import { NextRequest } from "next/server";
import { prisma } from "@/backend/lib/prisma";
import { auth } from "@/backend/lib/auth";
import { z } from "zod/v4";

/* ── Public GET ─────────────────────────────────────────────────── */
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const ticket = await prisma.ticket.findUnique({
    where: { id },
    select: {
      id: true, name: true, slug: true, description: true,
      category: true, dayLabel: true, originalPrice: true,
      resalePrice: true, currency: true, quantity: true,
      sold: true, isVisible: true, isFeatured: true,
      deliveryMethod: true, includes: true, imageUrl: true,
      createdAt: true, updatedAt: true,
      // stripeProductId, stripePriceId, pdfUrl, personalizationStatus omitted — internal only
    },
  });
  if (!ticket) {
    return Response.json({ error: "Not found" }, { status: 404 });
  }

  return Response.json(ticket);
}

/* ── Admin PATCH — explicit field whitelist ─────────────────────────
   Previously `data: body` passed the entire request body to Prisma,
   allowing an attacker with admin credentials to overwrite any field
   including `id`, `sold`, `createdAt`, and `slug`.               */

const patchSchema = z.object({
  name:                  z.string().min(1).max(200).optional(),
  description:           z.string().max(2000).optional(),
  resalePrice:           z.number().nonnegative().optional(),
  originalPrice:         z.number().nonnegative().optional(),
  currency:              z.string().length(3).optional(),
  category:              z.string().optional(),
  dayLabel:              z.string().max(100).nullable().optional(),
  deliveryMethod:        z.string().optional(),
  personalizationStatus: z.string().optional(),
  quantity:              z.number().int().nonnegative().optional(),
  isVisible:             z.boolean().optional(),
  isFeatured:            z.boolean().optional(),
  includes:              z.array(z.string()).optional(),
  slug:                  z.string().min(1).max(200).optional(),
}).strict(); // .strict() rejects any key not listed above

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

  if (Object.keys(parsed.data).length === 0) {
    return Response.json({ error: "No valid fields provided" }, { status: 400 });
  }

  const ticket = await prisma.ticket.update({
    where: { id },
    data:  parsed.data as never,
  });

  return Response.json(ticket);
}

/* ── Admin DELETE ───────────────────────────────────────────────── */
export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user || (session.user as { role?: string }).role !== "ADMIN") {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  await prisma.ticket.delete({ where: { id } });
  return Response.json({ success: true });
}
