import type { CreateInvoiceInput, ProviderInvoice, ProviderInvoiceStatus, WebhookEvent } from "../../types";
import { BasePaymentProvider } from "../base";
import { BTCPayClient } from "./client";
import { normalizeBTCPayWebhook } from "./normalizer";
import { WebhookVerificationError, ProviderError } from "../../errors";
import { INVOICE_TTL_SECONDS, PRICE_LOCK_TTL_SECONDS } from "../../constants";

export class BTCPayProvider extends BasePaymentProvider {
  private get storeId(): string {
    const id = process.env.BTCPAY_STORE_ID;
    if (!id) throw new ProviderError("BTCPAY_STORE_ID is not set");
    return id;
  }

  async createInvoice(
    input: CreateInvoiceInput & { cryptoAmount: string; exchangeRate: number; exchangeRateSource: string }
  ): Promise<ProviderInvoice> {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";

    const btcpayInvoice = await BTCPayClient.createInvoice(this.storeId, {
      amount: String(input.fiatAmount.toFixed(2)),
      currency: input.fiatCurrency,
      metadata: {
        orderId: input.orderId,
        preferredCurrency: input.preferredCurrency,
        preferredNetwork: input.preferredNetwork,
        ...(input.customerEmail ? { customerEmail: input.customerEmail } : {}),
      },
      checkout: {
        redirectURL: `${baseUrl}/checkout/success`,
        redirectAutomatically: false,
        defaultPaymentMethod: input.preferredCurrency === "BTC" ? "BTC" : `${input.preferredCurrency}_${input.preferredNetwork}`,
        expirationMinutes: Math.floor(INVOICE_TTL_SECONDS / 60),
      },
    });

    // BTCPay doesn't always return payment addresses in the create response
    // We use a deterministic address placeholder and rely on BTCPay's hosted checkout
    const paymentAddress = btcpayInvoice.checkoutLink ? `btcpay:${btcpayInvoice.id}` : `btcpay_unknown_${btcpayInvoice.id}`;
    const now = new Date();

    return {
      providerInvoiceId: btcpayInvoice.id,
      providerHostedUrl: btcpayInvoice.checkoutLink,
      paymentAddress,
      paymentUri: btcpayInvoice.checkoutLink ?? `${process.env.BTCPAY_URL}/i/${btcpayInvoice.id}`,
      cryptoAmount: input.cryptoAmount,
      cryptoCurrency: input.preferredCurrency,
      cryptoNetwork: input.preferredNetwork,
      exchangeRateSnapshot: String(input.exchangeRate),
      exchangeRateSource: input.exchangeRateSource,
      requiredConfirmations: 1, // BTCPay handles this internally
      expiresAt: btcpayInvoice.expirationTime
        ? new Date(btcpayInvoice.expirationTime)
        : new Date(now.getTime() + INVOICE_TTL_SECONDS * 1000),
      priceLockExpiresAt: new Date(now.getTime() + PRICE_LOCK_TTL_SECONDS * 1000),
    };
  }

  async getInvoiceStatus(invoiceId: string): Promise<ProviderInvoiceStatus> {
    const invoice = await BTCPayClient.getInvoice(this.storeId, invoiceId);

    const STATUS_MAP: Record<string, import("../../types").NormalizedPaymentStatus> = {
      New: "WAITING_PAYMENT",
      Processing: "PAYMENT_PENDING_CONFIRMATION",
      Settled: "PAID",
      Expired: "EXPIRED",
      Invalid: "FAILED",
    };

    return {
      providerInvoiceId: invoice.id,
      status: STATUS_MAP[invoice.status] ?? "WAITING_PAYMENT",
      confirmations: 0,
    };
  }

  verifyWebhookSignature(rawBody: Buffer, headers: Record<string, string>): void {
    const secret = process.env.BTCPAY_WEBHOOK_SECRET;
    if (!secret) throw new Error("BTCPAY_WEBHOOK_SECRET is not set");

    // BTCPay sends "sha256={hex}" in the BTCPay-Sig header
    const sigHeader = headers["btcpay-sig"] ?? "";
    if (!sigHeader) {
      throw new WebhookVerificationError("Missing BTCPay-Sig header");
    }

    const [algo, sigHex] = sigHeader.split("=");
    if (algo !== "sha256" || !sigHex) {
      throw new WebhookVerificationError("Invalid BTCPay-Sig format");
    }

    this.hmacVerify(secret, rawBody, sigHex);
  }

  normalizeWebhookEvent(rawBody: Buffer): WebhookEvent {
    return normalizeBTCPayWebhook(rawBody);
  }
}
