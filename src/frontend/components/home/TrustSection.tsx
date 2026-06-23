"use client";

import { motion } from "framer-motion";
import { ShieldCheck, ArrowRight } from "lucide-react";
import Link from "next/link";

const features = [
  {
    num: "01",
    title: "Fully Verified",
    body: "Every ticket is authenticated against the official Awakenings registry before appearing on the platform.",
    detail: "Zero-risk guarantee",
  },
  {
    num: "02",
    title: "Stripe-Secured Checkout",
    body: "Payments processed by Stripe — the same infrastructure trusted by Shopify, Amazon, and Uber.",
    detail: "PCI DSS Level 1",
  },
  {
    num: "03",
    title: "Name Transfer Included",
    body: "We handle the full personalization process. Your ticket arrives in your name, ready for entry.",
    detail: "Within 24h of payment",
  },
  {
    num: "04",
    title: "Human Support",
    body: "Real people, real answers. Reach us via email or the contact form — response within 4 hours.",
    detail: "9:00–22:00 CET",
  },
];

export function TrustSection() {
  return (
    <section className="relative py-28 overflow-hidden" style={{ background: "#07070A" }}>
      {/* Top rule */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-12 gap-16 items-start">

          {/* Left: sticky heading column */}
          <motion.div
            className="lg:col-span-4 lg:sticky lg:top-28"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 rounded-lg bg-[#C9A84C]/10 border border-[#C9A84C]/20 flex items-center justify-center">
                <ShieldCheck className="w-4 h-4 text-[#C9A84C]" />
              </div>
              <p className="text-[10px] uppercase tracking-[0.25em] text-[#C9A84C] font-semibold">
                Why choose us
              </p>
            </div>

            <h2 className="font-[var(--font-playfair)] text-4xl sm:text-5xl font-black text-white leading-tight mb-6">
              Buy with<br />
              <span
                style={{
                  background: "linear-gradient(135deg, #C9A84C 0%, #E4BA65 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                Confidence
              </span>
            </h2>

            <p className="text-zinc-500 text-sm leading-relaxed mb-8">
              We built AW Tickets on a single principle: every transaction should feel safe, transparent, and fast.
            </p>

            <Link
              href="/about"
              className="inline-flex items-center gap-2 text-sm text-zinc-500 hover:text-[#C9A84C] transition-colors duration-200 group"
            >
              Learn about us
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>

          {/* Right: numbered feature rows */}
          <div className="lg:col-span-8 space-y-1">
            {features.map((f, i) => (
              <motion.div
                key={f.num}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="group flex gap-8 items-start px-6 py-7 rounded-2xl
                           hover:bg-white/[0.03] transition-all duration-300 border border-transparent
                           hover:border-white/[0.06]"
              >
                {/* Number */}
                <div className="shrink-0 w-14">
                  <span
                    className="font-[var(--font-playfair)] text-4xl font-black leading-none"
                    style={{
                      background: "linear-gradient(180deg, rgba(201,168,76,0.6) 0%, rgba(201,168,76,0.1) 100%)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text",
                    }}
                  >
                    {f.num}
                  </span>
                </div>

                {/* Content */}
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-white font-bold text-lg group-hover:text-white transition-colors">
                      {f.title}
                    </h3>
                    <span className="text-[10px] uppercase tracking-[0.12em] text-[#C9A84C] bg-[#C9A84C]/8 border border-[#C9A84C]/15 px-2 py-0.5 rounded-full font-semibold">
                      {f.detail}
                    </span>
                  </div>
                  <p className="text-zinc-500 text-sm leading-relaxed">{f.body}</p>
                </div>

                {/* Hover arrow */}
                <div className="shrink-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 mt-1">
                  <ArrowRight className="w-4 h-4 text-zinc-600" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
