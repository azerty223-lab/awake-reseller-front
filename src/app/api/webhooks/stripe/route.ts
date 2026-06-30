import { NextRequest } from "next/server";
import { stripe } from "@/backend/lib/stripe";
import { prisma } from "@/backend/lib/prisma";
import { sendOrderConfirmation } from "@/backend/lib/email";

export async function POST(request: NextRequest) {
  const body      = await request.text();
  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return new Response("Missing stripe-signature header", { status: 400 });
  }

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    console.error("[stripe-webhook] signature verification failed:", err);
    return new Response("Signature verification failed", { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session  = event.data.object;
    const metadata = session.metadata ?? {};

    /* ── Idempotency guard ──────────────────────────────────────────
       Stripe retries webhooks when our server doesn't respond fast
       enough. Without this check each retry creates a duplicate order
       and charges the inventory twice.                              */
    const existing = await prisma.order.findUnique({
      where: { stripeSessionId: session.id },
    });
    if (existing) {
      return new Response("OK", { status: 200 });
    }

    const itemsData = JSON.parse(metadata.items || "[]") as {
      ticketId:  string;
      quantity:  number;
      unitPrice: number;
    }[];

    const customerEmail = session.customer_email ?? "";
    const customerName  = metadata.customerName  ?? "";
    const customerPhone = metadata.customerPhone  ?? "";
    const totalAmount   = (session.amount_total  ?? 0) / 100;

    const order = await prisma.order.create({
      data: {
        guestEmail:       customerEmail,
        guestName:        customerName,
        guestPhone:       customerPhone,
        status:           "PAID",
        totalAmount,
        currency:         session.currency?.toUpperCase() ?? "EUR",
        stripeSessionId:  session.id,
        stripePaymentId:  session.payment_intent as string | undefined,
        orderItems: {
          create: itemsData.map(item => ({
            ticketId:  item.ticketId,
            quantity:  item.quantity,
            unitPrice: item.unitPrice,
          })),
        },
      },
      include: { orderItems: { include: { ticket: true } } },
    });

    // Update ticket sold counts
    for (const item of itemsData) {
      await prisma.ticket.update({
        where: { id: item.ticketId },
        data:  { sold: { increment: item.quantity } },
      });
    }

    // Send confirmation email (fire-and-forget; never block the webhook response)
    if (customerEmail) {
      sendOrderConfirmation({
        to:           customerEmail,
        customerName: customerName || "Customer",
        orderNumber:  order.orderNumber,
        items:        order.orderItems.map(oi => ({
          name:      oi.ticket.name,
          quantity:  oi.quantity,
          unitPrice: oi.unitPrice,
        })),
        totalAmount,
        currency: order.currency,
      }).catch(err => console.error("[stripe-webhook] email failed:", err));
    }
  }

  return new Response("OK", { status: 200 });
}
