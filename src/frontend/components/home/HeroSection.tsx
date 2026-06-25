"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";

const FESTIVAL_DATE = new Date("2026-07-10T15:00:00+02:00");

function useCountdown(target: Date) {
  const [time, setTime] = useState({ d: 0, h: 0, m: 0, s: 0 });
  useEffect(() => {
    const tick = () => {
      const diff = Math.max(0, target.getTime() - Date.now());
      setTime({
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
  return time;
}


export function HeroSection() {
  const router = useRouter();
  const ref    = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const contentY = useTransform(scrollYProgress, [0, 1], ["0%", "8%"]);
  const opacity  = useTransform(scrollYProgress, [0, 0.6], [1, 0]);
  const { d, h, m, s } = useCountdown(FESTIVAL_DATE);

  return (
    <section ref={ref} className="relative min-h-screen overflow-hidden">

      {/* Local video background â€” looping, muted, cover-fitted */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none" aria-hidden="true">
        <video
          src="/hero-bg.mp4"
          autoPlay
          muted
          loop
          playsInline
          style={{
            position: "absolute",
            top: "50%", left: "50%",
            width: "max(177.78vh, 100%)",
            height: "max(100vh, 56.25vw)",
            transform: "translate(-50%, -50%)",
            objectFit: "cover",
          }}
        />
      </div>

      {/* Cinematic overlay â€” bottom darkening for text + warm amber glow at top */}
      <div
        className="absolute inset-0 z-10 pointer-events-none"
        style={{
          background: [
            "linear-gradient(to bottom, rgba(0,0,0,0.45), rgba(0,0,0,0.90))",
            "radial-gradient(circle at 50% 20%, rgba(210,170,55,0.18), transparent 45%)",
          ].join(", "),
        }}
      />

      {/* Content */}
      <motion.div
        className="relative z-20 min-h-screen flex flex-col justify-end"
        style={{ y: contentY, opacity }}
      >
        <div className="px-6 sm:px-12 lg:px-20 pb-20 sm:pb-28 max-w-[1400px] mx-auto w-full">

          {/* Provenance line */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="text-[10px] uppercase tracking-[0.3em] text-white/35 mb-10 font-medium"
          >
            Ticket Resale â€” awakenings.com
          </motion.p>

          {/* Primary headline â€” designed, not generated */}
          <motion.h1
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="font-[var(--font-playfair)] font-black text-white leading-[0.9] mb-10"
            style={{
              fontSize: "clamp(4.5rem, 13vw, 11rem)",
              letterSpacing: "-0.03em",
            }}
          >
            Awakenings
            <br />
            <span style={{
              background: "linear-gradient(to right, #C9A84C 0%, #E4BA65 40%, #C9A84C 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}>
              Festival
            </span>
          </motion.h1>

          {/* One-line event info */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.55 }}
            className="text-sm text-zinc-400 tracking-[0.12em] uppercase mb-12 font-light"
          >
            July 10â€“12, 2026&nbsp;&nbsp;Â·&nbsp;&nbsp;Hilvarenbeek, Netherlands
          </motion.p>

          {/* Countdown â€” plain numbers, no decoration */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            className="flex items-baseline gap-8 mb-14"
          >
            {[
              { val: d, label: "days" },
              { val: h, label: "hrs" },
              { val: m, label: "min" },
              { val: s, label: "sec" },
            ].map(({ val, label }, i) => (
              <div key={label} className="flex items-baseline gap-1.5">
                <span
                  className="font-[var(--font-playfair)] font-black text-white tabular-nums"
                  style={{ fontSize: "clamp(2rem, 4vw, 3.5rem)", letterSpacing: "-0.02em" }}
                >
                  {String(val).padStart(2, "0")}
                </span>
                <span className="text-zinc-600 text-[10px] uppercase tracking-[0.15em] font-medium">
                  {label}
                </span>
                {i < 3 && (
                  <span className="text-zinc-700 ml-3 font-light text-2xl leading-none select-none">Â·</span>
                )}
              </div>
            ))}
          </motion.div>

          {/* Single primary CTA */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.85 }}
          >
            <button
              onClick={() => router.push("/tickets")}
              className="group inline-flex items-center gap-3 text-sm font-semibold text-black tracking-wide rounded-full px-8 py-4 transition-all duration-500"
              style={{
                background: "linear-gradient(135deg, #C9A84C 0%, #E4BA65 100%)",
                boxShadow: "0 0 0 0 rgba(201,168,76,0)",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 0 60px rgba(201,168,76,0.4), 0 8px 32px rgba(0,0,0,0.4)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 0 0 0 rgba(201,168,76,0)";
              }}
            >
              Browse Tickets
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform duration-300" />
            </button>
          </motion.div>

        </div>
      </motion.div>

      {/* Scroll cue */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.4 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2"
      >
        <div className="h-10 w-px bg-gradient-to-b from-transparent to-white/20" />
        <span className="text-[9px] uppercase tracking-[0.3em] text-white/20">Scroll</span>
      </motion.div>

    </section>
  );
}

