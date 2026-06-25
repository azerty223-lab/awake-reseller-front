"use client";

import { Fragment, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";

/* ── Festival countdown ─────────────────────────────────────────────── */
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

/* ── Design tokens ──────────────────────────────────────────────────── */
const W = "#EDE9E1";                              // warm white
const G = "#B8923A";                              // gold
const I = "var(--font-inter, Inter, system-ui, sans-serif)";

/* ── Reusable entrance variants ─────────────────────────────────────── */
const up = (delay: number) => ({
  initial:    { opacity: 0, y: 22 } as const,
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

/* ── Component ──────────────────────────────────────────────────────── */
export function CinematicHero() {
  const router = useRouter();
  const { d, h, m, s } = useCountdown(FESTIVAL_DATE);

  const units = [
    { val: d, label: "Days"  },
    { val: h, label: "Hours" },
    { val: m, label: "Min"   },
    { val: s, label: "Sec"   },
  ];

  return (
    <section
      className="relative overflow-hidden -mt-16 sm:-mt-20"
      style={{ height: "100vh", background: "#050505" }}
    >

      {/* ── Video ─────────────────────────────────────────────────── */}
      <video
        autoPlay muted loop playsInline preload="auto" aria-hidden="true"
        poster="/festival-hero.png"
        className="absolute inset-0 w-full h-full object-cover"
        style={{ objectPosition: "center 28%", zIndex: 0 }}
      >
        <source src="/hero-bg.mp4" type="video/mp4" />
      </video>

      {/* ── Layered overlay ───────────────────────────────────────── */}
      {/* Bottom 60% darkens to near-black so text is always crisp   */}
      <div aria-hidden="true" className="absolute inset-0 pointer-events-none" style={{ zIndex: 1,
        background: [
          "linear-gradient(to top, rgba(4,4,4,0.98) 0%, rgba(4,4,4,0.70) 42%, rgba(4,4,4,0.10) 100%)",
          "linear-gradient(to bottom, rgba(4,4,4,0.50) 0%, transparent 18%)",
        ].join(", "),
      }} />

      {/* ── Ghost watermark ───────────────────────────────────────── */}
      <motion.span
        {...fade(1.2, 3.0)}
        aria-hidden="true"
        className="absolute pointer-events-none select-none"
        style={{
          bottom: "-6%", right: "-2%",
          fontFamily: I, fontWeight: 900,
          fontSize: "min(55vw, 820px)",
          lineHeight: 1, letterSpacing: "0.10em",
          textTransform: "uppercase",
          color: "rgba(237,233,225,0.022)",
          zIndex: 1,
        }}
      >
        2026
      </motion.span>

      {/* ── Content ───────────────────────────────────────────────── */}
      <div className="absolute inset-0 flex flex-col justify-end" style={{ zIndex: 2 }}>
        <div
          className="w-full max-w-[1380px] mx-auto px-6 sm:px-12 lg:px-20"
          style={{ paddingBottom: "clamp(2.5rem, 5.5vw, 5rem)" }}
        >

          {/* Eyebrow */}
          <motion.div {...up(0.15)} style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "clamp(1.25rem, 3vw, 2.5rem)" }}>
            <div style={{ width: "20px", height: "1px", background: `rgba(184,146,58,0.55)`, flexShrink: 0 }} />
            <span style={{ fontFamily: I, fontSize: "11px", fontWeight: 600, letterSpacing: "0.32em", textTransform: "uppercase", color: "rgba(237,233,225,0.55)" }}>
              Official Verified Resale
            </span>
          </motion.div>

          {/* ── Headline ──────────────────────────────────────────── */}
          <div style={{ overflow: "hidden", marginBottom: "clamp(0.35rem, 0.8vw, 0.6rem)" }}>
            <motion.h1
              {...reveal(0.30)}
              style={{ margin: 0, padding: 0 }}
            >
              <span style={{
                display:       "block",
                fontFamily:    I,
                fontWeight:    800,
                fontSize:      "clamp(3.25rem, 9.5vw, 8.5rem)",
                lineHeight:    0.92,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color:         W,
              }}>
                Awakenings
              </span>
            </motion.h1>
          </div>

          {/* Subtitle row */}
          <div style={{ overflow: "hidden", marginBottom: "clamp(1.5rem, 3.5vw, 3rem)" }}>
            <motion.div {...reveal(0.48)} style={{ display: "flex", alignItems: "baseline", gap: "clamp(1rem, 2.5vw, 2rem)", flexWrap: "wrap" }}>
              <span style={{
                fontFamily:    I,
                fontWeight:    700,
                fontSize:      "clamp(1rem, 2.4vw, 2.1rem)",
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                color:         G,
                lineHeight:    1,
              }}>
                Festival
              </span>
              <span style={{ width: "1px", height: "clamp(1rem, 2vw, 1.5rem)", background: "rgba(237,233,225,0.18)", flexShrink: 0, alignSelf: "center" }} />
              <span style={{
                fontFamily:    I,
                fontWeight:    500,
                fontSize:      "clamp(1rem, 2.4vw, 2.1rem)",
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                color:         "rgba(237,233,225,0.55)",
                lineHeight:    1,
              }}>
                2026
              </span>
            </motion.div>
          </div>

          {/* Meta strip */}
          <motion.div {...up(0.62)}>
            <div style={{ width: "100%", height: "1px", background: "rgba(237,233,225,0.10)", marginBottom: "clamp(0.875rem, 1.8vw, 1.5rem)" }} />
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "0.5rem 2rem" }}>
              <span style={{ fontFamily: I, fontSize: "11px", fontWeight: 400, letterSpacing: "0.22em", textTransform: "uppercase", color: "rgba(237,233,225,0.45)" }}>
                July 10 — 12, 2026
              </span>
              <span style={{ fontFamily: I, fontSize: "11px", fontWeight: 400, letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(237,233,225,0.30)" }}>
                Beekse Bergen · Hilvarenbeek, NL
              </span>
            </div>
          </motion.div>

          {/* ── Action strip: countdown + CTA ─────────────────────── */}
          <motion.div
            {...up(0.82)}
            style={{
              marginTop:      "clamp(2rem, 4.5vw, 4rem)",
              display:        "flex",
              alignItems:     "center",
              justifyContent: "space-between",
              flexWrap:       "wrap",
              gap:            "2rem",
            }}
          >
            {/* Countdown */}
            <div style={{ display: "flex", alignItems: "flex-start", gap: 0 }}>
              {units.map(({ val, label }, i) => (
                <Fragment key={label}>
                  <div style={{
                    display:       "flex",
                    flexDirection: "column",
                    alignItems:    "flex-start",
                    paddingLeft:   i === 0 ? 0 : "clamp(1.1rem, 2.5vw, 2rem)",
                    paddingRight:  i === 3 ? 0 : "clamp(1.1rem, 2.5vw, 2rem)",
                  }}>
                    {/* Animated digit */}
                    <motion.span
                      key={val}
                      initial={{ opacity: 0.2, y: -4 }}
                      animate={{ opacity: 1,   y: 0  }}
                      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                      style={{
                        fontFamily:         I,
                        fontWeight:         700,
                        fontSize:           "clamp(2.5rem, 6vw, 5rem)",
                        lineHeight:         1,
                        letterSpacing:      "0.06em",
                        color:              W,
                        fontVariantNumeric: "tabular-nums",
                        display:            "block",
                      }}
                    >
                      {String(val).padStart(2, "0")}
                    </motion.span>
                    {/* Label */}
                    <span style={{
                      fontFamily:    I,
                      fontWeight:    500,
                      fontSize:      "9px",
                      letterSpacing: "0.32em",
                      textTransform: "uppercase",
                      color:         `rgba(184,146,58,0.70)`,
                      marginTop:     "8px",
                      display:       "block",
                    }}>
                      {label}
                    </span>
                  </div>
                  {i < 3 && (
                    <div style={{
                      width:      "1px",
                      height:     "clamp(2.5rem, 6vw, 5rem)",
                      background: "rgba(237,233,225,0.12)",
                      flexShrink: 0,
                    }} />
                  )}
                </Fragment>
              ))}
            </div>

            {/* CTA button */}
            <button
              onClick={() => router.push("/tickets")}
              className="group relative overflow-hidden"
              style={{
                background:    "transparent",
                border:        "1px solid rgba(237,233,225,0.38)",
                padding:       "clamp(12px, 1.6vw, 16px) clamp(24px, 3vw, 40px)",
                cursor:        "pointer",
                display:       "flex",
                alignItems:    "center",
                gap:           "12px",
                transition:    "border-color 0.4s ease, background 0.4s ease",
                flexShrink:    0,
              }}
              onMouseEnter={e => {
                const b = e.currentTarget as HTMLButtonElement;
                b.style.borderColor = "rgba(184,146,58,0.80)";
                b.style.background  = "rgba(184,146,58,0.08)";
              }}
              onMouseLeave={e => {
                const b = e.currentTarget as HTMLButtonElement;
                b.style.borderColor = "rgba(237,233,225,0.38)";
                b.style.background  = "transparent";
              }}
            >
              <span style={{
                fontFamily:    I,
                fontWeight:    700,
                fontSize:      "clamp(11px, 1.2vw, 13px)",
                letterSpacing: "0.24em",
                textTransform: "uppercase",
                color:         W,
              }}>
                Browse Tickets
              </span>
              {/* Arrow */}
              <svg
                className="group-hover:translate-x-1 transition-transform duration-400"
                width="13" height="13" viewBox="0 0 13 13" fill="none"
                style={{ color: W, flexShrink: 0 }}
              >
                <path d="M1 6.5h11M7.5 2l4.5 4.5L7.5 11" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>

          </motion.div>
        </div>
      </div>

      {/* ── Scroll indicator ──────────────────────────────────────── */}
      <motion.div
        {...fade(2.0, 1.0)}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 pointer-events-none select-none"
        style={{ zIndex: 3, display: "flex", flexDirection: "column", alignItems: "center", gap: "8px" }}
      >
        <span style={{ fontFamily: I, fontSize: "7px", letterSpacing: "0.50em", textTransform: "uppercase", color: "rgba(237,233,225,0.18)" }}>
          Scroll
        </span>
        {/* Animated descending line */}
        <div style={{ position: "relative", width: "1px", height: "32px", overflow: "hidden" }}>
          <motion.div
            animate={{ y: ["0%", "100%"] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: "linear" }}
            style={{ position: "absolute", top: 0, left: 0, width: "1px", height: "100%", background: "linear-gradient(to bottom, transparent, rgba(237,233,225,0.35), transparent)" }}
          />
        </div>
      </motion.div>

    </section>
  );
}
