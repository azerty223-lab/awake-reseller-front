import { NextRequest } from "next/server";
import { z } from "zod/v4";
import { prisma } from "@/backend/lib/prisma";
import { auth } from "@/backend/lib/auth";
import { CheckoutValidationError, resolveCheckoutItems } from "@/backend/lib/checkout";
import { getIp, rateLimit, tooManyRequests } from "@/backend/lib/rate-limit";

const schema = z.object({
  items: z.array(z.object({
    ticketId: z.string().min(1),
    quantity: z.number().int().positive(),
    unitPrice: z.number().positive().optional(),
  })).min(1),
  totalAmount: z.number().positive().optional(),
  currency: z.string().optional(),
  guestEmail: z.string().email().optional(),
  guestName: z.string().optional(),
});

export async function POST(req: NextRequest) {
  // 5 pending-order creations per IP per 5 minutes — prevents inventory lock abuse
  const { allowed } = await rateLimit(`order-create:${getIp(req)}`, { windowSeconds: 300, maxRequests: 5 });
  if (!allowed) return tooManyRequests();

  try {
    const body = await req.json() as unknown;
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return Response.json({ error: "Invalid request" }, { status: 400 });
    }

    const { items, guestEmail, guestName } = parsed.data;
    const session = await auth();

    let resolved;
    try {
      resolved = await resolveCheckoutItems(items);
    } catch (err) {
      if (err instanceof CheckoutValidationError) {
        return Response.json({ error: err.message }, { status: err.status });
      }
      throw err;
    }

    const order = await prisma.order.create({
      data: {
        userId: session?.user?.id ?? null,
        guestEmail: guestEmail ?? (session?.user?.email ?? null),
        guestName: guestName ?? (session?.user?.name ?? null),
        totalAmount: resolved.totalAmount,
        currency: resolved.currency,
        status: "PENDING",
        orderItems: {
          create: resolved.items.map((item) => ({
            ticketId: item.ticketId,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
          })),
        },
      },
    });

    return Response.json({ orderId: order.id, orderNumber: order.orderNumber });
  } catch (err) {
    console.error("[POST /api/checkout/order]", err);
    return Response.json(
      { error: err instanceof Error ? err.message : "Internal server error" },
      { status: 500 }
    );
  }
}
