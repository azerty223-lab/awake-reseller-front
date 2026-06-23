import { NextRequest } from "next/server";
import { z } from "zod/v4";
import { getEnabledWallets, buildQuote } from "@/payments/static/service";

const schema = z.object({
  currency: z.string(),
  network:  z.string(),
  fiatAmount: z.number().positive(),
});

export async function GET() {
  const wallets = getEnabledWallets().map(({ address: _a, ...rest }) => rest);
  return Response.json({ wallets });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as unknown;
    const parsed = schema.safeParse(body);
    if (!parsed.success) return Response.json({ error: "Invalid request" }, { status: 400 });

    const { currency, network, fiatAmount } = parsed.data;

    const wallet = getEnabledWallets().find(
      w => w.currency === currency && w.network === network
    );
    if (!wallet) return Response.json({ error: "Currency not configured" }, { status: 400 });

    const quote = await buildQuote(wallet, fiatAmount);

    return Response.json({
      address:     quote.address,
      qrSvg:       quote.qrSvg,
      paymentUri:  quote.paymentUri,
      cryptoAmount: quote.cryptoAmount,
      currency:    wallet.currency,
      network:     wallet.network,
      networkLabel: wallet.networkLabel,
      rateEur:     quote.rateEur,
    });
  } catch (err) {
    console.error("[POST /api/payments/static-quote]", err);
    return Response.json({ error: "Failed to generate quote" }, { status: 500 });
  }
}
