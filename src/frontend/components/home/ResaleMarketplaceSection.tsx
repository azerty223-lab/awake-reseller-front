"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { LineReveal } from "@/frontend/components/ui/LineReveal";
import { Reveal } from "@/frontend/components/ui/Reveal";

const STATS = [
  { value: "100%",     label: "Tickets\nauthenticated" },
  { value: "3–5",      label: "Business days\ndelivery" },
  { value: "< 4h",     label: "Support\nresponse" },
  { value: "Official", label: "Name transfer\nprocess" },
];

const VERIFICATION = [
  {
    index: "01",
    title: "Name Transfer",
    body:  "After your purchase, we personally handle the official name-change process through Awakenings' transfer system — your ticket arrives personalised and ready for entry.",
  },
  {
    index: "02",
    title: "Fraud Protection",
    body:  "Duplicate detection and real-time validation prevent counterfeit tickets from ever reaching buyers. Every sale is backed by our guarantee.",
  },
];

const INTER = "var(--font-inter, Inter, system-ui, sans-serif)";

export function ResaleMarketplaceSection() {
  return (
    <section className="relative py-5 overflow-hidden">

      <div className="max-w-5xl mx-auto px-6 sm:px-12 lg:px-20">

        {/* Header + opening statement */}
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-start mb-5">

          {/* Left */}
          <div>
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.9 }}
              style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "0.75rem" }}
            >
              <span style={{ width: "16px", height: "1px", background: "rgba(184,146,58,0.45)", flexShrink: 0 }} />
              <span style={{ fontFamily: INTER, fontSize: "0.9375rem", fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: "rgba(237,233,225,0.82)" }}>
                Verified Resale
              </span>
            </motion.div>

            <h2
              className="font-[var(--font-playfair)] font-black text-white"
              style={{ fontSize: "clamp(2rem, 4.5vw, 3.25rem)", letterSpacing: "-0.03em", lineHeight: 0.92, marginBottom: "1.75rem" }}
            >
              <LineReveal>Buy with</LineReveal>
              <LineReveal delay={0.09}>certainty</LineReveal>
            </h2>

            <motion.p
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.9, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              style={{ fontFamily: INTER, fontSize: "1rem", lineHeight: 1.8, color: "rgba(161,161,170,1)", marginBottom: "2.25rem" }}
            >
              Every ticket on this platform has been verified against the official
              Awakenings registry. We handle the name transfer ourselves — so your
              ticket is personalized, valid, and ready for entry.
            </motion.p>

          </div>

          {/* Right: stats grid */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1.0, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="grid grid-cols-2" style={{ gap: "1px", background: "rgba(237,233,225,0.07)" }}>
              {STATS.map((stat, i) => (
                <motion.div
                  key={stat.label}
                  className="bg-[#050507]"
                  style={{ padding: "clamp(1.5rem, 3vw, 2rem)" }}
                  initial={{ scale: 0.88, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.55, delay: 0.1 + i * 0.09, type: "spring", stiffness: 180, damping: 22 }}
                >
                  <div
                    className="font-[var(--font-playfair)] font-black text-white"
                    style={{ fontSize: "clamp(1.75rem, 3.5vw, 2.75rem)", letterSpacing: "-0.03em", lineHeight: 1, marginBottom: "0.625rem" }}
                  >
                    {stat.value}
                  </div>
                  <p style={{
                    fontFamily:    INTER,
                    fontSize:      "11px",
                    letterSpacing: "0.14em",
                    textTransform: "uppercase",
                    color:         "rgba(161,161,170,0.55)",
                    whiteSpace:    "pre-line",
                    lineHeight:    1.5,
                  }}>
                    {stat.label}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Verification process */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          style={{ marginBottom: "1.5rem" }}
        >
          <span style={{ fontFamily: INTER, fontSize: "11px", letterSpacing: "0.28em", textTransform: "uppercase", color: "rgba(237,233,225,0.30)" }}>
            How verification works
          </span>
        </motion.div>

        <div>
          {VERIFICATION.map((step, i) => (
            <Reveal key={step.index} delay={0.06 + i * 0.10} direction={i % 2 === 0 ? "left" : "right"}>
              <div className="group relative border-t border-white/[0.06] py-8 sm:py-10 hover:border-white/[0.10] transition-colors duration-500">
                <div className="absolute bottom-0 left-0 h-px w-0 group-hover:w-full transition-all duration-700"
                     style={{ background: "rgba(184,146,58,0.15)" }} />
                <div className="grid grid-cols-[3.5rem_1fr] sm:grid-cols-[5rem_1fr] gap-6 sm:gap-10 items-start">
                  <span style={{ fontFamily: INTER, fontSize: "11px", letterSpacing: "0.28em", textTransform: "uppercase", color: "rgba(184,146,58,0.65)", paddingTop: "4px" }}>
                    {step.index}
                  </span>
                  <div>
                    <h3
                      className="font-[var(--font-playfair)] font-black text-white"
                      style={{ fontSize: "clamp(1.1rem, 2.2vw, 1.5rem)", letterSpacing: "-0.02em", lineHeight: 1.1, marginBottom: "0.75rem" }}
                    >
                      {step.title}
                    </h3>
                    <p style={{ fontFamily: INTER, fontSize: "0.9375rem", lineHeight: 1.75, color: "rgba(161,161,170,1)" }}>
                      {step.body}
                    </p>
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
          <div className="border-t border-white/[0.06]" />
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          style={{ marginTop: "2rem", display: "flex", alignItems: "center", gap: "2rem", flexWrap: "wrap" }}
        >
          <Link
            href="/tickets"
            className="group inline-flex items-center gap-3"
            style={{ fontFamily: INTER, fontSize: "13px", fontWeight: 500, letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(237,233,225,0.75)", transition: "color 0.3s ease" }}
            onMouseEnter={e => (e.currentTarget.style.color = "rgba(237,233,225,1)")}
            onMouseLeave={e => (e.currentTarget.style.color = "rgba(237,233,225,0.75)")}
          >
            Browse verified tickets
            <ArrowRight className="group-hover:translate-x-0.5 transition-transform duration-300" style={{ width: "13px", height: "13px" }} />
          </Link>
          <Link
            href="/about"
            style={{ fontFamily: INTER, fontSize: "13px", letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(237,233,225,0.35)", transition: "color 0.3s ease" }}
            onMouseEnter={e => (e.currentTarget.style.color = "rgba(237,233,225,0.60)")}
            onMouseLeave={e => (e.currentTarget.style.color = "rgba(237,233,225,0.35)")}
          >
            About us
          </Link>
        </motion.div>

      </div>
    </section>
  );
}
