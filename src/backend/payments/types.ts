import type {
  CryptoCurrency,
  CryptoNetwork,
  CryptoProviderName,
  CryptoPaymentStatus,
} from "@prisma/client";

export type { CryptoCurrency, CryptoNetwork, CryptoProviderName, CryptoPaymentStatus };

export type NormalizedPaymentStatus =
  | "WAITING_PAYMENT"
  | "PAYMENT_DETECTED"
  | "PAYMENT_PENDING_CONFIRMATION"
  | "PAID"
  | "EXPIRED"
  | "FAILED"
  | "UNDERPAID"
  | "OVERPAID";

export type PaymentStateEvent =
  | "PAYMENT_BROADCAST"
  | "CONFIRMATION_RECEIVED"
  | "THRESHOLD_MET"
  | "INVOICE_EXPIRED"
  | "PAYMENT_FAILED"
  | "UNDERPAYMENT_DETECTED"
  | "OVERPAYMENT_DETECTED";

export interface CreateInvoiceInput {
  orderId: string;
  fiatAmount: number;
  fiatCurrency: string;
  preferredCurrency: CryptoCurrency;
  preferredNetwork: CryptoNetwork;
  customerEmail?: string;
  metadata?: Record<string, unknown>;
}

export interface ProviderInvoice {
  providerInvoiceId: string;
  providerHostedUrl?: string;
  paymentAddress: string;
  paymentUri: string;
  cryptoAmount: string;
  cryptoCurrency: CryptoCurrency;
  cryptoNetwork: CryptoNetwork;
  exchangeRateSnapshot: string;
  exchangeRateSource: string;
  requiredConfirmations: number;
  expiresAt: Date;
  priceLockExpiresAt: Date;
}

export interface ProviderInvoiceStatus {
  providerInvoiceId: string;
  status: NormalizedPaymentStatus;
  confirmations: number;
  txHash?: string;
  receivedAmount?: string;
}

export interface WebhookEvent {
  eventId: string;
  provider: CryptoProviderName;
  providerInvoiceId: string;
  status: NormalizedPaymentStatus;
  confirmations: number;
  txHash?: string;
  receivedAmount?: string;
  blockHeight?: number;
  eventTimestamp: Date;
  rawPayload: unknown;
}

export interface PaymentProvider {
  createInvoice(input: CreateInvoiceInput & { cryptoAmount: string; exchangeRate: number; exchangeRateSource: string }): Promise<ProviderInvoice>;
  getInvoiceStatus(providerInvoiceId: string): Promise<ProviderInvoiceStatus>;
  verifyWebhookSignature(rawBody: Buffer, headers: Record<string, string>): void;
  normalizeWebhookEvent(rawBody: Buffer): WebhookEvent;
}

export interface StateTransitionResult {
  previousStatus: NormalizedPaymentStatus;
  newStatus: NormalizedPaymentStatus;
  transitionedAt: Date;
}

export interface WebhookJobPayload {
  cryptoInvoiceId: string;
  webhookEvent: WebhookEvent;
  receivedAt: string;
}

export interface ExpiryJobPayload {
  cryptoInvoiceId: string;
  orderId: string;
  scheduledExpiryAt: string;
}

export interface QrPayload {
  uri: string;
  svgString: string;
  address: string;
  amount: string;
  currency: CryptoCurrency;
  network: CryptoNetwork;
}

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetAt: Date;
}
