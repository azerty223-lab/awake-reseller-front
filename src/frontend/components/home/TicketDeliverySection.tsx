"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { LineReveal } from "@/frontend/components/ui/LineReveal";

/* ── Steps data ─────────────────────────────────────────────────── */
const STEPS = [
  {
    index: "01",
    illus: "/illus-checkout.svg",
    title: "Secure Checkout",
    body:  "Pay by Stripe or crypto with 3D Secure authentication and end-to-end encrypted processing. Confirmation lands in your inbox within seconds.",
    tags:  ["Stripe", "Crypto", "3D Secure"],
  },
  {
    index: "02",
    illus: "/illus-confirm.svg",
    title: "Instant Confirmation",
    body:  "Your order confirmation, payment receipt, and full ticket details arrive by email immediately after payment.",
    tags:  ["Receipt", "Order details", "Tracking"],
  },
  {
    index: "03",
    illus: "/illus-eticket.svg",
    title: "E-Ticket Delivery",
    body:  "Your personalised PDF e-ticket is dispatched on July 8th. Show it on a charged device at maximum brightness at the gate.",
    tags:  ["PDF", "Named ticket", "Gate ready"],
  },
];

const I = "var(--font-inter, Inter, system-ui, sans-serif)";

/* ── Tag pill ────────────────────────────────────────────────────── */
function TagPill({ label }: { label: string }) {
  return (
    <span style={{
      fontFamily:    I,
      fontSize:      "8.5px",
      fontWeight:    600,
      letterSpacing: "0.18em",
      textTransform: "uppercase" as const,
      color:         "rgba(6,182,212,0.65)",
      background:    "rgba(6,182,212,0.06)",
      border:        "1px solid rgba(6,182,212,0.14)",
      borderRadius:  "4px",
      padding:       "3px 8px",
    }}>
      {label}
    </span>
  );
}

