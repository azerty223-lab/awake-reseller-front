import type { WebhookEvent, NormalizedPaymentStatus } from "../../types";

const STATUS_MAP: Record<string, NormalizedPaymentStatus | null> = {
  NEW: null, // not a state change
  PENDING: "PAYMENT_DETECTED",
  CONFIRMED: "PAID",
  FAILED: "FAILED",
  EXPIRED: "EXPIRED",
  RESOLVED: "PAID",
  UNRESOLVED: "UNDERPAID",
};

export function normalizeCoinbaseWebhook(rawBody: Buffer): WebhookEvent {
  const payload = JSON.parse(rawBody.toString("utf8")) as {
    id: string;
    type: string;
    created_at: string;
    data: {
      id: string;
      code: string;
      timeline: Array<{ status: string; time: string; payment?: { transaction_id?: string; value?: { crypto?: { amount?: string } } } }>;
      payments?: Array<{ value?: { crypto?: { amount?: string } }; transaction_id?: string; block?: { confirmations_accumulated?: number; height?: number } }>;
    };
  };

  const timeline = payload.data?.timeline ?? [];
  const latestStatus = timeline[timeline.length - 1]?.status ?? "NEW";
  const mappedStatus: NormalizedPaymentStatus = STATUS_MAP[latestStatus] ?? "WAITING_PAYMENT";

  const payments = payload.data?.payments ?? [];
  const latestPayment = payments[payments.length - 1];

  const txHash = latestPayment?.transaction_id ?? timeline[timeline.length - 1]?.payment?.transaction_id;
  const confirmations = latestPayment?.block?.confirmations_accumulated ?? 0;
  const blockHeight = latestPayment?.block?.height;
  const receivedAmount = latestPayment?.value?.crypto?.amount;

  return {
    eventId: payload.id,
    provider: "COINBASE_COMMERCE",
    providerInvoiceId: payload.data.id,
    status: mappedStatus,
    confirmations,
    txHash,
    receivedAmount,
    blockHeight,
    eventTimestamp: new Date(payload.created_at),
    rawPayload: payload,
  };
}
