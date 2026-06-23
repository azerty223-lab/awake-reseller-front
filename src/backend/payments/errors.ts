export class PaymentError extends Error {
  constructor(
    message: string,
    public readonly code: string
  ) {
    super(message);
    this.name = "PaymentError";
  }
}

export class InvoiceNotFoundError extends PaymentError {
  constructor(invoiceId: string) {
    super(`Invoice not found: ${invoiceId}`, "INVOICE_NOT_FOUND");
    this.name = "InvoiceNotFoundError";
  }
}

export class InvalidTransitionError extends PaymentError {
  constructor(from: string, event: string) {
    super(`Invalid transition from ${from} on event ${event}`, "INVALID_TRANSITION");
    this.name = "InvalidTransitionError";
  }
}

export class WebhookVerificationError extends PaymentError {
  constructor(reason: string) {
    super(`Webhook verification failed: ${reason}`, "WEBHOOK_VERIFICATION_FAILED");
    this.name = "WebhookVerificationError";
  }
}

export class RateLimitError extends PaymentError {
  constructor(identifier: string) {
    super(`Rate limit exceeded for: ${identifier}`, "RATE_LIMIT_EXCEEDED");
    this.name = "RateLimitError";
  }
}

export class PriceLockExpiredError extends PaymentError {
  constructor(invoiceId: string) {
    super(`Price lock expired for invoice: ${invoiceId}`, "PRICE_LOCK_EXPIRED");
    this.name = "PriceLockExpiredError";
  }
}

export class ProviderError extends PaymentError {
  constructor(message: string, public readonly providerCode?: string) {
    super(message, "PROVIDER_ERROR");
    this.name = "ProviderError";
  }
}
