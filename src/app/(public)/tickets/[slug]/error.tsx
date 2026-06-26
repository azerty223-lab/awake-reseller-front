"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, RefreshCw } from "lucide-react";

export default function TicketDetailError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[TicketDetail error]", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-[#030305] flex items-center justify-center px-4">
      <div className="max-w-sm w-full text-center space-y-5">
        <div
          className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto"
          style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.20)" }}
        >
          <AlertTriangle className="w-6 h-6 text-red-400" aria-hidden="true" />
        </div>
        <div>
          <h1 className="text-white font-semibold text-lg mb-1">Could not load ticket</h1>
          <p className="text-zinc-500 text-sm leading-relaxed">
            This ticket may no longer be available or there was a connection problem.
          </p>
        </div>
        <div className="flex flex-col gap-3">
          <button
            onClick={reset}
            className="flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold text-black w-full"
            style={{ background: "#06B6D4" }}
          >
            <RefreshCw className="w-4 h-4" aria-hidden="true" />
            Try again
          </button>
          <Link
            href="/tickets"
            className="py-3 rounded-xl text-sm font-medium text-zinc-400 hover:text-zinc-200 transition-colors"
            style={{ border: "1px solid rgba(255,255,255,0.08)" }}
          >
            Browse all tickets
          </Link>
        </div>
      </div>
    </div>
  );
}
