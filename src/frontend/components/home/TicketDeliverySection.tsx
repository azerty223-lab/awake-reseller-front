"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Lock, MailCheck, Ticket } from "lucide-react";
import { LineReveal } from "@/frontend/components/ui/LineReveal";

/* ── Steps data ─────────────────────────────────────────────────── */
const STEPS = [
  {
    index: "01",
    Icon:  Lock,
    title: "Secure Checkout",
    body:  "Pay by Stripe or crypto with 3D Secure authentication and end-to-end encrypted processing. Confirmation lands in your inbox within seconds.",
    tags:  ["Stripe", "Crypto", "3D Secure"],
  },
  {
    index: "02",
    Icon:  MailCheck,
    title: "Instant Confirmation",
    body:  "Your order confirmation, payment receipt, and full ticket details arrive by email immediately after payment.",
    tags:  ["Receipt", "Order details", "Tracking"],
  },
  {
    index: "03",
    Icon:  Ticket,
    title: "E-Ticket Delivery",
    body:  "Your personalised PDF e-ticket is dispatched on July 8th. Show it on a charged device at maximum brightness at the gate.",
    tags:  ["PDF", "Named ticket", "Gate ready"],
  },
];

const I = "var(--font-inter, Inter, system-ui, sans-serif)";

/* ── Node visual helpers ─────────────────────────────────────────── */
// Final step (e-ticket) gets slightly stronger emphasis — it's the destination.
const nodeBorder  = (i: number) => `rgba(6,182,212,${i === 2 ? "0.55" : "0.28"})`;
const nodeBg      = (i: number) => `rgba(6,182,212,${i === 2 ? "0.13" : "0.06"})`;
const iconColor   = (i: number) => `rgba(6,182,212,${i === 2 ? "0.90" : "0.60"})`;

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

        {/* ── DESKTOP: horizontal connected timeline ──────────── */}
        <div className="hidden md:block">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="relative"
          >
            {/* Animated rail — runs from node 1 centre to node 3 centre */}
            <motion.div
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.5, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
              style={{
                position:        "absolute",
                top:             "19px",          // half of 38px node
                left:            "calc(100% / 6)",
                right:           "calc(100% / 6)",
                height:          "1px",
                background:      "linear-gradient(to right, rgba(6,182,212,0.30), rgba(6,182,212,0.14), rgba(6,182,212,0.30))",
                transformOrigin: "left",
                zIndex:          0,
              }}
            />

            <div className="grid grid-cols-3 gap-8">
              {STEPS.map((step, i) => (
                <div key={step.index} className="flex flex-col">

                  {/* Node */}
                  <div className="flex flex-col items-center mb-5 relative z-10">
                    <div style={{
                      width:          "38px",
                      height:         "38px",
                      borderRadius:   "50%",
                      border:         `1.5px solid ${nodeBorder(i)}`,
                      background:     nodeBg(i),
                      display:        "flex",
                      alignItems:     "center",
                      justifyContent: "center",
                      marginBottom:   "8px",
                    }}>
                      <step.Icon
                        style={{ width: "15px", height: "15px", color: iconColor(i) }}
                        strokeWidth={1.75}
                        aria-hidden="true"
                      />
                    </div>
                    <span style={{ fontFamily: I, fontSize: "9.5px", letterSpacing: "0.28em", textTransform: "uppercase", color: "rgba(6,182,212,0.45)" }}>
                      {step.index}
                    </span>
                  </div>

                  {/* Content — centre-aligned under the node */}
                  <div className="text-center">
                    <h3 style={{ fontFamily: I, fontWeight: 700, fontSize: "clamp(0.9375rem, 1.8vw, 1.0625rem)", letterSpacing: "0.01em", color: "rgba(237,233,225,0.96)", marginBottom: "0.625rem", lineHeight: 1.25 }}>
                      {step.title}
                    </h3>
                    <p style={{ fontFamily: I, fontSize: "0.875rem", lineHeight: 1.75, color: "rgba(161,161,170,0.80)", marginBottom: "1rem" }}>
                      {step.body}
                    </p>
                    <div style={{ display: "flex", justifyContent: "center", flexWrap: "wrap", gap: "5px" }}>
                      {step.tags.map(t => <TagPill key={t} label={t} />)}
                    </div>
                  </div>

                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* ── MOBILE: vertical stepper ─────────────────────────── */}
        <div className="md:hidden">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            {STEPS.map((step, i) => (
              <div key={step.index} className="flex gap-5">

                {/* Left rail: node + vertical connector */}
                <div className="flex flex-col items-center" style={{ width: "38px", flexShrink: 0 }}>
                  <div style={{
                    width:          "38px",
                    height:         "38px",
                    borderRadius:   "50%",
                    border:         `1.5px solid ${nodeBorder(i)}`,
                    background:     nodeBg(i),
                    display:        "flex",
                    alignItems:     "center",
                    justifyContent: "center",
                    flexShrink:     0,
                    zIndex:         1,
                    position:       "relative",
                  }}>
                    <step.Icon
                      style={{ width: "15px", height: "15px", color: iconColor(i) }}
                      strokeWidth={1.75}
                      aria-hidden="true"
                    />
                  </div>
                  {/* Vertical connector to next step */}
                  {i < STEPS.length - 1 && (
                    <div style={{
                      width:      "1px",
                      flex:       1,
                      minHeight:  "2rem",
                      margin:     "5px 0",
                      background: "linear-gradient(to bottom, rgba(6,182,212,0.20), rgba(6,182,212,0.04))",
                    }} />
                  )}
                </div>

                {/* Right: content */}
                <div style={{ paddingTop: "5px", paddingBottom: i < STEPS.length - 1 ? "2rem" : 0, flex: 1 }}>
                  <span style={{ fontFamily: I, fontSize: "9.5px", letterSpacing: "0.28em", textTransform: "uppercase", color: "rgba(6,182,212,0.45)", display: "block", marginBottom: "5px" }}>
                    {step.index}
                  </span>
                  <h3 style={{ fontFamily: I, fontWeight: 700, fontSize: "1rem", letterSpacing: "0.01em", color: "rgba(237,233,225,0.96)", marginBottom: "0.5rem", lineHeight: 1.25 }}>
                    {step.title}
                  </h3>
                  <p style={{ fontFamily: I, fontSize: "0.875rem", lineHeight: 1.75, color: "rgba(161,161,170,0.80)", marginBottom: "0.875rem" }}>
                    {step.body}
                  </p>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "5px" }}>
                    {step.tags.map(t => <TagPill key={t} label={t} />)}
                  </div>
                </div>

              </div>
            ))}
          </motion.div>
        </div>

        {/* Support row */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="mt-10 pt-7 border-t border-white/[0.06]"
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
              el.style.background   = "rgba(6,182,212,0.14)";
              el.style.borderColor  = "rgba(6,182,212,0.45)";
              el.style.color        = "rgba(6,182,212,1)";
            }}
            onMouseLeave={e => {
              const el = e.currentTarget as HTMLAnchorElement;
              el.style.background   = "rgba(6,182,212,0.07)";
              el.style.borderColor  = "rgba(6,182,212,0.22)";
              el.style.color        = "rgba(6,182,212,0.80)";
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
