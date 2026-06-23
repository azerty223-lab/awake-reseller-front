import type { WebhookEvent, NormalizedPaymentStatus } from "../../types";

const EVENT_TYPE_MAP: Record<string, NormalizedPaymentStatus | null> = {
  InvoiceSettled: "PAID",
  InvoicePaymentSettled: "PAYMENT_DETECTED",
  InvoiceExpired: "EXPIRED",
  InvoiceInvalid: "FAILED",
  InvoiceProcessing: "PAYMENT_PENDING_CONFIRMATION",
  InvoiceCreated: null, // not a state change
};

export function normalizeBTCPayWebhook(rawBody: Buffer): WebhookEvent {
  const payload = JSON.parse(rawBody.toString("utf8")) as {
    deliveryId?: string;
    webhookId?: string;
    originalDeliveryId?: string;
    isRedelivery?: boolean;
    type: string;
    timestamp: number;
    storeId: string;
    invoiceId: string;
    metadata?: Record<string, unknown>;
    payment?: {
      id?: string;
      receivedDate?: number;
      value?: string;
      fee?: string;
      status?: string;
      destination?: string;
      paymentProof?: {
        type?: string;
        proofType?: string;
        link?: string;
        id?: string;
        blockHash?: string;
        blockHeight?: number;
        confirmations?: number;
      };
    };
  };

  const mappedStatus = EVENT_TYPE_MAP[payload.type];
  const status: NormalizedPaymentStatus = mappedStatus ?? "WAITING_PAYMENT";

  const confirmations = payload.payment?.paymentProof?.confirmations ?? 0;
  const txHash = payload.payment?.paymentProof?.id ?? payload.payment?.id;
  const blockHeight = payload.payment?.paymentProof?.blockHeight;
  const receivedAmount = payload.payment?.value;

  const eventId = payload.deliveryId ?? payload.originalDeliveryId ?? `btcpay_${Date.now()}`;

  return {
    eventId,
    provider: "BTCPAY",
    providerInvoiceId: payload.invoiceId,
    status,
    confirmations,
    txHash,
    receivedAmount,
    blockHeight,
    eventTimestamp: new Date(payload.timestamp * 1000),
    rawPayload: payload,
  };
}
