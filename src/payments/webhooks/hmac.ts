import type { CryptoProviderName } from "@prisma/client";
import { createProvider } from "../providers";
import { WebhookVerificationError } from "../errors";

export function verifySignature(
  provider: CryptoProviderName,
  rawBody: Buffer,
  headers: Record<string, string>
): void {
  try {
    const providerInstance = createProvider(provider);
    providerInstance.verifyWebhookSignature(rawBody, headers);
  } catch (err) {
    if (err instanceof WebhookVerificationError) {
      throw err;
    }
    throw new WebhookVerificationError(
      err instanceof Error ? err.message : "Unknown verification error"
    );
  }
}
