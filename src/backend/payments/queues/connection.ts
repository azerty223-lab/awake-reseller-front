import { Redis } from "ioredis";

let _redis: Redis | null = null;

export function getRedis(): Redis {
  if (!_redis) {
    const url = process.env.REDIS_URL || "redis://localhost:6379";
    _redis = new Redis(url, {
      // Fail commands immediately when Redis is down — never queue or retry
      maxRetriesPerRequest: 0,
      enableOfflineQueue: false,
      lazyConnect: true,
      connectTimeout: 1500,
      commandTimeout: 1500,
      // Never attempt to reconnect — the next request will re-try lazily
      retryStrategy: () => null,
    });
    _redis.on("error", () => {
      // Silently suppress connection errors — Redis is optional in development.
      // The payment system degrades gracefully without it.
    });
  }
  return _redis;
}

export function getBullMQConnection(): { host: string; port: number; password?: string } {
  const url = process.env.REDIS_URL || "redis://localhost:6379";
  try {
    const parsed = new URL(url);
    return {
      host: parsed.hostname || "localhost",
      port: parseInt(parsed.port || "6379", 10),
      ...(parsed.password ? { password: decodeURIComponent(parsed.password) } : {}),
    };
  } catch {
    return { host: "localhost", port: 6379 };
  }
}

/** Returns true if Redis responds to PING within 1.5 s. */
export async function isRedisAvailable(): Promise<boolean> {
  // Reset the client so lazyConnect re-attempts on each check
  _redis = null;
  try {
    const redis = getRedis();
    await redis.ping();
    return true;
  } catch {
    _redis = null; // clear so next invocation retries fresh
    return false;
  }
}
