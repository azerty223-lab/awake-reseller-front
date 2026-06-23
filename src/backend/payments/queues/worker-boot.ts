// Entry point to start all BullMQ workers
// Run as: jiti src/payments/queues/worker-boot.ts
// Or call startWorkers() from a custom Next.js server

import { createWebhookWorker } from "./workers/webhook-worker";
import { createExpiryWorker } from "./workers/expiry-worker";

export function startWorkers() {
  const webhookWorker = createWebhookWorker();
  const expiryWorker = createExpiryWorker();

  webhookWorker.on("failed", (job, err) => {
    console.error("[WebhookWorker] Job failed", job?.id, err.message);
  });

  expiryWorker.on("failed", (job, err) => {
    console.error("[ExpiryWorker] Job failed", job?.id, err.message);
  });

  webhookWorker.on("completed", (job) => {
    console.log("[WebhookWorker] Job completed", job.id);
  });

  expiryWorker.on("completed", (job) => {
    console.log("[ExpiryWorker] Job completed", job.id);
  });

  console.log("[Workers] BullMQ workers started");
  return { webhookWorker, expiryWorker };
}

// Allow direct execution
if (require.main === module) {
  startWorkers();
}
