"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertCircle, Mail } from "lucide-react";

export default function CheckoutSuccessError({
  error,
}: {
  error: Error & { digest?: string };
}) {
  useEffect(() => {
    console.error("[CheckoutSuccess error]", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-[#030305] flex items-center justify-center px-4">
      <div
        className="max-w-md w-full rounded-2xl p-8 text-center"
        style={{ background: "#0F1013", border: "1px solid rgba(255,255,255,0.08)" }}
      >
        <AlertCircle className="w-10 h-10 text-amber-400 mx-auto mb-4" aria-hidden="true" />
        <h1 className="text-white font-semibold text-lg mb-2">Could not confirm your order</h1>
        <p className="text-zinc-500 text-sm leading-relaxed mb-2">
          If your payment was successful, you will receive a confirmation email within a few minutes.
        </p>
        <p className="text-zinc-600 text-xs mb-6">
          Your card has not been double-charged. If you have questions, contact us with your payment reference.
        </p>
        <div className="flex flex-col gap-3">
          <a
            href="mailto:awtickets@outlook.com"
            className="flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold text-black"
            style={{ background: "#06B6D4" }}
          >
            <Mail className="w-4 h-4" aria-hidden="true" />
            Email Support
          </a>
          <Link
            href="/"
            className="py-3 rounded-xl text-sm font-medium text-zinc-400 hover:text-zinc-200 transition-colors"
            style={{ border: "1px solid rgba(255,255,255,0.08)" }}
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}
