"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

/* ── Tier data ──────────────────────────────────────────────────── */
const TIERS = [
  {
    id:     "grand",
    index:  "01",
    label:  "Outdoor",
    illus:  "/illus-camping.svg",
    title:  "Grand Camping",
    spec:   "Personal tent space · Shared facilities",
    dates:  "Thu check-in · Mon checkout",
    note:   null,
    cyan:   false,
  },
  {
    id:     "comfort",
    index:  "02",
    label:  "Equipped",
    illus:  "/illus-bell-tent.svg",
    title:  "Comfort Camping",
    spec:   "Pre-pitched bell tent · Beds & bedding",
    dates:  "Fri check-in · Mon checkout",
    note:   "Most popular",
    cyan:   true,
  },
  {
    id:     "resort",
    index:  "03",
    label:  "Luxury",
    illus:  "/illus-glamping.svg",
    title:  "Relax Resort",
    spec:   "Private glamping pod · A/C & concierge",
    dates:  "Fri check-in · Mon checkout",
    note:   "Limited availability",
    cyan:   false,
  },
];

const I = "var(--font-inter, Inter, system-ui, sans-serif)";

/* ── Section ────────────────────────────────────────────────────── */
/* Intentionally compact — accommodation is a secondary upsell,
   not a primary conversion driver. Visual weight is deliberately
   lower than FeaturedTickets and ResaleMarketplaceSection.         */
