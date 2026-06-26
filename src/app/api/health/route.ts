import { NextResponse } from "next/server";
import { prisma } from "@/backend/lib/prisma";

/* ── Health check endpoint ──────────────────────────────────────────
   Railway (and any uptime monitor) pings this to verify the app and
   its critical dependencies are reachable.

   Returns 200 { status: "ok" }       when everything is healthy
   Returns 503 { status: "degraded" } when the database is unreachable

   Intentionally lightweight — no auth, no heavy queries.           */

export async function GET() {
  try {
    // Minimal DB round-trip — confirms connection pool is alive
    await prisma.$queryRaw`SELECT 1`;

    return NextResponse.json(
      { status: "ok", timestamp: new Date().toISOString() },
      { status: 200 }
    );
  } catch {
    return NextResponse.json(
      { status: "degraded", error: "database unreachable" },
      { status: 503 }
    );
  }
}
