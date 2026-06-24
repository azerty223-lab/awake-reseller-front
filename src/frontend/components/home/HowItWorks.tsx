"use client";

import { motion } from "framer-motion";
import { Search, Lock, MailCheck } from "lucide-react";

const STEPS = [
  {
    number: "01",
    Icon: Search,
    title: "Find your pass",
    body: "Browse verified resale tickets across every area and day. Real-time availability, fully transparent prices — no hidden fees, no guesswork.",
  },
  {
    number: "02",
    Icon: Lock,
    title: "Pay securely",
    body: "Complete checkout with Stripe or crypto. Your data is encrypted end-to-end. Order confirmation lands in your inbox in seconds.",
  },
  {
    number: "03",
    Icon: MailCheck,
    title: "Receive your ticket",
    body: "We handle the official Awakenings name-change process. Your personalised e-ticket arrives within 3–5 business days, ready to scan at the gate.",
  },
];

export function HowItWorks() {
  return (
    <section className="relative py-32 sm:py-40 overflow-hidden">
      {/* Top rule */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />

      <div className="max-w-5xl mx-auto px-6 sm:px-12 lg:px-20">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-20"
        >
          <p className="text-[10px] uppercase tracking-[0.25em] text-zinc-600 mb-4 font-medium">
            The process
          </p>
          <h2
            className="font-[var(--font-playfair)] font-black text-white leading-tight"
            style={{ fontSize: "clamp(2rem, 4.5vw, 3.5rem)", letterSpacing: "-0.02em" }}
          >
            Your ticket, three steps
          </h2>
        </motion.div>

        {/* Steps — 3 columns desktop, stacked mobile */}
        <div className="grid md:grid-cols-3 gap-10 md:gap-0 md:divide-x md:divide-white/[0.06]">
          {STEPS.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55, delay: i * 0.1 }}
              className="relative md:px-10 first:pl-0 last:pr-0"
            >
              {/* Faded editorial number */}
              <span
                className="block font-[var(--font-playfair)] font-black select-none leading-none mb-4"
                style={{
                  fontSize: "4.5rem",
                  letterSpacing: "-0.04em",
                  background:
                    "linear-gradient(180deg, rgba(201,168,76,0.35) 0%, rgba(201,168,76,0.04) 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
                aria-hidden="true"
              >
                {step.number}
              </span>

              {/* Icon */}
              <div className="w-10 h-10 rounded-xl bg-[#C9A84C]/10 border border-[#C9A84C]/20 flex items-center justify-center mb-5">
                <step.Icon className="w-4.5 h-4.5 text-[#C9A84C]" style={{ width: "1.125rem", height: "1.125rem" }} />
              </div>

              {/* Copy */}
              <h3
                className="text-white font-bold mb-3"
                style={{ fontSize: "1.0625rem", letterSpacing: "-0.01em" }}
              >
                {step.title}
              </h3>
              <p className="text-zinc-500 text-sm leading-relaxed">{step.body}</p>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
