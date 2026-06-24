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

// ── Component ─────────────────────────────────────────────────────────────────
export function CinematicHero() {
  const router = useRouter();
  const { d, h, m, s } = useCountdown(FESTIVAL_DATE);

  return (
    /*
     * -mt-16 sm:-mt-20 negates <main>'s pt-16 sm:pt-20 so the hero is
     * truly full-bleed. The transparent navbar sits on top naturally.
     */
    <section className="relative overflow-hidden -mt-16 sm:-mt-20" style={{ height: "100vh" }}>

      {/* Background video */}
      <video
        autoPlay
        muted
        loop
        playsInline
        aria-hidden="true"
        className="absolute inset-0 w-full h-full object-cover"
        style={{ objectPosition: "center 30%", zIndex: 0 }}
      >
        <source src="/hero.mp4" type="video/mp4" />
      </video>

      {/*
       * Overlay — heavy at the bottom where text lives, light at the top
       * so the crowd energy stays visible through the video.
       */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{
          zIndex: 1,
          background: [
            "linear-gradient(to top, rgba(0,0,0,0.90) 0%, rgba(0,0,0,0.42) 52%, rgba(0,0,0,0.15) 100%)",
            "radial-gradient(ellipse 70% 45% at 50% 0%, rgba(201,168,76,0.12), transparent 70%)",
          ].join(", "),
        }}
      />

      {/* Content — bottom-anchored, left-aligned editorial layout */}
      <div
        className="absolute inset-0 flex flex-col justify-end"
        style={{ zIndex: 2 }}
      >
        <div className="w-full max-w-[1400px] mx-auto px-6 sm:px-12 lg:px-20 pb-14 sm:pb-20 lg:pb-24">

          {/* Eyebrow */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="flex items-center gap-3 mb-5"
          >
            <div className="shrink-0 h-px w-6 bg-[#C9A84C]" />
            <span
              className="text-[11px] font-semibold uppercase"
              style={{ letterSpacing: "0.28em", color: "rgba(255,255,255,0.62)" }}
            >
              Official Verified Resale
            </span>
          </motion.div>

          {/* Main headline */}
          <motion.h1
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
            style={{
              fontFamily:    "var(--font-playfair)",
              fontWeight:    900,
              fontSize:      "clamp(3rem, 9.5vw, 8.5rem)",
              lineHeight:    0.9,
              letterSpacing: "-0.03em",
              color:         "#fff",
              textShadow:    "0 4px 48px rgba(0,0,0,0.55)",
              marginBottom:  "clamp(1rem, 2.5vw, 1.75rem)",
            }}
          >
            Awakenings
            <br />
            <span
              style={{
                background:           "linear-gradient(90deg, #C9A84C 0%, #F0D080 45%, #C9A84C 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor:  "transparent",
                backgroundClip:       "text",
              }}
            >
              Festival 2026
            </span>
          </motion.h1>

          {/* Location line */}
          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
            style={{
              fontSize:      "clamp(0.8rem, 1.4vw, 1rem)",
              letterSpacing: "0.06em",
              color:         "rgba(255,255,255,0.52)",
              textShadow:    "0 2px 12px rgba(0,0,0,0.5)",
              marginBottom:  "clamp(1.75rem, 4vw, 2.75rem)",
            }}
          >
            July 10–12&nbsp;&nbsp;·&nbsp;&nbsp;Amsterdam&nbsp;&nbsp;·&nbsp;&nbsp;Gashouder
            &amp; Hembrugterrein
          </motion.p>

          {/* Countdown + CTA */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.65, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col sm:flex-row items-start sm:items-center gap-7 sm:gap-0"
          >
            {/* Countdown units */}
            <div className="flex items-end gap-5 sm:gap-7 sm:pr-10">
              {[
                { val: d, label: "days" },
                { val: h, label: "hrs"  },
                { val: m, label: "min"  },
                { val: s, label: "sec"  },
              ].map(({ val, label }) => (
                <div key={label} className="flex flex-col items-center">
                  <span
                    style={{
                      fontFamily:         "var(--font-playfair)",
                      fontWeight:         900,
                      fontSize:           "clamp(2rem, 5vw, 3.25rem)",
                      lineHeight:         1,
                      letterSpacing:      "-0.025em",
                      color:              "#fff",
                      textShadow:         "0 2px 20px rgba(0,0,0,0.4)",
                      fontVariantNumeric: "tabular-nums",
                    }}
                  >
                    {String(val).padStart(2, "0")}
                  </span>
                  <span
                    style={{
                      fontSize:      "10px",
                      textTransform: "uppercase",
                      letterSpacing: "0.18em",
                      color:         "rgba(255,255,255,0.36)",
                      marginTop:     "6px",
                    }}
                  >
                    {label}
                  </span>
                </div>
              ))}
            </div>

            {/* Vertical rule */}
            <div
              className="hidden sm:block shrink-0 w-px bg-white/[0.14] sm:mx-10"
              style={{ height: "2.75rem" }}
            />

            {/* CTA */}
            <button
              onClick={() => router.push("/tickets")}
              className="group inline-flex items-center gap-3 text-sm font-semibold text-black tracking-wide rounded-full w-fit transition-all duration-300"
              style={{ background: "linear-gradient(135deg, #C9A84C 0%, #E4BA65 100%)", padding: "14px 28px" }}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLButtonElement;
                el.style.boxShadow = "0 0 50px rgba(201,168,76,0.5), 0 8px 28px rgba(0,0,0,0.4)";
                el.style.transform = "translateY(-1px)";
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLButtonElement;
                el.style.boxShadow = "none";
                el.style.transform = "none";
              }}
            >
              Browse Tickets
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform duration-300" />
            </button>
          </motion.div>

        </div>
      </div>

      {/* Scroll cue — bottom right */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.9, delay: 1.4 }}
        className="absolute bottom-8 right-8 sm:right-12 lg:right-20 z-10 flex items-center gap-3 pointer-events-none select-none"
      >
        <span
          style={{
            fontSize:      "10px",
            textTransform: "uppercase",
            letterSpacing: "0.26em",
            color:         "rgba(255,255,255,0.28)",
          }}
        >
          Scroll to explore
        </span>
        <div className="w-8 h-px bg-white/[0.18]" />
      </motion.div>

    </section>
  );
}
