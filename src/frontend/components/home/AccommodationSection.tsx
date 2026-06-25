"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { LineReveal } from "@/frontend/components/ui/LineReveal";

const TIERS = [
  {
    id:          "grand",
    index:       "01",
    label:       "Outdoor",
    title:       "Grand Camping",
    description: "Dedicated campsite adjacent to the festival grounds. Shared facilities, 24-hour security, and full power access points.",
    details: [
      { label: "Site type",   value: "Personal tent space" },
      { label: "Facilities",  value: "Shared showers + WC" },
      { label: "Access",      value: "Festival + camping wristband" },
      { label: "Duration",    value: "Thu – Mon" },
    ],
    note:       "BYO tent",
    featured:   false,
  },
  {
    id:          "comfort",
    index:       "02",
    label:       "Equipped",
    title:       "Comfort Camping",
    description: "Pre-pitched bell tents with camping beds, bedding, electricity, and a dedicated lounge area. Everything set up before you arrive.",
    details: [
      { label: "Tent type",   value: "Pre-pitched bell tent" },
      { label: "Included",    value: "Beds, bedding, electricity" },
      { label: "Facilities",  value: "Upgraded shower block" },
      { label: "Duration",    value: "Fri – Mon" },
    ],
    note:       "Most popular",
    featured:   true,
  },
  {
    id:          "resort",
    index:       "03",
    label:       "Luxury",
    title:       "Relax Resort",
    description: "Private glamping pods with ensuite facilities, air conditioning, and a dedicated concierge. The most refined way to be at Awakenings.",
    details: [
      { label: "Unit type",   value: "Private glamping pod" },
      { label: "Facilities",  value: "Private shower + WC, A/C" },
      { label: "Included",    value: "Concierge, welcome package" },
      { label: "Duration",    value: "Fri – Mon" },
    ],
    note:       "Limited availability",
    featured:   false,
  },
];

const INTER = "var(--font-inter, Inter, system-ui, sans-serif)";
const CYAN  = "rgba(6,182,212,";

