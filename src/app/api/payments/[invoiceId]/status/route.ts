import { NextRequest } from "next/server";
import { PaymentService } from "@/backend/payments/service";
import { InvoiceNotFoundError } from "@/backend/payments/errors";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ invoiceId: string }> }
) {
  try {
    const { invoiceId } = await params;

    const status = await PaymentService.getInvoiceStatus(invoiceId);

    return Response.json({
      status: status.status,
      confirmations: status.confirmations,
      requiredConfirmations: status.requiredConfirmations,
      priceLockExpiresAt: status.priceLockExpiresAt.toISOString(),
      expiresAt: status.expiresAt.toISOString(),
      txHash: status.txHash,
      paymentAddress: status.paymentAddress,
      cryptoAmount: status.cryptoAmount,
      cryptoCurrency: status.cryptoCurrency,
      cryptoNetwork: status.cryptoNetwork,
      ...(status.qr
        ? {
            qr: {
              uri: status.qr.uri,
              svgString: status.qr.svgString,
              address: status.qr.address,
              amount: status.qr.amount,
              currency: status.qr.currency,
              network: status.qr.network,
            },
          }
        : {}),
    });
  } catch (err) {
    if (err instanceof InvoiceNotFoundError) {
      return Response.json({ error: "Invoice not found" }, { status: 404 });
    }
    console.error("[GET /api/payments/[invoiceId]/status]", err);
    return Response.json(
      { error: err instanceof Error ? err.message : "Internal server error" },
      { status: 500 }
    );
  }
}
