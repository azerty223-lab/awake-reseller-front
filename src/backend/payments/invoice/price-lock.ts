import type { Redis } from "ioredis";
import type { CryptoCurrency } from "@prisma/client";
import Decimal from "decimal.js";
import { PRICE_LOCK_TTL_SECONDS } from "../constants";

const COINGECKO_IDS: Record<CryptoCurrency, string> = {
  USDC: "usd-coin",
  USDT: "tether",
  ETH: "ethereum",
  BTC: "bitcoin",
};

// Conservative fallback rates (EUR per 1 unit of crypto)
const FALLBACK_RATES: Record<CryptoCurrency, number> = {
  USDC: 0.92,
  USDT: 0.92,
  ETH: 0.00033,
  BTC: 0.000014,
};

export class PriceLockService {
  async fetchExchangeRate(
    cryptoCurrency: CryptoCurrency
  ): Promise<{ rate: number; source: string }> {
    const coinId = COINGECKO_IDS[cryptoCurrency];

    try {
      const url = `https://api.coingecko.com/api/v3/simple/price?ids=${coinId}&vs_currencies=eur`;
      const response = await fetch(url, {
        headers: { Accept: "application/json" },
        signal: AbortSignal.timeout(5000),
      });

      if (!response.ok) {
        throw new Error(`CoinGecko returned ${response.status}`);
      }

      const data = await response.json() as Record<string, { eur: number }>;
      const rate = data[coinId]?.eur;

      if (!rate || typeof rate !== "number") {
        throw new Error("Invalid rate data from CoinGecko");
      }

      return { rate, source: "coingecko" };
    } catch (err) {
      console.warn(`[PriceLock] CoinGecko fetch failed, using fallback:`, err);
      return {
        rate: FALLBACK_RATES[cryptoCurrency],
        source: "fallback",
      };
    }
  }

  /**
   * Convert fiatAmount (EUR) to crypto.
   * rate = EUR price of 1 crypto unit (e.g. ETH = 3000 EUR/ETH, rate = 3000)
   * cryptoAmount = fiatAmount / rate
   */
  calculateCryptoAmount(fiatAmount: number, rate: number): string {
    return new Decimal(fiatAmount).div(new Decimal(rate)).toFixed(8);
  }

  async lockRate(
    invoiceId: string,
    cryptoAmount: string,
    rate: number,
    redis: Redis
  ): Promise<void> {
    const key = `price-lock:${invoiceId}`;
    const value = JSON.stringify({ cryptoAmount, rate, lockedAt: new Date().toISOString() });
    await redis.set(key, value, "EX", PRICE_LOCK_TTL_SECONDS);
  }

  async getLockedRate(
    invoiceId: string,
    redis: Redis
  ): Promise<{ cryptoAmount: string; rate: number } | null> {
    const key = `price-lock:${invoiceId}`;
    const raw = await redis.get(key);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as { cryptoAmount: string; rate: number };
    } catch {
      return null;
    }
  }
}

export const priceLockService = new PriceLockService();