export function AccommodationSection() {
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
            <span style={{ width: "16px", height: "1px", background: `${CYAN}0.45)`, flexShrink: 0 }} />
            <span style={{ fontFamily: INTER, fontSize: "0.9375rem", fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: "rgba(237,233,225,0.82)" }}>
              Camping & Resort
            </span>
          </div>
          <h2
            className="font-[var(--font-playfair)] font-black text-white"
            style={{ fontSize: "clamp(2rem, 4.5vw, 3.25rem)", letterSpacing: "-0.025em", lineHeight: 0.92 }}
          >
            <LineReveal>Stay on-site.</LineReveal>
            <LineReveal delay={0.09}>
              <span style={{ color: "rgba(237,233,225,0.45)" }}>Three tiers.</span>
            </LineReveal>
          </h2>
        </motion.div>

        {/* ── 3-column tier cards ──────────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {TIERS.map((tier, i) => (
            <motion.div
              key={tier.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "0px 0px -40px 0px" }}
              transition={{ duration: 0.7, delay: i * 0.10, ease: [0.16, 1, 0.3, 1] }}
            >
              <div
                className="flex flex-col h-full relative overflow-hidden"
                style={{
                  borderRadius:  "18px",
                  border:        tier.featured
                    ? `1.5px solid ${CYAN}0.45)`
                    : "1px solid rgba(237,233,225,0.09)",
                  background:    tier.featured
                    ? `linear-gradient(160deg, ${CYAN}0.07) 0%, #0c0a0e 40%)`
                    : "linear-gradient(160deg, rgba(237,233,225,0.02) 0%, #0a090d 50%)",
                  boxShadow:     tier.featured
                    ? `0 0 0 1px ${CYAN}0.10), 0 0 40px ${CYAN}0.08), 0 24px 60px rgba(0,0,0,0.70)`
                    : "0 8px 32px rgba(0,0,0,0.45)",
                  padding:       "1.75rem",
                }}
              >
                {/* Featured top accent line */}
                {tier.featured && (
                  <div style={{
                    position:   "absolute",
                    top: 0, left: 0, right: 0,
                    height:     "2px",
                    background: `linear-gradient(90deg, transparent, ${CYAN}0.80) 30%, ${CYAN}0.80) 70%, transparent)`,
                    borderRadius: "18px 18px 0 0",
                  }} />
                )}

                {/* Index + label */}
                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "1.25rem" }}>
                  <span style={{
                    fontFamily:    INTER,
                    fontSize:      "10px",
                    fontWeight:    600,
                    letterSpacing: "0.28em",
                    textTransform: "uppercase",
                    color:         tier.featured ? `${CYAN}0.75)` : "rgba(237,233,225,0.30)",
                  }}>
                    {tier.index}
                  </span>
                  <div style={{ width: "18px", height: "1px", background: "rgba(237,233,225,0.10)" }} />
                  <span style={{
                    fontFamily:    INTER,
                    fontSize:      "10px",
                    fontWeight:    500,
                    letterSpacing: "0.20em",
                    textTransform: "uppercase",
                    color:         tier.featured ? `${CYAN}0.60)` : "rgba(237,233,225,0.25)",
                  }}>
                    {tier.label}
                  </span>
                </div>

                {/* Title */}
                <h3 style={{
                  fontFamily:    INTER,
                  fontWeight:    800,
                  fontSize:      "clamp(1rem, 2vw, 1.1875rem)",
                  letterSpacing: "0.04em",
                  textTransform: "uppercase",
                  lineHeight:    1.15,
                  color:         "rgba(237,233,225,0.95)",
                  marginBottom:  "0.875rem",
                }}>
                  {tier.title}
                </h3>

                {/* Description */}
                <p style={{
                  fontFamily:   INTER,
                  fontSize:     "0.875rem",
                  lineHeight:   1.75,
                  color:        "rgba(161,161,170,0.85)",
                  marginBottom: "1.5rem",
                  flex:         1,
                }}>
                  {tier.description}
                </p>

                {/* Divider */}
                <div style={{ width: "100%", height: "1px", background: "rgba(237,233,225,0.07)", marginBottom: "1.25rem" }} />

                {/* Detail rows */}
                <div style={{ marginBottom: "1.5rem" }}>
                  {tier.details.map(({ label, value }) => (
                    <div key={label} style={{
                      display:        "flex",
                      justifyContent: "space-between",
                      alignItems:     "baseline",
                      padding:        "0.5rem 0",
                      borderBottom:   "1px solid rgba(237,233,225,0.05)",
                    }}>
                      <span style={{
                        fontFamily:    INTER,
                        fontSize:      "10px",
                        fontWeight:    500,
                        letterSpacing: "0.18em",
                        textTransform: "uppercase",
                        color:         "rgba(161,161,170,0.45)",
                        flexShrink:    0,
                      }}>
                        {label}
                      </span>
                      <span style={{
                        fontFamily:  INTER,
                        fontSize:    "0.8125rem",
                        fontWeight:  400,
                        color:       "rgba(237,233,225,0.80)",
                        textAlign:   "right",
                        marginLeft:  "0.5rem",
                        lineHeight:  1.4,
                      }}>
                        {value}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Footer: note + CTA */}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "auto" }}>
                  <span style={{
                    fontFamily:    INTER,
                    fontSize:      "9px",
                    fontWeight:    tier.featured ? 700 : 400,
                    letterSpacing: "0.24em",
                    textTransform: "uppercase",
                    color:         tier.featured ? `${CYAN}0.70)` : "rgba(237,233,225,0.28)",
                    padding:       tier.featured ? "3px 10px 3px 0" : "0",
                  }}>
                    {tier.note}
                  </span>
                  <Link
                    href="/tickets"
                    className="group/cta inline-flex items-center gap-1.5"
                    style={{
                      fontFamily:    INTER,
                      fontSize:      "10px",
                      fontWeight:    500,
                      letterSpacing: "0.20em",
                      textTransform: "uppercase",
                      color:         tier.featured ? `${CYAN}0.75)` : "rgba(237,233,225,0.40)",
                      transition:    "color 0.3s ease",
                    }}
                    onMouseEnter={e => (e.currentTarget.style.color = `${CYAN}1.0)`)}
                    onMouseLeave={e => (e.currentTarget.style.color = tier.featured ? `${CYAN}0.75)` : "rgba(237,233,225,0.40)")}
                  >
                    View tickets
                    <ArrowRight
                      className="group-hover/cta:translate-x-0.5 transition-transform duration-300"
                      style={{ width: "10px", height: "10px" }}
                    />
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
