import { prisma } from "@/backend/lib/prisma";
import type { CryptoInvoice } from "@prisma/client";
import type { CreateInvoiceInput, QrPayload } from "../types";
import { priceLockService } from "./price-lock";
import { qrCodeService } from "../qr/service";
import { createProvider, getDefaultProvider } from "../providers";
import { getRedis, isRedisAvailable } from "../queues/connection";
import { getExpiryQueue } from "../queues/expiry-queue";
import { AuditLogger } from "../audit/logger";
import { INVOICE_TTL_SECONDS, PRICE_LOCK_TTL_SECONDS, CONFIRMATION_THRESHOLDS } from "../constants";

export class InvoiceService {
  async createInvoice(
    input: CreateInvoiceInput
  ): Promise<{ invoice: CryptoInvoice; qr: QrPayload; alreadyExisted: boolean }> {
    // Check Redis once — all Redis-dependent steps are skipped if unavailable
    const redisUp = await isRedisAvailable();

    // 1. Idempotency check — return existing non-expired invoice
    const existing = await prisma.cryptoInvoice.findUnique({
      where: { orderId: input.orderId },
    });

    if (existing && existing.expiresAt > new Date() && existing.status !== "EXPIRED" && existing.status !== "FAILED") {
      const qr = await qrCodeService.generatePayload(existing);
      return { invoice: existing, qr, alreadyExisted: true };
    }

    // 2. Fetch exchange rate
    const { rate, source: exchangeRateSource } = await priceLockService.fetchExchangeRate(
      input.preferredCurrency
    );

    // 3. Calculate crypto amount
    const cryptoAmount = priceLockService.calculateCryptoAmount(input.fiatAmount, rate);

    // 4. Determine required confirmations
    const thresholdKey = `${input.preferredCurrency}_${input.preferredNetwork}` as keyof typeof CONFIRMATION_THRESHOLDS;
    const fastMode = process.env.CRYPTO_FAST_MODE === "true";
    const thresholds = CONFIRMATION_THRESHOLDS[thresholdKey];
    const requiredConfirmations = thresholds
      ? (fastMode ? thresholds.fast : thresholds.standard)
      : 12;

    // 5. Call provider
    const providerName = getDefaultProvider();
    const provider = createProvider(providerName);

    const providerInvoice = await provider.createInvoice({
      ...input,
      cryptoAmount,
      exchangeRate: rate,
      exchangeRateSource,
    });

    // 6. Write CryptoInvoice to DB
    const now = new Date();
    const expiresAt = new Date(now.getTime() + INVOICE_TTL_SECONDS * 1000);
    const priceLockExpiresAt = new Date(now.getTime() + PRICE_LOCK_TTL_SECONDS * 1000);

    const invoice = await prisma.cryptoInvoice.create({
      data: {
        orderId: input.orderId,
        provider: providerName,
        providerInvoiceId: providerInvoice.providerInvoiceId,
        providerHostedUrl: providerInvoice.providerHostedUrl,
        status: "WAITING_PAYMENT",
        fiatAmount: input.fiatAmount,
        fiatCurrency: input.fiatCurrency,
        cryptoCurrency: input.preferredCurrency,
        cryptoNetwork: input.preferredNetwork,
        cryptoAmount,
        exchangeRateSnapshot: String(rate),
        exchangeRateSource,
        paymentAddress: providerInvoice.paymentAddress,
        paymentUri: providerInvoice.paymentUri,
        requiredConfirmations,
        expiresAt,
        priceLockExpiresAt,
      },
    });

    // 7. Lock rate in Redis (skipped entirely when Redis is unavailable)
    if (redisUp) {
      const redis = getRedis();
      await priceLockService.lockRate(invoice.id, cryptoAmount, rate, redis).catch(() => {});
    }

    // 8. Schedule expiry job via BullMQ (skipped when Redis unavailable — expiry checked at query time)
    if (redisUp) {
      const expiryQueue = getExpiryQueue();
      await expiryQueue.add(
        "expire-invoice",
        { cryptoInvoiceId: invoice.id, orderId: input.orderId, scheduledExpiryAt: expiresAt.toISOString() },
        { delay: INVOICE_TTL_SECONDS * 1000 }
      ).catch(() => {});
    }

    // 9. Log INVOICE_CREATED
    await AuditLogger.log({
      cryptoInvoiceId: invoice.id,
      event: "INVOICE_CREATED",
      providerName,
      metadata: {
        orderId: input.orderId,
        fiatAmount: input.fiatAmount,
        cryptoAmount,
        exchangeRateSource,
      },
    });

    // 10. Generate QR
    const qr = await qrCodeService.generatePayload(invoice);

    return { invoice, qr, alreadyExisted: false };
  }

  async getInvoice(invoiceId: string): Promise<CryptoInvoice | null> {
    return prisma.cryptoInvoice.findUnique({ where: { id: invoiceId } });
  }

  async getInvoiceByOrderId(orderId: string): Promise<CryptoInvoice | null> {
    return prisma.cryptoInvoice.findUnique({ where: { orderId } });
  }
}

export const invoiceService = new InvoiceService();
