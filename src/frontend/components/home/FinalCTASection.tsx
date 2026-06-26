"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";

const I = "var(--font-inter, Inter, system-ui, sans-serif)";
const C = "#06B6D4";
const W = "#EDE9E1";

const up = (delay: number) => ({
  initial:    { opacity: 0, y: 20 } as const,
  animate:    { opacity: 1, y: 0  } as const,
  whileInView: { opacity: 1, y: 0 } as const,
  viewport:   { once: true } as const,
  transition: { duration: 0.9, delay, ease: [0.16, 1, 0.3, 1] as const },
});

const STATS = [
  { value: "200+",  label: "Tickets sold"     },
  { value: "0",     label: "Disputes"         },
  { value: "100%",  label: "Delivery rate"    },
  { value: "4 hrs", label: "Support response" },
];

export function FinalCTASection() {
  const router    = useRouter();
  const [email,   setEmail]     = useState("");
  const [sent,    setSent]      = useState(false);
  const [loading, setLoading]   = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || loading) return;
    setLoading(true);
    try {
      await fetch("/api/notify", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ email }),
      });
    } finally {
      setSent(true);
      setLoading(false);
    }
  };

  return (
    <section
      className="relative overflow-hidden"
      style={{
        paddingTop:    "clamp(4rem, 8vw, 7rem)",
        paddingBottom: "clamp(4rem, 8vw, 7rem)",
        background:    "linear-gradient(to bottom, #050507 0%, #030305 100%)",
      }}
    >
      {/* Ambient glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background: "radial-gradient(ellipse 55% 45% at 50% 65%, rgba(6,182,212,0.055) 0%, transparent 70%)",
        }}
      />

      {/* Noise grain overlay */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage:  "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E\")",
          backgroundRepeat: "repeat",
          backgroundSize:   "128px 128px",
        }}
      />

      <div className="relative max-w-3xl mx-auto px-6 sm:px-12 text-center">

        {/* Stats strip */}
        <motion.div
          {...up(0.0)}
          style={{
            display:       "flex",
            justifyContent: "center",
            gap:           "clamp(1.5rem, 5vw, 3.5rem)",
            flexWrap:      "wrap",
            marginBottom:  "clamp(2.5rem, 5vw, 4rem)",
          }}
        >
          {STATS.map(({ value, label }) => (
            <div key={label} style={{ textAlign: "center" }}>
              <span style={{
                display:       "block",
                fontFamily:    I,
                fontWeight:    700,
                fontSize:      "clamp(1.375rem, 3vw, 2rem)",
                color:         W,
                letterSpacing: "0.01em",
                lineHeight:    1,
                marginBottom:  "5px",
              }}>
                {value}
              </span>
              <span style={{
                fontFamily:    I,
                fontSize:      "10px",
                fontWeight:    500,
                letterSpacing: "0.20em",
                textTransform: "uppercase",
                color:         "rgba(237,233,225,0.32)",
              }}>
                {label}
              </span>
            </div>
          ))}
        </motion.div>

        {/* Divider */}
        <motion.div
          {...up(0.08)}
          style={{ height: "1px", background: "rgba(237,233,225,0.07)", marginBottom: "clamp(2.5rem, 5vw, 4rem)" }}
        />

        {/* Eyebrow */}
        <motion.div
          {...up(0.12)}
          style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "12px", marginBottom: "1.5rem" }}
        >
          <div style={{ flex: 1, height: "1px", background: "rgba(237,233,225,0.07)", maxWidth: "72px" }} />
          <span style={{
            fontFamily:    I,
            fontSize:      "11px",
            fontWeight:    600,
            letterSpacing: "0.30em",
            textTransform: "uppercase",
            color:         "rgba(6,182,212,0.72)",
          }}>
            Last chance
          </span>
          <div style={{ flex: 1, height: "1px", background: "rgba(237,233,225,0.07)", maxWidth: "72px" }} />
        </motion.div>

        {/* Headline */}
        <motion.h2
          {...up(0.18)}
          style={{
            fontFamily:    I,
            fontWeight:    800,
            fontSize:      "clamp(2.25rem, 5.5vw, 4.25rem)",
            lineHeight:    0.90,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            color:         W,
            marginBottom:  "1.25rem",
          }}
        >
          Awakenings 2026
        </motion.h2>

        {/* Subheadline */}
        <motion.p
          {...up(0.26)}
          style={{
            fontFamily:   I,
            fontSize:     "clamp(0.9375rem, 2vw, 1.0625rem)",
            lineHeight:   1.70,
            color:        "rgba(237,233,225,0.42)",
            marginBottom: "2.5rem",
          }}
        >
          Tickets are running out. Once they're gone, there is no
          official resale source.
        </motion.p>

        {/* Primary CTA */}
        <motion.div {...up(0.34)} style={{ marginBottom: "3.5rem" }}>
          <button
            onClick={() => router.push("/tickets")}
            className="group inline-flex items-center gap-3"
            style={{
              background:    C,
              border:        "none",
              padding:       "clamp(14px, 1.8vw, 18px) clamp(36px, 5vw, 60px)",
              cursor:        "pointer",
              fontFamily:    I,
              fontWeight:    800,
              fontSize:      "clamp(11px, 1.2vw, 13px)",
              letterSpacing: "0.26em",
              textTransform: "uppercase",
              color:         "#040404",
              transition:    "background 0.25s ease, transform 0.15s ease",
            }}
            onMouseEnter={e => (e.currentTarget.style.background = "#22D3EE")}
            onMouseLeave={e => (e.currentTarget.style.background = C)}
            onMouseDown={e  => (e.currentTarget.style.transform = "scale(0.97)")}
            onMouseUp={e    => (e.currentTarget.style.transform = "scale(1)")}
          >
            Secure Your Ticket
            <ArrowRight
              className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300"
              style={{ color: "#040404" }}
            />
          </button>
        </motion.div>

        {/* Email capture — waitlist / future drops */}
        <motion.div {...up(0.42)}>
          <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1.25rem" }}>
            <div style={{ flex: 1, height: "1px", background: "rgba(237,233,225,0.06)" }} />
            <span style={{
              fontFamily:    I,
              fontSize:      "10px",
              fontWeight:    500,
              letterSpacing: "0.20em",
              textTransform: "uppercase",
              color:         "rgba(237,233,225,0.22)",
              flexShrink:    0,
            }}>
              Sold out? Get early access to future drops
            </span>
            <div style={{ flex: 1, height: "1px", background: "rgba(237,233,225,0.06)" }} />
          </div>

          {sent ? (
            <p style={{
              fontFamily:    I,
              fontSize:      "13px",
              fontWeight:    500,
              color:         "rgba(6,182,212,0.80)",
              letterSpacing: "0.06em",
              padding:       "0.75rem 0",
            }}>
              You're on the list — we'll notify you first when new tickets drop.
            </p>
          ) : (
            <form
              onSubmit={handleSubmit}
              style={{
                display:       "flex",
                gap:           "8px",
                maxWidth:      "420px",
                margin:        "0 auto",
              }}
            >
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
                style={{
                  flex:          1,
                  background:    "rgba(237,233,225,0.035)",
                  border:        "1px solid rgba(237,233,225,0.10)",
                  padding:       "11px 16px",
                  fontFamily:    I,
                  fontSize:      "13px",
                  color:         W,
                  outline:       "none",
                  transition:    "border-color 0.25s ease",
                  borderRadius:  "0",
                  minWidth:      "0",
                }}
                onFocus={e  => (e.currentTarget.style.borderColor = "rgba(6,182,212,0.40)")}
                onBlur={e   => (e.currentTarget.style.borderColor = "rgba(237,233,225,0.10)")}
              />
              <button
                type="submit"
                disabled={loading}
                style={{
                  background:    "rgba(237,233,225,0.05)",
                  border:        "1px solid rgba(237,233,225,0.12)",
                  padding:       "11px 20px",
                  fontFamily:    I,
                  fontSize:      "11px",
                  fontWeight:    600,
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                  color:         "rgba(237,233,225,0.65)",
                  cursor:        loading ? "wait" : "pointer",
                  transition:    "all 0.22s ease",
                  whiteSpace:    "nowrap",
                  borderRadius:  "0",
                  flexShrink:    0,
                  opacity:       loading ? 0.6 : 1,
                }}
                onMouseEnter={e => {
                  if (loading) return;
                  e.currentTarget.style.background   = "rgba(6,182,212,0.09)";
                  e.currentTarget.style.borderColor  = "rgba(6,182,212,0.32)";
                  e.currentTarget.style.color        = C;
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background   = "rgba(237,233,225,0.05)";
                  e.currentTarget.style.borderColor  = "rgba(237,233,225,0.12)";
                  e.currentTarget.style.color        = "rgba(237,233,225,0.65)";
                }}
              >
                {loading ? "…" : "Notify me"}
              </button>
            </form>
          )}
        </motion.div>

      </div>
    </section>
  );
}