/* ── Section ─────────────────────────────────────────────────────── */
export function TicketDeliverySection() {
  return (
    <section className="relative py-5 overflow-hidden">
      <div className="max-w-5xl mx-auto px-6 sm:px-12 lg:px-20">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9 }}
          className="mb-10"
        >
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "0.75rem" }}>
            <span style={{ width: "16px", height: "1px", background: "rgba(6,182,212,0.45)", flexShrink: 0 }} />
            <span style={{ fontFamily: I, fontSize: "0.9375rem", fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: "rgba(237,233,225,0.82)" }}>
              Ticket Delivery
            </span>
          </div>
          <h2
            className="font-[var(--font-playfair)] font-black text-white"
            style={{ fontSize: "clamp(2rem, 4.5vw, 3.25rem)", letterSpacing: "-0.025em", lineHeight: 0.92 }}
          >
            <LineReveal>From payment</LineReveal>
            <LineReveal delay={0.09}>to gate entry</LineReveal>
          </h2>
        </motion.div>

        {/* ── Steps with illustrations ──────────────────────────── */}
        <div className="relative">

          {/* Desktop connecting rail — at mid-illustration height */}
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.5, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="hidden md:block"
            style={{
              position:        "absolute",
              top:             "80px",
              left:            "calc(100% / 6)",
              right:           "calc(100% / 6)",
              height:          "1px",
              background:      "linear-gradient(to right, rgba(6,182,212,0.30), rgba(6,182,212,0.10), rgba(6,182,212,0.30))",
              transformOrigin: "left",
              zIndex:          0,
            }}
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-8">
            {STEPS.map((step, i) => (
              <motion.div
                key={step.index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.75, delay: 0.15 + i * 0.14, ease: [0.16, 1, 0.3, 1] }}
                className="flex flex-col items-center text-center"
              >
                {/* Illustration + numbered badge */}
                <div style={{ position: "relative", marginBottom: "1.5rem", zIndex: 1 }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={step.illus}
                    alt=""
                    aria-hidden="true"
                    width={160}
                    height={160}
                    style={{
                      width:        "160px",
                      height:       "160px",
                      objectFit:    "contain",
                      display:      "block",
                      filter:       "drop-shadow(0 8px 28px rgba(0,0,0,0.50))",
                      borderRadius: "12px",
                    }}
                  />
                  {/* Step number badge */}
                  <div
                    aria-label={`Step ${step.index}`}
                    style={{
                      position:       "absolute",
                      bottom:         "-6px",
                      right:          "-6px",
                      width:          "24px",
                      height:         "24px",
                      borderRadius:   "50%",
                      background:     "#06B6D4",
                      border:         "2px solid #050507",
                      display:        "flex",
                      alignItems:     "center",
                      justifyContent: "center",
                      fontFamily:     I,
                      fontSize:       "11px",
                      fontWeight:     800,
                      color:          "#000",
                      lineHeight:     1,
                    }}
                  >
                    {i + 1}
                  </div>
                </div>

                {/* Title */}
                <h3 style={{
                  fontFamily:   I,
                  fontWeight:   700,
                  fontSize:     "clamp(0.9375rem, 1.8vw, 1.0625rem)",
                  letterSpacing:"0.01em",
                  color:        "rgba(237,233,225,0.96)",
                  marginBottom: "0.625rem",
                  lineHeight:   1.25,
                }}>
                  {step.title}
                </h3>

                {/* Body */}
                <p style={{
                  fontFamily:   I,
                  fontSize:     "0.875rem",
                  lineHeight:   1.75,
                  color:        "rgba(161,161,170,0.80)",
                  marginBottom: "1rem",
                  maxWidth:     "220px",
                }}>
                  {step.body}
                </p>

                {/* Tags */}
                <div style={{ display: "flex", justifyContent: "center", flexWrap: "wrap", gap: "5px" }}>
                  {step.tags.map(t => <TagPill key={t} label={t} />)}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Support row */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="mt-12 pt-7 border-t border-white/[0.06]"
          style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem" }}
        >
          <p style={{ fontFamily: I, fontSize: "0.875rem", color: "rgba(161,161,170,0.70)", lineHeight: 1.6 }}>
            Questions about your order?{" "}
            <Link
              href="/contact"
              style={{ color: "rgba(6,182,212,0.75)", textDecoration: "underline", textUnderlineOffset: "3px", textDecorationColor: "rgba(6,182,212,0.25)", transition: "color 0.25s ease" }}
              onMouseEnter={e => (e.currentTarget.style.color = "rgba(6,182,212,1)")}
              onMouseLeave={e => (e.currentTarget.style.color = "rgba(6,182,212,0.75)")}
            >
              Contact us
            </Link>
            {" — "}we respond within 4 hours during CET business hours.
          </p>

          <Link
            href="/tickets"
            className="group inline-flex items-center gap-2.5 shrink-0"
            style={{
              fontFamily:    I,
              fontSize:      "11px",
              fontWeight:    600,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color:         "rgba(6,182,212,0.80)",
              background:    "rgba(6,182,212,0.07)",
              border:        "1px solid rgba(6,182,212,0.22)",
              padding:       "9px 18px",
              borderRadius:  "8px",
              transition:    "all 0.22s ease",
            }}
            onMouseEnter={e => {
              const el = e.currentTarget as HTMLAnchorElement;
              el.style.background  = "rgba(6,182,212,0.14)";
              el.style.borderColor = "rgba(6,182,212,0.45)";
              el.style.color       = "rgba(6,182,212,1)";
            }}
            onMouseLeave={e => {
              const el = e.currentTarget as HTMLAnchorElement;
              el.style.background  = "rgba(6,182,212,0.07)";
              el.style.borderColor = "rgba(6,182,212,0.22)";
              el.style.color       = "rgba(6,182,212,0.80)";
            }}
          >
            Browse tickets
            <ArrowRight className="group-hover:translate-x-0.5 transition-transform duration-300" style={{ width: "12px", height: "12px" }} />
          </Link>
        </motion.div>

      </div>
    </section>
  );
}
