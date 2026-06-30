import { NextResponse } from "next/server";
import { auth } from "@/backend/lib/auth";
import { prisma } from "@/backend/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  const session = await auth();
  const role = (session?.user as { role?: string } | undefined)?.role;

  if (!session?.user || role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      image: true,
      createdAt: true,
      accounts: {
        select: { provider: true },
        take: 1,
      },
    },
  });

  const result = users.map((u) => ({
    ...u,
    provider: u.accounts[0]?.provider ?? "credentials",
  }));

  return NextResponse.json({ users: result });
}
