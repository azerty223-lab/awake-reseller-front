import { NextRequest } from "next/server";
import { headers } from "next/headers";
import { z } from "zod/v4";
import { auth } from "@/lib/auth";
import { PaymentService } from "@/payments/service";
import { RateLimitError } from "@/payments/errors";

const createInvoiceSchema = z.object({
  orderId: z.string().min(1, "orderId is required"),
  preferredCurrency: z.enum(["USDC", "USDT", "ETH", "BTC"]),
  preferredNetwork: z.enum(["ETHEREUM", "BITCOIN", "POLYGON", "BASE"]),
  fiatAmount: z.number().positive("fiatAmount must be positive"),
  customerEmail: z.string().email().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as unknown;
    const parsed = createInvoiceSchema.safeParse(body);

    if (!parsed.success) {
      return Response.json(
        { error: "Invalid request", details: parsed.error.issues },
        { status: 400 }
      );
    }

    const { orderId, preferredCurrency, preferredNetwork, fiatAmount, customerEmail } = parsed.data;

    const reqHeaders = await headers();
    const ip = reqHeaders.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "127.0.0.1";

    const session = await auth();
    const userId = session?.user?.id;

    const { invoice, qr, alreadyExisted } = await PaymentService.createCryptoInvoice({
      orderId,
      fiatAmount,
      preferredCurrency,
      preferredNetwork,
      customerEmail,
      ip,
      userId,
    });

    return Response.json({
      invoiceId: invoice.id,
      paymentAddress: invoice.paymentAddress,
      paymentUri: invoice.paymentUri,
      qrSvg: qr.svgString,
      cryptoAmount: invoice.cryptoAmount,
      cryptoCurrency: invoice.cryptoCurrency,
      cryptoNetwork: invoice.cryptoNetwork,
      expiresAt: invoice.expiresAt.toISOString(),
      priceLockExpiresAt: invoice.priceLockExpiresAt.toISOString(),
      providerHostedUrl: invoice.providerHostedUrl ?? null,
      alreadyExisted,
    });
  } catch (err) {
    if (err instanceof RateLimitError) {
      return Response.json({ error: "Too many requests" }, { status: 429 });
    }
    console.error("[POST /api/payments/create]", err);
    return Response.json(
      { error: err instanceof Error ? err.message : "Internal server error" },
      { status: 500 }
    );
  }
}
