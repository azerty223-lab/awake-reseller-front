export const PRICE_LOCK_TTL_SECONDS = 900; // 15 minutes
export const INVOICE_TTL_SECONDS = 3600;   // 1 hour outer limit

export const CONFIRMATION_THRESHOLDS = {
  BTC_BITCOIN: { standard: 3, fast: 1 },
  ETH_ETHEREUM: { standard: 12, fast: 1 },
  USDC_ETHEREUM: { standard: 12, fast: 1 },
  USDT_ETHEREUM: { standard: 12, fast: 1 },
  USDC_BASE: { standard: 12, fast: 1 },
  USDC_POLYGON: { standard: 128, fast: 1 },
} as const;

export const RATE_LIMIT = {
  WINDOW_SECONDS: 60,
  MAX_REQUESTS: 10,
} as const;
