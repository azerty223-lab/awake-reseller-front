import { Queue } from "bullmq";
import { getBullMQConnection } from "./connection";
import type { ExpiryJobPayload } from "../types";

let _queue: Queue | null = null;

export function getExpiryQueue(): Queue {
  if (!_queue) {
    _queue = new Queue("crypto-expirations", {
      connection: getBullMQConnection(),
      defaultJobOptions: {
        attempts: 3,
        backoff: { type: "exponential", delay: 5000 },
        removeOnComplete: { count: 500 },
        removeOnFail: { count: 2000 },
      },
    });
  }
  return _queue;
}

export async function addExpiryJob(
  payload: ExpiryJobPayload,
  delayMs: number
): Promise<void> {
  await getExpiryQueue().add("expire-invoice", payload, { delay: delayMs });
}
