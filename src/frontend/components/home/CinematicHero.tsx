"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";

/* ── Festival countdown ─────────────────────────────────────────── */
const FESTIVAL_DATE = new Date("2026-07-10T15:00:00+02:00");

function useCountdown(target: Date) {
  const [t, setT] = useState({ d: 0, h: 0, m: 0, s: 0 });
  useEffect(() => {
    const tick = () => {
      const diff = Math.max(0, target.getTime() - Date.now());
      setT({
        d: Math.floor(diff / 86400000),
        h: Math.floor((diff % 86400000) / 3600000),
        m: Math.floor((diff % 3600000) / 60000),
        s: Math.floor((diff % 60000) / 1000),
      });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [target]);
  return t;
}

/* ── Design tokens ──────────────────────────────────────────────── */
const W = "#EDE9E1";
const C = "#06B6D4";
const I = "var(--font-inter, Inter, system-ui, sans-serif)";

/* ── Animation variants ─────────────────────────────────────────── */
const up = (delay: number) => ({
  initial:    { opacity: 0, y: 20 } as const,
  animate:    { opacity: 1, y: 0  } as const,
  transition: { duration: 1.0, delay, ease: [0.16, 1, 0.3, 1] as const },
});

const reveal = (delay: number) => ({
  initial:    { clipPath: "inset(0 0 100% 0)", opacity: 0.7 } as const,
  animate:    { clipPath: "inset(0 0 0% 0)",   opacity: 1   } as const,
  transition: { duration: 1.1, delay, ease: [0.16, 1, 0.3, 1] as const },
});

const fade = (delay: number, dur = 1.2) => ({
  initial:    { opacity: 0 } as const,
  animate:    { opacity: 1 } as const,
  transition: { duration: dur, delay, ease: "easeOut" as const },
});

/* ── Trust chips data ───────────────────────────────────────────── */
const TRUST = [
  "Sourced from Awakenings.nl",
  "Official name transfer",
  "E-ticket July 8",
  "Stripe secured",
  "4hr support",
];

/* ── Countdown unit ─────────────────────────────────────────────── */
function CountUnit({ val, label }: { val: number; label: string }) {
  return (
    <div style={{ display: "inline-flex", alignItems: "baseline", gap: "4px" }}>
      <motion.span
        key={val}
        initial={{ opacity: 0.3, y: -4 }}
        animate={{ opacity: 1,   y:  0 }}
        transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
        style={{
          fontFamily:         I,
          fontWeight:         700,
          fontSize:           "clamp(1.875rem, 4.2vw, 3.5rem)",
          lineHeight:         1,
          letterSpacing:      "0.01em",
          color:              W,
          fontVariantNumeric: "tabular-nums",
        }}
      >
        {String(val).padStart(2, "0")}
      </motion.span>
      <span style={{
        fontFamily:    I,
        fontWeight:    500,
        fontSize:      "clamp(0.7rem, 1.3vw, 1rem)",
        letterSpacing: "0.08em",
        textTransform: "uppercase",
        color:         C,
        lineHeight:    1,
        paddingBottom: "3px",
      }}>
        {label.charAt(0)}
      </span>
    </div>
  );
}

/* ── Component ──────────────────────────────────────────────────── */
export function CinematicHero() {
  const router        = useRouter();
  const { d, h, m, s } = useCountdown(FESTIVAL_DATE);

  return (
    <section
      className="relative overflow-hidden -mt-16 sm:-mt-20"
      style={{ height: "100vh", minHeight: "640px", background: "#050505" }}
    >

      {/* ── Video ─────────────────────────────────────────────── */}
      <video
        autoPlay muted loop playsInline preload="auto" aria-hidden="true"
        poster="/festival-hero.png"
        className="absolute inset-0 w-full h-full object-cover"
        style={{ objectPosition: "center 28%", zIndex: 0 }}
      >
        <source src="/hero-bg.mp4" type="video/mp4" />
      </video>

      {/* ── Overlay — heavier at bottom to ensure text legibility ── */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{
          zIndex: 1,
          background: [
            "linear-gradient(to top, rgba(4,4,4,1.00) 0%, rgba(4,4,4,0.85) 38%, rgba(4,4,4,0.22) 68%, rgba(4,4,4,0.06) 100%)",
            "linear-gradient(to bottom, rgba(4,4,4,0.58) 0%, transparent 22%)",
          ].join(", "),
        }}
      />

      {/* ── Ghost watermark ───────────────────────────────────── */}
      <motion.span
        {...fade(1.4, 3.0)}
        aria-hidden="true"
        className="absolute pointer-events-none select-none"
        style={{
          bottom: "-6%", right: "-2%",
          fontFamily: I, fontWeight: 900,
          fontSize: "min(55vw, 820px)",
          lineHeight: 1, letterSpacing: "0.10em",
          textTransform: "uppercase",
          color: "rgba(237,233,225,0.016)",
          zIndex: 1,
        }}
      >
        2026
      </motion.span>

      {/* ── ANNOUNCEMENT BADGE — centered, below navbar ───────── */}
      <motion.div
        {...fade(0.0, 0.9)}
        className="absolute left-0 right-0 flex items-center justify-center pointer-events-none"
        style={{
          top:   "clamp(76px, 11vw, 96px)",
          zIndex: 3,
        }}
      >
        <div style={{
          display:        "inline-flex",
          alignItems:     "center",
          gap:            "8px",
          background:     "rgba(6,182,212,0.08)",
          border:         "1px solid rgba(6,182,212,0.22)",
          borderRadius:   "100px",
          padding:        "5px 16px 5px 10px",
        }}>
          {/* Pulsing dot */}
          <span style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "center", width: "16px", height: "16px" }}>
            <motion.span
              animate={{ scale: [1, 1.6, 1], opacity: [0.6, 0, 0.6] }}
              transition={{ duration: 2.2, repeat: Infinity, ease: "easeOut" }}
              style={{
                position: "absolute",
                width: "12px", height: "12px",
                borderRadius: "50%",
                background: "rgba(6,182,212,0.35)",
              }}
            />
            <span style={{ width: "5px", height: "5px", borderRadius: "50%", background: C, position: "relative" }} />
          </span>
          <span style={{
            fontFamily:    I,
            fontSize:      "11px",
            fontWeight:    600,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            color:         "rgba(6,182,212,0.90)",
          }}>
            Verified resale · Delivering July 8 · Limited availability
          </span>
        </div>
      </motion.div>

      {/* ── MAIN CONTENT — bottom-anchored ────────────────────── */}
      <div className="absolute inset-0 flex flex-col justify-end" style={{ zIndex: 2 }}>
        <div
          className="w-full max-w-[1380px] mx-auto px-6 sm:px-12 lg:px-20"
          style={{ paddingBottom: "clamp(2rem, 5vw, 4.5rem)" }}
        >

          {/* Eyebrow */}
          <motion.div
            {...up(0.15)}
            style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "clamp(1rem, 2.5vw, 1.75rem)" }}
          >
            <div style={{ width: "20px", height: "1px", background: "rgba(6,182,212,0.65)", flexShrink: 0 }} />
            <span style={{
              fontFamily:    I,
              fontSize:      "11px",
              fontWeight:    600,
              letterSpacing: "0.30em",
              textTransform: "uppercase",
              color:         "rgba(237,233,225,0.65)",
            }}>
              Official Verified Resale — Awakenings 2026
            </span>
          </motion.div>

          {/* ── Headline ──────────────────────────────────────── */}
          <div style={{ overflow: "hidden", marginBottom: "clamp(0.625rem, 1.2vw, 1rem)" }}>
            <motion.h1 {...reveal(0.28)} style={{ margin: 0, padding: 0 }}>
              <span style={{
                display:       "block",
                fontFamily:    I,
                fontWeight:    800,
                fontSize:      "clamp(2.5rem, 7vw, 6.25rem)",
                lineHeight:    0.88,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                color:         W,
              }}>
                Awakenings
              </span>
            </motion.h1>
          </div>

          {/* ── Value prop tagline ─────────────────────────────── */}
          <motion.p
            {...up(0.42)}
            style={{
              fontFamily:   I,
              fontSize:     "clamp(0.875rem, 1.7vw, 1.0625rem)",
              fontWeight:   400,
              color:        "rgba(237,233,225,0.52)",
              lineHeight:   1.55,
              marginBottom: "clamp(1rem, 2.2vw, 1.625rem)",
              maxWidth:     "500px",
            }}
          >
            Verified resale — name transfer included.
            Your ticket. Your name. Gate-ready by July 8.
          </motion.p>

          {/* Meta strip — date & location */}
          <motion.div {...up(0.52)}>
            <div style={{ width: "100%", height: "1px", background: "rgba(237,233,225,0.10)", marginBottom: "clamp(0.75rem, 1.4vw, 1.125rem)" }} />
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "0.5rem 2rem" }}>
              <span style={{ fontFamily: I, fontSize: "11px", fontWeight: 400, letterSpacing: "0.22em", textTransform: "uppercase", color: "rgba(237,233,225,0.45)" }}>
                July 10 — 12, 2026
              </span>
              <span style={{ fontFamily: I, fontSize: "11px", fontWeight: 400, letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(237,233,225,0.28)" }}>
                Beekse Bergen · Hilvarenbeek, NL
              </span>
            </div>
          </motion.div>

          {/* ── TRUST CHIPS — visible, readable, icon-led ─────── */}
          <motion.div
            {...fade(0.60, 1.0)}
            style={{
              display:   "flex",
              flexWrap:  "wrap",
              gap:       "7px",
              marginTop: "clamp(0.875rem, 1.8vw, 1.5rem)",
            }}
          >
            {TRUST.map(label => (
              <span
                key={label}
                style={{
                  display:       "inline-flex",
                  alignItems:    "center",
                  gap:           "7px",
                  fontFamily:    I,
                  fontSize:      "11px",
                  fontWeight:    600,
                  letterSpacing: "0.06em",
                  color:         "rgba(237,233,225,0.78)",
                  border:        "1px solid rgba(237,233,225,0.13)",
                  padding:       "5px 11px 5px 9px",
                  background:    "rgba(237,233,225,0.035)",
                }}
              >
                {/* Cyan dot */}
                <span style={{
                  width:        "4px",
                  height:       "4px",
                  borderRadius: "50%",
                  background:   "rgba(6,182,212,0.90)",
                  flexShrink:   0,
                }} />
                {label}
              </span>
            ))}
          </motion.div>

          {/* ── COUNTDOWN — own prominent row ─────────────────── */}
          <motion.div
            {...up(0.68)}
            style={{
              marginTop:  "clamp(1.25rem, 3vw, 2.5rem)",
              display:    "flex",
              alignItems: "baseline",
              gap:        "clamp(1.25rem, 3.5vw, 3rem)",
              flexWrap:   "wrap",
            }}
          >
            <CountUnit val={d} label="Days"  />
            <CountUnit val={h} label="Hours" />
            <CountUnit val={m} label="Min"   />
            <CountUnit val={s} label="Sec"   />

            {/* Separator + label */}
            <div style={{
              display:    "flex",
              alignItems: "center",
              gap:        "12px",
              alignSelf:  "center",
              paddingBottom: "4px",
            }}>
              <div style={{ width: "1px", height: "2rem", background: "rgba(237,233,225,0.10)" }} />
              <span style={{
                fontFamily:    I,
                fontSize:      "10px",
                fontWeight:    400,
                letterSpacing: "0.22em",
                textTransform: "uppercase",
                color:         "rgba(237,233,225,0.25)",
              }}>
                Until gates open
              </span>
            </div>
          </motion.div>

          {/* ── CTA ROW ───────────────────────────────────────── */}
          <motion.div
            {...up(0.82)}
            style={{
              marginTop:  "clamp(1.5rem, 3vw, 2.5rem)",
              display:    "flex",
              alignItems: "center",
              gap:        "clamp(0.875rem, 2vw, 1.5rem)",
              flexWrap:   "wrap",
            }}
          >
            {/* ── Primary CTA — FILLED, solid, action-driven ─── */}
            <button
              onClick={() => router.push("/tickets")}
              className="group relative overflow-hidden"
              style={{
                background:    C,
                border:        "none",
                padding:       "clamp(13px, 1.7vw, 17px) clamp(28px, 3.8vw, 52px)",
                cursor:        "pointer",
                display:       "flex",
                alignItems:    "center",
                gap:           "12px",
                transition:    "background 0.28s ease, transform 0.15s ease",
                flexShrink:    0,
              }}
              onMouseEnter={e => (e.currentTarget.style.background = "#22D3EE")}
              onMouseLeave={e => (e.currentTarget.style.background = C)}
              onMouseDown={e  => (e.currentTarget.style.transform  = "scale(0.97)")}
              onMouseUp={e    => (e.currentTarget.style.transform  = "scale(1)")}
            >
              <span style={{
                fontFamily:    I,
                fontWeight:    800,
                fontSize:      "clamp(11px, 1.2vw, 13px)",
                letterSpacing: "0.26em",
                textTransform: "uppercase",
                color:         "#040404",
              }}>
                Secure Your Ticket
              </span>
              <svg
                className="group-hover:translate-x-1 transition-transform duration-300"
                width="13" height="13" viewBox="0 0 13 13" fill="none"
                style={{ color: "#040404", flexShrink: 0 }}
              >
                <path
                  d="M1 6.5h11M7.5 2l4.5 4.5L7.5 11"
                  stroke="currentColor" strokeWidth="1.8"
                  strokeLinecap="round" strokeLinejoin="round"
                />
              </svg>
            </button>

            {/* ── Secondary CTA — text, scroll to lineup ──────── */}
            <a
              href="#lineup"
              style={{
                display:       "inline-flex",
                alignItems:    "center",
                gap:           "6px",
                fontFamily:    I,
                fontWeight:    500,
                fontSize:      "clamp(11px, 1.1vw, 12px)",
                letterSpacing: "0.20em",
                textTransform: "uppercase",
                color:         "rgba(237,233,225,0.38)",
                textDecoration: "none",
                transition:    "color 0.3s ease",
              }}
              onMouseEnter={e => (e.currentTarget.style.color = "rgba(237,233,225,0.75)")}
              onMouseLeave={e => (e.currentTarget.style.color = "rgba(237,233,225,0.38)")}
            >
              View Lineup
              {/* Down chevron */}
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none" style={{ flexShrink: 0 }}>
                <path
                  d="M2 3.5L5 6.5L8 3.5"
                  stroke="currentColor" strokeWidth="1.4"
                  strokeLinecap="round" strokeLinejoin="round"
                />
              </svg>
            </a>
          </motion.div>

          {/* ── SCARCITY LINE ─────────────────────────────────── */}
          <motion.p
            {...fade(1.0, 0.9)}
            style={{
              fontFamily:    I,
              fontSize:      "10px",
              fontWeight:    500,
              letterSpacing: "0.12em",
              color:         "rgba(237,233,225,0.24)",
              marginTop:     "clamp(0.75rem, 1.4vw, 1.125rem)",
            }}
          >
            Limited availability · Selling fast — once gone, there is no official resale source
          </motion.p>

        </div>
      </div>

      {/* ── SCROLL INDICATOR — more visible ───────────────────── */}
      <motion.div
        {...fade(2.2, 1.0)}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 pointer-events-none select-none"
        style={{ zIndex: 3, display: "flex", flexDirection: "column", alignItems: "center", gap: "8px" }}
      >
        <span style={{
          fontFamily:    I,
          fontSize:      "9px",
          letterSpacing: "0.42em",
          textTransform: "uppercase",
          color:         "rgba(237,233,225,0.32)",
        }}>
          Scroll
        </span>
        <div style={{ position: "relative", width: "1px", height: "36px", overflow: "hidden" }}>
          <motion.div
            animate={{ y: ["0%", "100%"] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: "linear" }}
            style={{
              position:   "absolute",
              top: 0, left: 0,
              width:      "1px",
              height:     "100%",
              background: "linear-gradient(to bottom, transparent, rgba(237,233,225,0.55), transparent)",
            }}
          />
        </div>
      </motion.div>

    </section>
  );
}
