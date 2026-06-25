"use client";

import { Fragment, useEffect, useRef, useState } from "react";
import { useRouter }       from "next/navigation";
import { motion, useReducedMotion, animate } from "motion/react";

/* ── Countdown ────────────────────────────────────────────────────────── */
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

/* ── Count-up on mount (skill rec: "stat counter animations") ─────────── */
function useCountUp(target: number, duration = 1.8, delay = 0) {
  const [val, setVal] = useState(0);
  const done = useRef(false);
  useEffect(() => {
    if (done.current) return;
    done.current = true;
    const ctrl = animate(0, target, {
      duration,
      delay,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => setVal(Math.round(v)),
    });
    return () => ctrl.stop();
  }, [target, duration, delay]); // eslint-disable-line
  return val;
}

/* ── Tokens ───────────────────────────────────────────────────────────── */
const BEBAS = "var(--font-bebas, 'Bebas Neue', Impact, sans-serif)";
const INTER = "var(--font-inter, Inter, system-ui, sans-serif)";
const GOLD  = "#CA8A04";   // ui-ux-pro-max recommended CTA color
const WHITE = "#EDE9E1";   // warm white

/* ── Component ───────────────────────────────────────────────────────── */
export function CinematicHero() {
  const router      = useRouter();
  const prefersLess = useReducedMotion(); // skill checklist: prefers-reduced-motion
  const { d, h, m, s } = useCountdown(FESTIVAL_DATE);

  // Count-up only on first render (skill: "number count-up" effect)
  const days  = useCountUp(d, 1.6, 0.9);
  const hours = useCountUp(h, 1.4, 1.0);
  const mins  = useCountUp(m, 1.2, 1.1);
  const secs  = useCountUp(s, 1.0, 1.2);

  const units = [
    { live: d, display: days,  label: "Days"  },
    { live: h, display: hours, label: "Hrs"   },
    { live: m, display: mins,  label: "Min"   },
    { live: s, display: secs,  label: "Sec"   },
  ];

  /* Shared entrance props — respects prefers-reduced-motion */
  const up = (delay: number) => ({
    initial:    { opacity: 0, y: prefersLess ? 0 : 20 } as const,
    animate:    { opacity: 1, y: 0 } as const,
    transition: { duration: prefersLess ? 0.01 : 0.9, delay, ease: [0.16, 1, 0.3, 1] as const },
  });

  const blade = (delay: number) => ({
    initial:    { clipPath: prefersLess ? "inset(0)" : "inset(0 0 100% 0)", opacity: prefersLess ? 1 : 0.6 } as const,
    animate:    { clipPath: "inset(0 0 0% 0)", opacity: 1 } as const,
    transition: { duration: prefersLess ? 0.01 : 1.15, delay, ease: [0.16, 1, 0.3, 1] as const },
  });

  const ghost = (delay: number) => ({
    initial:    { opacity: 0 } as const,
    animate:    { opacity: 1 } as const,
    transition: { duration: prefersLess ? 0.01 : 3.5, delay, ease: "easeOut" as const },
  });

  return (
    <section
      className="relative overflow-hidden -mt-16 sm:-mt-20"
      style={{ height: "100vh", background: "#050505" }}
      aria-label="Awakenings Festival 2026 — Official Verified Resale"
    >

      {/* ── Video ──────────────────────────────────────────────────── */}
      <video
        autoPlay muted loop playsInline preload="auto" aria-hidden="true"
        poster="/festival-hero.png"
        className="absolute inset-0 w-full h-full object-cover"
        style={{ objectPosition: "center 28%", zIndex: 0 }}
      >
        <source src="/hero-bg.mp4" type="video/mp4" />
      </video>

      {/* ── Overlay: two-pass for perfect readability at all scroll positions */}
      <div aria-hidden="true" className="absolute inset-0 pointer-events-none" style={{ zIndex: 1,
        background: [
          "linear-gradient(to top,  rgba(4,4,4,0.97) 0%,   rgba(4,4,4,0.65) 44%, rgba(4,4,4,0.08) 100%)",
          "linear-gradient(to bottom, rgba(4,4,4,0.55) 0%, transparent 20%)",
        ].join(", "),
      }} />

      {/* ── Ghost watermark ─────────────────────────────────────────── */}
      <motion.span
        {...ghost(1.4)}
        aria-hidden="true"
        className="absolute pointer-events-none select-none"
        style={{
          bottom: "-4%", right: "-2%", zIndex: 1,
          fontFamily: BEBAS, fontSize: "min(58vw, 860px)",
          lineHeight: 1, letterSpacing: "0.08em", textTransform: "uppercase",
          color: "rgba(237,233,225,0.025)",
        }}
      >
        2026
      </motion.span>

      {/* ── Content ─────────────────────────────────────────────────── */}
      <div className="absolute inset-0 flex flex-col justify-end" style={{ zIndex: 2 }}>
        <div
          className="w-full max-w-[1380px] mx-auto px-6 sm:px-12 lg:px-20"
          style={{ paddingBottom: "clamp(2.5rem, 5vw, 5rem)" }}
        >

          {/* Eyebrow */}
          <motion.div {...up(0.15)} style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "clamp(1rem, 2.5vw, 2rem)" }}>
            <div style={{ width: "18px", height: "1px", background: `rgba(202,138,4,0.60)`, flexShrink: 0 }} />
            <span style={{ fontFamily: INTER, fontSize: "11px", fontWeight: 600, letterSpacing: "0.28em", textTransform: "uppercase", color: "rgba(237,233,225,0.55)" }}>
              Official Verified Resale
            </span>
          </motion.div>

          {/* ── Main headline — Bebas Neue (skill: "Bold Statement" for events) */}
          <div style={{ overflow: "hidden", lineHeight: 1, marginBottom: "clamp(0.2rem, 0.6vw, 0.5rem)" }}>
            <motion.h1 {...blade(0.28)} style={{ margin: 0, padding: 0 }}>
              <span style={{
                display:       "block",
                fontFamily:    BEBAS,
                fontSize:      "clamp(4.5rem, 14vw, 12.5rem)",
                lineHeight:    0.90,
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                color:         WHITE,
              }}>
                Awakenings
              </span>
            </motion.h1>
          </div>

          {/* Subtitle */}
          <div style={{ overflow: "hidden", marginBottom: "clamp(1.5rem, 3.5vw, 3rem)" }}>
            <motion.div {...blade(0.44)} style={{ display: "flex", alignItems: "center", gap: "clamp(0.75rem, 2vw, 1.75rem)", flexWrap: "wrap" }}>
              <span style={{ fontFamily: BEBAS, fontSize: "clamp(1.5rem, 3.8vw, 3.25rem)", letterSpacing: "0.08em", textTransform: "uppercase", color: GOLD, lineHeight: 1 }}>
                Festival
              </span>
              <div style={{ width: "1px", height: "clamp(1.2rem, 2.5vw, 2rem)", background: "rgba(237,233,225,0.20)", flexShrink: 0, alignSelf: "center" }} />
              <span style={{ fontFamily: BEBAS, fontSize: "clamp(1.5rem, 3.8vw, 3.25rem)", letterSpacing: "0.08em", textTransform: "uppercase", color: "rgba(237,233,225,0.45)", lineHeight: 1 }}>
                2026
              </span>
            </motion.div>
          </div>

          {/* Meta strip */}
          <motion.div {...up(0.60)}>
            <div style={{ width: "100%", height: "1px", background: "rgba(237,233,225,0.12)", marginBottom: "clamp(0.75rem, 1.5vw, 1.25rem)" }} />
            <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: "0.5rem 2rem" }}>
              <span style={{ fontFamily: INTER, fontSize: "11px", fontWeight: 400, letterSpacing: "0.22em", textTransform: "uppercase", color: "rgba(237,233,225,0.50)" }}>
                July 10 — 12, 2026
              </span>
              <span style={{ fontFamily: INTER, fontSize: "11px", fontWeight: 400, letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(237,233,225,0.30)" }}>
                Beekse Bergen · Hilvarenbeek, NL
              </span>
            </div>
          </motion.div>

          {/* ── Action strip ─────────────────────────────────────────── */}
          <motion.div
            {...up(0.80)}
            style={{
              marginTop:      "clamp(1.75rem, 4vw, 3.5rem)",
              display:        "flex",
              alignItems:     "center",
              justifyContent: "space-between",
              flexWrap:       "wrap",
              gap:            "2rem",
            }}
          >

            {/* Countdown — count-up on mount, live ticks after */}
            <div style={{ display: "flex", alignItems: "flex-start", gap: 0 }}>
              {units.map(({ live, display, label }, i) => (
                <Fragment key={label}>
                  <div style={{
                    display: "flex", flexDirection: "column", alignItems: "flex-start",
                    paddingLeft:  i === 0 ? 0 : "clamp(1rem, 2.2vw, 1.75rem)",
                    paddingRight: i === 3 ? 0 : "clamp(1rem, 2.2vw, 1.75rem)",
                  }}>
                    {/* Number */}
                    <motion.span
                      key={live}
                      initial={{ opacity: 0.25, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                      style={{
                        fontFamily: BEBAS,
                        fontSize:   "clamp(2.75rem, 6.5vw, 5.5rem)",
                        lineHeight: 0.90,
                        letterSpacing: "0.04em",
                        color:      WHITE,
                        display:    "block",
                        fontVariantNumeric: "tabular-nums",
                      }}
                      aria-label={`${display} ${label}`}
                    >
                      {String(display).padStart(2, "0")}
                    </motion.span>
                    {/* Label */}
                    <span style={{
                      fontFamily: INTER, fontWeight: 500,
                      fontSize: "9px", letterSpacing: "0.30em", textTransform: "uppercase",
                      color: `rgba(202,138,4,0.75)`, marginTop: "7px",
                    }}>
                      {label}
                    </span>
                  </div>
                  {i < 3 && (
                    <div style={{ width: "1px", height: "clamp(2.75rem, 6.5vw, 5.5rem)", background: "rgba(237,233,225,0.12)", flexShrink: 0 }} />
                  )}
                </Fragment>
              ))}
            </div>

            {/* CTA — skill rec: #CA8A04, 44×44 min touch target, cursor-pointer */}
            <button
              onClick={() => router.push("/tickets")}
              style={{
                background:     "rgba(202,138,4,0.08)",
                border:         "1px solid rgba(202,138,4,0.55)",
                padding:        "clamp(13px, 1.5vw, 17px) clamp(24px, 3vw, 44px)",
                minHeight:      "44px",   // skill checklist: 44×44px touch targets
                cursor:         "pointer", // skill checklist: cursor-pointer
                display:        "flex",
                alignItems:     "center",
                gap:            "12px",
                flexShrink:     0,
                transition:     "background 0.25s ease, border-color 0.25s ease, transform 0.15s ease",
                outline:        "none",
              }}
              onMouseEnter={e => {
                const b = e.currentTarget as HTMLButtonElement;
                b.style.background   = "rgba(202,138,4,0.18)";
                b.style.borderColor  = "rgba(202,138,4,0.90)";
              }}
              onMouseLeave={e => {
                const b = e.currentTarget as HTMLButtonElement;
                b.style.background   = "rgba(202,138,4,0.08)";
                b.style.borderColor  = "rgba(202,138,4,0.55)";
              }}
              onFocus={e => { // skill checklist: focus states visible
                (e.currentTarget as HTMLButtonElement).style.outline = `2px solid rgba(202,138,4,0.80)`;
              }}
              onBlur={e => {
                (e.currentTarget as HTMLButtonElement).style.outline = "none";
              }}
              onMouseDown={e => { (e.currentTarget as HTMLButtonElement).style.transform = "scale(0.97)"; }}
              onMouseUp={e   => { (e.currentTarget as HTMLButtonElement).style.transform = "scale(1)"; }}
              aria-label="Browse available tickets"
            >
              <span style={{ fontFamily: INTER, fontWeight: 700, fontSize: "clamp(11px, 1.2vw, 13px)", letterSpacing: "0.22em", textTransform: "uppercase", color: GOLD }}>
                Browse Tickets
              </span>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true"
                style={{ color: GOLD, flexShrink: 0, transition: "transform 0.3s ease" }}
                className="group-hover:translate-x-1">
                <path d="M1 7h12M8 2l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>

          </motion.div>
        </div>
      </div>

      {/* ── Animated scroll cue ─────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 2.2, ease: "easeOut" }}
        className="absolute bottom-7 left-1/2 -translate-x-1/2 pointer-events-none select-none"
        style={{ zIndex: 3, display: "flex", flexDirection: "column", alignItems: "center", gap: "6px" }}
        aria-hidden="true"
      >
        <span style={{ fontFamily: INTER, fontSize: "7px", letterSpacing: "0.46em", textTransform: "uppercase", color: "rgba(237,233,225,0.18)" }}>
          Scroll
        </span>
        <div style={{ position: "relative", width: "1px", height: "30px", overflow: "hidden" }}>
          <motion.div
            animate={prefersLess ? {} : { y: ["0%", "110%"] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
            style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, transparent, rgba(202,138,4,0.55), transparent)" }}
          />
        </div>
      </motion.div>

    </section>
  );
}
