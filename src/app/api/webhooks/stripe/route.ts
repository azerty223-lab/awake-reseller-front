import { NextRequest } from "next/server";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";
import { sendOrderConfirmation } from "@/lib/email";

export async function POST(request: NextRequest) {
  const body = await request.text();
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
    const message = err instanceof Error ? err.message : "Unknown error";
    return new Response(`Webhook Error: ${message}`, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const metadata = session.metadata ?? {};
    const itemsData = JSON.parse(metadata.items || "[]") as {
      ticketId: string;
      quantity: number;
      unitPrice: number;
    }[];

    const customerEmail = session.customer_email ?? "";
    const customerName = metadata.customerName ?? "";
    const customerPhone = metadata.customerPhone ?? "";
    const totalAmount = (session.amount_total ?? 0) / 100;

    // Create order
    const order = await prisma.order.create({
      data: {
        guestEmail: customerEmail,
        guestName: customerName,
        guestPhone: customerPhone,
        status: "PAID",
        totalAmount,
        currency: session.currency?.toUpperCase() ?? "EUR",
        stripeSessionId: session.id,
        stripePaymentId: session.payment_intent as string | undefined,
        orderItems: {
          create: itemsData.map((item) => ({
            ticketId: item.ticketId,
            quantity: item.quantity,
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
        data: { sold: { increment: item.quantity } },
      });
    }

    // Send confirmation email
    if (customerEmail) {
      try {
        await sendOrderConfirmation({
          to: customerEmail,
          customerName: customerName || "Customer",
          orderNumber: order.orderNumber,
          items: order.orderItems.map((oi: { ticket: { name: string }; quantity: number; unitPrice: number }) => ({
            name: oi.ticket.name,
            quantity: oi.quantity,
            unitPrice: oi.unitPrice,
          })),
          totalAmount,
          currency: order.currency,
        });
      } catch (emailErr) {
        console.error("Failed to send order confirmation email:", emailErr);
      }
    }
  }

  return new Response("OK", { status: 200 });
}
