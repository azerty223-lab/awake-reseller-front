import type { CryptoProviderName } from "@prisma/client";
import type { PaymentProvider } from "../types";
import { ProviderError } from "../errors";
import { MockProvider } from "./mock";
import { CoinbaseCommerceProvider } from "./coinbase";
import { BTCPayProvider } from "./btcpay";

export function createProvider(name: CryptoProviderName): PaymentProvider {
  switch (name) {
    case "COINBASE_COMMERCE":
      return new CoinbaseCommerceProvider();
    case "BTCPAY":
      return new BTCPayProvider();
    case "MOCK":
      return new MockProvider();
    default:
      throw new ProviderError(`Unknown provider: ${name as string}`);
  }
}

export function getDefaultProvider(): CryptoProviderName {
  const env = process.env.CRYPTO_PROVIDER;
  if (env === "COINBASE_COMMERCE" || env === "BTCPAY") return env;
  return "MOCK";
}
