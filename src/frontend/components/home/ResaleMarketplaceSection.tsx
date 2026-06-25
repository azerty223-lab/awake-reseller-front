"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, ShieldCheck, BadgeCheck, Clock, Headphones } from "lucide-react";
import { LineReveal } from "@/frontend/components/ui/LineReveal";
import { Reveal } from "@/frontend/components/ui/Reveal";

/* ── Trust metrics ──────────────────────────────────────────────── */
const METRICS = [
  { Icon: ShieldCheck, label: "100% Authenticated",        desc: "Verified against the official Awakenings registry" },
  { Icon: BadgeCheck,  label: "Official Name Transfer",    desc: "Handled through the authorised transfer system"     },
  { Icon: Clock,       label: "3–5 Business Days",         desc: "Personalised e-ticket delivered before the festival" },
  { Icon: Headphones,  label: "< 4h Support Response",     desc: "During CET business hours, 7 days a week"           },
];

/* ── Verification steps ─────────────────────────────────────────── */
const STEPS = [
  {
    index: "01",
    title: "Registry Check",
    body:  "We verify the ticket against the official Awakenings registry before confirming the order.",
  },
  {
    index: "02",
    title: "Official Name Transfer",
    body:  "We handle the name-change process through the official transfer system.",
  },
  {
    index: "03",
    title: "Personalised Delivery",
    body:  "Your e-ticket arrives in your name, ready to present on a charged device at the gate.",
  },
];

const I = "var(--font-inter, Inter, system-ui, sans-serif)";

