import { prisma } from "@/backend/lib/prisma";
import type { CryptoPaymentStatus, CryptoProviderName, PaymentLogEvent } from "@prisma/client";
import type { NormalizedPaymentStatus } from "../types";

export class AuditLogger {
  static async log(params: {
    cryptoInvoiceId: string;
    event: PaymentLogEvent;
    fromStatus?: NormalizedPaymentStatus | CryptoPaymentStatus;
    toStatus?: NormalizedPaymentStatus | CryptoPaymentStatus;
    rawPayload?: unknown;
    webhookEventId?: string;
    providerName?: CryptoProviderName;
    confirmations?: number;
    txHash?: string;
    errorCode?: string;
    errorMessage?: string;
    metadata?: Record<string, unknown>;
  }): Promise<void> {
    try {
      if (!params.cryptoInvoiceId || params.cryptoInvoiceId === "unknown") {
        // Don't write logs for unknown invoices
        return;
      }

      await prisma.cryptoPaymentLog.create({
        data: {
          cryptoInvoiceId: params.cryptoInvoiceId,
          event: params.event,
          fromStatus: params.fromStatus as CryptoPaymentStatus | undefined,
          toStatus: params.toStatus as CryptoPaymentStatus | undefined,
          rawPayload: params.rawPayload !== undefined ? JSON.parse(JSON.stringify(params.rawPayload)) : undefined,
          webhookEventId: params.webhookEventId,
          providerName: params.providerName,
          confirmations: params.confirmations,
          txHash: params.txHash,
          errorCode: params.errorCode,
          errorMessage: params.errorMessage,
          metadata: params.metadata !== undefined ? JSON.parse(JSON.stringify(params.metadata)) : undefined,
        },
      });
    } catch (err) {
      // Logging must never crash the payment flow
      console.error("[AuditLogger] Failed to write log:", err);
    }
  }
}
