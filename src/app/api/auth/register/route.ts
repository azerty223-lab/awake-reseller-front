import { NextRequest, NextResponse } from "next/server";
import { hash } from "bcryptjs";
import { z } from "zod";
import { prisma } from "@/backend/lib/prisma";
import { rateLimit, getIp, tooManyRequests } from "@/backend/lib/rate-limit";

const registerSchema = z.object({
  name:     z.string().min(2, "Name must be at least 2 characters").max(50),
  email:    z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters").max(72),
});

export async function POST(req: NextRequest) {
  // 5 registrations per IP per 15 minutes
  const ip     = getIp(req);
  const { allowed } = await rateLimit(`register:${ip}`, { windowSeconds: 900, maxRequests: 5 });
  if (!allowed) return tooManyRequests();

  try {
    const body   = await req.json();
    const parsed = registerSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0].message },
        { status: 400 }
      );
    }

    const { name, password } = parsed.data;
    const email = parsed.data.email.toLowerCase().trim();

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json(
        { error: "An account with this email already exists." },
        { status: 409 }
      );
    }

    const passwordHash = await hash(password, 12);
    await prisma.user.create({
      data: { name: name.trim(), email, password: passwordHash, role: "CUSTOMER" },
    });

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (err) {
    console.error("[register]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