/* ── Section ─────────────────────────────────────────────────────── */
export function ResaleMarketplaceSection() {
  return (
    <section className="relative py-5 overflow-hidden">
      <div className="max-w-5xl mx-auto px-6 sm:px-12 lg:px-20">

        {/* Desktop: 2-column. Mobile: stacked. */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.15fr] gap-10 lg:gap-14 items-start">

          {/* ── Left: intro + CTA ─────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Eyebrow */}
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "0.875rem" }}>
              <span style={{ width: "16px", height: "1px", background: "rgba(6,182,212,0.45)", flexShrink: 0 }} />
              <span style={{ fontFamily: I, fontSize: "0.9375rem", fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: "rgba(237,233,225,0.82)" }}>
                Verified Resale
              </span>
            </div>

            {/* Headline */}
            <h2
              className="font-[var(--font-playfair)] font-black text-white"
              style={{ fontSize: "clamp(2rem, 4.5vw, 3.25rem)", letterSpacing: "-0.025em", lineHeight: 0.92, marginBottom: "1.25rem" }}
            >
              <LineReveal>Officially verified.</LineReveal>
              <LineReveal delay={0.09}>
                <span style={{ color: "rgba(237,233,225,0.55)" }}>Transferred to your name.</span>
              </LineReveal>
            </h2>

            {/* Intro copy */}
            <p style={{ fontFamily: I, fontSize: "0.9375rem", lineHeight: 1.8, color: "rgba(161,161,170,0.82)", marginBottom: "2rem" }}>
              Every ticket is checked against the official Awakenings registry before delivery.
              We handle the name transfer so your ticket arrives personalised, valid, and ready for entry.
            </p>

            {/* CTAs */}
            <div style={{ display: "flex", alignItems: "center", gap: "1rem", flexWrap: "wrap" }}>
              {/* Primary */}
              <Link
                href="/tickets"
                className="group inline-flex items-center gap-2.5 shrink-0"
                style={{
                  fontFamily:    I,
                  fontSize:      "11px",
                  fontWeight:    600,
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                  color:         "rgba(6,182,212,0.85)",
                  background:    "rgba(6,182,212,0.07)",
                  border:        "1px solid rgba(6,182,212,0.25)",
                  padding:       "10px 20px",
                  borderRadius:  "8px",
                  transition:    "all 0.22s ease",
                }}
                onMouseEnter={e => {
                  const el = e.currentTarget as HTMLAnchorElement;
                  el.style.background = "rgba(6,182,212,0.14)";
                  el.style.borderColor = "rgba(6,182,212,0.48)";
                  el.style.color = "rgba(6,182,212,1)";
                }}
                onMouseLeave={e => {
                  const el = e.currentTarget as HTMLAnchorElement;
                  el.style.background = "rgba(6,182,212,0.07)";
                  el.style.borderColor = "rgba(6,182,212,0.25)";
                  el.style.color = "rgba(6,182,212,0.85)";
                }}
              >
                Browse verified tickets
                <ArrowRight className="group-hover:translate-x-0.5 transition-transform duration-300" style={{ width: "12px", height: "12px" }} />
              </Link>

              {/* Secondary */}
              <Link
                href="/about"
                style={{
                  fontFamily:    I,
                  fontSize:      "11px",
                  letterSpacing: "0.16em",
                  textTransform: "uppercase",
                  color:         "rgba(237,233,225,0.30)",
                  transition:    "color 0.25s ease",
                }}
                onMouseEnter={e => (e.currentTarget.style.color = "rgba(237,233,225,0.60)")}
                onMouseLeave={e => (e.currentTarget.style.color = "rgba(237,233,225,0.30)")}
              >
                About us
              </Link>
            </div>
          </motion.div>

          {/* ── Right: verification panel ─────────────────── */}
          <Reveal delay={0.18} direction="left">
            <div style={{
              border:        "1px solid rgba(6,182,212,0.16)",
              borderRadius:  "16px",
              background:    "rgba(6,182,212,0.025)",
              overflow:      "hidden",
            }}>

              {/* Certificate top accent */}
              <div style={{
                height:     "2px",
                background: "linear-gradient(to right, rgba(6,182,212,0.65), rgba(6,182,212,0.25) 60%, transparent)",
              }} />

              {/* Trust metrics */}
              <div style={{ padding: "1.5rem 1.5rem 1.25rem" }}>
                <p style={{ fontFamily: I, fontSize: "9.5px", fontWeight: 600, letterSpacing: "0.24em", textTransform: "uppercase", color: "rgba(6,182,212,0.55)", marginBottom: "1rem" }}>
                  Verification proof
                </p>
                {METRICS.map((m, i) => (
                  <div
                    key={m.label}
                    style={{
                      display:      "flex",
                      alignItems:   "center",
                      gap:          "12px",
                      padding:      "0.6875rem 0",
                      borderBottom: i < METRICS.length - 1 ? "1px solid rgba(237,233,225,0.04)" : "none",
                    }}
                  >
                    {/* Icon box */}
                    <div style={{
                      width:          "30px",
                      height:         "30px",
                      borderRadius:   "7px",
                      background:     "rgba(6,182,212,0.08)",
                      border:         "1px solid rgba(6,182,212,0.16)",
                      display:        "flex",
                      alignItems:     "center",
                      justifyContent: "center",
                      flexShrink:     0,
                    }}>
                      <m.Icon style={{ width: "13px", height: "13px", color: "rgba(6,182,212,0.75)" }} strokeWidth={1.75} aria-hidden="true" />
                    </div>
                    {/* Text */}
                    <div>
                      <div style={{ fontFamily: I, fontWeight: 600, fontSize: "0.875rem", color: "rgba(237,233,225,0.90)", lineHeight: 1.2, marginBottom: "2px" }}>
                        {m.label}
                      </div>
                      <div style={{ fontFamily: I, fontSize: "11.5px", color: "rgba(161,161,170,0.50)", lineHeight: 1.4 }}>
                        {m.desc}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Panel divider */}
              <div style={{ height: "1px", background: "rgba(237,233,225,0.07)", margin: "0 1.5rem" }} />

              {/* Verification steps */}
              <div style={{ padding: "1.25rem 1.5rem 1.5rem" }}>
                <p style={{ fontFamily: I, fontSize: "9.5px", fontWeight: 600, letterSpacing: "0.24em", textTransform: "uppercase", color: "rgba(6,182,212,0.55)", marginBottom: "1rem" }}>
                  How verification works
                </p>

                {STEPS.map((step, i) => (
                  <div key={step.index} style={{ display: "flex", gap: "12px" }}>

                    {/* Left: node + connector */}
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "20px", flexShrink: 0 }}>
                      <div style={{
                        width:          "20px",
                        height:         "20px",
                        borderRadius:   "50%",
                        border:         "1.5px solid rgba(6,182,212,0.35)",
                        background:     "rgba(6,182,212,0.07)",
                        display:        "flex",
                        alignItems:     "center",
                        justifyContent: "center",
                        flexShrink:     0,
                      }}>
                        <span style={{ fontFamily: I, fontSize: "8px", fontWeight: 700, color: "rgba(6,182,212,0.75)" }}>
                          {i + 1}
                        </span>
                      </div>
                      {i < STEPS.length - 1 && (
                        <div style={{
                          width:      "1px",
                          flex:       1,
                          minHeight:  "1.5rem",
                          margin:     "4px 0",
                          background: "linear-gradient(to bottom, rgba(6,182,212,0.20), rgba(6,182,212,0.04))",
                        }} />
                      )}
                    </div>

                    {/* Right: content */}
                    <div style={{ paddingBottom: i < STEPS.length - 1 ? "1rem" : 0, paddingTop: "1px", flex: 1 }}>
                      <div style={{ fontFamily: I, fontWeight: 600, fontSize: "0.875rem", color: "rgba(237,233,225,0.88)", marginBottom: "3px", lineHeight: 1.2 }}>
                        {step.title}
                      </div>
                      <p style={{ fontFamily: I, fontSize: "0.8125rem", color: "rgba(161,161,170,0.55)", lineHeight: 1.6, margin: 0 }}>
                        {step.body}
                      </p>
                    </div>

                  </div>
                ))}
              </div>

            </div>
          </Reveal>

        </div>

      </div>
    </section>
  );
}
