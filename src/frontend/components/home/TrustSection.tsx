"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { LineReveal } from "@/frontend/components/ui/LineReveal";
import { Reveal } from "@/frontend/components/ui/Reveal";

const features = [
  {
    num: "01",
    title:  "Fully Verified",
    body:   "Every ticket is authenticated against the official Awakenings registry before appearing on the platform.",
    detail: "Zero-risk guarantee",
  },
  {
    num: "02",
    title:  "Secured-Payment Checkout",
    body:   "Payments processed by Stripe â€” the same infrastructure trusted by Shopify, Amazon, and Uber.",
    detail: "PCI DSS Level 1",
  },
  {
    num: "03",
    title:  "Name Transfer Included",
    body:   "We handle the full personalization process. Your ticket arrives in your name, ready for entry.",
    detail: "Within 24h of payment",
  },
  {
    num: "04",
    title:  "Human Support",
    body:   "Real people, real answers. Reach us via email or the contact form â€” response within 4 hours.",
    detail: "9:00â€“22:00 CET",
  },
];

const INTER = "var(--font-inter, Inter, system-ui, sans-serif)";

export function TrustSection() {
  return (
    <section className="relative py-5 overflow-hidden bg-transparent">

      <div className="max-w-5xl mx-auto px-6 sm:px-12 lg:px-20">
        <div className="grid lg:grid-cols-[1fr_1.4fr] gap-16 lg:gap-24 items-start">

          {/* â”€â”€ Left: sticky heading â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
          <div className="lg:sticky lg:top-28">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.9 }}
              style={{ display: "flex", alignItems: "center", gap: "14px", marginBottom: "0.75rem" }}
            >
              <span style={{ width: "16px", height: "1px", background: "rgba(6,182,212,0.45)", flexShrink: 0 }} />
              <span style={{
                fontFamily:    INTER,
                fontSize:      "11px",
                fontWeight:    400,
                letterSpacing: "0.28em",
                textTransform: "uppercase",
                color:         "rgba(237,233,225,0.50)",
              }}>
                Why choose us
              </span>
            </motion.div>

            <h2
              className="font-[var(--font-playfair)] font-black text-white leading-[0.92] mb-8"
              style={{ fontSize: "clamp(2.25rem, 4.5vw, 3.5rem)", letterSpacing: "-0.03em" }}
            >
              <LineReveal>Buy with</LineReveal>
              <LineReveal delay={0.09}>
                <span style={{ color: "#06B6D4" }}>confidence</span>
              </LineReveal>
            </h2>

            <motion.p
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.9, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              style={{
                fontFamily: INTER,
                fontSize:   "clamp(0.875rem, 1.5vw, 1rem)",
                lineHeight: 1.85,
                color:      "rgba(161,161,170,1)",
                marginBottom: "2.25rem",
              }}
            >
              Every transaction feels safe, transparent, and fast. That was
              the single principle we built on.
            </motion.p>

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.35 }}
            >
              <Link
                href="/about"
                className="group inline-flex items-center gap-2"
                style={{
                  fontFamily:    INTER,
                  fontSize:      "12px",
                  fontWeight:    400,
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                  color:         "rgba(237,233,225,0.55)",
                  transition:    "color 0.4s ease",
                }}
                onMouseEnter={e => (e.currentTarget.style.color = "rgba(6,182,212,0.90)")}
                onMouseLeave={e => (e.currentTarget.style.color = "rgba(237,233,225,0.55)")}
              >
                Learn about us
                <ArrowRight
                  className="group-hover:translate-x-0.5 transition-transform duration-300"
                  style={{ width: "10px", height: "10px" }}
                />
              </Link>
            </motion.div>
          </div>

          {/* â”€â”€ Right: editorial feature rows â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
          <div>
            {features.map((f, i) => (
              <Reveal key={f.num} delay={0.05 + i * 0.08} direction="left">
                <div
                  className="group border-t border-white/[0.06] py-8 sm:py-10
                             hover:border-white/[0.12] transition-colors duration-500
                             relative"
                >
                  {/* Gold hover accent */}
                  <div className="absolute left-0 top-0 h-px w-0 group-hover:w-full
                                  transition-all duration-700"
                       style={{ background: "rgba(6,182,212,0.22)" }} />

                  <div className="grid grid-cols-[4rem_1fr] sm:grid-cols-[5rem_1fr] gap-6 items-start">

                    {/* Number */}
                    <span style={{
                      fontFamily:    INTER,
                      fontSize:      "11px",
                      fontWeight:    400,
                      letterSpacing: "0.28em",
                      textTransform: "uppercase",
                      color:         "rgba(6,182,212,0.70)",
                      display:       "block",
                      paddingTop:    "3px",
                    }}>
                      {f.num}
                    </span>

                    {/* Content */}
                    <div>
                      <div style={{ display: "flex", alignItems: "baseline", gap: "0.75rem", flexWrap: "wrap", marginBottom: "0.5rem" }}>
                        <h3
                          className="font-[var(--font-playfair)] font-black text-white"
                          style={{ fontSize: "clamp(1rem, 2vw, 1.25rem)", letterSpacing: "-0.015em" }}
                        >
                          {f.title}
                        </h3>
                        <span style={{
                          fontFamily:    INTER,
                          fontSize:      "10px",
                          fontWeight:    400,
                          letterSpacing: "0.20em",
                          textTransform: "uppercase",
                          color:         "rgba(6,182,212,0.65)",
                        }}>
                          {f.detail}
                        </span>
                      </div>
                      <p style={{
                        fontFamily: INTER,
                        fontSize:   "0.875rem",
                        lineHeight: 1.75,
                        color:      "rgba(113,113,122,1)",
                      }}>
                        {f.body}
                      </p>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
            <div className="border-t border-white/[0.06]" />
          </div>

        </div>
      </div>
    </section>
  );
}

