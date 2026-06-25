"use client";

import { useEffect, useState } from "react";
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
const G = "#06B6D4";                              // gold
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
            <div style={{ width: "20px", height: "1px", background: `rgba(6,182,212,0.55)`, flexShrink: 0 }} />
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
                fontSize:      "clamp(2.25rem, 6vw, 5.25rem)",
                lineHeight:    0.92,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color:         W,
              }}>
                Awakenings
              </span>
            </motion.h1>
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
            {/* Countdown — inline editorial format: 15D  01H  13M  03S */}
            <div style={{ display: "flex", alignItems: "baseline", gap: "clamp(1.5rem, 3.5vw, 3rem)" }}>
              {units.map(({ val, label }) => (
                <motion.span
                  key={label}
                  style={{ display: "inline-flex", alignItems: "baseline", gap: "3px" }}
                >
                  <motion.span
                    key={val}
                    initial={{ opacity: 0.25, y: -3 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                    style={{
                      fontFamily:         I,
                      fontWeight:         600,
                      fontSize:           "clamp(1.625rem, 3.5vw, 2.875rem)",
                      lineHeight:         1,
                      letterSpacing:      "0.02em",
                      color:              W,
                      fontVariantNumeric: "tabular-nums",
                    }}
                  >
                    {String(val).padStart(2, "0")}
                  </motion.span>
                  <span style={{
                    fontFamily:    I,
                    fontWeight:    400,
                    fontSize:      "clamp(0.75rem, 1.4vw, 1.05rem)",
                    letterSpacing: "0.04em",
                    color:         G,
                    lineHeight:    1,
                  }}>
                    {label.charAt(0)}
                  </span>
                </motion.span>
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
                b.style.borderColor = "rgba(6,182,212,0.80)";
                b.style.background  = "rgba(6,182,212,0.08)";
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
