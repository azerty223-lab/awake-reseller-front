export interface BTCPayInvoice {
  id: string;
  status: string;
  amount: string;
  currency: string;
  checkoutLink: string;
  expirationTime: string;
  createdTime: string;
  metadata: Record<string, unknown>;
  checkout: Record<string, unknown>;
}

async function btcpayFetch<T>(
  path: string,
  options?: RequestInit
): Promise<T> {
  const baseUrl = process.env.BTCPAY_URL;
  const apiKey = process.env.BTCPAY_API_KEY;

  if (!baseUrl) throw new Error("BTCPAY_URL is not set");
  if (!apiKey) throw new Error("BTCPAY_API_KEY is not set");

  const response = await fetch(`${baseUrl}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `token ${apiKey}`,
      ...(options?.headers ?? {}),
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`BTCPay Server error ${response.status}: ${errorText}`);
  }

  return response.json() as Promise<T>;
}

export const BTCPayClient = {
  async createInvoice(
    storeId: string,
    params: {
      amount: string;
      currency: string;
      metadata?: Record<string, unknown>;
      checkout?: Record<string, unknown>;
    }
  ): Promise<BTCPayInvoice> {
    return btcpayFetch<BTCPayInvoice>(`/api/v1/stores/${storeId}/invoices`, {
      method: "POST",
      body: JSON.stringify(params),
    });
  },

  async getInvoice(storeId: string, invoiceId: string): Promise<BTCPayInvoice> {
    return btcpayFetch<BTCPayInvoice>(
      `/api/v1/stores/${storeId}/invoices/${invoiceId}`
    );
  },
};
