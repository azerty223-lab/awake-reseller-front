"use client";

import { motion } from "framer-motion";
import { LineReveal } from "@/frontend/components/ui/LineReveal";
import { Reveal } from "@/frontend/components/ui/Reveal";

const RULES = [
  {
    index:    "01",
    title:    "No Re-Entry",
    body:     "Once you exit the festival site, re-admission is not permitted under any circumstance. Plan your schedule accordingly.",
  },
  {
    index:    "02",
    title:    "Digital Ticket Only",
    body:     "Paper printouts are not accepted at the gate. Present your personalised e-ticket on a fully charged device at maximum screen brightness.",
  },
  {
    index:    "03",
    title:    "Photo ID Required",
    body:     "Your government-issued ID must match the name printed on your ticket. Mismatches result in denied entry without exception.",
  },
  {
    index:    "04",
    title:    "Resale Invalidates Tickets",
    body:     "Reselling a ticket purchased through this platform will invalidate the original. All transfers are handled officially through our process.",
  },
  {
    index:    "05",
    title:    "Festival Entry Timing",
    body:     "Gate access opens 30 minutes before the first act on each day. Late arrivals are admitted until 23:00 on Friday and Saturday.",
  },
  {
    index:    "06",
    title:    "Personal Photography",
    body:     "Personal photography is permitted for festival-goers. Professional or commercial recording equipment requires advance accreditation.",
  },
];

const INTER = "var(--font-inter, Inter, system-ui, sans-serif)";

export function FestivalRulesSection() {
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
          className="mb-6"
        >
          <div style={{ display: "flex", alignItems: "center", gap: "14px", marginBottom: "0.75rem" }}>
            <span style={{ width: "16px", height: "1px", background: "rgba(184,146,58,0.45)", flexShrink: 0 }} />
            <span style={{ fontFamily: INTER, fontSize: "0.9375rem", fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: "rgba(237,233,225,0.82)" }}>
              Important
            </span>
          </div>
          <h2
            className="font-[var(--font-playfair)] font-black text-white"
            style={{ fontSize: "clamp(2.5rem, 5.5vw, 4.25rem)", letterSpacing: "-0.03em", lineHeight: 0.92 }}
          >
            <LineReveal>Festival</LineReveal>
            <LineReveal delay={0.09}>rules</LineReveal>
          </h2>
        </motion.div>

        {/* Rules â€” two-column grid of editorial rows */}
        <div className="grid grid-cols-1 lg:grid-cols-2" style={{ gap: "1px", background: "rgba(237,233,225,0.05)" }}>
          {RULES.map((rule, i) => (
            <Reveal key={rule.index} delay={0.04 + i * 0.05} direction="left" className="bg-[#050507] h-full">
              <div
                className="bg-[#050507] group relative hover:bg-white/[0.015] transition-colors duration-500"
                style={{ padding: "clamp(1.75rem, 3.5vw, 2.5rem)" }}
              >
                {/* Left accent on hover */}
                <div className="absolute left-0 top-0 bottom-0 w-px bg-[#B8923A]/0 group-hover:bg-[#B8923A]/30 transition-colors duration-500" />

                {/* Index + title row */}
                <div style={{ display: "flex", alignItems: "baseline", gap: "1rem", marginBottom: "0.875rem" }}>
                  <span style={{
                    fontFamily:    INTER,
                    fontSize:      "10px",
                    letterSpacing: "0.30em",
                    textTransform: "uppercase",
                    color:         "rgba(184,146,58,0.55)",
                    flexShrink:    0,
                  }}>
                    {rule.index}
                  </span>
                  <h3
                    className="font-[var(--font-playfair)] font-black text-white"
                    style={{ fontSize: "clamp(1.1rem, 2vw, 1.375rem)", letterSpacing: "-0.015em", lineHeight: 1.1 }}
                  >
                    {rule.title}
                  </h3>
                </div>

                {/* Body */}
                <p style={{
                  fontFamily:  INTER,
                  fontSize:    "0.9375rem",
                  lineHeight:  1.75,
                  color:       "rgba(161,161,170,0.90)",
                  paddingLeft: "calc(10px + 1rem)",
                }}>
                  {rule.body}
                </p>
              </div>
            </Reveal>
          ))}
        </div>

        {/* Closing note */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.25 }}
          style={{
            fontFamily:   INTER,
            fontSize:     "12px",
            color:        "rgba(237,233,225,0.25)",
            marginTop:    "1.25rem",
            letterSpacing: "0.02em",
          }}
        >
          Full festival regulations are available at awakenings.com. Rules are subject to change without notice.
        </motion.p>

      </div>
    </section>
  );
}

