import type { CreateInvoiceInput, ProviderInvoice, ProviderInvoiceStatus } from "../../types";
import { BasePaymentProvider } from "../base";
import { CoinbaseClient } from "./client";
import { normalizeCoinbaseWebhook } from "./normalizer";
import type { WebhookEvent } from "../../types";
import { INVOICE_TTL_SECONDS, PRICE_LOCK_TTL_SECONDS } from "../../constants";
import { ProviderError, WebhookVerificationError } from "../../errors";

// Coinbase Commerce currency codes mapping
const CURRENCY_MAP: Record<string, string> = {
  USDC: "USDC",
  USDT: "USDT",
  ETH: "ETH",
  BTC: "BTC",
};

export class CoinbaseCommerceProvider extends BasePaymentProvider {
  async createInvoice(
    input: CreateInvoiceInput & { cryptoAmount: string; exchangeRate: number; exchangeRateSource: string }
  ): Promise<ProviderInvoice> {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";

    const charge = await CoinbaseClient.createCharge({
      name: "Awakenings Festival 2026 Ticket",
      description: `Order ${input.orderId} — ${input.preferredCurrency} on ${input.preferredNetwork}`,
      pricing_type: "fixed_price",
      local_price: {
        amount: String(input.fiatAmount.toFixed(2)),
        currency: input.fiatCurrency,
      },
      metadata: {
        orderId: input.orderId,
        preferredCurrency: input.preferredCurrency,
        preferredNetwork: input.preferredNetwork,
        ...(input.customerEmail && { customerEmail: input.customerEmail }),
      },
      redirect_url: `${baseUrl}/checkout/success`,
      cancel_url: `${baseUrl}/checkout/crypto`,
    });

    const currencyCode = CURRENCY_MAP[input.preferredCurrency] ?? input.preferredCurrency;
    const paymentAddress = charge.addresses[currencyCode.toLowerCase()] ?? charge.addresses[currencyCode] ?? "";

    if (!paymentAddress) {
      throw new ProviderError(
        `Coinbase Commerce did not return a payment address for ${currencyCode}`
      );
    }

    const now = new Date();

    return {
      providerInvoiceId: charge.id,
      providerHostedUrl: charge.hosted_url,
      paymentAddress,
      paymentUri: `${currencyCode.toLowerCase()}:${paymentAddress}?amount=${input.cryptoAmount}`,
      cryptoAmount: input.cryptoAmount,
      cryptoCurrency: input.preferredCurrency,
      cryptoNetwork: input.preferredNetwork,
      exchangeRateSnapshot: String(input.exchangeRate),
      exchangeRateSource: input.exchangeRateSource,
      requiredConfirmations: 12,
      expiresAt: charge.expires_at
        ? new Date(charge.expires_at)
        : new Date(now.getTime() + INVOICE_TTL_SECONDS * 1000),
      priceLockExpiresAt: new Date(now.getTime() + PRICE_LOCK_TTL_SECONDS * 1000),
    };
  }

  async getInvoiceStatus(chargeId: string): Promise<ProviderInvoiceStatus> {
    const charge = await CoinbaseClient.getCharge(chargeId);
    const timeline = charge.timeline ?? [];
    const latestStatus = timeline[timeline.length - 1]?.status ?? "NEW";

    const STATUS_MAP: Record<string, import("../../types").NormalizedPaymentStatus> = {
      NEW: "WAITING_PAYMENT",
      PENDING: "PAYMENT_DETECTED",
      CONFIRMED: "PAID",
      FAILED: "FAILED",
      EXPIRED: "EXPIRED",
      RESOLVED: "PAID",
      UNRESOLVED: "UNDERPAID",
    };

    const payments = charge.payments as Array<{ transaction_id?: string; block?: { confirmations_accumulated?: number } }> ?? [];
    const latestPayment = payments[payments.length - 1];

    return {
      providerInvoiceId: charge.id,
      status: STATUS_MAP[latestStatus] ?? "WAITING_PAYMENT",
      confirmations: latestPayment?.block?.confirmations_accumulated ?? 0,
      txHash: latestPayment?.transaction_id,
    };
  }

  verifyWebhookSignature(rawBody: Buffer, headers: Record<string, string>): void {
    const secret = process.env.COINBASE_COMMERCE_WEBHOOK_SECRET;
    if (!secret) throw new Error("COINBASE_COMMERCE_WEBHOOK_SECRET is not set");

    const signature = headers["x-cc-webhook-signature"] ?? "";
    if (!signature) {
      throw new WebhookVerificationError("Missing x-cc-webhook-signature header");
    }

    this.hmacVerify(secret, rawBody, signature);
  }

  normalizeWebhookEvent(rawBody: Buffer): WebhookEvent {
    return normalizeCoinbaseWebhook(rawBody);
  }
}
