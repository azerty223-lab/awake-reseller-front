import { NextRequest } from "next/server";
import { z } from "zod/v4";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

const schema = z.object({
  items: z.array(z.object({
    ticketId: z.string(),
    quantity: z.number().int().positive(),
    unitPrice: z.number().positive(),
  })).min(1),
  totalAmount: z.number().positive(),
  currency: z.string().default("EUR"),
  guestEmail: z.string().email().optional(),
  guestName: z.string().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as unknown;
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return Response.json({ error: "Invalid request" }, { status: 400 });
    }

    const { items, totalAmount, currency, guestEmail, guestName } = parsed.data;
    const session = await auth();

    // Verify all tickets exist and have available stock
    for (const item of items) {
      const ticket = await prisma.ticket.findUnique({
        where: { id: item.ticketId },
        select: { id: true, quantity: true, sold: true, isVisible: true },
      });
      if (!ticket || !ticket.isVisible) {
        return Response.json({ error: `Ticket not found: ${item.ticketId}` }, { status: 404 });
      }
      if (ticket.quantity - ticket.sold < item.quantity) {
        return Response.json({ error: "Insufficient ticket availability" }, { status: 409 });
      }
    }

    const order = await prisma.order.create({
      data: {
        userId: session?.user?.id ?? null,
        guestEmail: guestEmail ?? (session?.user?.email ?? null),
        guestName: guestName ?? (session?.user?.name ?? null),
        totalAmount,
        currency,
        status: "PENDING",
        orderItems: {
          create: items.map((item) => ({
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
