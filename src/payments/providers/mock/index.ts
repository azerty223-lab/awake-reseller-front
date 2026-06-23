import type { CreateInvoiceInput, ProviderInvoice, ProviderInvoiceStatus, WebhookEvent } from "../../types";
import { BasePaymentProvider } from "../base";
import { WebhookVerificationError } from "../../errors";
import { INVOICE_TTL_SECONDS, PRICE_LOCK_TTL_SECONDS } from "../../constants";

export class MockProvider extends BasePaymentProvider {
  async createInvoice(
    input: CreateInvoiceInput & { cryptoAmount: string; exchangeRate: number; exchangeRateSource: string }
  ): Promise<ProviderInvoice> {
    const now = new Date();
    const providerInvoiceId = `mock_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;

    return {
      providerInvoiceId,
      providerHostedUrl: undefined,
      paymentAddress: "0x1234567890abcdef1234567890abcdef12345678",
      paymentUri: `ethereum:0x1234567890abcdef1234567890abcdef12345678?value=0&token=${input.preferredCurrency}&amount=${input.cryptoAmount}`,
      cryptoAmount: input.cryptoAmount,
      cryptoCurrency: input.preferredCurrency,
      cryptoNetwork: input.preferredNetwork,
      exchangeRateSnapshot: String(input.exchangeRate),
      exchangeRateSource: input.exchangeRateSource,
      requiredConfirmations: 12,
      expiresAt: new Date(now.getTime() + INVOICE_TTL_SECONDS * 1000),
      priceLockExpiresAt: new Date(now.getTime() + PRICE_LOCK_TTL_SECONDS * 1000),
    };
  }

  async getInvoiceStatus(providerInvoiceId: string): Promise<ProviderInvoiceStatus> {
    return {
      providerInvoiceId,
      status: "WAITING_PAYMENT",
      confirmations: 0,
    };
  }

  verifyWebhookSignature(rawBody: Buffer, headers: Record<string, string>): void {
    if (process.env.NODE_ENV === "production") {
      const sig = headers["x-mock-signature"];
      if (sig !== "valid") {
        throw new WebhookVerificationError("Mock signature invalid in production");
      }
    }
    // In dev, always passes
  }

  normalizeWebhookEvent(rawBody: Buffer): WebhookEvent {
    const body = JSON.parse(rawBody.toString("utf8")) as {
      type: string;
      invoiceId: string;
      status: string;
      confirmations?: number;
      txHash?: string;
    };

    const statusMap: Record<string, string> = {
      pending: "PAYMENT_DETECTED",
      confirmed: "PAID",
      failed: "FAILED",
      expired: "EXPIRED",
    };

    return {
      eventId: `mock_evt_${Date.now()}`,
      provider: "MOCK",
      providerInvoiceId: body.invoiceId,
      status: (statusMap[body.status] ?? "WAITING_PAYMENT") as import("../../types").NormalizedPaymentStatus,
      confirmations: body.confirmations ?? 0,
      txHash: body.txHash,
      eventTimestamp: new Date(),
      rawPayload: body,
    };
  }
}
