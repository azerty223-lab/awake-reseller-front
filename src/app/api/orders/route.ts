import { NextRequest } from "next/server";
import { prisma } from "@/backend/lib/prisma";
import { auth } from "@/backend/lib/auth";
import { getIp, rateLimit, tooManyRequests } from "@/backend/lib/rate-limit";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const sessionId = searchParams.get("session_id");

  // Public: get order by stripe session id
  if (sessionId) {
    const { allowed } = await rateLimit(`orders:${getIp(request)}`, { windowSeconds: 60, maxRequests: 10 });
    if (!allowed) return tooManyRequests();
    const order = await prisma.order.findUnique({
      where: { stripeSessionId: sessionId },
      include: { orderItems: { include: { ticket: true } } },
    });
    if (!order) {
      return Response.json({ error: "Order not found" }, { status: 404 });
    }
    return Response.json(order);
  }

  // Admin: list all orders
  const session = await auth();
  if (!session?.user || (session.user as { role?: string }).role !== "ADMIN") {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const status = searchParams.get("status");
  const where = status ? { status: status as never } : {};

  const orders = await prisma.order.findMany({
    where,
    include: {
      orderItems: { include: { ticket: true } },
      user: { select: { id: true, name: true, email: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return Response.json(orders);
}
