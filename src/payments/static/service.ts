import QRCode from "qrcode";
import Decimal from "decimal.js";

export type StaticCurrency = "BTC" | "ETH" | "SOL" | "USDT";
export type StaticNetwork = "BITCOIN" | "ETHEREUM" | "SOLANA" | "TRON" | "BSC" | "POLYGON";

export interface WalletOption {
  currency: StaticCurrency;
  network: StaticNetwork;
  label: string;
  networkLabel: string;
  coingeckoId: string;
}

export interface WalletConfig extends WalletOption {
  address: string;
}


// CoinGecko price feed IDs
const COINGECKO_IDS: Record<StaticCurrency, string> = {
  BTC:  "bitcoin",
  ETH:  "ethereum",
  SOL:  "solana",
  USDT: "tether",
};

// Conservative EUR fallback rates (EUR per 1 unit)
const FALLBACK_RATES: Record<StaticCurrency, number> = {
  BTC:  85000,
  ETH:  2500,
  SOL:  130,
  USDT: 0.92,
};

// Ordered list of all supported wallet slots
const WALLET_SLOTS: Array<{ envKey: string } & WalletOption> = [
  { envKey: "STATIC_WALLET_BTC",          currency: "BTC",  network: "BITCOIN",   label: "Bitcoin", networkLabel: "Bitcoin",                coingeckoId: "bitcoin"  },
  { envKey: "STATIC_WALLET_ETH",          currency: "ETH",  network: "ETHEREUM",  label: "ETH",     networkLabel: "Ethereum",               coingeckoId: "ethereum" },
  { envKey: "STATIC_WALLET_SOL",          currency: "SOL",  network: "SOLANA",    label: "SOL",     networkLabel: "Solana",                 coingeckoId: "solana"   },
  { envKey: "STATIC_WALLET_USDT_ETH",     currency: "USDT", network: "ETHEREUM",  label: "USDT",    networkLabel: "Ethereum (ERC-20)",      coingeckoId: "tether"   },
  { envKey: "STATIC_WALLET_USDT_TRX",     currency: "USDT", network: "TRON",      label: "USDT",    networkLabel: "Tron (TRC-20)",          coingeckoId: "tether"   },
  { envKey: "STATIC_WALLET_USDT_BSC",     currency: "USDT", network: "BSC",       label: "USDT",    networkLabel: "BNB Smart Chain (BEP-20)", coingeckoId: "tether" },
  { envKey: "STATIC_WALLET_USDT_POLYGON", currency: "USDT", network: "POLYGON",   label: "USDT",    networkLabel: "Polygon",                coingeckoId: "tether"   },
  { envKey: "STATIC_WALLET_USDT_SOL",     currency: "USDT", network: "SOLANA",    label: "USDT",    networkLabel: "Solana (SPL)",           coingeckoId: "tether"   },
];

export function getEnabledWallets(): WalletConfig[] {
  return WALLET_SLOTS
    .filter(s => !!process.env[s.envKey])
    .map(({ envKey, ...rest }) => ({ ...rest, address: process.env[envKey]! }));
}

// Simple URI schemes tell Trust Wallet which network to open.
// Rules:
//   - bitcoin:  → BTC network
//   - ethereum: → any EVM chain (ETH, USDT ERC-20/BEP-20/Polygon)
//   - solana:   → Solana / USDT-SPL
//   - plain TRX address → TronLink / Trust Wallet TRC-20 scanner handles it
// No amounts, no contract calls — those break Trust Wallet's scanner.
export function buildStaticPaymentUri(address: string, network: StaticNetwork): string {
  if (network === "BITCOIN")  return `bitcoin:${address}`;
  if (network === "SOLANA")   return `solana:${address}`;
  if (network === "TRON")     return address; // TRX addresses are unique enough
  // ETHEREUM, BSC, POLYGON all use ethereum: prefix
  return `ethereum:${address}`;
}

export async function fetchStaticRate(currency: StaticCurrency): Promise<number> {
  const id = COINGECKO_IDS[currency];
  try {
    const res = await fetch(
      `https://api.coingecko.com/api/v3/simple/price?ids=${id}&vs_currencies=eur`,
      { signal: AbortSignal.timeout(5000) }
    );
    if (!res.ok) throw new Error(`CoinGecko ${res.status}`);
    const data = await res.json() as Record<string, { eur: number }>;
    const rate = data[id]?.eur;
    if (!rate) throw new Error("no rate");
    return rate;
  } catch {
    return FALLBACK_RATES[currency];
  }
}

export function calcCryptoAmount(fiatEur: number, rateEur: number, currency: StaticCurrency): string {
  const raw = new Decimal(fiatEur).div(rateEur);
  if (currency === "BTC")  return raw.toDecimalPlaces(8).toString();
  if (currency === "ETH")  return raw.toDecimalPlaces(6).toString();
  if (currency === "SOL")  return raw.toDecimalPlaces(4).toString();
  if (currency === "USDT") return raw.toDecimalPlaces(2).toString();
  return raw.toDecimalPlaces(6).toString();
}

export async function buildQuote(
  wallet: WalletConfig,
  fiatAmount: number
): Promise<{ address: string; qrSvg: string; paymentUri: string; cryptoAmount: string; rateEur: number }> {
  const rateEur = await fetchStaticRate(wallet.currency);
  const cryptoAmount = calcCryptoAmount(fiatAmount, rateEur, wallet.currency);
  const paymentUri = buildStaticPaymentUri(wallet.address, wallet.network);

  const qrSvg = await QRCode.toString(paymentUri, {
    type: "svg",
    width: 280,
    margin: 2,
    color: { dark: "#000000", light: "#ffffff" },
  });

  return { address: wallet.address, qrSvg, paymentUri, cryptoAmount, rateEur };
}
