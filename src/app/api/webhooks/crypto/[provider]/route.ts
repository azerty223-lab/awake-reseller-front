import { NextRequest } from "next/server";
import { PaymentService } from "@/backend/payments/service";
import { WebhookVerificationError } from "@/backend/payments/errors";
import type { CryptoProviderName } from "@prisma/client";

const VALID_PROVIDERS: CryptoProviderName[] = ["COINBASE_COMMERCE", "BTCPAY", "MOCK"];

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ provider: string }> }
) {
  const { provider } = await params;

  if (!VALID_PROVIDERS.includes(provider as CryptoProviderName)) {
    return Response.json({ error: "Unknown provider" }, { status: 400 });
  }

  const rawBody = Buffer.from(await req.arrayBuffer());

  const reqHeaders: Record<string, string> = {};
  req.headers.forEach((value, key) => {
    reqHeaders[key] = value;
  });

  try {
    await PaymentService.processWebhook(
      provider as CryptoProviderName,
      rawBody,
      reqHeaders
    );
    return Response.json({ received: true });
  } catch (err) {
    if (err instanceof WebhookVerificationError) {
      console.warn("[Webhook] Signature verification failed:", err.message);
      return Response.json({ error: "Signature verification failed" }, { status: 401 });
    }
    console.error(`[Webhook] Processing failed for provider ${provider}:`, err);
    // Return 200 to prevent retries on unexpected errors — BullMQ handles retries internally
    return Response.json({ received: true, error: "Processing queued with error" });
  }
}
