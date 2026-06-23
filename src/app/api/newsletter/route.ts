import { NextRequest } from "next/server";
import { prisma } from "@/backend/lib/prisma";
import { getIp, rateLimit, tooManyRequests } from "@/backend/lib/rate-limit";

export async function POST(request: NextRequest) {
  const { allowed } = await rateLimit(`newsletter:${getIp(request)}`, { windowSeconds: 60, maxRequests: 5 });
  if (!allowed) return tooManyRequests();

  const body = await request.json();
  const { email } = body;

  if (!email) {
    return Response.json({ error: "Email is required" }, { status: 400 });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return Response.json({ error: "Invalid email address" }, { status: 400 });
  }

  const existing = await prisma.newsletterSubscriber.findUnique({
    where: { email },
  });

  if (existing) {
    return Response.json({ success: true }, { status: 200 });
  }

  await prisma.newsletterSubscriber.create({ data: { email } });

  return Response.json({ success: true }, { status: 201 });
}
