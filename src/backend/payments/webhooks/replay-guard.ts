import type { Redis } from "ioredis";

export class ReplayGuard {
  /**
   * Returns true if this eventId is a duplicate (already processed), false if new.
   * Uses SET NX EX 86400 (24-hour deduplication window).
   */
  async check(redis: Redis, eventId: string): Promise<boolean> {
    const key = `webhook-seen:${eventId}`;
    // SET key 1 NX EX 86400 — returns "OK" if set, null if key already existed
    // ioredis: EX must come before NX in the argument list
    const result = await redis.set(key, "1", "EX", 86400, "NX");
    // result is null if the key already existed (duplicate)
    return result === null;
  }
}

export const replayGuard = new ReplayGuard();
