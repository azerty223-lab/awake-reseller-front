export interface CoinbaseChargeTimeline {
  time: string;
  status: string;
  payment?: {
    network: string;
    transaction_id: string;
    value: { local: { amount: string; currency: string }; crypto: { amount: string; currency: string } };
  };
}

export interface CoinbasePricing {
  local: { amount: string; currency: string };
  [currency: string]: { amount: string; currency?: string } | { amount: string };
}

export interface CoinbaseCharge {
  id: string;
  code: string;
  name: string;
  description: string;
  hosted_url: string;
  created_at: string;
  expires_at: string;
  timeline: CoinbaseChargeTimeline[];
  metadata: Record<string, string>;
  pricing: CoinbasePricing;
  pricing_type: string;
  addresses: Record<string, string>;
  payments: unknown[];
}

const COINBASE_BASE_URL = "https://api.commerce.coinbase.com";

async function coinbaseFetch<T>(
  path: string,
  options?: RequestInit
): Promise<T> {
  const apiKey = process.env.COINBASE_COMMERCE_API_KEY;
  if (!apiKey) throw new Error("COINBASE_COMMERCE_API_KEY is not set");

  const response = await fetch(`${COINBASE_BASE_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      "X-CC-Api-Key": apiKey,
      "X-CC-Version": "2018-03-22",
      ...(options?.headers ?? {}),
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Coinbase Commerce error ${response.status}: ${errorText}`);
  }

  const json = await response.json() as { data: T };
  return json.data;
}

export const CoinbaseClient = {
  async createCharge(params: {
    name: string;
    description: string;
    pricing_type: "fixed_price" | "no_price";
    local_price: { amount: string; currency: string };
    metadata?: Record<string, string>;
    redirect_url?: string;
    cancel_url?: string;
  }): Promise<CoinbaseCharge> {
    return coinbaseFetch<CoinbaseCharge>("/charges", {
      method: "POST",
      body: JSON.stringify(params),
    });
  },

  async getCharge(chargeId: string): Promise<CoinbaseCharge> {
    return coinbaseFetch<CoinbaseCharge>(`/charges/${chargeId}`);
  },
};
