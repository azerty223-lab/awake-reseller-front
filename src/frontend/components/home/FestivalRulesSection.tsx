"use client";

import { motion } from "framer-motion";
import {
  LogOut, Smartphone, CreditCard,
  ShieldAlert, Clock, Camera,
} from "lucide-react";
import { LineReveal } from "@/frontend/components/ui/LineReveal";

/* ── Rules data ─────────────────────────────────────────────────── */
// critical:true → stronger icon/rail/title; false → quieter treatment
const RULES = [
  {
    index:    "01",
    Icon:     LogOut,
    title:    "No Re-Entry",
    body:     "Once you leave the festival site, re-entry is not permitted. Plan your day before exiting.",
    critical: true,
  },
  {
    index:    "02",
    Icon:     Smartphone,
    title:    "Digital Ticket Only",
    body:     "Paper printouts are not accepted. Present your personalised e-ticket on a charged phone at full brightness.",
    critical: true,
  },
  {
    index:    "03",
    Icon:     CreditCard,
    title:    "Photo ID Required",
    body:     "Your government-issued ID must match the name on your ticket. Mismatches may result in denied entry.",
    critical: true,
  },
  {
    index:    "04",
    Icon:     ShieldAlert,
    title:    "Official Transfers Only",
    body:     "Reselling outside the official process invalidates the original ticket. Use the authorised transfer flow only.",
    critical: true,
  },
  {
    index:    "05",
    Icon:     Clock,
    title:    "Entry Timing",
    body:     "Gates open 30 minutes before the first act. Late arrivals are admitted until 23:00 on Friday and Saturday.",
    critical: false,
  },
  {
    index:    "06",
    Icon:     Camera,
    title:    "Personal Photography",
    body:     "Personal photography is welcome. Professional or commercial recording equipment requires advance accreditation.",
    critical: false,
  },
];

const I = "var(--font-inter, Inter, system-ui, sans-serif)";
const TOTAL = RULES.length;

/* ── Rule row ────────────────────────────────────────────────────── */
// Critical rules get cyan icon/rail/title; secondary rules are quieter.
// Left border acts as a persistent accent rail at rest — no hover-only tricks.
function RuleRow({ rule, idx }: { rule: typeof RULES[0]; idx: number }) {
  // Remove bottom divider on the last two items (bottom row in 2-col grid)
  const isLastRow   = idx >= TOTAL - 2;
  const isCritical  = rule.critical;

  const railColor   = isCritical ? "rgba(6,182,212,0.40)"  : "rgba(237,233,225,0.07)";
  const iconBg      = isCritical ? "rgba(6,182,212,0.08)"  : "rgba(237,233,225,0.03)";
  const iconBorder  = isCritical ? "rgba(6,182,212,0.18)"  : "rgba(237,233,225,0.06)";
  const iconColor   = isCritical ? "rgba(6,182,212,0.80)"  : "rgba(237,233,225,0.22)";
  const indexColor  = isCritical ? "rgba(6,182,212,0.55)"  : "rgba(237,233,225,0.20)";
  const titleColor  = isCritical ? "rgba(237,233,225,0.95)": "rgba(237,233,225,0.48)";
  const bodyColor   = isCritical ? "rgba(161,161,170,0.82)": "rgba(161,161,170,0.42)";

  return (
    <motion.div
      initial={{ opacity: 0, x: idx % 2 === 0 ? -14 : 14 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "0px 0px -30px 0px" }}
      transition={{ duration: 0.55, delay: Math.floor(idx / 2) * 0.08, ease: [0.16, 1, 0.3, 1] }}
      style={{
        display:     "flex",
        alignItems:  "flex-start",
        gap:         "14px",
        padding:     "1.25rem 0 1.25rem 14px",
        borderLeft:  `2px solid ${railColor}`,
        borderBottom: isLastRow ? "none" : "1px solid rgba(237,233,225,0.05)",
        transition:  "border-left-color 0.3s ease",
      }}
    >
      {/* Icon node */}
      <div style={{
        width:          "32px",
        height:         "32px",
        borderRadius:   "8px",
        background:     iconBg,
        border:         `1px solid ${iconBorder}`,
        display:        "flex",
        alignItems:     "center",
        justifyContent: "center",
        flexShrink:     0,
        marginTop:      "1px",
      }}>
        <rule.Icon
          style={{ width: "14px", height: "14px", color: iconColor }}
          strokeWidth={1.75}
          aria-hidden="true"
        />
      </div>

      {/* Content */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: "8px", marginBottom: "4px" }}>
          <span style={{
            fontFamily:    I,
            fontSize:      "9.5px",
            letterSpacing: "0.26em",
            textTransform: "uppercase",
            color:         indexColor,
            flexShrink:    0,
          }}>
            {rule.index}
          </span>
          <h3 style={{
            fontFamily:  I,
            fontWeight:  700,
            fontSize:    "0.9375rem",
            lineHeight:  1.2,
            color:       titleColor,
          }}>
            {rule.title}
          </h3>
        </div>
        <p style={{
          fontFamily: I,
          fontSize:   "0.8125rem",
          lineHeight: 1.7,
          color:      bodyColor,
        }}>
          {rule.body}
        </p>
      </div>
    </motion.div>
  );
}

/* ── Section ─────────────────────────────────────────────────────── */
export function FestivalRulesSection() {
  return (
    <section className="relative py-5 overflow-hidden">
      <div className="max-w-5xl mx-auto px-6 sm:px-12 lg:px-20">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9 }}
          className="mb-8"
        >
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "0.75rem" }}>
            <span style={{ width: "16px", height: "1px", background: "rgba(6,182,212,0.45)", flexShrink: 0 }} />
            <span style={{ fontFamily: I, fontSize: "0.9375rem", fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: "rgba(237,233,225,0.82)" }}>
              Important
            </span>
          </div>
          <h2
            className="font-[var(--font-playfair)] font-black text-white"
            style={{ fontSize: "clamp(2rem, 4.5vw, 3.25rem)", letterSpacing: "-0.025em", lineHeight: 0.92, marginBottom: "0.875rem" }}
          >
            <LineReveal>Festival</LineReveal>
            <LineReveal delay={0.09}>rules</LineReveal>
          </h2>
          {/* Supporting line — provides immediate context */}
          <p style={{ fontFamily: I, fontSize: "0.9375rem", color: "rgba(161,161,170,0.55)", lineHeight: 1.5 }}>
            Entry rules and ticket conditions to know before arrival.
          </p>
        </motion.div>

        {/* Policy board — 2 cols desktop, 1 col mobile */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-0">
          {RULES.map((rule, i) => (
            <RuleRow key={rule.index} rule={rule} idx={i} />
          ))}
        </div>

        {/* Footer note — separated with a thin rule */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.25 }}
          style={{
            fontFamily:    I,
            fontSize:      "12px",
            color:         "rgba(237,233,225,0.20)",
            marginTop:     "1.5rem",
            paddingTop:    "1.25rem",
            borderTop:     "1px solid rgba(237,233,225,0.06)",
            letterSpacing: "0.01em",
          }}
        >
          Full festival regulations are available at awakenings.com. Rules are subject to change without notice.
        </motion.p>

      </div>
    </section>
  );
}
