"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { LineReveal } from "@/frontend/components/ui/LineReveal";

/* ── Data ─────────────────────────────────────────────────────── */
const TIERS = [
  {
    id:          "grand",
    index:       "01",
    label:       "Outdoor",
    title:       "Grand Camping",
    description: "Dedicated campsite adjacent to the festival grounds with shared facilities, 24-hour security, and full power access points.",
    specs: [
      { key: "Site type",  val: "Personal tent space"         },
      { key: "Facilities", val: "Shared showers + WC"         },
      { key: "Access",     val: "Festival wristband"           },
      { key: "Duration",   val: "Thu check-in · Mon checkout"  },
    ],
    note:     "Bring your own tent",
    featured: false,
  },
  {
    id:          "comfort",
    index:       "02",
    label:       "Equipped",
    title:       "Comfort Camping",
    description: "Pre-pitched bell tents with proper beds, bedding, electricity, and a dedicated lounge area. Everything ready before you arrive.",
    specs: [
      { key: "Tent type",  val: "Pre-pitched bell tent"        },
      { key: "Included",   val: "Beds, bedding, electricity"   },
      { key: "Facilities", val: "Upgraded shower block"        },
      { key: "Duration",   val: "Fri check-in · Mon checkout"  },
    ],
    note:     "Most popular",
    featured: true,
  },
  {
    id:          "resort",
    index:       "03",
    label:       "Luxury",
    title:       "Relax Resort",
    description: "Private glamping pods with ensuite facilities, A/C, and a dedicated concierge. The most refined way to experience Awakenings.",
    specs: [
      { key: "Unit",       val: "Private glamping pod"         },
      { key: "Facilities", val: "Private shower + WC, A/C"    },
      { key: "Service",    val: "Concierge + welcome kit"      },
      { key: "Duration",   val: "Fri check-in · Mon checkout"  },
    ],
    note:     "Limited availability",
    featured: false,
  },
];

/* ── Design tokens ─────────────────────────────────────────────── */
const I    = "var(--font-inter, Inter, system-ui, sans-serif)";
const CYAN = "#06B6D4";

