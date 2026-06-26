import { NextResponse } from "next/server";
import { prisma } from "@/backend/lib/prisma";

/* ── Health check endpoint ──────────────────────────────────────────
   Railway pings this to decide whether to restart the container.

   Design decision: always return 200 as long as the Node process is
   alive. Returning 503 on a slow DB query was causing Railway to
   restart the app in a loop during cold-start (DB takes a few seconds
   to accept connections after a deploy).

   DB status is included in the response body so an external uptime
   monitor (UptimeRobot, BetterUptime, etc.) can alert on degradation
   without Railway treating it as a crash.                          */

export async function GET() {
  let dbStatus: "ok" | "degraded" = "ok";

  try {
    // 3-second timeout — if the DB doesn't respond in time we still
    // return 200 so Railway doesn't restart a healthy Node process.
    await Promise.race([
      prisma.$queryRaw`SELECT 1`,
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error("timeout")), 3000)
      ),
    ]);
  } catch {
    dbStatus = "degraded";
  }

  return NextResponse.json(
    {
      status:    dbStatus === "ok" ? "ok" : "degraded",
      db:        dbStatus,
      timestamp: new Date().toISOString(),
    },
    // Always 200 — Railway only uses the status code to decide whether
    // to restart. DB degradation is monitored separately.
    { status: 200 }
  );
}
