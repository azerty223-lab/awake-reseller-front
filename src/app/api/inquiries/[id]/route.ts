import { NextRequest } from "next/server";
import { prisma } from "@/backend/lib/prisma";
import { auth } from "@/backend/lib/auth";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user || (session.user as { role?: string }).role !== "ADMIN") {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const body = await request.json();
  const { status } = body;

  const inquiry = await prisma.inquiry.update({
    where: { id },
    data: { status },
  });

  return Response.json(inquiry);
}
