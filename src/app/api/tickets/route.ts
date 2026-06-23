import { NextRequest } from "next/server";
import { prisma } from "@/backend/lib/prisma";
import { auth } from "@/backend/lib/auth";
import { TicketCategory } from "@prisma/client";
import { slugify } from "@/backend/lib/utils";
import { getIp, rateLimit, tooManyRequests } from "@/backend/lib/rate-limit";

export async function GET(request: NextRequest) {
  const { allowed } = await rateLimit(`tickets:${getIp(request)}`, { windowSeconds: 60, maxRequests: 60 });
  if (!allowed) return tooManyRequests();
  const searchParams = request.nextUrl.searchParams;
  const featured = searchParams.get("featured");
  const category = searchParams.get("category");
  const visible = searchParams.get("visible");

  const where: Record<string, unknown> = {};

  if (featured === "true") where.isFeatured = true;
  if (visible === "true") where.isVisible = true;
  if (category && Object.values(TicketCategory).includes(category as TicketCategory)) {
    where.category = category as TicketCategory;
  }

  const tickets = await prisma.ticket.findMany({
    where,
    orderBy: [{ isFeatured: "desc" }, { createdAt: "desc" }],
  });

  return Response.json(tickets);
}

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user || (session.user as { role?: string }).role !== "ADMIN") {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const {
    name,
    description,
    category,
    dayLabel,
    originalPrice,
    resalePrice,
    currency,
    quantity,
    isVisible,
    isFeatured,
    deliveryMethod,
    personalizationStatus,
    includes,
    imageUrl,
  } = body;

  if (!name || !description || !category || !originalPrice || !resalePrice) {
    return Response.json({ error: "Missing required fields" }, { status: 400 });
  }

  const slug = slugify(name);

  const ticket = await prisma.ticket.create({
    data: {
      name,
      slug,
      description,
      category,
      dayLabel,
      originalPrice: parseFloat(originalPrice),
      resalePrice: parseFloat(resalePrice),
      currency: currency ?? "EUR",
      quantity: parseInt(quantity) ?? 1,
      isVisible: isVisible ?? true,
      isFeatured: isFeatured ?? false,
      deliveryMethod: deliveryMethod ?? "DIGITAL",
      personalizationStatus: personalizationStatus ?? "PENDING",
      includes: includes ?? [],
      imageUrl,
    },
  });

  return Response.json(ticket, { status: 201 });
}