export function AccommodationSection() {
  return (
    <section className="relative overflow-hidden" style={{ paddingTop: "clamp(1.5rem, 3vw, 2.5rem)", paddingBottom: "clamp(1.5rem, 3vw, 2.5rem)" }}>

      {/* ── Video background ─────────────────────────────────────── */}
      <video
        autoPlay
        muted
        loop
        playsInline
        aria-hidden="true"
        style={{
          position:   "absolute",
          inset:      0,
          width:      "100%",
          height:     "100%",
          objectFit:  "cover",
          objectPosition: "center center",
          zIndex:     0,
        }}
      >
        <source src="/camping-bg.mp4" type="video/mp4" />
      </video>

      {/* Dark overlay — keeps text readable over the video */}
      <div aria-hidden="true" style={{
        position:   "absolute",
        inset:      0,
        background: "linear-gradient(to bottom, rgba(3,3,5,0.72) 0%, rgba(3,3,5,0.60) 50%, rgba(3,3,5,0.78) 100%)",
        zIndex:     1,
      }} />

      <div className="max-w-5xl mx-auto px-6 sm:px-12 lg:px-20" style={{ position: "relative", zIndex: 2 }}>

        {/* ── Compact header ──────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", flexWrap: "wrap", gap: "0.5rem 2rem", marginBottom: "clamp(1rem, 2.5vw, 1.75rem)" }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span style={{ width: "14px", height: "1px", background: "rgba(6,182,212,0.35)", flexShrink: 0 }} />
            <span style={{
              fontFamily:    I,
              fontSize:      "11px",
              fontWeight:    600,
              letterSpacing: "0.24em",
              textTransform: "uppercase",
              color:         "rgba(237,233,225,0.50)",
            }}>
              Camping &amp; Resort — Stay on-site
            </span>
          </div>
          <Link
            href="/tickets"
            className="hidden sm:inline-flex items-center gap-1.5 group"
            style={{
              fontFamily:    I,
              fontSize:      "11px",
              letterSpacing: "0.16em",
              textTransform: "uppercase",
              color:         "rgba(237,233,225,0.28)",
              transition:    "color 0.3s ease",
              textDecoration: "none",
            }}
            onMouseEnter={e => (e.currentTarget.style.color = "rgba(6,182,212,0.75)")}
            onMouseLeave={e => (e.currentTarget.style.color = "rgba(237,233,225,0.28)")}
          >
            View accommodation tickets
            <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform duration-300" />
          </Link>
        </motion.div>

        {/* ── Compact tier strip ───────────────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {TIERS.map((tier, i) => (
            <motion.div
              key={tier.id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "0px 0px -20px 0px" }}
              transition={{ duration: 0.55, delay: i * 0.07, ease: [0.16, 1, 0.3, 1] }}
            >
              <Link
                href="/tickets"
                className="group block"
                style={{
                  background:    tier.cyan
                    ? "rgba(6,182,212,0.10)"
                    : "rgba(0,0,0,0.45)",
                  border:        tier.cyan
                    ? "1px solid rgba(6,182,212,0.35)"
                    : "1px solid rgba(255,255,255,0.12)",
                  backdropFilter: "blur(10px)",
                  borderRadius:  "8px",
                  padding:       "1.25rem 1.125rem 1rem",
                  textDecoration: "none",
                  display:       "block",
                  transition:    "border-color 0.25s ease, background 0.25s ease",
                }}
                onMouseEnter={e => {
                  const el = e.currentTarget;
                  el.style.borderColor = tier.cyan
                    ? "rgba(6,182,212,0.60)"
                    : "rgba(255,255,255,0.22)";
                  el.style.background = tier.cyan
                    ? "rgba(6,182,212,0.15)"
                    : "rgba(0,0,0,0.55)";
                }}
                onMouseLeave={e => {
                  const el = e.currentTarget;
                  el.style.borderColor = tier.cyan
                    ? "rgba(6,182,212,0.35)"
                    : "rgba(255,255,255,0.12)";
                  el.style.background = tier.cyan
                    ? "rgba(6,182,212,0.10)"
                    : "rgba(0,0,0,0.45)";
                }}
              >
                {/* Index + label + note */}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.5rem" }}>
                  <span style={{
                    fontFamily:    I,
                    fontSize:      "9.5px",
                    fontWeight:    600,
                    letterSpacing: "0.22em",
                    textTransform: "uppercase",
                    color:         tier.cyan ? "rgba(6,182,212,0.65)" : "rgba(237,233,225,0.28)",
                  }}>
                    {tier.index} · {tier.label}
                  </span>
                  {tier.note && (
                    <span style={{
                      fontFamily:    I,
                      fontSize:      "8px",
                      fontWeight:    700,
                      letterSpacing: "0.14em",
                      textTransform: "uppercase",
                      color:         tier.cyan ? "rgba(6,182,212,0.80)" : "rgba(237,233,225,0.32)",
                      background:    tier.cyan ? "rgba(6,182,212,0.08)" : "rgba(237,233,225,0.05)",
                      border:        tier.cyan ? "1px solid rgba(6,182,212,0.22)" : "1px solid rgba(237,233,225,0.08)",
                      padding:       "2px 7px",
                      borderRadius:  "3px",
                    }}>
                      {tier.note}
                    </span>
                  )}
                </div>

                {/* Title */}
                <p style={{
                  fontFamily:    I,
                  fontWeight:    700,
                  fontSize:      "0.9375rem",
                  color:         "rgba(237,233,225,0.90)",
                  letterSpacing: "0.02em",
                  marginBottom:  "0.375rem",
                  margin:        "0 0 0.375rem",
                }}>
                  {tier.title}
                </p>

                {/* Spec one-liner */}
                <p style={{
                  fontFamily:    I,
                  fontSize:      "12px",
                  color:         "rgba(255,255,255,0.58)",
                  lineHeight:    1.4,
                  marginBottom:  "0.625rem",
                  margin:        "0 0 0.625rem",
                  textShadow:    "0 1px 3px rgba(0,0,0,0.5)",
                }}>
                  {tier.spec}
                </p>

                {/* Dates + CTA row */}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <span style={{
                    fontFamily:    I,
                    fontSize:      "10px",
                    color:         "rgba(255,255,255,0.45)",
                    letterSpacing: "0.06em",
                  }}>
                    {tier.dates}
                  </span>
                  <span
                    className="group-hover:translate-x-0.5 transition-transform duration-300"
                    style={{
                      fontFamily:    I,
                      fontSize:      "10px",
                      fontWeight:    600,
                      letterSpacing: "0.14em",
                      textTransform: "uppercase",
                      color:         tier.cyan ? "rgba(6,182,212,0.70)" : "rgba(237,233,225,0.30)",
                      display:       "inline-flex",
                      alignItems:    "center",
                      gap:           "4px",
                    }}
                  >
                    Tickets
                    <ArrowRight style={{ width: "9px", height: "9px" }} />
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
