"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { CountdownTimer } from "@/components/ui/CountdownTimer";
import { PaymentStatus } from "./PaymentStatus";
import type { CryptoCurrency, CryptoNetwork, CryptoPaymentStatus } from "@prisma/client";

interface InvoiceQRProps {
  invoiceId: string;
  paymentAddress: string;
  qrSvg: string;
  cryptoAmount: string;
  cryptoCurrency: CryptoCurrency;
  cryptoNetwork: CryptoNetwork;
  fiatAmount: number;
  expiresAt: string;
  priceLockExpiresAt: string;
  providerHostedUrl?: string | null;
}

const NETWORK_COLORS: Record<CryptoNetwork, string> = {
  ETHEREUM: "#627EEA",
  BITCOIN: "#F7931A",
  POLYGON: "#8247E5",
  BASE: "#0052FF",
};

const NETWORK_LABELS: Record<CryptoNetwork, string> = {
  ETHEREUM: "Ethereum",
  BITCOIN: "Bitcoin",
  POLYGON: "Polygon",
  BASE: "Base",
};

interface StatusResponse {
  status: CryptoPaymentStatus;
  confirmations: number;
  requiredConfirmations: number;
}

export function InvoiceQR({
  invoiceId,
  paymentAddress,
  qrSvg,
  cryptoAmount,
  cryptoCurrency,
  cryptoNetwork,
  fiatAmount,
  expiresAt,
  priceLockExpiresAt,
  providerHostedUrl,
}: InvoiceQRProps) {
  const router = useRouter();
  const [copied, setCopied] = useState(false);
  const [status, setStatus] = useState<CryptoPaymentStatus>("WAITING_PAYMENT");
  const [confirmations, setConfirmations] = useState(0);
  const [requiredConfirmations, setRequiredConfirmations] = useState(12);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const redirectedRef = useRef(false);

  const pollStatus = useCallback(async () => {
    try {
      const res = await fetch(`/api/payments/${invoiceId}/status`);
      if (!res.ok) return;
      const data = (await res.json()) as StatusResponse;
      setStatus(data.status);
      setConfirmations(data.confirmations);
      setRequiredConfirmations(data.requiredConfirmations);

      if (data.status === "PAID" && !redirectedRef.current) {
        redirectedRef.current = true;
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
        setTimeout(() => {
          router.push(`/checkout/success?invoice_id=${invoiceId}`);
        }, 2000);
      }

      if (data.status === "EXPIRED" || data.status === "FAILED") {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
      }
    } catch {
      // silently ignore network errors during polling
    }
  }, [invoiceId, router]);

  useEffect(() => {
    // Poll immediately, then every 5 seconds
    void pollStatus();
    intervalRef.current = setInterval(() => {
      void pollStatus();
    }, 5000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [pollStatus]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(paymentAddress);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback: select the text
    }
  };

  const isTerminal = status === "PAID" || status === "EXPIRED" || status === "FAILED";

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="text-center">
        <p className="text-zinc-500 text-sm mb-1">Send exactly</p>
        <p className="text-[#c9a84c] text-3xl font-bold tracking-tight">
          {cryptoAmount} {cryptoCurrency}
        </p>
        <p className="text-zinc-400 text-sm mt-1">
          on {NETWORK_LABELS[cryptoNetwork]} · ≈ €{fiatAmount.toFixed(2)}
        </p>
      </div>

      {/* QR Code */}
      <div className="flex justify-center">
        <div className="bg-white border border-[#2a2a2a] rounded-2xl p-3 w-[288px] h-[288px] flex items-center justify-center overflow-hidden">
          <div
            className="w-full h-full [&>svg]:w-full [&>svg]:h-full"
            dangerouslySetInnerHTML={{ __html: qrSvg }}
          />
        </div>
      </div>

      {/* Status */}
      <div className="bg-[#111111] border border-[#2a2a2a] rounded-xl p-4">
        <PaymentStatus
          status={status}
          confirmations={confirmations}
          requiredConfirmations={requiredConfirmations}
        />
      </div>

      {/* Price lock countdown */}
      {!isTerminal && (
        <div className="bg-[#111111] border border-[#2a2a2a] rounded-xl p-4">
          <p className="text-zinc-500 text-xs mb-3 uppercase tracking-widest">Rate locked for</p>
          <CountdownTimer targetDate={new Date(priceLockExpiresAt)} />
        </div>
      )}

      {/* Payment address panel */}
      <div className="bg-[#111111] border border-[#2a2a2a] rounded-xl p-4 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-zinc-400 text-sm">Payment address</span>
          <span
            className="text-xs font-medium px-2 py-0.5 rounded-full text-white"
            style={{ backgroundColor: NETWORK_COLORS[cryptoNetwork] }}
          >
            {NETWORK_LABELS[cryptoNetwork]}
          </span>
        </div>

        <div className="bg-[#0a0a0a] border border-[#2a2a2a] rounded-lg p-3 flex items-center gap-3">
          <code className="flex-1 text-white text-xs font-mono break-all leading-relaxed">
            {paymentAddress}
          </code>
          <button
            type="button"
            onClick={() => void handleCopy()}
            className={cn(
              "flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all",
              copied
                ? "bg-green-500/20 text-green-400 border border-green-500/30"
                : "bg-[#c9a84c]/10 text-[#c9a84c] border border-[#c9a84c]/30 hover:bg-[#c9a84c]/20"
            )}
          >
            {copied ? (
              <>
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Copied
              </>
            ) : (
              <>
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <rect x="4" y="4" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1.2" />
                  <path d="M8 4V3a1 1 0 00-1-1H3a1 1 0 00-1 1v4a1 1 0 001 1h1" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                </svg>
                Copy
              </>
            )}
          </button>
        </div>
      </div>

      {/* Warnings */}
      <div className="space-y-2">
        <div className="bg-red-500/10 border border-red-500/25 rounded-xl p-4 space-y-2">
          <p className="text-red-400 text-xs font-semibold uppercase tracking-wider">
            ⚠ Important warnings
          </p>
          <ul className="space-y-1.5 text-xs text-red-300">
            <li>
              • Send <strong>ONLY {cryptoCurrency}</strong> on the{" "}
              <strong>{NETWORK_LABELS[cryptoNetwork]}</strong> network
            </li>
            <li>
              • <strong>Wrong network = permanent, irreversible loss of funds</strong>
            </li>
            <li>
              • Send exactly <strong>{cryptoAmount} {cryptoCurrency}</strong> — underpayments
              and overpayments require manual resolution
            </li>
            <li>
              • Do not send from an exchange — use a self-custody wallet
            </li>
          </ul>
        </div>

        <div className="bg-[#c9a84c]/5 border border-[#c9a84c]/20 rounded-xl p-3">
          <p className="text-[#c9a84c] text-xs">
            ⏱ Invoice expires {new Date(expiresAt).toLocaleTimeString()} — rate guaranteed during
            price lock window
          </p>
        </div>
      </div>

      {/* Provider checkout link */}
      {providerHostedUrl && (
        <a
          href={providerHostedUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 w-full py-3 px-4 rounded-xl border border-[#c9a84c]/30 text-[#c9a84c] text-sm hover:bg-[#c9a84c]/10 transition-all"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M6 2H2a1 1 0 00-1 1v9a1 1 0 001 1h9a1 1 0 001-1V8m-4-6h5m0 0v5m0-5L7 7" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Open provider checkout page
        </a>
      )}

      {/* Paid success overlay */}
      {status === "PAID" && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 backdrop-blur-sm">
          <div className="text-center space-y-4 p-8">
            <div className="w-20 h-20 rounded-full bg-green-500/20 border-2 border-green-500 flex items-center justify-center mx-auto">
              <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                <path d="M8 20l8 8 16-16" stroke="#22c55e" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <h2 className="text-white text-2xl font-bold">Payment confirmed!</h2>
            <p className="text-zinc-400">Redirecting to your order...</p>
          </div>
        </div>
      )}
    </div>
  );
}
