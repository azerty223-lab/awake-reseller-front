import { NextRequest } from "next/server";
import { prisma } from "@/backend/lib/prisma";
import { auth } from "@/backend/lib/auth";
import { getIp, rateLimit, tooManyRequests } from "@/backend/lib/rate-limit";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const sessionId    = searchParams.get("session_id");

  /* ── Public: order lookup by Stripe session ID ─────────────────
     Used by the /checkout/success page to show order details.

     Security notes:
     • Stripe session IDs are ~100 chars of high-entropy URL-safe
       base64, making brute-force enumeration computationally
       infeasible in practice.
     • Rate limit is deliberately tight (5 / 5 min) to prevent any
       automated scraping via harvested session IDs.
     • Only the fields needed by the success page are returned.
       guestPhone, stripePaymentId, notes, and internal fields are
       intentionally omitted from the public response.              */
  if (sessionId) {
    const { allowed } = await rateLimit(
      `order-lookup:${getIp(request)}`,
      { windowSeconds: 300, maxRequests: 5 }
    );
    if (!allowed) return tooManyRequests();

    const order = await prisma.order.findUnique({
      where:   { stripeSessionId: sessionId },
      select: {
        id:          true,
        orderNumber: true,
        guestEmail:  true,
        guestName:   true,
        totalAmount: true,
        currency:    true,
        status:      true,
        createdAt:   true,
        orderItems: {
          select: {
            id:        true,
            quantity:  true,
            unitPrice: true,
            ticket: {
              select: {
                name:           true,
                dayLabel:       true,
                deliveryMethod: true,
              },
            },
          },
        },
      },
    });

    if (!order) {
      return Response.json({ error: "Order not found" }, { status: 404 });
    }

    return Response.json(order);
  }

  /* ── Admin: list all orders ─────────────────────────────────── */
  const session = await auth();
  if (!session?.user || (session.user as { role?: string }).role !== "ADMIN") {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const status = searchParams.get("status");
  const where  = status ? { status: status as never } : {};

  const orders = await prisma.order.findMany({
    where,
    include: {
      orderItems: { include: { ticket: true } },
      user:       { select: { id: true, name: true, email: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return Response.json(orders);
}
