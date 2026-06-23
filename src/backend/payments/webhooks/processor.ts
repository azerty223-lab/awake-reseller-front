import type { CryptoProviderName } from "@prisma/client";
import { createProvider } from "../providers";
import { verifySignature } from "./hmac";
import { replayGuard } from "./replay-guard";
import { getRedis } from "../queues/connection";
import { getWebhookQueue } from "../queues/webhook-queue";
import { prisma } from "@/backend/lib/prisma";
import { AuditLogger } from "../audit/logger";

export class WebhookProcessor {
  async process(
    provider: CryptoProviderName,
    rawBody: Buffer,
    headers: Record<string, string>
  ): Promise<{ queued: boolean; reason?: string }> {
    // 1. Verify signature
    verifySignature(provider, rawBody, headers);

    // 2. Normalize the event to get eventId for replay check
    const providerInstance = createProvider(provider);
    const webhookEvent = providerInstance.normalizeWebhookEvent(rawBody);

    const redis = getRedis();

    // 3. Replay guard
    const isDuplicate = await replayGuard.check(redis, webhookEvent.eventId);
    if (isDuplicate) {
      await AuditLogger.log({
        // We don't have invoiceId yet at this stage, find it
        cryptoInvoiceId: await resolveCryptoInvoiceId(webhookEvent.providerInvoiceId),
        event: "IDEMPOTENCY_SKIP",
        webhookEventId: webhookEvent.eventId,
        providerName: provider,
        metadata: { reason: "duplicate_event_id" },
      });
      return { queued: false, reason: "duplicate" };
    }

    // 4. Enqueue to BullMQ
    const queue = getWebhookQueue();
    await queue.add(
      "process-webhook",
      {
        cryptoInvoiceId: await resolveCryptoInvoiceId(webhookEvent.providerInvoiceId),
        webhookEvent,
        receivedAt: new Date().toISOString(),
      },
      {
        jobId: webhookEvent.eventId,
      }
    );

    // 5. Write WebhookIdempotency row to DB
    await prisma.webhookIdempotency.create({
      data: {
        eventId: webhookEvent.eventId,
        provider,
      },
    });

    return { queued: true };
  }
}

async function resolveCryptoInvoiceId(providerInvoiceId: string): Promise<string> {
  const invoice = await prisma.cryptoInvoice.findUnique({
    where: { providerInvoiceId },
    select: { id: true },
  });
  return invoice?.id ?? "unknown";
}

export const webhookProcessor = new WebhookProcessor();
