import { NextRequest } from "next/server";
import { prisma } from "@/backend/lib/prisma";
import { auth } from "@/backend/lib/auth";
import { sendTicketEmail } from "@/backend/lib/email";
import QRCode from "qrcode";

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
  if (!order.guestEmail) return Response.json({ error: "No customer email on this order" }, { status: 400 });
  if (!["PAID", "PROCESSING"].includes(order.status)) {
    return Response.json({ error: "Ticket can only be sent for PAID or PROCESSING orders" }, { status: 409 });
  }

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";
  const ticketUrl = `${baseUrl}/ticket/${order.id}`;

  const qrDataUri = await QRCode.toDataURL(ticketUrl, {
    width: 400,
    margin: 2,
    color: { dark: "#000000", light: "#ffffff" },
  });

  const ticketTypes = order.orderItems
    .map((oi) => `${oi.ticket.name}${oi.quantity > 1 ? ` ×${oi.quantity}` : ""}`)
    .join(", ");

  let emailError: string | null = null;

  try {
    await sendTicketEmail({
      to: order.guestEmail,
      customerName: order.guestName ?? "Attendee",
      orderNumber: order.orderNumber,
      ticketTypes,
      ticketUrl,
      qrDataUri,
    });
  } catch (err) {
    console.error("[send-ticket] Email failed:", err);
    emailError = err instanceof Error ? err.message : "Email sending failed";
  }

  // Always mark as delivered even if email failed
  await prisma.order.update({
    where: { id },
    data: { status: "DELIVERED", deliveredAt: new Date() },
  });

  if (emailError) {
    return Response.json({
      success: false,
      delivered: true,
      emailError,
      ticketUrl,
    }, { status: 207 });
  }

  return Response.json({ success: true, ticketUrl });
}
