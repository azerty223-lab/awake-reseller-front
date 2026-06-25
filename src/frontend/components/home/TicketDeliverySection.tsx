"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { LineReveal } from "@/frontend/components/ui/LineReveal";
import { Reveal } from "@/frontend/components/ui/Reveal";

const STEPS = [
  {
    index:    "01",
    title:    "Secure Checkout",
    body:     "Complete your purchase via Stripe or crypto. 3D Secure authentication, end-to-end encryption. Confirmation lands in your inbox within seconds.",
    detail:   "Stripe · Crypto · 3D Secure",
  },
  {
    index:    "02",
    title:    "Order Confirmed",
    body:     "A confirmation email lands in your inbox immediately — containing your payment receipt, full ticket details, and a real-time tracking link. You will receive your personalised ticket very soon.",
    detail:   "Instant confirmation · Ticket info",
  },
  {
    index:    "03",
    title:    "Your E-Ticket Arrives",
    body:     "A personalized PDF e-ticket lands in your inbox. Present it on a charged device at maximum screen brightness at the festival gate.",
    detail:   "PDF · Named to you",
  },
];

const INTER = "var(--font-inter, Inter, system-ui, sans-serif)";

export function TicketDeliverySection() {
  return (
    <section className="relative py-5 overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/[0.07] to-transparent" />

      <div className="max-w-5xl mx-auto px-6 sm:px-12 lg:px-20">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9 }}
          className="mb-5"
        >
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "0.75rem" }}>
            <span style={{ width: "16px", height: "1px", background: "rgba(184,146,58,0.45)", flexShrink: 0 }} />
            <span style={{ fontFamily: INTER, fontSize: "0.9375rem", fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: "rgba(237,233,225,0.82)" }}>
              Ticket Delivery
            </span>
          </div>
          <h2
            className="font-[var(--font-playfair)] font-black text-white"
            style={{ fontSize: "clamp(2.5rem, 5.5vw, 4.25rem)", letterSpacing: "-0.03em", lineHeight: 0.92 }}
          >
            <LineReveal>From purchase</LineReveal>
            <LineReveal delay={0.09}>to gate entry</LineReveal>
          </h2>
        </motion.div>

        {/* Timeline */}
        <div className="relative">

          {/* Connecting line — desktop only */}
          <motion.div
            className="hidden md:block absolute top-[1.4rem] left-0 right-0 h-px"
            style={{ background: "rgba(237,233,225,0.07)", zIndex: 0 }}
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.4, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8 lg:gap-12 relative">
            {STEPS.map((step, i) => (
              <Reveal key={step.index} delay={0.1 + i * 0.12}>
                <div className="relative pt-2">

                  {/* Step indicator dot */}
                  <div className="hidden md:flex items-center gap-4 mb-8">
                    <div style={{
                      width:        "11px",
                      height:       "11px",
                      borderRadius: "50%",
                      background:   i === 0 ? "rgba(184,146,58,0.80)" : "rgba(237,233,225,0.18)",
                      border:       `1px solid ${i === 0 ? "rgba(184,146,58,0.40)" : "rgba(237,233,225,0.12)"}`,
                      flexShrink:   0,
                    }} />
                  </div>

                  {/* Index */}
                  <span style={{
                    fontFamily:    INTER,
                    fontSize:      "11px",
                    letterSpacing: "0.28em",
                    textTransform: "uppercase",
                    color:         "rgba(184,146,58,0.65)",
                    display:       "block",
                    marginBottom:  "0.875rem",
                  }}>
                    {step.index}
                  </span>

                  {/* Title */}
                  <h3
                    className="font-[var(--font-playfair)] font-black text-white"
                    style={{ fontSize: "clamp(1.375rem, 2.8vw, 1.875rem)", letterSpacing: "-0.02em", lineHeight: 1.05, marginBottom: "1rem" }}
                  >
                    {step.title}
                  </h3>

                  {/* Body */}
                  <p style={{
                    fontFamily:   INTER,
                    fontSize:     "0.9375rem",
                    lineHeight:   1.8,
                    color:        "rgba(161,161,170,1)",
                    marginBottom: "1.25rem",
                  }}>
                    {step.body}
                  </p>

                  {/* Detail tag */}
                  <span style={{
                    fontFamily:    INTER,
                    fontSize:      "10px",
                    letterSpacing: "0.24em",
                    textTransform: "uppercase",
                    color:         "rgba(184,146,58,0.55)",
                    display:       "block",
                    borderTop:     "1px solid rgba(237,233,225,0.06)",
                    paddingTop:    "0.875rem",
                  }}>
                    {step.detail}
                  </span>
                </div>
              </Reveal>
            ))}
          </div>
        </div>

        {/* Support note */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="mt-12 pt-8 border-t border-white/[0.06]"
          style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem" }}
        >
          <p style={{ fontFamily: INTER, fontSize: "0.9375rem", color: "rgba(161,161,170,1)", lineHeight: 1.6 }}>
            Questions about your order?{" "}
            <Link
              href="/contact"
              style={{ color: "rgba(237,233,225,0.70)", textDecoration: "underline", textUnderlineOffset: "3px", textDecorationColor: "rgba(237,233,225,0.20)" }}
              onMouseEnter={e => (e.currentTarget.style.color = "rgba(184,146,58,0.90)")}
              onMouseLeave={e => (e.currentTarget.style.color = "rgba(237,233,225,0.70)")}
            >
              Contact us
            </Link>
            {" — "}we respond within 4 hours during CET business hours.
          </p>
          <Link
            href="/tickets"
            className="group flex items-center gap-2.5 shrink-0"
            style={{
              fontFamily:    INTER,
              fontSize:      "12px",
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color:         "rgba(237,233,225,0.55)",
              transition:    "color 0.3s ease",
            }}
            onMouseEnter={e => (e.currentTarget.style.color = "rgba(184,146,58,0.90)")}
            onMouseLeave={e => (e.currentTarget.style.color = "rgba(237,233,225,0.55)")}
          >
            Browse tickets
            <ArrowRight
              className="group-hover:translate-x-0.5 transition-transform duration-300"
              style={{ width: "12px", height: "12px" }}
            />
          </Link>
        </motion.div>

      </div>
    </section>
  );
}
