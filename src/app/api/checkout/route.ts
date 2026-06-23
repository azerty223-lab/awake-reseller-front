import { NextRequest } from "next/server";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";
import { getIp, rateLimit, tooManyRequests } from "@/lib/rate-limit";
import { verifyTurnstile } from "@/lib/turnstile";

interface CartItem {
  ticketId: string;
  name: string;
  quantity: number;
  resalePrice: number;
  currency: string;
}

export async function POST(request: NextRequest) {
  const { allowed } = await rateLimit(`checkout:${getIp(request)}`, { windowSeconds: 60, maxRequests: 10 });
  if (!allowed) return tooManyRequests();

  const body = await request.json();
  const { items, customerEmail, customerName, customerPhone, turnstileToken } = body as {
    items: CartItem[];
    customerEmail?: string;
    customerName?: string;
    customerPhone?: string;
    turnstileToken?: string;
  };

  const humanVerified = await verifyTurnstile(turnstileToken ?? "");
  if (!humanVerified) {
    return Response.json({ error: "Bot check failed. Please try again." }, { status: 403 });
  }

  if (!items || items.length === 0) {
    return Response.json({ error: "No items in cart" }, { status: 400 });
  }

  // Verify tickets exist and are available
  for (const item of items) {
    const ticket = await prisma.ticket.findUnique({
      where: { id: item.ticketId },
    });
    if (!ticket) {
      return Response.json({ error: `Ticket ${item.ticketId} not found` }, { status: 400 });
    }
    if (ticket.quantity - ticket.sold < item.quantity) {
      return Response.json(
        { error: `Not enough availability for ${ticket.name}` },
        { status: 400 }
      );
    }
  }

  const origin = request.headers.get("origin") || process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

  const lineItems = items.map((item) => ({
    price_data: {
      currency: item.currency.toLowerCase(),
      unit_amount: Math.round(item.resalePrice * 100),
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
      items: JSON.stringify(items.map((i) => ({ ticketId: i.ticketId, quantity: i.quantity, unitPrice: i.resalePrice }))),
    },
  });

  return Response.json({ url: session.url });
}
