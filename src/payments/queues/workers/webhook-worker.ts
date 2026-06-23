import { Worker, UnrecoverableError } from "bullmq";
import { getBullMQConnection } from "../connection";
import { prisma } from "@/lib/prisma";
import { stateMachine } from "../../state-machine";
import { AuditLogger } from "../../audit/logger";
import { InvalidTransitionError } from "../../errors";
import type { WebhookJobPayload, PaymentStateEvent, NormalizedPaymentStatus } from "../../types";

function statusToEvent(
  status: NormalizedPaymentStatus,
  confirmations: number,
  requiredConfirmations: number
): PaymentStateEvent {
  switch (status) {
    case "PAYMENT_DETECTED":
      return confirmations >= requiredConfirmations ? "THRESHOLD_MET" : "PAYMENT_BROADCAST";
    case "PAYMENT_PENDING_CONFIRMATION":
      return confirmations >= requiredConfirmations ? "THRESHOLD_MET" : "CONFIRMATION_RECEIVED";
    case "PAID":
      return "THRESHOLD_MET";
    case "EXPIRED":
      return "INVOICE_EXPIRED";
    case "FAILED":
      return "PAYMENT_FAILED";
    case "UNDERPAID":
      return "UNDERPAYMENT_DETECTED";
    case "OVERPAID":
      return "OVERPAYMENT_DETECTED";
    default:
      return "PAYMENT_BROADCAST";
  }
}

export function createWebhookWorker(): Worker {
  return new Worker(
    "crypto-webhooks",
    async (job) => {
      const { cryptoInvoiceId, webhookEvent } = job.data;

      // 1. Load invoice
      const invoice = await prisma.cryptoInvoice.findUnique({
        where: { id: cryptoInvoiceId },
      });

      if (!invoice) {
        // Unknown invoice — don't retry
        throw new UnrecoverableError(`Invoice not found: ${cryptoInvoiceId}`);
      }

      // 2. If terminal, skip
      if (stateMachine.isTerminal(invoice.status as import("../../types").NormalizedPaymentStatus)) {
        await AuditLogger.log({
          cryptoInvoiceId: invoice.id,
          event: "IDEMPOTENCY_SKIP",
          webhookEventId: webhookEvent.eventId,
          metadata: { reason: "already_terminal", status: invoice.status },
        });
        return;
      }

      // 3. Determine event
      const paymentEvent = statusToEvent(
        webhookEvent.status,
        webhookEvent.confirmations,
        invoice.requiredConfirmations
      );

      // 4. Transition
      try {
        await stateMachine.transition(invoice, paymentEvent, {
          confirmations: webhookEvent.confirmations,
          txHash: webhookEvent.txHash,
          receivedAmount: webhookEvent.receivedAmount,
        });

        await AuditLogger.log({
          cryptoInvoiceId: invoice.id,
          event: "WEBHOOK_RECEIVED",
          fromStatus: invoice.status as import("../../types").NormalizedPaymentStatus,
          toStatus: webhookEvent.status,
          webhookEventId: webhookEvent.eventId,
          providerName: webhookEvent.provider,
          confirmations: webhookEvent.confirmations,
          txHash: webhookEvent.txHash,
          rawPayload: webhookEvent.rawPayload as Record<string, unknown>,
          metadata: { paymentEvent },
        });
      } catch (err) {
        if (err instanceof InvalidTransitionError) {
          // Don't retry invalid transitions
          throw new UnrecoverableError(err.message);
        }
        throw err;
      }
    },
    {
      connection: getBullMQConnection(),
      concurrency: 5,
    }
  );
}
