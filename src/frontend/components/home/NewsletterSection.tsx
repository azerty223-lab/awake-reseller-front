"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, ArrowRight, CheckCircle } from "lucide-react";

export function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setStatus("loading");
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (res.ok) {
        setStatus("success");
        setEmail("");
      } else {
        const data = await res.json().catch(() => ({}));
        setErrorMsg(data.error ?? "Something went wrong. Try again.");
        setStatus("error");
      }
    } catch {
      setErrorMsg("Network error. Please try again.");
      setStatus("error");
    }
  };

  return (
    <section className="py-20 bg-[#080808]">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center justify-center gap-2 mb-4">
            <Mail className="w-4 h-4 text-[#c9a84c]" />
            <span className="text-[#c9a84c] text-xs uppercase tracking-widest font-semibold">
              Newsletter
            </span>
          </div>
          <h2 className="font-[var(--font-playfair)] text-3xl sm:text-4xl font-bold text-white mb-3">
            Stay in the Loop
          </h2>
          <p className="text-zinc-500 text-sm mb-8 max-w-md mx-auto">
            Get notified when new tickets drop, price updates, and festival news. No spam —
            just the essentials.
          </p>

          {status === "success" ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex items-center justify-center gap-3 py-4 px-6 bg-emerald-500/10 border border-emerald-500/30 rounded-xl"
            >
              <CheckCircle className="w-5 h-5 text-emerald-400" />
              <p className="text-emerald-400 font-medium">
                You're on the list! We'll keep you posted.
              </p>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1 relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setStatus("idle"); }}
                  placeholder="your@email.com"
                  required
                  className="w-full pl-10 pr-4 py-3.5 bg-[#111111] border border-[#2a2a2a] rounded-xl text-white placeholder-zinc-600 text-sm focus:outline-none focus:border-[#c9a84c]/60 focus:ring-1 focus:ring-[#c9a84c]/30 transition-all"
                />
              </div>
              <button
                type="submit"
                disabled={status === "loading"}
                className="flex items-center justify-center gap-2 px-6 py-3.5 bg-[#c9a84c] text-black font-semibold text-sm rounded-xl hover:bg-[#e8c05a] disabled:opacity-60 disabled:cursor-not-allowed transition-colors whitespace-nowrap"
              >
                {status === "loading" ? "Subscribing..." : "Subscribe"}
                {status !== "loading" && <ArrowRight className="w-4 h-4" />}
              </button>
            </form>
          )}

          {status === "error" && (
            <p className="mt-3 text-red-400 text-sm">{errorMsg}</p>
          )}

          <p className="mt-4 text-zinc-600 text-xs">
            No spam, ever. Unsubscribe at any time.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
