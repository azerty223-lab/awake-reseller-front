"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle } from "lucide-react";
import Image from "next/image";

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
    <section className="relative py-24 overflow-hidden">
      {/* Background image */}
      <div className="absolute inset-0">
        <Image
          src="https://images.unsplash.com/photo-1493676304819-0d7a8d026dcf?q=80&w=1920&auto=format&fit=crop"
          alt=""
          fill
          style={{ objectFit: "cover" }}
          className="opacity-15 scale-105"
        />
      </div>

      {/* Heavy gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#050507] via-[#050507]/90 to-[#050507]" />

      {/* Content */}
      <div className="relative z-10 max-w-2xl mx-auto text-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          {/* Small label */}
          <p className="text-[10px] uppercase tracking-[0.2em] font-semibold text-zinc-500 mb-4">
            Stay in the Loop
          </p>

          {/* Heading */}
          <h2 className="font-[var(--font-playfair)] text-4xl sm:text-5xl font-black text-white mb-3">
            Never Miss a Drop
          </h2>

          {/* Social proof */}
          <p className="text-zinc-500 text-xs mb-2">
            Join 2,400+ festival fans
          </p>

          {/* Subtext */}
          <p className="text-zinc-400 text-sm max-w-sm mx-auto">
            Get early access to new ticket listings, price drops, and exclusive offers.
          </p>

          {/* Form / Success state */}
          <div className="mt-8">
            {status === "success" ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-center justify-center gap-3 py-4 px-6 bg-emerald-500/10 border border-emerald-500/20 rounded-xl max-w-md mx-auto"
              >
                <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />
                <p className="text-emerald-400 font-medium text-sm">
                  You&apos;re in! Watch your inbox.
                </p>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="flex gap-3 max-w-md mx-auto">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setStatus("idle"); }}
                  placeholder="your@email.com"
                  required
                  className="flex-1 bg-white/[0.07] border border-white/[0.1] rounded-xl px-5 py-3.5 text-white placeholder-zinc-500 text-sm focus:outline-none focus:border-[#C9A84C]/50 transition-colors"
                />
                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="bg-gradient-to-r from-[#C9A84C] to-[#E4BA65] text-black font-bold text-sm rounded-xl px-6 py-3.5 hover:shadow-[0_0_30px_rgba(201,168,76,0.4)] disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-300 whitespace-nowrap"
                >
                  {status === "loading" ? "Subscribing..." : "Subscribe"}
                </button>
              </form>
            )}

            {status === "error" && (
              <p className="mt-3 text-red-400/80 text-sm">{errorMsg}</p>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
