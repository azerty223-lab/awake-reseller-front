import { Worker } from "bullmq";
import { getBullMQConnection, getRedis } from "../connection";
import { prisma } from "@/lib/prisma";
import { stateMachine } from "../../state-machine";
import { AuditLogger } from "../../audit/logger";
import type { ExpiryJobPayload, NormalizedPaymentStatus } from "../../types";

const EXPIRABLE_STATES = ["WAITING_PAYMENT", "UNDERPAID", "OVERPAID"] as const;

export function createExpiryWorker(): Worker {
  return new Worker(
    "crypto-expirations",
    async (job) => {
      const { cryptoInvoiceId, orderId } = job.data as ExpiryJobPayload;

      const invoice = await prisma.cryptoInvoice.findUnique({
        where: { id: cryptoInvoiceId },
      });

      if (!invoice) {
        console.warn(`[ExpiryWorker] Invoice not found: ${cryptoInvoiceId}`);
        return;
      }

      if (stateMachine.isTerminal(invoice.status as NormalizedPaymentStatus)) {
        return;
      }

      if (!EXPIRABLE_STATES.includes(invoice.status as typeof EXPIRABLE_STATES[number])) {
        await AuditLogger.log({
          cryptoInvoiceId: invoice.id,
          event: "EXPIRY_TRIGGERED",
          metadata: { reason: "not_in_expirable_state", currentStatus: invoice.status, skipped: true },
        });
        return;
      }

      try {
        await stateMachine.transition(invoice, "INVOICE_EXPIRED");
        await AuditLogger.log({
          cryptoInvoiceId: invoice.id,
          event: "EXPIRY_TRIGGERED",
          fromStatus: invoice.status as NormalizedPaymentStatus,
          toStatus: "EXPIRED",
          metadata: { orderId },
        });
      } catch (err) {
        console.error(`[ExpiryWorker] Failed to expire invoice ${cryptoInvoiceId}:`, err);
        throw err;
      }

      // Delete Redis price-lock key using the standalone Redis client
      const redis = getRedis();
      await redis.del(`price-lock:${cryptoInvoiceId}`);
    },
    {
      connection: getBullMQConnection(),
      concurrency: 10,
    }
  );
}
