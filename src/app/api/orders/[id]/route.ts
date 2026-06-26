import { NextRequest } from "next/server";
import { prisma } from "@/backend/lib/prisma";
import { auth } from "@/backend/lib/auth";
import { z } from "zod/v4";

/* ── Valid order status transitions ────────────────────────────────
   Prevents an admin from jumping from PENDING → DELIVERED, or from
   re-opening a REFUNDED order.                                    */
const TRANSITIONS: Record<string, readonly string[]> = {
  PENDING:    ["PAID", "CANCELLED"],
  PAID:       ["PROCESSING", "DELIVERED", "CANCELLED", "REFUNDED"],
  PROCESSING: ["DELIVERED", "CANCELLED", "REFUNDED"],
  DELIVERED:  ["REFUNDED"],
  CANCELLED:  [],
  REFUNDED:   [],
};

const patchSchema = z.object({
  status:      z.string().optional(),
  notes:       z.string().max(2000).nullable().optional(),
  deliveredAt: z.string().datetime({ offset: true }).nullable().optional(),
}).strict();

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user || (session.user as { role?: string }).role !== "ADMIN") {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  let body: unknown;
  try { body = await request.json(); }
  catch { return Response.json({ error: "Invalid JSON" }, { status: 400 }); }

  const parsed = patchSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json({ error: "Invalid fields", details: parsed.error.issues }, { status: 400 });
  }

  const { status, notes, deliveredAt } = parsed.data;

  /* ── Validate status transition ─────────────────────────────── */
  if (status !== undefined) {
    const current = await prisma.order.findUnique({
      where:  { id },
      select: { status: true },
    });
    if (!current) {
      return Response.json({ error: "Order not found" }, { status: 404 });
    }

    const allowed = TRANSITIONS[current.status] ?? [];
    if (!allowed.includes(status)) {
      return Response.json(
        { error: `Cannot transition from ${current.status} to ${status}` },
        { status: 422 }
      );
    }
  }

  const order = await prisma.order.update({
    where: { id },
    data: {
      ...(status      !== undefined && { status:      status as never }),
      ...(notes       !== undefined && { notes }),
      ...(deliveredAt !== undefined && { deliveredAt: deliveredAt ? new Date(deliveredAt) : null }),
    },
    include: { orderItems: { include: { ticket: true } } },
  });

  return Response.json(order);
}
