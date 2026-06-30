import { NextRequest } from "next/server";
import { z } from "zod/v4";
import { stripe } from "@/backend/lib/stripe";
import { getIp, rateLimit, tooManyRequests } from "@/backend/lib/rate-limit";
import { verifyTurnstile } from "@/backend/lib/turnstile";
import { CheckoutValidationError, resolveCheckoutItems } from "@/backend/lib/checkout";

const schema = z.object({
  items: z.array(z.object({
    ticketId: z.string().min(1),
    quantity: z.number().int().positive(),
  }).strict()).min(1),
  customerEmail: z.string().email().optional(),
  customerName: z.string().max(100).optional(),
  customerPhone: z.string().max(50).optional(),
  turnstileToken: z.string().optional(),
});

export async function POST(request: NextRequest) {
  const { allowed } = await rateLimit(`checkout:${getIp(request)}`, { windowSeconds: 60, maxRequests: 10 });
  if (!allowed) return tooManyRequests();

  const body = await request.json() as unknown;
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return Response.json({ error: "Invalid request" }, { status: 400 });
  }

  const { items, customerEmail, customerName, customerPhone, turnstileToken } = parsed.data;

  const humanVerified = await verifyTurnstile(turnstileToken ?? "");
  if (!humanVerified) {
    return Response.json({ error: "Bot check failed. Please try again." }, { status: 403 });
  }

  let resolved;
  try {
    resolved = await resolveCheckoutItems(items);
  } catch (err) {
    if (err instanceof CheckoutValidationError) {
      return Response.json({ error: err.message }, { status: err.status });
    }
    throw err;
  }

  const origin =
    request.headers.get("origin") ||
    process.env.NEXT_PUBLIC_APP_URL ||
    process.env.NEXT_PUBLIC_BASE_URL ||
    "http://localhost:3000";

  const lineItems = resolved.items.map((item) => ({
    price_data: {
      currency: item.currency.toLowerCase(),
      unit_amount: Math.round(item.unitPrice * 100),
      product_data: {
        name: item.name,
        description: `Awakenings Festival 2026 — ${item.name}`,
        metadata: { ticketId: item.ticketId },
      },
    },
    quantity: item.quantity,
  }));

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    payment_method_types: ["card"],
    line_items: lineItems,
    success_url: `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${origin}/checkout`,
    customer_email: customerEmail,
    metadata: {
      customerName: customerName ?? "",
      customerPhone: customerPhone ?? "",
      items: JSON.stringify(resolved.items.map((i) => ({
        ticketId: i.ticketId,
        quantity: i.quantity,
        unitPrice: i.unitPrice,
      }))),
    },
  });

  return Response.json({ url: session.url });
}
