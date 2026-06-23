import { prisma } from "@/lib/prisma";
import type { CryptoInvoice, CryptoCurrency, CryptoNetwork, CryptoProviderName } from "@prisma/client";
import type { QrPayload } from "./types";
import { invoiceService } from "./invoice/service";
import { qrCodeService } from "./qr/service";
import { webhookProcessor } from "./webhooks/processor";
import { rateLimitService } from "./rate-limit/service";
import { getRedis, isRedisAvailable } from "./queues/connection";
import { RateLimitError, InvoiceNotFoundError } from "./errors";

export class PaymentService {
  static async createCryptoInvoice(params: {
    orderId: string;
    fiatAmount: number;
    preferredCurrency: CryptoCurrency;
    preferredNetwork: CryptoNetwork;
    customerEmail?: string;
    ip: string;
    userId?: string;
  }): Promise<{ invoice: CryptoInvoice; qr: QrPayload; alreadyExisted: boolean }> {
    // Rate limit check — skipped gracefully when Redis is unavailable (dev mode)
    const redisUp = await isRedisAvailable();
    if (redisUp) {
      const redis = getRedis();
      const identifier = `${params.ip}:${params.userId ?? "guest"}`;
      const rateLimitResult = await rateLimitService.check(redis, identifier);
      if (!rateLimitResult.allowed) {
        throw new RateLimitError(identifier);
      }
    }

    return invoiceService.createInvoice({
      orderId: params.orderId,
      fiatAmount: params.fiatAmount,
      fiatCurrency: "EUR",
      preferredCurrency: params.preferredCurrency,
      preferredNetwork: params.preferredNetwork,
      customerEmail: params.customerEmail,
    });
  }

  static async getInvoiceStatus(invoiceId: string): Promise<{
    status: import("@prisma/client").CryptoPaymentStatus;
    confirmations: number;
    requiredConfirmations: number;
    priceLockExpiresAt: Date;
    expiresAt: Date;
    txHash: string | null;
    paymentAddress: string;
    cryptoAmount: string;
    cryptoCurrency: CryptoCurrency;
    cryptoNetwork: CryptoNetwork;
    qr?: QrPayload;
  }> {
    const invoice = await prisma.cryptoInvoice.findUnique({
      where: { id: invoiceId },
    });

    if (!invoice) {
      throw new InvoiceNotFoundError(invoiceId);
    }

    const result: Awaited<ReturnType<typeof PaymentService.getInvoiceStatus>> = {
      status: invoice.status,
      confirmations: invoice.confirmations,
      requiredConfirmations: invoice.requiredConfirmations,
      priceLockExpiresAt: invoice.priceLockExpiresAt,
      expiresAt: invoice.expiresAt,
      txHash: invoice.txHash,
      paymentAddress: invoice.paymentAddress,
      cryptoAmount: invoice.cryptoAmount,
      cryptoCurrency: invoice.cryptoCurrency,
      cryptoNetwork: invoice.cryptoNetwork,
    };

    if (invoice.status === "WAITING_PAYMENT") {
      result.qr = await qrCodeService.generatePayload(invoice);
    }

    return result;
  }

  static async processWebhook(
    provider: CryptoProviderName,
    rawBody: Buffer,
    headers: Record<string, string>
  ): Promise<void> {
    await webhookProcessor.process(provider, rawBody, headers);
  }
}
