"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, ShieldCheck, BadgeCheck, Clock, Headphones } from "lucide-react";
import { LineReveal } from "@/frontend/components/ui/LineReveal";

/* ── Data ─────────────────────────────────────────────────────── */
const METRICS = [
  { Icon: ShieldCheck, value: "100%",        label: "Authenticated",       desc: "Against official registry"     },
  { Icon: BadgeCheck,  value: "Official",    label: "Name Transfer",       desc: "Authorised system only"        },
  { Icon: Clock,       value: "3–5",         label: "Business Days",       desc: "Delivery before festival"       },
  { Icon: Headphones,  value: "< 4h",        label: "Support Response",    desc: "CET business hours"             },
];

const STEPS = [
  {
    num:   "1",
    title: "Registry Check",
    body:  "We validate the ticket against the official Awakenings registry before confirming the order.",
  },
  {
    num:   "2",
    title: "Name Transfer",
    body:  "We handle the official transfer process so the ticket is issued in your name.",
  },
  {
    num:   "3",
    title: "Gate Ready",
    body:  "Your personalised e-ticket is delivered by email, ready to present at the festival gate.",
  },
];

const I = "var(--font-inter, Inter, system-ui, sans-serif)";

/* ── Verified ticket pass module ──────────────────────────────── */
function VerifiedPass() {
  return (
    <div
      style={{
        position:      "relative",
        border:        "1px solid rgba(6,182,212,0.22)",
        borderRadius:  "8px",
        background:    "rgba(7,9,15,0.98)",
        overflow:      "hidden",
      }}
    >
      {/* Top accent stripe */}
      <div style={{
        height:     "3px",
        background: "linear-gradient(to right, rgba(6,182,212,0.85) 0%, rgba(6,182,212,0.40) 55%, transparent 100%)",
      }} />

      {/* ── Ticket header ─────────────────────────── */}
      <div style={{ padding: "1.25rem 1.5rem 1rem", display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "1rem" }}>
        <div>
          <p style={{ fontFamily: I, fontSize: "8.5px", letterSpacing: "0.34em", textTransform: "uppercase", color: "rgba(6,182,212,0.45)", marginBottom: "4px" }}>
            Awakenings Festival 2026
          </p>
          <p style={{ fontFamily: I, fontSize: "12px", fontWeight: 600, letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(237,233,225,0.55)" }}>
            Official Resale Ticket
          </p>
        </div>

        {/* VERIFIED badge */}
        <div style={{
          display:       "flex",
          alignItems:    "center",
          gap:           "5px",
          padding:       "5px 11px",
          border:        "1px solid rgba(6,182,212,0.38)",
          borderRadius:  "4px",
          background:    "rgba(6,182,212,0.09)",
          flexShrink:    0,
        }}>
          <ShieldCheck style={{ width: "10px", height: "10px", color: "rgba(6,182,212,0.82)" }} strokeWidth={2.2} aria-hidden="true" />
          <span style={{ fontFamily: I, fontSize: "8px", fontWeight: 700, letterSpacing: "0.22em", textTransform: "uppercase", color: "rgba(6,182,212,0.82)" }}>
            Verified
          </span>
        </div>
      </div>

      {/* ── Barcode visual ─────────────────────────── */}
      <div style={{ padding: "0 1.5rem 1.25rem", display: "flex", alignItems: "center", gap: "14px" }}>
        {/* CSS barcode strip */}
        <div
          aria-hidden="true"
          style={{
            width:        "72px",
            height:       "40px",
            flexShrink:   0,
            borderRadius: "2px",
            background: `repeating-linear-gradient(
              90deg,
              rgba(6,182,212,0.32) 0px, rgba(6,182,212,0.32) 2px,
              transparent 2px, transparent 4px,
              rgba(6,182,212,0.18) 4px, rgba(6,182,212,0.18) 5px,
              transparent 5px, transparent 9px,
              rgba(6,182,212,0.26) 9px, rgba(6,182,212,0.26) 12px,
              transparent 12px, transparent 14px,
              rgba(6,182,212,0.14) 14px, rgba(6,182,212,0.14) 15px,
              transparent 15px, transparent 18px,
              rgba(6,182,212,0.30) 18px, rgba(6,182,212,0.30) 21px,
              transparent 21px, transparent 24px
            )`,
          }}
        />
        <div>
          <p style={{ fontFamily: I, fontSize: "8.5px", letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(6,182,212,0.40)", marginBottom: "3px" }}>
            Authentication code
          </p>
          <p style={{ fontFamily: "monospace", fontSize: "10.5px", color: "rgba(237,233,225,0.25)", letterSpacing: "0.12em" }}>
            AW-2026-VR-✓
          </p>
        </div>
      </div>

      {/* ── Perforation line ───────────────────────── */}
      <div style={{ position: "relative", margin: "0 -1px" }}>
        <div style={{ borderTop: "2px dashed rgba(237,233,225,0.11)" }} />
        {/* Semicircle cutouts at edges */}
        <div style={{ position: "absolute", left: "-5px",  top: "-6px", width: "10px", height: "10px", borderRadius: "50%", background: "#050507", border: "1px solid rgba(6,182,212,0.22)" }} aria-hidden="true" />
        <div style={{ position: "absolute", right: "-5px", top: "-6px", width: "10px", height: "10px", borderRadius: "50%", background: "#050507", border: "1px solid rgba(6,182,212,0.22)" }} aria-hidden="true" />
      </div>

      {/* ── Metric rows ────────────────────────────── */}
      <div style={{ padding: "1.125rem 1.5rem" }}>
        {METRICS.map((m, i) => (
          <div key={m.label} style={{
            display:      "flex",
            alignItems:   "center",
            gap:          "10px",
            padding:      "0.5625rem 0",
            borderBottom: i < METRICS.length - 1 ? "1px solid rgba(237,233,225,0.04)" : "none",
          }}>
            {/* Small icon */}
            <m.Icon style={{ width: "12px", height: "12px", color: "rgba(6,182,212,0.60)", flexShrink: 0 }} strokeWidth={2} aria-hidden="true" />

            {/* Value */}
            <span style={{ fontFamily: I, fontWeight: 700, fontSize: "0.875rem", color: "rgba(237,233,225,0.90)", minWidth: "3rem", flexShrink: 0 }}>
              {m.value}
            </span>

            {/* Label + desc */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <span style={{ fontFamily: I, fontWeight: 500, fontSize: "0.8125rem", color: "rgba(237,233,225,0.65)" }}>
                {m.label}
              </span>
              <span style={{ fontFamily: I, fontSize: "0.75rem", color: "rgba(161,161,170,0.38)", marginLeft: "8px" }}>
                {m.desc}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* ── Ticket footer watermark ─────────────────── */}
      <div style={{
        padding:      "0.75rem 1.5rem",
        borderTop:    "1px solid rgba(237,233,225,0.05)",
        display:      "flex",
        justifyContent: "space-between",
        alignItems:   "center",
      }}>
        <span style={{ fontFamily: "monospace", fontSize: "7.5px", letterSpacing: "0.12em", color: "rgba(237,233,225,0.10)", textTransform: "uppercase" }}>
          AWRE-2026-OFFICIAL
        </span>
        <span style={{ fontFamily: I, fontSize: "7.5px", letterSpacing: "0.14em", color: "rgba(237,233,225,0.10)", textTransform: "uppercase" }}>
          awakenings.com/resale
        </span>
      </div>
    </div>
  );
}

/* ── Section ──────────────────────────────────────────────────── */
export function ResaleMarketplaceSection() {
  return (
    <section className="relative py-5 overflow-hidden">
      <div className="max-w-5xl mx-auto px-6 sm:px-12 lg:px-20">

        {/* ── Top: editorial split ─────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-center">

          {/* Left: headline + copy + CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
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
                <span style={{ color: "rgba(237,233,225,0.50)" }}>Transferred to your name.</span>
              </LineReveal>
            </h2>

            {/* Intro */}
            <p style={{ fontFamily: I, fontSize: "0.9375rem", lineHeight: 1.8, color: "rgba(161,161,170,0.78)", marginBottom: "2rem" }}>
              Every resale ticket is checked against the official Awakenings registry before delivery.
              We handle the name transfer so your ticket arrives personalised, valid, and ready for entry.
            </p>

            {/* CTAs */}
            <div style={{ display: "flex", alignItems: "center", gap: "1rem", flexWrap: "wrap" }}>
              <Link
                href="/tickets"
                className="group inline-flex items-center gap-2.5 shrink-0"
                style={{ fontFamily: I, fontSize: "11px", fontWeight: 600, letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(6,182,212,0.85)", background: "rgba(6,182,212,0.07)", border: "1px solid rgba(6,182,212,0.25)", padding: "10px 20px", borderRadius: "8px", transition: "all 0.22s ease" }}
                onMouseEnter={e => { const el = e.currentTarget as HTMLAnchorElement; el.style.background = "rgba(6,182,212,0.14)"; el.style.borderColor = "rgba(6,182,212,0.48)"; el.style.color = "rgba(6,182,212,1)"; }}
                onMouseLeave={e => { const el = e.currentTarget as HTMLAnchorElement; el.style.background = "rgba(6,182,212,0.07)"; el.style.borderColor = "rgba(6,182,212,0.25)"; el.style.color = "rgba(6,182,212,0.85)"; }}
              >
                Browse verified tickets
                <ArrowRight className="group-hover:translate-x-0.5 transition-transform duration-300" style={{ width: "12px", height: "12px" }} />
              </Link>
              <Link href="/about"
                style={{ fontFamily: I, fontSize: "11px", letterSpacing: "0.16em", textTransform: "uppercase", color: "rgba(237,233,225,0.28)", transition: "color 0.25s ease" }}
                onMouseEnter={e => (e.currentTarget.style.color = "rgba(237,233,225,0.58)")}
                onMouseLeave={e => (e.currentTarget.style.color = "rgba(237,233,225,0.28)")}
              >
                About us
              </Link>
            </div>
          </motion.div>

          {/* Right: ticket pass */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, delay: 0.18, ease: [0.16, 1, 0.3, 1] }}
          >
            <VerifiedPass />
          </motion.div>
        </div>

        {/* ── Bottom: verification process ─────────── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="mt-12 pt-10"
          style={{ borderTop: "1px solid rgba(237,233,225,0.07)" }}
        >
          <p style={{ fontFamily: I, fontSize: "9.5px", fontWeight: 600, letterSpacing: "0.26em", textTransform: "uppercase", color: "rgba(6,182,212,0.50)", marginBottom: "2rem", textAlign: "center" }}>
            How verification works
          </p>

          {/* Steps — horizontal desktop, vertical mobile */}
          <div className="relative">

            {/* Desktop rail */}
            <motion.div
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.4, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="hidden md:block"
              style={{ position: "absolute", top: "14px", left: "calc(100%/6)", right: "calc(100%/6)", height: "1px", background: "linear-gradient(to right, rgba(6,182,212,0.28), rgba(6,182,212,0.12), rgba(6,182,212,0.28))", transformOrigin: "left", zIndex: 0 }}
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-6">
              {STEPS.map((step, i) => (
                <div key={step.num} className="flex md:flex-col gap-4 md:gap-0 items-start md:items-center">

                  {/* Mobile: node + vertical line */}
                  <div className="flex md:hidden flex-col items-center shrink-0" style={{ width: "28px" }}>
                    <div style={{ width: "28px", height: "28px", borderRadius: "50%", border: "1.5px solid rgba(6,182,212,0.40)", background: "rgba(6,182,212,0.08)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, position: "relative", zIndex: 1 }}>
                      <span style={{ fontFamily: I, fontSize: "10px", fontWeight: 700, color: "rgba(6,182,212,0.80)" }}>{step.num}</span>
                    </div>
                    {i < STEPS.length - 1 && <div style={{ width: "1px", flex: 1, minHeight: "2rem", margin: "4px 0", background: "linear-gradient(to bottom, rgba(6,182,212,0.20), rgba(6,182,212,0.04))" }} />}
                  </div>

                  {/* Desktop: node centred */}
                  <div className="hidden md:flex flex-col items-center mb-5 relative z-10">
                    <div style={{ width: "28px", height: "28px", borderRadius: "50%", border: "1.5px solid rgba(6,182,212,0.40)", background: "rgba(6,182,212,0.08)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <span style={{ fontFamily: I, fontSize: "10px", fontWeight: 700, color: "rgba(6,182,212,0.80)" }}>{step.num}</span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="md:text-center flex-1" style={{ paddingBottom: "0", paddingTop: "3px" }}>
                    <h4 style={{ fontFamily: I, fontWeight: 700, fontSize: "0.9375rem", color: "rgba(237,233,225,0.92)", marginBottom: "0.375rem", lineHeight: 1.2 }}>
                      {step.title}
                    </h4>
                    <p style={{ fontFamily: I, fontSize: "0.8125rem", lineHeight: 1.7, color: "rgba(161,161,170,0.58)", margin: 0 }}>
                      {step.body}
                    </p>
                  </div>

                </div>
              ))}
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
