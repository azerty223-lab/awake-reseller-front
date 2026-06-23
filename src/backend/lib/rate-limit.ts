import { getRedis } from "@/backend/payments/queues/connection";
import type { NextRequest } from "next/server";

interface Config {
  windowSeconds: number;
  maxRequests: number;
}

export function getIp(request: NextRequest): string {
  const forwarded = request.headers.get("x-forwarded-for");
  return forwarded?.split(",")[0]?.trim() ?? "unknown";
}

export async function rateLimit(
  identifier: string,
  config: Config
): Promise<{ allowed: boolean }> {
  try {
    const redis = getRedis();
    const now = Date.now();
    const windowStart = now - config.windowSeconds * 1000;
    const key = `rl:${identifier}`;

    const pipeline = redis.pipeline();
    pipeline.zremrangebyscore(key, "-inf", windowStart);
    pipeline.zadd(key, now, `${now}-${Math.random()}`);
    pipeline.zcard(key);
    pipeline.expire(key, config.windowSeconds * 2);

    const results = await pipeline.exec();
    const count = (results?.[2]?.[1] as number) ?? 0;

    return { allowed: count <= config.maxRequests };
  } catch {
    return { allowed: true };
  }
}

export function tooManyRequests(): Response {
  return Response.json(
    { error: "Too many requests. Please try again later." },
    { status: 429, headers: { "Retry-After": "60" } }
  );
}
