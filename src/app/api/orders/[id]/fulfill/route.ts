import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { sendOrderConfirmation } from "@/lib/email";

export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user || (session.user as { role?: string }).role !== "ADMIN") {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  const order = await prisma.order.findUnique({
    where: { id },
    include: { orderItems: { include: { ticket: true } } },
  });

  if (!order) return Response.json({ error: "Order not found" }, { status: 404 });
  if (order.status === "PAID") return Response.json({ error: "Order already paid" }, { status: 409 });

  // Mark order as PAID
  const updated = await prisma.order.update({
    where: { id },
    data: { status: "PAID" },
    include: { orderItems: { include: { ticket: true } } },
  });

  // Decrement available tickets (increment sold count)
  for (const item of order.orderItems) {
    await prisma.ticket.update({
      where: { id: item.ticketId },
      data: { sold: { increment: item.quantity } },
    });
  }

  // Send confirmation email to customer
  const email = order.guestEmail;
  if (email) {
    try {
      await sendOrderConfirmation({
        to: email,
        customerName: order.guestName ?? "Customer",
        orderNumber: order.orderNumber,
        items: updated.orderItems.map((oi) => ({
          name: oi.ticket.name,
          quantity: oi.quantity,
          unitPrice: oi.unitPrice,
        })),
        totalAmount: order.totalAmount,
        currency: order.currency,
      });
    } catch (err) {
      console.error("[fulfill] Email failed:", err);
      // Don't fail the whole request if email errors — order is already PAID
    }
  }

  return Response.json({ success: true, orderNumber: order.orderNumber });
}
