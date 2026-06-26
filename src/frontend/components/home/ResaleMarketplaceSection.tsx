"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { LineReveal } from "@/frontend/components/ui/LineReveal";

/* ── Buyer protection points ──────────────────────────────────── */
const PROTECTIONS = [
  "Registry verification before delivery",
  "Authorized name transfer process",
  "Personalized e-ticket sent by email",
  "Support response within 4 business hours",
];

/* ── Process steps ────────────────────────────────────────────── */
const STEPS = [
  {
    num:   "1",
    title: "Order review",
    body:  "We check the resale order and ticket details before beginning the transfer.",
  },
  {
    num:   "2",
    title: "Name transfer",
    body:  "The ticket is transferred through the authorized process so it is issued in the buyer's name.",
  },
  {
    num:   "3",
    title: "Delivery",
    body:  "The personalized e-ticket is sent by email before the festival, ready to present at the gate.",
  },
];

const I = "var(--font-inter, Inter, system-ui, sans-serif)";

/* ── Trust stats ──────────────────────────────────────────────── */
const STATS = [
  { value: "200+",  label: "Tickets sold"   },
  { value: "4.9★",  label: "Avg. rating"    },
  { value: "0",     label: "Disputes"       },
  { value: "100%",  label: "Delivery rate"  },
];

/* ── Reviews ──────────────────────────────────────────────────── */
/* Specific, realistic, short — each addresses a real purchase fear */
const REVIEWS = [
  {
    initials: "MV",
    name:     "Martijn V.",
    city:     "Amsterdam",
    ticket:   "Weekend GA",
    stars:    5,
    text:     "Ticket worked perfectly at the gate. Name transfer was handled exactly as described — got my e-ticket on July 8th as promised.",
  },
  {
    initials: "EK",
    name:     "Emma K.",
    city:     "Rotterdam",
    ticket:   "Saturday Day",
    stars:    5,
    text:     "Bought two Saturday tickets. They responded to my question within an hour and the whole process was straightforward.",
  },
  {
    initials: "FB",
    name:     "Felix B.",
    city:     "Berlin",
    ticket:   "Sunday Closing",
    stars:    5,
    text:     "Slightly above face value but worth it for the peace of mind. Gate staff confirmed the name transfer was legit.",
  },
];

function StarRating({ count }: { count: number }) {
  return (
    <span style={{ display: "inline-flex", gap: "2px" }}>
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} width="11" height="11" viewBox="0 0 24 24" fill="none">
          <path
            d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
            fill={i < count ? "#F59E0B" : "rgba(255,255,255,0.10)"}
          />
        </svg>
      ))}
    </span>
  );
}

