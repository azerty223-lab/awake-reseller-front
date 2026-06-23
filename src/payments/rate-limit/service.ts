import type { Redis } from "ioredis";
import type { RateLimitResult } from "../types";
import { RATE_LIMIT } from "../constants";

export class RateLimitService {
  async check(redis: Redis, identifier: string): Promise<RateLimitResult> {
    const now = Date.now();
    const windowStart = now - RATE_LIMIT.WINDOW_SECONDS * 1000;
    const key = `rate-limit:${identifier}`;

    const pipeline = redis.pipeline();
    // Remove expired entries
    pipeline.zremrangebyscore(key, "-inf", windowStart);
    // Add current request
    pipeline.zadd(key, now, `${now}-${Math.random()}`);
    // Count current requests in window
    pipeline.zcard(key);
    // Set expiry
    pipeline.expire(key, RATE_LIMIT.WINDOW_SECONDS * 2);

    const results = await pipeline.exec();
    const count = (results?.[2]?.[1] as number) ?? 0;

    const allowed = count <= RATE_LIMIT.MAX_REQUESTS;
    const remaining = Math.max(0, RATE_LIMIT.MAX_REQUESTS - count);
    const resetAt = new Date(now + RATE_LIMIT.WINDOW_SECONDS * 1000);

    return { allowed, remaining, resetAt };
  }
}

export const rateLimitService = new RateLimitService();
