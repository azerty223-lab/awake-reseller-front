import { Queue } from "bullmq";
import { getBullMQConnection } from "./connection";
import type { WebhookJobPayload } from "../types";

let _queue: Queue | null = null;

export function getWebhookQueue(): Queue {
  if (!_queue) {
    _queue = new Queue("crypto-webhooks", {
      connection: getBullMQConnection(),
      defaultJobOptions: {
        attempts: 5,
        backoff: { type: "exponential", delay: 2000 },
        removeOnComplete: { count: 1000 },
        removeOnFail: { count: 5000 },
      },
    });
  }
  return _queue;
}

export async function addWebhookJob(payload: WebhookJobPayload): Promise<void> {
  await getWebhookQueue().add("process-webhook", payload);
}
