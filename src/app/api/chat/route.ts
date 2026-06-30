import Anthropic from "@anthropic-ai/sdk";
import { NextRequest } from "next/server";
import { rateLimit, getIp, tooManyRequests } from "@/backend/lib/rate-limit";

const client = new Anthropic();

const MAX_MESSAGES   = 10;   // max conversation history sent to API
const MAX_MSG_LENGTH = 500;  // max chars per message

const SYSTEM = `You are a helpful customer support assistant for Awakenings Resale — a verified ticket resale platform for Awakenings Festival 2026.

FESTIVAL:
- Awakenings Summer Festival 2026
- Dates: July 10–12, 2026
- Venue: Beekse Bergen nature area, Hilvarenbeek, Netherlands
- 6+ stages (Area V, A, B, C, X, H, Y, N, S)

TICKET TYPES:
- Weekend Pass (3-Day): July 10–12 — all stages, Friday evening through Sunday closing
- Saturday Day Access: July 11
- Sunday Day Access: July 12
- Camping add-ons: Grand Camping (outdoor, own tent), Comfort Camping (pre-pitched bell tent), Relax Resort (private glamping pod)

RESALE PROCESS & DELIVERY:
- All tickets verified before delivery
- We handle the official Awakenings name transfer on the buyer's behalf
- Immediately after payment: confirmation email with order details and ticket info
- E-tickets dispatched on July 8th (official Awakenings send-out schedule)
- Support response: within 4 hours during CET business hours
- Contact: awtickets@outlook.com

ENTRY RULES:
- No re-entry once you leave the festival site
- Digital ticket only — no paper printouts; charged device at full brightness
- Photo ID must match the name on the ticket
- Official transfers only; reselling outside the official process invalidates the ticket
- Gates open 30 minutes before first act

REFUND POLICY:
- All sales are final once name transfer is initiated
- If the event is cancelled by the organiser: full refund provided

Keep answers concise (2–3 sentences). Be warm, direct, and helpful. If asked about specific ticket prices, direct users to browse the listings on the platform.`;

export async function POST(req: NextRequest) {
  // 15 messages per hour per IP
  const ip = getIp(req);
  const { allowed } = await rateLimit(`chat:${ip}`, { windowSeconds: 3600, maxRequests: 15 });
  if (!allowed) return tooManyRequests();

  try {
    const { messages } = await req.json();

    if (!Array.isArray(messages) || messages.length === 0) {
      return Response.json({ error: "Messages required" }, { status: 400 });
    }

    // Validate and sanitize: only user/assistant roles, cap length and history size
    const safe = messages
      .filter((m): m is { role: "user" | "assistant"; content: string } =>
        (m.role === "user" || m.role === "assistant") &&
        typeof m.content === "string" &&
        m.content.trim().length > 0
      )
      .map((m) => ({ role: m.role, content: m.content.slice(0, MAX_MSG_LENGTH) }))
      .slice(-MAX_MESSAGES); // keep only the last N messages

    if (safe.length === 0) {
      return Response.json({ error: "No valid messages" }, { status: 400 });
    }

    // Stream the response
    const stream = client.messages.stream({
      model: "claude-haiku-4-5",
      max_tokens: 400,
      system: SYSTEM,
      messages: safe,
    });

    const encoder = new TextEncoder();
    const readable = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of stream) {
            if (
              chunk.type === "content_block_delta" &&
              chunk.delta.type === "text_delta"
            ) {
              controller.enqueue(encoder.encode(chunk.delta.text));
            }
          }
        } finally {
          controller.close();
        }
      },
    });

    return new Response(readable, {
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  } catch (err) {
    console.error("[chat] error:", err);
    return Response.json({ error: "Failed to process request" }, { status: 500 });
  }
}
