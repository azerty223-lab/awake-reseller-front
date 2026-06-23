import { NextRequest } from "next/server";
import { prisma } from "@/backend/lib/prisma";
import { auth } from "@/backend/lib/auth";
import { sendInquiryConfirmation } from "@/backend/lib/email";
import { getIp, rateLimit, tooManyRequests } from "@/backend/lib/rate-limit";
import { verifyTurnstile } from "@/backend/lib/turnstile";

export async function POST(request: NextRequest) {
  const { allowed } = await rateLimit(`inquiries:${getIp(request)}`, { windowSeconds: 60, maxRequests: 3 });
  if (!allowed) return tooManyRequests();

  const body = await request.json();
  const { name, email, subject, message, turnstileToken } = body;

  const humanVerified = await verifyTurnstile(turnstileToken ?? "");
  if (!humanVerified) {
    return Response.json({ error: "Bot check failed. Please try again." }, { status: 403 });
  }

  if (!name || !email || !subject || !message) {
    return Response.json({ error: "All fields are required" }, { status: 400 });
  }

  if (typeof name !== "string" || name.length > 100) {
    return Response.json({ error: "Invalid name" }, { status: 400 });
  }
  if (typeof subject !== "string" || subject.length > 200) {
    return Response.json({ error: "Invalid subject" }, { status: 400 });
  }
  if (typeof message !== "string" || message.length > 5000) {
    return Response.json({ error: "Message too long" }, { status: 400 });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return Response.json({ error: "Invalid email address" }, { status: 400 });
  }

  const inquiry = await prisma.inquiry.create({
    data: { name, email, subject, message },
  });

  // Send confirmation email
  try {
    await sendInquiryConfirmation({ to: email, name, subject, message });
  } catch (err) {
    console.error("Failed to send inquiry confirmation:", err);
  }

  return Response.json(inquiry, { status: 201 });
}

export async function GET(request: NextRequest) {
  const session = await auth();
  if (!session?.user || (session.user as { role?: string }).role !== "ADMIN") {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const searchParams = request.nextUrl.searchParams;
  const status = searchParams.get("status");
  const where = status ? { status: status as never } : {};

  const inquiries = await prisma.inquiry.findMany({
    where,
    include: {
      user: { select: { id: true, name: true, email: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return Response.json(inquiries);
}
