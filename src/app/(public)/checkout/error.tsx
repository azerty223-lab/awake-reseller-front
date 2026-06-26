"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, RefreshCw, Mail } from "lucide-react";

export default function CheckoutError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[Checkout error]", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-4">
      <div className="max-w-sm w-full text-center space-y-5">
        <div
          className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto"
          style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.20)" }}
        >
          <AlertTriangle className="w-6 h-6 text-red-400" aria-hidden="true" />
        </div>
        <div>
          <h1 className="text-white font-semibold text-lg mb-1">Checkout error</h1>
          <p className="text-zinc-500 text-sm leading-relaxed">
            There was a problem loading the checkout. Your card has not been charged.
          </p>
        </div>
        <div className="flex flex-col gap-3">
          <button
            onClick={reset}
            className="flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold text-black w-full"
            style={{ background: "#06B6D4" }}
          >
            <RefreshCw className="w-4 h-4" aria-hidden="true" />
            Retry checkout
          </button>
          <Link
            href="/tickets"
            className="py-3 rounded-xl text-sm font-medium text-zinc-400 hover:text-zinc-200 transition-colors"
            style={{ border: "1px solid rgba(255,255,255,0.08)" }}
          >
            Back to tickets
          </Link>
        </div>
        <p className="text-xs text-zinc-700">
          Problem persists?{" "}
          <a
            href="mailto:awtickets@outlook.com"
            className="inline-flex items-center gap-1 text-zinc-500 hover:text-[#06B6D4] transition-colors"
          >
            <Mail className="w-3 h-3" aria-hidden="true" />
            awtickets@outlook.com
          </a>
        </p>
      </div>
    </div>
  );
}
