"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { LineReveal } from "@/frontend/components/ui/LineReveal";
import { Reveal } from "@/frontend/components/ui/Reveal";

const PASSES = [
  {
    id:          "weekend",
    label:       "Weekend Pass",
    title:       "3-Day Access",
    dates:       "July 10 — 12",
    description: "The complete Awakenings experience. Three days across all six stages — from the Friday evening opening through Sunday's closing ceremony.",
    includes: [
      "All 6+ stages",
      "Friday evening entry",
      "Saturday & Sunday full day",
      "Camping add-on available",
    ],
    note: "Recommended",
    accent: true,
  },
  {
    id:          "saturday",
    label:       "Saturday",
    title:       "Day Access",
    dates:       "July 11",
    description: "The peak day. Maximum capacity with headline acts running across every stage simultaneously.",
    includes: [
      "All active stages",
      "13:00 — 01:00",
      "Day wristband included",
    ],
    note: null,
    accent: false,
  },
  {
    id:          "sunday",
    label:       "Sunday",
    title:       "Day Access",
    dates:       "July 12",
    description: "The closing day. Charlotte de Witte, Richie Hawtin, and the ceremonial final hours of the festival.",
    includes: [
      "All active stages",
      "13:00 — 23:00",
      "Day wristband included",
    ],
    note: "Closing ceremony",
    accent: false,
  },
];

const INTER = "var(--font-inter, Inter, system-ui, sans-serif)";

export function FestivalAccessSection() {
  return (
    <section className="relative py-24 sm:py-36 overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/[0.07] to-transparent" />

      <div className="max-w-5xl mx-auto px-6 sm:px-12 lg:px-20">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9 }}
          className="mb-14 sm:mb-18"
        >
          <div style={{ display: "flex", alignItems: "center", gap: "14px", marginBottom: "clamp(1.5rem, 3vw, 2.5rem)" }}>
            <span style={{ width: "16px", height: "1px", background: "rgba(184,146,58,0.45)", flexShrink: 0 }} />
            <span style={{ fontFamily: INTER, fontSize: "11px", fontWeight: 400, letterSpacing: "0.28em", textTransform: "uppercase", color: "rgba(237,233,225,0.50)" }}>
              Festival Access
            </span>
          </div>
          <h2
            className="font-[var(--font-playfair)] font-black text-white"
            style={{ fontSize: "clamp(2.5rem, 5.5vw, 4.25rem)", letterSpacing: "-0.03em", lineHeight: 0.92 }}
          >
            <LineReveal>Choose your</LineReveal>
            <LineReveal delay={0.09}>access</LineReveal>
          </h2>
        </motion.div>

        {/* 1px gap grid — the gap background creates hairline dividers */}
        <div
          className="grid grid-cols-1 md:grid-cols-3"
          style={{ gap: "1px", background: "rgba(237,233,225,0.07)" }}
        >
          {PASSES.map((pass, i) => (
            <Reveal key={pass.id} delay={i * 0.08}>
              <div
                className="flex flex-col bg-[#050507] hover:bg-white/[0.015] transition-colors duration-500"
                style={{ padding: "clamp(2rem, 4vw, 2.75rem)", minHeight: "clamp(360px, 45vw, 480px)" }}
              >
                {/* Top accent */}
                <div style={{
                  height:     "1px",
                  width:      pass.accent ? "48px" : "22px",
                  background: pass.accent ? "rgba(184,146,58,0.65)" : "rgba(237,233,225,0.18)",
                  marginBottom: "2rem",
                }} />

                {/* Label */}
                <span style={{
                  fontFamily:    INTER,
                  fontSize:      "10px",
                  fontWeight:    400,
                  letterSpacing: "0.30em",
                  textTransform: "uppercase",
                  color:         pass.accent ? "rgba(184,146,58,0.65)" : "rgba(237,233,225,0.35)",
                  display:       "block",
                  marginBottom:  "0.625rem",
                }}>
                  {pass.label}
                </span>

                {/* Title */}
                <h3
                  className="font-[var(--font-playfair)] font-black text-white"
                  style={{ fontSize: "clamp(1.625rem, 3.2vw, 2.25rem)", letterSpacing: "-0.025em", lineHeight: 1, marginBottom: "0.5rem" }}
                >
                  {pass.title}
                </h3>

                {/* Date */}
                <span style={{
                  fontFamily:    INTER,
                  fontSize:      "11px",
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                  color:         "rgba(237,233,225,0.35)",
                  display:       "block",
                  marginBottom:  "1.5rem",
                }}>
                  {pass.dates}
                </span>

                {/* Thin divider */}
                <div style={{ width: "100%", height: "1px", background: "rgba(237,233,225,0.05)", marginBottom: "1.5rem" }} />

                {/* Description */}
                <p style={{
                  fontFamily:   INTER,
                  fontSize:     "0.9375rem",
                  lineHeight:   1.75,
                  color:        "rgba(161,161,170,0.90)",
                  marginBottom: "1.75rem",
                  flex:         1,
                }}>
                  {pass.description}
                </p>

                {/* Feature list */}
                <ul style={{ listStyle: "none", padding: 0, margin: 0, marginBottom: "2rem" }}>
                  {pass.includes.map((feat) => (
                    <li key={feat} style={{
                      display:      "flex",
                      alignItems:   "baseline",
                      gap:          "0.75rem",
                      paddingBottom: "0.45rem",
                      fontFamily:   INTER,
                      fontSize:     "13px",
                      color:        "rgba(237,233,225,0.55)",
                    }}>
                      <span style={{ color: "rgba(184,146,58,0.50)", flexShrink: 0 }}>—</span>
                      {feat}
                    </li>
                  ))}
                </ul>

                {/* Footer: note + link */}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "auto" }}>
                  {pass.note && (
                    <span style={{
                      fontFamily:    INTER,
                      fontSize:      "10px",
                      letterSpacing: "0.22em",
                      textTransform: "uppercase",
                      color:         "rgba(184,146,58,0.50)",
                    }}>
                      {pass.note}
                    </span>
                  )}
                  <Link
                    href="/tickets"
                    className="group/lnk inline-flex items-center gap-2 ml-auto"
                    style={{
                      fontFamily:    INTER,
                      fontSize:      "11px",
                      letterSpacing: "0.20em",
                      textTransform: "uppercase",
                      color:         "rgba(237,233,225,0.40)",
                      transition:    "color 0.3s ease",
                    }}
                    onMouseEnter={e => (e.currentTarget.style.color = "rgba(184,146,58,0.80)")}
                    onMouseLeave={e => (e.currentTarget.style.color = "rgba(237,233,225,0.40)")}
                  >
                    Browse
                    <ArrowRight
                      className="group-hover/lnk:translate-x-0.5 transition-transform duration-300"
                      style={{ width: "11px", height: "11px" }}
                    />
                  </Link>
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        {/* Footnote */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.25 }}
          style={{ fontFamily: INTER, fontSize: "12px", color: "rgba(237,233,225,0.25)", marginTop: "1.25rem", letterSpacing: "0.02em" }}
        >
          Camping tickets sold separately and must be paired with a festival pass.
        </motion.p>

      </div>
    </section>
  );
}
