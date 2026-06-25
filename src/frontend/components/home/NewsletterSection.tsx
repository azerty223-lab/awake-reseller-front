"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { SectionBackground } from "@/frontend/components/ui/SectionBackground";

export function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

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
      setStatus(res.ok ? "success" : "error");
      if (res.ok) setEmail("");
    } catch {
      setStatus("error");
    }
  };

  return (
    <section className="relative py-4 overflow-hidden">
      <SectionBackground src="/bg-newsletter.jpg" objectPosition="center 45%" overlay="rgba(8,8,8,0.88)" />
      {/* Restrained horizontal rule top */}
      <div className="absolute top-0 left-6 right-6 sm:left-12 lg:left-20 sm:right-12 lg:right-20 h-px bg-white/[0.06]" />

      <div className="relative z-10 max-w-5xl mx-auto px-6 sm:px-12 lg:px-20">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">

          {/* Left: copy */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <p className="text-[10px] uppercase tracking-[0.25em] text-zinc-600 mb-6 font-medium">
              Stay informed
            </p>
            <h2
              className="font-[var(--font-playfair)] font-black text-white leading-[0.95] mb-6"
              style={{ fontSize: "clamp(2rem, 4vw, 3rem)", letterSpacing: "-0.02em" }}
            >
              Early access.<br />No noise.
            </h2>
            <p className="text-zinc-500 text-sm leading-[1.8]">
              New ticket listings, price changes, and sale alerts — straight to your inbox.
              Join 2,400+ people already subscribed.
            </p>
          </motion.div>

          {/* Right: form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1 }}
          >
            {status === "success" ? (
              <div className="py-6">
                <p className="text-zinc-400 text-sm">You&apos;re subscribed. Watch your inbox.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="relative">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); setStatus("idle"); }}
                    placeholder="your@email.com"
                    required
                    className="w-full bg-transparent border-b border-white/20 py-4 text-white placeholder-zinc-700 text-sm outline-none focus:border-[#C9A84C]/60 transition-colors duration-300"
                    style={{ letterSpacing: "0.01em" }}
                  />
                </div>
                <div className="flex items-center justify-between pt-2">
                  <p className="text-zinc-700 text-xs">
                    Unsubscribe anytime. No spam.
                  </p>
                  <button
                    type="submit"
                    disabled={status === "loading"}
                    className="group flex items-center gap-2 text-xs uppercase tracking-[0.15em] font-semibold text-[#C9A84C] hover:text-[#E4BA65] transition-colors duration-200 disabled:opacity-50"
                  >
                    {status === "loading" ? "Subscribing" : "Subscribe"}
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </button>
                </div>
                {status === "error" && (
                  <p className="text-red-400/70 text-xs">Something went wrong. Try again.</p>
                )}
              </form>
            )}
          </motion.div>

        </div>
      </div>
    </section>
  );
}
