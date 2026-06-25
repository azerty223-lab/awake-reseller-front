"use client";

import { Fragment, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

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

// Cinematic fade â€” no movement. Used for the headline so it feels like a film dissolve.
const dissolve = (delay: number, duration = 1.4) => ({
  initial:    { opacity: 0 } as const,
  animate:    { opacity: 1 } as const,
  transition: { duration, delay, ease: "easeOut" } as const,
});

// Precise rise â€” minimal vertical movement. Used for supporting content.
const rise = (delay: number) => ({
  initial:    { opacity: 0, y: 14 } as const,
  animate:    { opacity: 1, y: 0  } as const,
  transition: { duration: 1.1, delay, ease: [0.16, 1, 0.3, 1] as const },
});

// Design tokens
const WARM_WHITE = "#EDE9E1"; // off-white â€” warm, cinematic, not clinical
const GOLD       = "#B8923A"; // darker gold â€” more industrial, less decorative
const INTER      = "var(--font-inter, Inter, system-ui, sans-serif)";
const SERIF      = "var(--font-playfair)";

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
      style={{ height: "100vh", background: "#080808" }}
    >

      {/* Video */}
      <video
        autoPlay muted loop playsInline aria-hidden="true"
        className="absolute inset-0 w-full h-full object-cover"
        style={{ objectPosition: "center 28%", zIndex: 0 }}
      >
        <source src="/hero-bg.mp4" type="video/mp4" />
      </video>

      {/* Overlay â€” sharp darkening at bottom, nearly transparent at top */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{
          zIndex: 1,
          background:
            "linear-gradient(to top, rgba(5,5,5,0.97) 0%, rgba(5,5,5,0.60) 38%, rgba(5,5,5,0.12) 100%)",
        }}
      />

      {/* Ghost year â€” architectural background element.
          Type at this scale becomes texture, not information.
          Acne Studios / editorial technique: let the letter-forms own the space. */}
      <motion.span
        {...dissolve(1.0, 2.4)}
        aria-hidden="true"
        className="absolute pointer-events-none select-none"
        style={{
          bottom:        "-8%",
          right:         "-3%",
          fontFamily:    SERIF,
          fontWeight:    900,
          fontSize:      "min(52vw, 780px)",
          lineHeight:    1,
          letterSpacing: "-0.06em",
          color:         "rgba(237,233,225,0.028)",
          zIndex:        1,
        }}
      >
        2026
      </motion.span>

      {/* Content layer */}
      <div className="absolute inset-0 flex flex-col justify-end" style={{ zIndex: 2 }}>
        <div
          className="w-full max-w-[1380px] mx-auto px-6 sm:px-12 lg:px-20"
          style={{ paddingBottom: "clamp(3rem, 6.5vw, 5.5rem)" }}
        >

          {/* â”€â”€ Eyebrow â”€â”€ */}
          <motion.div
            {...rise(0.1)}
            style={{
              display:       "flex",
              alignItems:    "center",
              gap:           "12px",
              marginBottom:  "clamp(1.5rem, 3.8vw, 3.25rem)",
            }}
          >
            <span style={{
              width:      "16px",
              height:     "1px",
              background: `rgba(184,146,58,0.50)`,
              flexShrink: 0,
            }} />
            <span style={{
              fontFamily:    INTER,
              fontSize:      "11px",
              fontWeight:    400,
              textTransform: "uppercase",
              letterSpacing: "0.28em",
              color:         "rgba(237,233,225,0.50)",
            }}>
              Official Verified Resale
            </span>
          </motion.div>

          {/* â”€â”€ Monumental headline â”€â”€
              The headline IS the layout. It absorbs the space.
              No decoration. No shadow. No gradient. Just mass. */}
          <motion.h1
            {...dissolve(0.15, 1.6)}
            style={{ margin: 0, padding: 0 }}
          >
            <span
              className="block"
              style={{
                fontFamily:    SERIF,
                fontWeight:    900,
                fontSize:      "clamp(5rem, 15.5vw, 13.5rem)",
                lineHeight:    0.84,
                letterSpacing: "-0.048em",
                color:         WARM_WHITE,
              }}
            >
              Awakenings
            </span>
          </motion.h1>

          {/* â”€â”€ Info band â”€â”€
              Full-width rule acts as a horizon line between the monument
              and the information below. Year + location read as a single caption. */}
          <motion.div
            {...rise(0.45)}
            style={{ marginTop: "clamp(1.75rem, 3.8vw, 3.25rem)" }}
          >
            <div style={{
              width:        "100%",
              height:       "1px",
              background:   "rgba(237,233,225,0.06)",
              marginBottom: "clamp(0.85rem, 1.8vw, 1.5rem)",
            }} />

            {/* Two-column caption: year left, location right */}
            <div style={{
              display:        "flex",
              justifyContent: "space-between",
              alignItems:     "baseline",
              flexWrap:       "wrap",
              gap:            "0.75rem 2rem",
            }}>
              <span style={{
                fontFamily:    INTER,
                fontSize:      "12px",
                fontWeight:    400,
                letterSpacing: "0.20em",
                textTransform: "uppercase",
                color:         "rgba(237,233,225,0.55)",
              }}>
                10&thinsp;â€”&thinsp;12 July&ensp;Â·&ensp;2026
              </span>
              <span style={{
                fontFamily:    INTER,
                fontSize:      "12px",
                fontWeight:    400,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color:         "rgba(237,233,225,0.40)",
              }}>
                Amsterdam&ensp;Â·&ensp;Gashouder&thinsp;+&thinsp;Hembrug
              </span>
            </div>
          </motion.div>

          {/* â”€â”€ Countdown + CTA â”€â”€
              Numbers are ultra-thin (weight 100): the luxury/fashion move.
              Tension comes from the contrast between the massive bold headline
              and these hairline numerals â€” not from decoration.
              CTA has no box, no border. Opacity at rest â†’ full on hover. */}
          <motion.div
            {...rise(0.65)}
            style={{
              marginTop:  "clamp(2.5rem, 5.5vw, 4.5rem)",
              display:    "flex",
              alignItems: "flex-end",
              flexWrap:   "wrap",
              columnGap:  "clamp(2rem, 5vw, 4.5rem)",
              rowGap:     "2.5rem",
            }}
          >

            {/* Countdown strip */}
            <div style={{ display: "flex", alignItems: "flex-start", gap: 0 }}>
              {units.map(({ val, label }, i) => (
                <Fragment key={label}>
                  <div style={{
                    display:       "flex",
                    flexDirection: "column",
                    alignItems:    "flex-start",
                    paddingLeft:   i === 0 ? 0 : "clamp(1.25rem, 2.8vw, 2.25rem)",
                    paddingRight:  i === 3 ? 0 : "clamp(1.25rem, 2.8vw, 2.25rem)",
                  }}>
                    {/* Number â€” Playfair 700 for impact, fade tick on change */}
                    <motion.span
                      key={val}
                      initial={{ opacity: 0.3 }}
                      animate={{ opacity: 1   }}
                      transition={{ duration: 0.4, ease: "easeOut" }}
                      style={{
                        fontFamily:         SERIF,
                        fontWeight:         700,
                        fontSize:           "clamp(3rem, 7vw, 6rem)",
                        lineHeight:         1,
                        letterSpacing:      "-0.02em",
                        color:              WARM_WHITE,
                        fontVariantNumeric: "tabular-nums",
                        display:            "block",
                      }}
                    >
                      {String(val).padStart(2, "0")}
                    </motion.span>
                    {/* Label */}
                    <span style={{
                      fontFamily:    INTER,
                      fontWeight:    400,
                      fontSize:      "11px",
                      letterSpacing: "0.22em",
                      textTransform: "uppercase",
                      color:         `rgba(184,146,58,0.70)`,
                      marginTop:     "8px",
                    }}>
                      {label}
                    </span>
                  </div>

                  {/* Hairline vertical rule between units */}
                  {i < 3 && (
                    <div style={{
                      width:      "1px",
                      height:     "clamp(3rem, 7vw, 6rem)",
                      background: "rgba(237,233,225,0.10)",
                      flexShrink: 0,
                    }} />
                  )}
                </Fragment>
              ))}
            </div>

            {/* CTA */}
            <button
              onClick={() => router.push("/tickets")}
              className="group flex items-center gap-3"
              style={{
                background:  "none",
                border:      "none",
                padding:     "0 0 calc(11px + 8px) 0",
                cursor:      "pointer",
                opacity:     0.75,
                transition:  "opacity 0.4s ease",
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.opacity = "1"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.opacity = "0.75"; }}
            >
              <span style={{
                fontFamily:    INTER,
                fontWeight:    500,
                fontSize:      "13px",
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color:         WARM_WHITE,
              }}>
                Browse Tickets
              </span>
              <ArrowRight
                className="group-hover:translate-x-1 transition-transform duration-500"
                style={{ width: "13px", height: "13px", color: WARM_WHITE }}
              />
            </button>

          </motion.div>
        </div>
      </div>

      {/* Scroll indicator â€” bottom center */}
      <motion.div
        {...dissolve(1.8, 1.0)}
        className="absolute bottom-7 left-1/2 -translate-x-1/2 z-10 pointer-events-none select-none"
        style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "8px" }}
      >
        <span style={{
          fontFamily:    INTER,
          fontSize:      "6.5px",
          textTransform: "uppercase",
          letterSpacing: "0.48em",
          color:         "rgba(237,233,225,0.12)",
        }}>
          Scroll
        </span>
        <div style={{
          width:      "1px",
          height:     "24px",
          background: "linear-gradient(to bottom, rgba(237,233,225,0.10), transparent)",
        }} />
      </motion.div>

    </section>
  );
}