export function AccommodationSection() {
  return (
    <section className="relative py-5 overflow-hidden">

      {/* Ambient glow behind the card area */}
      <div
        aria-hidden="true"
        style={{
          position:   "absolute",
          top:        "55%",
          left:       "50%",
          transform:  "translate(-50%, -50%)",
          width:      "50%",
          height:     "70%",
          background: `radial-gradient(ellipse at center, rgba(6,182,212,0.055) 0%, transparent 70%)`,
          pointerEvents: "none",
          zIndex:     0,
        }}
      />

      <div className="relative z-10 max-w-5xl mx-auto px-6 sm:px-12 lg:px-20">

        {/* ── Section header ───────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9 }}
          className="mb-8"
        >
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "0.875rem" }}>
            <span style={{ width: "16px", height: "1px", background: `rgba(6,182,212,0.50)`, flexShrink: 0 }} />
            <span style={{ fontFamily: I, fontSize: "0.9375rem", fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: "rgba(237,233,225,0.82)" }}>
              Camping & Resort
            </span>
          </div>
          <h2
            className="font-[var(--font-playfair)] font-black text-white"
            style={{ fontSize: "clamp(2rem, 4.5vw, 3.25rem)", letterSpacing: "-0.025em", lineHeight: 0.92 }}
          >
            <LineReveal>Stay on-site.</LineReveal>
            <LineReveal delay={0.09}>
              <span style={{ color: "rgba(237,233,225,0.38)" }}>Three tiers.</span>
            </LineReveal>
          </h2>
        </motion.div>

        {/* ── Cards grid ───────────────────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-5 items-stretch">
          {TIERS.map((tier, i) => (
            <TierCard key={tier.id} tier={tier} index={i} />
          ))}
        </div>

      </div>
    </section>
  );
}

/* ── Individual card ───────────────────────────────────────────── */
function TierCard({ tier, index }: { tier: typeof TIERS[0]; index: number }) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -40px 0px" }}
      transition={{ duration: 0.7, delay: index * 0.10, ease: [0.16, 1, 0.3, 1] }}
      style={{ height: "100%" }}
    >
      <motion.div
        onHoverStart={() => setHovered(true)}
        onHoverEnd={()   => setHovered(false)}
        animate={{
          y:         hovered ? -6 : 0,
          boxShadow: hovered && tier.featured
            ? `0 0 0 1.5px rgba(6,182,212,0.65), 0 0 55px rgba(6,182,212,0.14), 0 32px 64px rgba(0,0,0,0.80)`
            : hovered
              ? `0 0 0 1px rgba(237,233,225,0.14), 0 24px 56px rgba(0,0,0,0.70)`
              : tier.featured
                ? `0 0 0 1.5px rgba(6,182,212,0.40), 0 0 35px rgba(6,182,212,0.09), 0 20px 50px rgba(0,0,0,0.70)`
                : `0 0 0 1px rgba(237,233,225,0.07), 0 12px 36px rgba(0,0,0,0.55)`,
        }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        style={{
          height:        "100%",
          display:       "flex",
          flexDirection: "column",
          position:      "relative",
          overflow:      "hidden",
          borderRadius:  "20px",
          background:    tier.featured
            ? "linear-gradient(145deg, rgba(6,182,212,0.06) 0%, rgba(10,10,18,0.95) 45%, rgba(8,9,16,0.98) 100%)"
            : "rgba(9,10,16,0.92)",
          backdropFilter:       "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          padding:       tier.featured ? "2rem 1.75rem" : "1.875rem 1.625rem",
          cursor:        "default",
        }}
      >

        {/* Featured top gradient line */}
        {tier.featured && (
          <div style={{
            position:      "absolute",
            top: 0, left: 0, right: 0,
            height:        "2px",
            background:    `linear-gradient(90deg, transparent 0%, rgba(6,182,212,0.75) 30%, rgba(6,182,212,0.75) 70%, transparent 100%)`,
            borderRadius:  "20px 20px 0 0",
          }} />
        )}

        {/* Popular badge */}
        {tier.featured && (
          <div style={{
            position:      "absolute",
            top:           "1.125rem",
            right:         "1.25rem",
            padding:       "3px 10px",
            borderRadius:  "100px",
            background:    "rgba(6,182,212,0.10)",
            border:        "1px solid rgba(6,182,212,0.28)",
            fontFamily:    I,
            fontSize:      "8px",
            fontWeight:    700,
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            color:         "rgba(6,182,212,0.85)",
          }}>
            Popular
          </div>
        )}

        {/* Index + label row */}
        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "1.25rem" }}>
          <span style={{
            fontFamily:    I,
            fontSize:      "10px",
            fontWeight:    600,
            letterSpacing: "0.26em",
            textTransform: "uppercase",
            color:         tier.featured ? "rgba(6,182,212,0.80)" : "rgba(237,233,225,0.28)",
          }}>
            {tier.index}
          </span>
          <span style={{ width: "16px", height: "1px", background: "rgba(237,233,225,0.10)" }} />
          <span style={{
            fontFamily:    I,
            fontSize:      "10px",
            fontWeight:    500,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color:         tier.featured ? "rgba(6,182,212,0.55)" : "rgba(237,233,225,0.22)",
          }}>
            {tier.label}
          </span>
        </div>

        {/* Title */}
        <h3 style={{
          fontFamily:    I,
          fontWeight:    800,
          fontSize:      "clamp(1.0625rem, 2.2vw, 1.25rem)",
          letterSpacing: "0.04em",
          textTransform: "uppercase",
          lineHeight:    1.15,
          color:         "rgba(237,233,225,0.96)",
          marginBottom:  "0.875rem",
          paddingRight:  tier.featured ? "3.5rem" : "0",
        }}>
          {tier.title}
        </h3>

        {/* Description */}
        <p style={{
          fontFamily:   I,
          fontSize:     "0.875rem",
          lineHeight:   1.75,
          color:        "rgba(161,161,170,0.78)",
          marginBottom: "1.5rem",
          flex:         1,
        }}>
          {tier.description}
        </p>

        {/* Specs list */}
        <div style={{ marginBottom: "1.5rem" }}>
          {tier.specs.map(({ key, val }) => (
            <div
              key={key}
              style={{
                display:     "flex",
                alignItems:  "flex-start",
                gap:         "10px",
                padding:     "0.5625rem 0",
                borderBottom: "1px solid rgba(255,255,255,0.04)",
              }}
            >
              {/* Dot */}
              <span style={{
                width:        "4px",
                height:       "4px",
                borderRadius: "50%",
                background:   tier.featured ? "rgba(6,182,212,0.55)" : "rgba(237,233,225,0.18)",
                flexShrink:   0,
                marginTop:    "5px",
              }} />
              <div style={{ flex: 1, display: "flex", justifyContent: "space-between", gap: "8px", flexWrap: "wrap" }}>
                <span style={{
                  fontFamily:    I,
                  fontSize:      "9.5px",
                  fontWeight:    500,
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                  color:         "rgba(161,161,170,0.42)",
                  flexShrink:    0,
                }}>
                  {key}
                </span>
                <span style={{
                  fontFamily:  I,
                  fontSize:    "0.8125rem",
                  fontWeight:  400,
                  color:       "rgba(237,233,225,0.82)",
                  textAlign:   "right",
                }}>
                  {val}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* CTA row */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "8px" }}>
          <span style={{
            fontFamily:    I,
            fontSize:      "8.5px",
            fontWeight:    tier.featured ? 600 : 400,
            letterSpacing: "0.20em",
            textTransform: "uppercase",
            color:         tier.featured ? "rgba(6,182,212,0.60)" : "rgba(237,233,225,0.22)",
          }}>
            {tier.note}
          </span>

          <CTAButton featured={tier.featured} />
        </div>

      </motion.div>
    </motion.div>
  );
}

/* ── CTA button ─────────────────────────────────────────────────── */
function CTAButton({ featured }: { featured: boolean }) {
  const [hov, setHov] = useState(false);

  return (
    <Link
      href="/tickets"
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display:       "inline-flex",
        alignItems:    "center",
        gap:           "6px",
        padding:       "8px 16px",
        borderRadius:  "8px",
        background:    hov
          ? featured ? "rgba(6,182,212,0.20)" : "rgba(237,233,225,0.07)"
          : featured ? "rgba(6,182,212,0.10)" : "rgba(237,233,225,0.03)",
        border:        hov
          ? featured ? "1px solid rgba(6,182,212,0.55)" : "1px solid rgba(237,233,225,0.18)"
          : featured ? "1px solid rgba(6,182,212,0.30)" : "1px solid rgba(237,233,225,0.08)",
        fontFamily:    "var(--font-inter, Inter, system-ui, sans-serif)",
        fontSize:      "10px",
        fontWeight:    600,
        letterSpacing: "0.18em",
        textTransform: "uppercase" as const,
        color:         featured ? "rgba(6,182,212,0.90)" : "rgba(237,233,225,0.55)",
        transition:    "all 0.22s ease",
        flexShrink:    0,
        whiteSpace:    "nowrap" as const,
      }}
    >
      View tickets
      <ArrowRight style={{ width: "10px", height: "10px" }} />
    </Link>
  );
}
