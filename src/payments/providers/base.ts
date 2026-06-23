import * as crypto from "crypto";
import type { CreateInvoiceInput, PaymentProvider, ProviderInvoice, ProviderInvoiceStatus, WebhookEvent } from "../types";
import { WebhookVerificationError } from "../errors";

export abstract class BasePaymentProvider implements PaymentProvider {
  abstract createInvoice(
    input: CreateInvoiceInput & { cryptoAmount: string; exchangeRate: number; exchangeRateSource: string }
  ): Promise<ProviderInvoice>;

  abstract getInvoiceStatus(providerInvoiceId: string): Promise<ProviderInvoiceStatus>;

  abstract verifyWebhookSignature(rawBody: Buffer, headers: Record<string, string>): void;

  abstract normalizeWebhookEvent(rawBody: Buffer): WebhookEvent;

  protected hmacVerify(secret: string, rawBody: Buffer, signature: string): void {
    const expected = crypto
      .createHmac("sha256", secret)
      .update(rawBody)
      .digest("hex");

    const expectedBuf = Buffer.from(expected, "utf8");
    const signatureBuf = Buffer.from(signature, "utf8");

    if (
      expectedBuf.length !== signatureBuf.length ||
      !crypto.timingSafeEqual(expectedBuf, signatureBuf)
    ) {
      throw new WebhookVerificationError("HMAC signature mismatch");
    }
  }
}