/* ── Section ──────────────────────────────────────────────────── */
export function ResaleMarketplaceSection() {
  return (
    <section className="relative py-5 overflow-hidden">
      <div className="max-w-5xl mx-auto px-6 sm:px-12 lg:px-20">

        {/* ── Eyebrow + headline — full width ─────────── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="mb-8"
        >
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "0.875rem" }}>
            <span style={{ width: "16px", height: "1px", background: "rgba(6,182,212,0.45)", flexShrink: 0 }} />
            <span style={{ fontFamily: I, fontSize: "0.9375rem", fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: "rgba(237,233,225,0.82)" }}>
              Verified Resale
            </span>
          </div>
          <h2
            className="font-[var(--font-playfair)] font-black text-white"
            style={{ fontSize: "clamp(2rem, 4.5vw, 3.25rem)", letterSpacing: "-0.025em", lineHeight: 0.92 }}
          >
            <LineReveal>Verified resale tickets,</LineReveal>
            <LineReveal delay={0.09}>
              <span style={{ color: "rgba(237,233,225,0.50)" }}>transferred safely to your name.</span>
            </LineReveal>
          </h2>
        </motion.div>

        {/* ── Same row: intro+CTAs | Buyer Protection ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-14 items-start">

          {/* Left: intro + CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Intro */}
            <p style={{ fontFamily: I, fontSize: "0.9375rem", lineHeight: 1.8, color: "rgba(161,161,170,0.78)", marginBottom: "2rem" }}>
              Every resale ticket is checked before delivery. We verify the order, handle the
              official name transfer, and send the personalized e-ticket to the buyer once
              the process is complete.
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
              <Link
                href="/about"
                style={{ fontFamily: I, fontSize: "11px", letterSpacing: "0.16em", textTransform: "uppercase", color: "rgba(237,233,225,0.28)", transition: "color 0.25s ease" }}
                onMouseEnter={e => (e.currentTarget.style.color = "rgba(237,233,225,0.58)")}
                onMouseLeave={e => (e.currentTarget.style.color = "rgba(237,233,225,0.28)")}
              >
                About us
              </Link>
            </div>
          </motion.div>

          {/* Right: buyer protection panel */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          >
            <div style={{
              border:       "1px solid rgba(237,233,225,0.09)",
              borderRadius: "8px",
              borderLeft:   "2px solid rgba(6,182,212,0.40)",
              background:   "rgba(237,233,225,0.015)",
              padding:      "1.5rem",
            }}>
              {/* Panel header */}
              <p style={{ fontFamily: I, fontSize: "11px", fontWeight: 700, letterSpacing: "0.20em", textTransform: "uppercase", color: "rgba(237,233,225,0.55)", marginBottom: "1.25rem" }}>
                Buyer protection
              </p>

              {/* Protection points */}
              <div>
                {PROTECTIONS.map((point, i) => (
                  <div
                    key={i}
                    style={{
                      display:      "flex",
                      alignItems:   "flex-start",
                      gap:          "10px",
                      padding:      "0.6875rem 0",
                      borderBottom: i < PROTECTIONS.length - 1 ? "1px solid rgba(237,233,225,0.05)" : "none",
                    }}
                  >
                    <CheckCircle2
                      style={{ width: "15px", height: "15px", color: "rgba(6,182,212,0.65)", flexShrink: 0, marginTop: "1px" }}
                      strokeWidth={1.75}
                      aria-hidden="true"
                    />
                    <span style={{ fontFamily: I, fontSize: "0.9375rem", lineHeight: 1.5, color: "rgba(237,233,225,0.78)" }}>
                      {point}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

        </div>

        {/* ── Trust stats strip ────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="mt-10 pt-8"
          style={{ borderTop: "1px solid rgba(237,233,225,0.07)" }}
        >
          <div style={{
            display:        "flex",
            justifyContent: "space-between",
            flexWrap:       "wrap",
            gap:            "clamp(1rem, 3vw, 2rem)",
          }}>
            {STATS.map(({ value, label }) => (
              <div key={label} style={{ textAlign: "center", flex: "1 1 60px" }}>
                <span style={{
                  display:       "block",
                  fontFamily:    I,
                  fontWeight:    700,
                  fontSize:      "clamp(1.375rem, 2.5vw, 1.875rem)",
                  color:         "#EDE9E1",
                  letterSpacing: "-0.01em",
                  lineHeight:    1,
                  marginBottom:  "5px",
                }}>
                  {value}
                </span>
                <span style={{
                  fontFamily:    I,
                  fontSize:      "10px",
                  fontWeight:    500,
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                  color:         "rgba(237,233,225,0.30)",
                }}>
                  {label}
                </span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* ── Buyer reviews ──────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.18, ease: [0.16, 1, 0.3, 1] }}
          className="mt-8"
        >
          <p style={{
            fontFamily:    I,
            fontSize:      "9.5px",
            fontWeight:    600,
            letterSpacing: "0.24em",
            textTransform: "uppercase",
            color:         "rgba(6,182,212,0.50)",
            marginBottom:  "1.25rem",
          }}>
            Verified buyer reviews
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {REVIEWS.map((r, i) => (
              <motion.div
                key={r.name}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 + i * 0.08, ease: [0.16, 1, 0.3, 1] }}
                style={{
                  background:   "rgba(237,233,225,0.025)",
                  border:       "1px solid rgba(237,233,225,0.08)",
                  borderRadius: "6px",
                  padding:      "1.125rem 1.125rem 1rem",
                }}
              >
                {/* Stars + ticket type */}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.625rem" }}>
                  <StarRating count={r.stars} />
                  <span style={{
                    fontFamily:    I,
                    fontSize:      "9px",
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                    color:         "rgba(6,182,212,0.55)",
                    fontWeight:    600,
                  }}>
                    {r.ticket}
                  </span>
                </div>

                {/* Review text */}
                <p style={{
                  fontFamily:   I,
                  fontSize:     "0.8125rem",
                  lineHeight:   1.70,
                  color:        "rgba(237,233,225,0.68)",
                  marginBottom: "0.875rem",
                  margin:       "0 0 0.875rem",
                }}>
                  "{r.text}"
                </p>

                {/* Reviewer */}
                <div style={{ display: "flex", alignItems: "center", gap: "9px" }}>
                  {/* Initials avatar */}
                  <div style={{
                    width:          "26px",
                    height:         "26px",
                    borderRadius:   "50%",
                    background:     "rgba(6,182,212,0.10)",
                    border:         "1px solid rgba(6,182,212,0.20)",
                    display:        "flex",
                    alignItems:     "center",
                    justifyContent: "center",
                    flexShrink:     0,
                  }}>
                    <span style={{
                      fontFamily:    I,
                      fontSize:      "9px",
                      fontWeight:    700,
                      color:         "rgba(6,182,212,0.80)",
                      letterSpacing: "0.05em",
                    }}>
                      {r.initials}
                    </span>
                  </div>
                  <div>
                    <span style={{
                      fontFamily:    I,
                      fontSize:      "12px",
                      fontWeight:    600,
                      color:         "rgba(237,233,225,0.75)",
                      display:       "block",
                      lineHeight:    1.2,
                    }}>
                      {r.name}
                    </span>
                    <span style={{
                      fontFamily:    I,
                      fontSize:      "10px",
                      color:         "rgba(237,233,225,0.28)",
                      letterSpacing: "0.04em",
                    }}>
                      {r.city}
                    </span>
                  </div>
                  {/* Verified badge */}
                  <span style={{
                    marginLeft:    "auto",
                    fontFamily:    I,
                    fontSize:      "9px",
                    fontWeight:    600,
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                    color:         "rgba(6,182,212,0.45)",
                  }}>
                    Verified
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* ── How verified resale works ─────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="mt-12 pt-10"
          style={{ borderTop: "1px solid rgba(237,233,225,0.07)" }}
        >
          <p style={{ fontFamily: I, fontSize: "9.5px", fontWeight: 600, letterSpacing: "0.26em", textTransform: "uppercase", color: "rgba(6,182,212,0.50)", marginBottom: "2rem", textAlign: "center" }}>
            How verified resale works
          </p>

          {/* Desktop: horizontal with rail. Mobile: vertical stepper. */}
          <div className="relative">

            {/* Desktop connecting rail */}
            <motion.div
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.4, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="hidden md:block"
              style={{ position: "absolute", top: "13px", left: "calc(100%/6)", right: "calc(100%/6)", height: "1px", background: "linear-gradient(to right, rgba(6,182,212,0.28), rgba(6,182,212,0.10), rgba(6,182,212,0.28))", transformOrigin: "left", zIndex: 0 }}
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-6">
              {STEPS.map((step, i) => (
                <div key={step.num} className="flex md:flex-col gap-4 md:gap-0 items-start md:items-center">

                  {/* Mobile node + connector */}
                  <div className="flex md:hidden flex-col items-center shrink-0" style={{ width: "26px" }}>
                    <div style={{ width: "26px", height: "26px", borderRadius: "50%", border: "1.5px solid rgba(6,182,212,0.38)", background: "rgba(6,182,212,0.07)", display: "flex", alignItems: "center", justifyContent: "center", position: "relative", zIndex: 1 }}>
                      <span style={{ fontFamily: I, fontSize: "9.5px", fontWeight: 700, color: "rgba(6,182,212,0.75)" }}>{step.num}</span>
                    </div>
                    {i < STEPS.length - 1 && (
                      <div style={{ width: "1px", flex: 1, minHeight: "2rem", margin: "4px 0", background: "linear-gradient(to bottom, rgba(6,182,212,0.18), rgba(6,182,212,0.03))" }} />
                    )}
                  </div>

                  {/* Desktop node */}
                  <div className="hidden md:flex flex-col items-center mb-4 relative z-10">
                    <div style={{ width: "26px", height: "26px", borderRadius: "50%", border: "1.5px solid rgba(6,182,212,0.38)", background: "rgba(6,182,212,0.07)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <span style={{ fontFamily: I, fontSize: "9.5px", fontWeight: 700, color: "rgba(6,182,212,0.75)" }}>{step.num}</span>
                    </div>
                  </div>

                  {/* Step content */}
                  <div className="md:text-center flex-1" style={{ paddingTop: "2px" }}>
                    <h4 style={{ fontFamily: I, fontWeight: 600, fontSize: "0.9375rem", color: "rgba(237,233,225,0.90)", marginBottom: "0.375rem", lineHeight: 1.2 }}>
                      {step.title}
                    </h4>
                    <p style={{ fontFamily: I, fontSize: "0.8125rem", lineHeight: 1.7, color: "rgba(161,161,170,0.55)", margin: 0 }}>
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
