"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

// ── Countdown ─────────────────────────────────────────────────────────────────
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

// ── Shared entrance animation factory ─────────────────────────────────────────
// Each layer enters with a staggered delay for a composed, cinematic reveal.
const enter = (delay: number) => ({
  initial:    { opacity: 0, y: 16 } as const,
  animate:    { opacity: 1, y: 0  } as const,
  transition: { duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] as const },
});

// ── Design tokens (kept co-located for easy tuning) ───────────────────────────
const GOLD         = "#C9A84C";
const GOLD_LIGHT   = "#E8CC78";
const GOLD_GRAD    = `linear-gradient(90deg, ${GOLD} 0%, ${GOLD_LIGHT} 50%, ${GOLD} 100%)`;
const INTER        = "var(--font-inter, Inter, system-ui, sans-serif)";
const PLAYFAIR     = "var(--font-playfair)";

// ── Component ─────────────────────────────────────────────────────────────────
export function CinematicHero() {
  const router   = useRouter();
  const { d, h, m, s } = useCountdown(FESTIVAL_DATE);

  return (
    /*
     * -mt-16 sm:-mt-20 negates <main>'s pt-16 sm:pt-20 so the hero is
     * truly full-bleed behind the transparent navbar.
     */
    <section
      className="relative overflow-hidden -mt-16 sm:-mt-20"
      style={{ height: "100vh" }}
    >

      {/* ── Background video ────────────────────────────────────────────── */}
      <video
        autoPlay muted loop playsInline aria-hidden="true"
        className="absolute inset-0 w-full h-full object-cover"
        style={{ objectPosition: "center 30%", zIndex: 0 }}
      >
        <source src="/hero.mp4" type="video/mp4" />
      </video>

      {/*
       * ── Cinematic overlay ────────────────────────────────────────────────
       * Transparent at the top so the crowd energy stays visible.
       * Graduates to near-opaque at the bottom where text lives.
       * The gold radial adds a subtle brand warmth from above.
       */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{
          zIndex: 1,
          background: [
            "linear-gradient(to top, rgba(0,0,0,0.94) 0%, rgba(0,0,0,0.40) 54%, rgba(0,0,0,0.10) 100%)",
            `radial-gradient(ellipse 80% 40% at 50% 0%, rgba(201,168,76,0.09), transparent 65%)`,
          ].join(", "),
        }}
      />

      {/* ── Content — bottom-anchored, left-aligned editorial layout ────── */}
      <div
        className="absolute inset-0 flex flex-col justify-end"
        style={{ zIndex: 2 }}
      >
        <div
          className="w-full max-w-[1380px] mx-auto px-6 sm:px-12 lg:px-20"
          style={{ paddingBottom: "clamp(3rem, 7vw, 6rem)" }}
        >

          {/* ── Eyebrow ───────────────────────────────────────────────────
           * Ultra-small, ultra-tracked caps. The gold rule acts as a
           * visual anchor — restraint here amplifies the headline below.
           */}
          <motion.div
            {...enter(0.15)}
            style={{ display: "flex", alignItems: "center", gap: "14px", marginBottom: "clamp(1.75rem, 3.5vw, 2.75rem)" }}
          >
            <span style={{ display: "block", width: "18px", height: "1px", background: GOLD, flexShrink: 0 }} />
            <span
              style={{
                fontFamily:    INTER,
                fontSize:      "9px",
                fontWeight:    500,
                textTransform: "uppercase",
                letterSpacing: "0.4em",
                color:         "rgba(255,255,255,0.45)",
              }}
            >
              Official Verified Resale
            </span>
          </motion.div>

          {/* ── Primary headline ──────────────────────────────────────────
           *
           * TWO-TIER SCALE — the luxury signal:
           *
           * "Awakenings"   → massive, dominant, full-weight serif
           *                  (brand mark, owns the space)
           *
           * "Festival 2026" → intentionally much smaller, lighter weight,
           *                   gold-tinted, wide tracking
           *                   (descriptor, refines without competing)
           *
           * The dramatic scale jump is the editorial hierarchy —
           * the same pattern as "BALENCIAGA / Paris" or "DIOR / Haute Couture".
           * Both lines share the h1 for correct DOM/SEO semantics.
           */}
          <motion.h1
            {...enter(0.3)}
            style={{ margin: 0, padding: 0 }}
          >
            <span
              className="block"
              style={{
                fontFamily:    PLAYFAIR,
                fontWeight:    900,
                fontSize:      "clamp(4.25rem, 12vw, 10rem)",
                lineHeight:    0.87,
                letterSpacing: "-0.035em",
                color:         "#fff",
                textShadow:    "0 8px 80px rgba(0,0,0,0.40)",
              }}
            >
              Awakenings
            </span>

            <span
              className="block"
              style={{
                fontFamily:    PLAYFAIR,
                fontWeight:    400,
                fontSize:      "clamp(1.05rem, 2.3vw, 1.9rem)",
                lineHeight:    1,
                letterSpacing: "0.12em",
                marginTop:     "clamp(0.55rem, 1.1vw, 0.95rem)",
                background:    GOLD_GRAD,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor:  "transparent",
                backgroundClip:       "text",
              }}
            >
              Festival 2026
            </span>
          </motion.h1>

          {/* ── Location metadata ─────────────────────────────────────────
           * Treated as a luxury address line — very small, very tracked,
           * muted. Information without decoration.
           */}
          <motion.p
            {...enter(0.45)}
            style={{
              fontFamily:    INTER,
              fontWeight:    400,
              fontSize:      "clamp(0.65rem, 1vw, 0.78rem)",
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              color:         "rgba(255,255,255,0.35)",
              marginTop:     "clamp(1.75rem, 3.5vw, 2.5rem)",
              marginBottom:  0,
            }}
          >
            July 10–12&ensp;·&ensp;Amsterdam&ensp;·&ensp;Gashouder &amp; Hembrugterrein
          </motion.p>

          {/* ── Gold rule — separates metadata from the action row ──────── */}
          <motion.div
            {...enter(0.52)}
            style={{
              width:      "28px",
              height:     "1px",
              background: `rgba(201,168,76,0.40)`,
              margin:     "clamp(1.25rem, 2.8vw, 2rem) 0",
            }}
          />

          {/* ── Action row: countdown + CTA ───────────────────────────────
           * Countdown uses a "label above / number below" pattern —
           * reads like a luxury timepiece rather than a generic web widget.
           * Labels are gold (brand accent), numbers are white serif.
           */}
          <motion.div
            {...enter(0.62)}
            style={{
              display:    "flex",
              flexDirection: "row",
              alignItems: "flex-end",
              flexWrap:   "wrap",
              gap:        "clamp(1.5rem, 4vw, 0px)",
            }}
          >
            {/* Countdown units */}
            <div
              style={{
                display: "flex",
                alignItems: "flex-end",
                gap: "clamp(1.25rem, 3vw, 2.25rem)",
                paddingRight: "clamp(1.5rem, 3.5vw, 2.5rem)",
              }}
            >
              {[
                { val: d, label: "Days" },
                { val: h, label: "Hrs"  },
                { val: m, label: "Min"  },
                { val: s, label: "Sec"  },
              ].map(({ val, label }) => (
                <div
                  key={label}
                  style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: "6px" }}
                >
                  {/* Label above — gold, micro */}
                  <span
                    style={{
                      fontFamily:    INTER,
                      fontSize:      "8px",
                      fontWeight:    500,
                      textTransform: "uppercase",
                      letterSpacing: "0.24em",
                      color:         GOLD,
                    }}
                  >
                    {label}
                  </span>
                  {/* Number — dominant serif */}
                  <span
                    style={{
                      fontFamily:         PLAYFAIR,
                      fontWeight:         900,
                      fontSize:           "clamp(1.75rem, 3.8vw, 2.75rem)",
                      lineHeight:         1,
                      letterSpacing:      "-0.025em",
                      color:              "#fff",
                      fontVariantNumeric: "tabular-nums",
                    }}
                  >
                    {String(val).padStart(2, "0")}
                  </span>
                </div>
              ))}
            </div>

            {/* Vertical separator — only on wider viewports */}
            <div
              className="hidden sm:block shrink-0"
              style={{
                width:      "1px",
                height:     "40px",
                background: "rgba(255,255,255,0.10)",
                marginRight: "clamp(1.5rem, 3.5vw, 2.5rem)",
              }}
            />

            {/*
             * ── CTA button ─────────────────────────────────────────────────
             * Sharp 2px radius (vs pill) signals luxury/fashion.
             * Medium-weight, tracked uppercase, small text — refined, precise.
             * The gold fill is the single moment of brand warmth in the layout.
             */}
            <button
              onClick={() => router.push("/tickets")}
              className="group flex items-center gap-2.5"
              style={{
                background:   `linear-gradient(135deg, ${GOLD} 0%, ${GOLD_LIGHT} 100%)`,
                padding:      "12px 24px",
                borderRadius: "2px",
                border:       "none",
                cursor:       "pointer",
                transition:   "transform 0.35s cubic-bezier(0.22,1,0.36,1), box-shadow 0.35s ease",
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLButtonElement;
                el.style.transform  = "translateY(-2px)";
                el.style.boxShadow  = "0 0 40px rgba(201,168,76,0.40), 0 6px 20px rgba(0,0,0,0.30)";
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLButtonElement;
                el.style.transform  = "none";
                el.style.boxShadow  = "none";
              }}
            >
              <span
                style={{
                  fontFamily:    INTER,
                  fontWeight:    500,
                  fontSize:      "10px",
                  letterSpacing: "0.20em",
                  textTransform: "uppercase",
                  color:         "#000",
                }}
              >
                Browse Tickets
              </span>
              <ArrowRight
                className="group-hover:translate-x-px transition-transform duration-300"
                style={{ width: "12px", height: "12px", color: "#000" }}
              />
            </button>

          </motion.div>
        </div>
      </div>

      {/* ── Scroll cue — minimal, bottom-right ──────────────────────────── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.7 }}
        className="absolute bottom-8 right-8 sm:right-12 lg:right-20 z-10 pointer-events-none select-none"
        style={{ display: "flex", alignItems: "center", gap: "12px" }}
      >
        <span
          style={{
            fontFamily:    INTER,
            fontSize:      "8px",
            textTransform: "uppercase",
            letterSpacing: "0.38em",
            color:         "rgba(255,255,255,0.20)",
          }}
        >
          Scroll
        </span>
        <div style={{ width: "28px", height: "1px", background: "rgba(255,255,255,0.12)" }} />
      </motion.div>

    </section>
  );
}
