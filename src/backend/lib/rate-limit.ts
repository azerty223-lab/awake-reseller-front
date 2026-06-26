import { getRedis } from "@/backend/payments/queues/connection";
import type { NextRequest } from "next/server";

interface Config {
  windowSeconds: number;
  maxRequests:   number;
}

/* ── IP extraction ──────────────────────────────────────────────────
   Priority order:
   1. CF-Connecting-IP  — set by Cloudflare, cannot be forged by the
                          client because Cloudflare strips it from
                          incoming requests before adding its own value.
   2. X-Real-IP         — set by Nginx/proxy, single trusted IP.
   3. X-Forwarded-For   — we take the LAST entry (rightmost), which is
                          added by the nearest trusted proxy.
                          The FIRST entry can be forged by the client.

   Note: If the app is deployed behind multiple untrusted proxies (rare
   for this use-case), further configuration at the infrastructure level
   is required. The rightmost XFF value is safe for single-proxy setups
   (Vercel, Fly.io, Render, etc.).                                   */
export function getIp(request: NextRequest): string {
  const cf = request.headers.get("cf-connecting-ip");
  if (cf?.trim()) return cf.trim();

  const realIp = request.headers.get("x-real-ip");
  if (realIp?.trim()) return realIp.trim();

  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    const ips = forwarded
      .split(",")
      .map(s => s.trim())
      .filter(Boolean);
    if (ips.length > 0) return ips[ips.length - 1];
  }

  return "unknown";
}

export async function rateLimit(
  identifier: string,
  config:     Config
): Promise<{ allowed: boolean }> {
  try {
    const redis      = getRedis();
    const now        = Date.now();
    const windowStart = now - config.windowSeconds * 1000;
    const key        = `rl:${identifier}`;

    const pipeline = redis.pipeline();
    pipeline.zremrangebyscore(key, "-inf", windowStart);
    pipeline.zadd(key, now, `${now}-${Math.random()}`);
    pipeline.zcard(key);
    pipeline.expire(key, config.windowSeconds * 2);

    const results = await pipeline.exec();
    const count   = (results?.[2]?.[1] as number) ?? 0;

    return { allowed: count <= config.maxRequests };
  } catch {
    // Redis unavailable — fail open (allows traffic) to avoid self-DoS.
    // In production, alert on Redis connectivity failures separately.
    return { allowed: true };
  }
}

export function tooManyRequests(): Response {
  return Response.json(
    { error: "Too many requests. Please try again later." },
    { status: 429, headers: { "Retry-After": "60" } }
  );
}
