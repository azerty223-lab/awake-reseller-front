"use client";

import { useState, useCallback, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { LineReveal } from "@/frontend/components/ui/LineReveal";

/* ── Pass data ────────────────────────────────────────────────────────── */
const PASSES = [
  {
    id:          "weekend",
    label:       "Weekend Pass",
    index:       "01",
    title:       "3-Day Access",
    dates:       "July 10 — 12",
    description: "Three days. Every stage. From Friday's opening act straight through to Sunday's last hour — nothing cut, nothing missed.",
    includes:    ["6 stages, indoor & outdoor", "From Friday evening", "Full Sat & Sun", "Camping add-on available"],
    note:        "Best value",
  },
  {
    id:          "saturday",
    label:       "Saturday",
    index:       "02",
    title:       "Day Access",
    dates:       "July 11",
    description: "The peak. Every stage locked in at full capacity — headline after headline, back to back. Plan a route at the gate and abandon it by noon.",
    includes:    ["All 6 stages", "13:00 until 01:00", "Day wristband"],
    note:        null,
  },
  {
    id:          "sunday",
    label:       "Sunday",
    index:       "03",
    title:       "Day Access",
    dates:       "July 12",
    description: "The closing night. Charlotte de Witte. Richie Hawtin. The kind of ending that makes everyone wish it went one more day.",
    includes:    ["All 6 stages", "13:00 until 23:00", "Day wristband", "Closing ceremony"],
    note:        "Closing night",
  },
];

/* ── Per-card color themes ────────────────────────────────────────────── */
const THEMES = [
  { stage: "#06B6D4", beams: ["#22D3EE", "#06B6D4", "#67E8F9"], ambient: "#0E7490" }, // gold
  { stage: "#3C82DC", beams: ["#50A0FF", "#3C82DC", "#64C8FF"], ambient: "#1E5AB4" }, // blue
  { stage: "#9B40C8", beams: ["#C060F0", "#9B40C8", "#D480FF"], ambient: "#6E1EA0" }, // purple
];

/* ── Animated festival stage background ──────────────────────────────── */
function FestivalBg({ ti, active: isActive }: { ti: number; active: boolean }) {
  const t   = THEMES[ti];
  const uid = `fbg-${ti}`;

  const BEAMS = [
    { angle: [-14, 8],  dur: "7s",  delay: "0s",    width: 16, color: t.beams[0], op: 0.80 },
    { angle: [4,  -10], dur: "5.5s",delay: "0.8s",  width: 12, color: t.beams[1], op: 0.60 },
    { angle: [10, -18], dur: "9s",  delay: "1.6s",  width: 10, color: t.beams[2], op: 0.45 },
    { angle: [-6,  14], dur: "6.5s",delay: "2.4s",  width: 8,  color: t.beams[0], op: 0.35 },
  ];

  const PARTICLES = [
    { x: 72,  y: 400, r: 1.8, dur: "9s",  begin: "0s"   },
    { x: 145, y: 320, r: 1.2, dur: "7s",  begin: "2.1s" },
    { x: 210, y: 440, r: 2.2, dur: "11s", begin: "0.7s" },
    { x: 290, y: 360, r: 1.5, dur: "8s",  begin: "3.5s" },
    { x: 340, y: 280, r: 1.0, dur: "10s", begin: "1.2s" },
    { x: 55,  y: 460, r: 1.2, dur: "12s", begin: "4.2s" },
    { x: 330, cy: 420,r: 0.8, dur: "6s",  begin: "5.0s" },
    { x: 175, y: 390, r: 1.4, dur: "8.5s",begin: "1.8s" },
  ];

  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 390 540"
      preserveAspectRatio="xMidYMid slice"
      style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }}
    >
      <defs>
        {/* Stage glow */}
        <radialGradient id={`${uid}-sg`} cx="50%" cy="100%" r="65%" gradientUnits="objectBoundingBox">
          <stop offset="0%"   stopColor={t.stage}   stopOpacity={isActive ? "0.38" : "0.18"} />
          <stop offset="55%"  stopColor={t.ambient} stopOpacity="0.08" />
          <stop offset="100%" stopColor="transparent" stopOpacity="0" />
        </radialGradient>

        {/* Ambient top-center glow */}
        <radialGradient id={`${uid}-ag`} cx="50%" cy="0%" r="50%" gradientUnits="objectBoundingBox">
          <stop offset="0%"   stopColor={t.stage} stopOpacity={isActive ? "0.12" : "0.05"} />
          <stop offset="100%" stopColor="transparent" stopOpacity="0" />
        </radialGradient>

        {/* Beam gradients — bottom-to-top */}
        {BEAMS.map((b, i) => (
          <linearGradient key={i} id={`${uid}-b${i}`} x1="195" y1="540" x2="195" y2="0" gradientUnits="userSpaceOnUse">
            <stop offset="0%"   stopColor={b.color} stopOpacity={isActive ? `${b.op}` : `${b.op * 0.4}`} />
            <stop offset="70%"  stopColor={b.color} stopOpacity={isActive ? "0.06" : "0.02"} />
            <stop offset="100%" stopColor="transparent" stopOpacity="0" />
          </linearGradient>
        ))}
      </defs>

      {/* Stage glow base */}
      <rect width="390" height="540" fill={`url(#${uid}-sg)`}>
        <animate attributeName="opacity" values="0.75;1;0.75" dur="4s" repeatCount="indefinite" />
      </rect>

      {/* Ambient ceiling glow */}
      <rect width="390" height="540" fill={`url(#${uid}-ag)`} />

      {/* Light beams — each sweeps independently */}
      {BEAMS.map((b, i) => {
        const hw = b.width;
        return (
          <polygon
            key={i}
            points={`195,540 ${195 - hw},0 ${195 + hw},0`}
            fill={`url(#${uid}-b${i})`}
          >
            <animateTransform
              attributeName="transform"
              type="rotate"
              values={`${b.angle[0]} 195 540; ${b.angle[1]} 195 540; ${b.angle[0]} 195 540`}
              dur={b.dur}
              begin={b.delay}
              repeatCount="indefinite"
              calcMode="spline"
              keyTimes="0;0.5;1"
              keySplines="0.4 0 0.6 1;0.4 0 0.6 1"
            />
            <animate
              attributeName="opacity"
              values={`${isActive ? 1 : 0.4};${isActive ? 0.65 : 0.25};${isActive ? 1 : 0.4}`}
              dur={b.dur}
              begin={b.delay}
              repeatCount="indefinite"
            />
          </polygon>
        );
      })}

      {/* Haze band at stage horizon */}
      <rect x="0" y="430" width="390" height="36"
        fill={t.stage} fillOpacity={isActive ? "0.07" : "0.03"}>
        <animate attributeName="opacity" values="0.5;1;0.5" dur="3.5s" repeatCount="indefinite" />
      </rect>

      {/* Floating particles */}
      {PARTICLES.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r={p.r} fill="rgba(237,233,225,0.55)">
          <animate attributeName="cy"
            values={`${p.y};${(p.y as number) - 560};${(p.y as number) - 560}`}
            dur={p.dur} begin={p.begin} repeatCount="indefinite" />
          <animate attributeName="opacity"
            values="0;0.70;0.70;0"
            keyTimes="0;0.08;0.90;1"
            dur={p.dur} begin={p.begin} repeatCount="indefinite" />
        </circle>
      ))}

      {/* Ground floor line */}
      <line x1="40" y1="488" x2="350" y2="488"
        stroke={t.stage} strokeOpacity={isActive ? "0.22" : "0.08"} strokeWidth="1">
        <animate attributeName="stroke-opacity"
          values={`${isActive ? 0.15 : 0.05};${isActive ? 0.28 : 0.10};${isActive ? 0.15 : 0.05}`}
          dur="4s" repeatCount="indefinite" />
      </line>
    </svg>
  );
}

/* ── 3D slot position ─────────────────────────────────────────────────── */
function getSlotStyle(pos: number) {
  if (pos === 0)  return { x: 0,    rotateY: 0,   scale: 1,    opacity: 1,    zIndex: 30, blur: 0 };
  if (pos === -1) return { x: -310, rotateY: 22,  scale: 0.76, opacity: 0.30, zIndex: 10, blur: 1.5 };
  if (pos === 1)  return { x: 310,  rotateY: -22, scale: 0.76, opacity: 0.30, zIndex: 10, blur: 1.5 };
  return           { x: pos < 0 ? -800 : 800, rotateY: 0, scale: 0.5, opacity: 0, zIndex: 0, blur: 0 };
}

const INTER = "var(--font-inter, Inter, system-ui, sans-serif)";
const SERIF = "var(--font-playfair)";

/* ── Section ──────────────────────────────────────────────────────────── */
export function FestivalAccessSection() {
  const [active, setActive] = useState(0);
  const [dir,    setDir]    = useState<1 | -1>(1);
  const total = PASSES.length;

  const go = useCallback((n: number) => { setDir(n > active ? 1 : -1); setActive(n); }, [active]);
  const prev = useCallback(() => { if (active > 0) go(active - 1); }, [active, go]);
  const next = useCallback(() => { if (active < total - 1) go(active + 1); }, [active, total, go]);

  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft")  prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [prev, next]);

  let sx = 0;

  return (
    <section className="relative py-5 overflow-hidden">
      <div className="max-w-5xl mx-auto px-6 sm:px-12 lg:px-20">

        {/* Section header */}
        <motion.div
          initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
          viewport={{ once: true }} transition={{ duration: 0.9 }}
          className="mb-5"
        >
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "0.75rem" }}>
            <span style={{ width: "16px", height: "1px", background: "rgba(6,182,212,0.45)", flexShrink: 0 }} />
            <span style={{ fontFamily: INTER, fontSize: "0.9375rem", fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: "rgba(237,233,225,0.82)" }}>
              Festival Access
            </span>
          </div>
          <h2 className="font-[var(--font-playfair)] font-black text-white"
              style={{ fontSize: "clamp(2rem, 4.5vw, 3.25rem)", letterSpacing: "-0.025em", lineHeight: 0.92 }}>
            <LineReveal>Your ticket</LineReveal>
            <LineReveal delay={0.09}>to the festival</LineReveal>
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 1.0, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Perspective + clipping stage */}
          <div style={{ perspective: "900px", perspectiveOrigin: "50% 38%" }}>
            <div
              style={{ position: "relative", height: "clamp(480px, 60vh, 540px)", overflow: "hidden" }}
              onPointerDown={e => { sx = e.clientX; }}
              onPointerUp={e => { const d = e.clientX - sx; if (d < -50) next(); if (d > 50) prev(); }}
            >
              {PASSES.map((pass, i) => {
                const pos      = i - active;
                const s        = getSlotStyle(pos);
                const isActive = pos === 0;

                return (
                  <motion.div
                    key={pass.id}
                    animate={{ x: s.x, rotateY: s.rotateY, scale: s.scale, opacity: s.opacity, zIndex: s.zIndex, filter: `blur(${s.blur}px)` }}
                    transition={{ duration: 0.72, ease: [0.16, 1, 0.3, 1], zIndex: { duration: 0 }, filter: { duration: 0.4 } }}
                    onClick={() => !isActive && (pos < 0 ? prev() : next())}
                    style={{ position: "absolute", top: 0, left: "50%", width: "min(390px, 100%)", marginLeft: "max(-195px, -50%)", height: "100%", cursor: isActive ? "default" : "pointer" }}
                  >
                    {/* Card shell */}
                    <div style={{
                      width: "100%", height: "100%",
                      position: "relative", overflow: "hidden",
                      borderRadius: "4px",
                      border: `1px solid ${isActive ? "rgba(6,182,212,0.35)" : "rgba(237,233,225,0.06)"}`,
                      background: "#0b090d",
                      boxShadow: isActive
                        ? "0 2px 0 0 rgba(6,182,212,0.16) inset, 0 48px 100px rgba(0,0,0,0.82), 0 6px 30px rgba(0,0,0,0.60)"
                        : "0 12px 48px rgba(0,0,0,0.55)",
                      padding: "2.5rem 2.25rem 2rem",
                      display: "flex", flexDirection: "column",
                      userSelect: "none",
                    }}>

                      {/* ── Animated festival background ── */}
                      <FestivalBg ti={i} active={isActive} />

                      {/* Top gradient line */}
                      <div style={{
                        position: "absolute", top: 0, left: 0, right: 0, height: "1px",
                        background: isActive
                          ? `linear-gradient(90deg, transparent, ${THEMES[i].stage}CC 35%, ${THEMES[i].stage}CC 65%, transparent)`
                          : "rgba(237,233,225,0.05)",
                      }} />

                      {/* Ghost index number */}
                      <span aria-hidden="true" style={{
                        position: "absolute", bottom: "-0.1em", right: "-0.05em",
                        fontFamily: SERIF, fontWeight: 900,
                        fontSize: "clamp(6rem, 16vw, 10rem)",
                        lineHeight: 1, letterSpacing: "-0.06em",
                        color: isActive ? `${THEMES[i].stage}12` : "rgba(237,233,225,0.03)",
                        pointerEvents: "none",
                      }}>
                        {pass.index}
                      </span>

                      {/* Content — relative to sit above SVG background */}
                      <div style={{ position: "relative", zIndex: 1, display: "flex", flexDirection: "column", height: "100%" }}>
                        {/* Label */}
                        <span style={{ fontFamily: INTER, fontSize: "9px", fontWeight: 400, letterSpacing: "0.36em", textTransform: "uppercase", color: isActive ? `${THEMES[i].stage}CC` : "rgba(237,233,225,0.20)", display: "block", marginBottom: "0.75rem" }}>
                          {pass.label}
                        </span>

                        {/* Title */}
                        <h3 style={{ fontFamily: INTER, fontWeight: 800, fontSize: "clamp(1.75rem, 4.5vw, 2.5rem)", letterSpacing: "0.08em", lineHeight: 1, textTransform: "uppercase", color: isActive ? "rgba(237,233,225,0.96)" : "rgba(237,233,225,0.32)", marginBottom: "0.625rem" }}>
                          {pass.title}
                        </h3>

                        {/* Dates */}
                        <span style={{ fontFamily: INTER, fontSize: "11px", letterSpacing: "0.20em", textTransform: "uppercase", color: isActive ? `${THEMES[i].stage}99` : "rgba(237,233,225,0.16)", display: "block", marginBottom: "1.75rem" }}>
                          {pass.dates}
                        </span>

                        {/* Divider */}
                        <div style={{ width: "100%", height: "1px", background: "rgba(237,233,225,0.08)", marginBottom: "1.5rem" }} />

                        {/* Description */}
                        <p style={{ fontFamily: INTER, fontSize: "0.875rem", lineHeight: 1.8, color: isActive ? "rgba(161,161,170,0.88)" : "rgba(161,161,170,0.24)", marginBottom: "1.5rem", flex: 1 }}>
                          {pass.description}
                        </p>

                        {/* Features */}
                        <ul style={{ listStyle: "none", padding: 0, margin: 0, marginBottom: "2rem" }}>
                          {pass.includes.map(f => (
                            <li key={f} style={{ display: "flex", alignItems: "baseline", gap: "0.75rem", paddingBottom: "0.45rem", fontFamily: INTER, fontSize: "13px", color: isActive ? "rgba(237,233,225,0.52)" : "rgba(237,233,225,0.12)" }}>
                              <span style={{ color: isActive ? `${THEMES[i].stage}99` : "rgba(6,182,212,0.12)", flexShrink: 0 }}>—</span>
                              {f}
                            </li>
                          ))}
                        </ul>

                        {/* Footer */}
                        {isActive && (
                          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "auto" }}>
                            <span style={{ fontFamily: INTER, fontSize: "9px", letterSpacing: "0.26em", textTransform: "uppercase", color: `${THEMES[i].stage}88` }}>
                              {pass.note ?? ""}
                            </span>
                            <Link href="/tickets" className="group/b inline-flex items-center gap-2"
                              style={{ fontFamily: INTER, fontSize: "10px", letterSpacing: "0.24em", textTransform: "uppercase", color: "rgba(237,233,225,0.42)", transition: "color 0.3s ease" }}
                              onMouseEnter={e => (e.currentTarget.style.color = `${THEMES[i].stage}EE`)}
                              onMouseLeave={e => (e.currentTarget.style.color = "rgba(237,233,225,0.42)")}
                            >
                              Browse tickets
                              <ArrowRight className="group-hover/b:translate-x-0.5 transition-transform duration-300" style={{ width: "10px", height: "10px" }} />
                            </Link>
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Navigation bar */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "2rem", paddingLeft: "0.25rem", paddingRight: "0.25rem" }}>
            <motion.span key={active} initial={{ opacity: 0, x: dir * -12 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              style={{ fontFamily: INTER, fontSize: "0.875rem", fontWeight: 500, color: "rgba(237,233,225,0.55)", letterSpacing: "0.04em", minWidth: "120px" }}>
              {PASSES[active].label}
            </motion.span>

            <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
              {/* Prev */}
              <button onClick={prev} disabled={active === 0}
                style={{ width: "36px", height: "36px", borderRadius: "50%", border: "1px solid rgba(237,233,225,0.14)", background: "transparent", display: "flex", alignItems: "center", justifyContent: "center", cursor: active === 0 ? "not-allowed" : "pointer", opacity: active === 0 ? 0.22 : 0.80, color: "rgba(237,233,225,0.80)", transition: "all 0.3s ease", fontSize: "16px", lineHeight: "1" }}
                onMouseEnter={e => { if (active > 0) Object.assign((e.currentTarget as HTMLButtonElement).style, { borderColor: `${THEMES[active].stage}99`, color: THEMES[active].stage, opacity: "1" }); }}
                onMouseLeave={e => { Object.assign((e.currentTarget as HTMLButtonElement).style, { borderColor: "rgba(237,233,225,0.14)", color: "rgba(237,233,225,0.80)", opacity: active === 0 ? "0.22" : "0.80" }); }}
              >←</button>

              <span style={{ fontFamily: INTER, fontSize: "11px", letterSpacing: "0.18em", color: "rgba(237,233,225,0.30)", minWidth: "3.5rem", textAlign: "center" }}>
                <motion.span key={active} initial={{ opacity: 0, y: dir * -6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}
                  style={{ color: "rgba(237,233,225,0.75)", fontWeight: 500 }}>
                  {PASSES[active].index}
                </motion.span>
                {" / "}{String(total).padStart(2, "0")}
              </span>

              {/* Next */}
              <button onClick={next} disabled={active === total - 1}
                style={{ width: "36px", height: "36px", borderRadius: "50%", border: "1px solid rgba(237,233,225,0.14)", background: "transparent", display: "flex", alignItems: "center", justifyContent: "center", cursor: active === total - 1 ? "not-allowed" : "pointer", opacity: active === total - 1 ? 0.22 : 0.80, color: "rgba(237,233,225,0.80)", transition: "all 0.3s ease", fontSize: "16px", lineHeight: "1" }}
                onMouseEnter={e => { if (active < total - 1) Object.assign((e.currentTarget as HTMLButtonElement).style, { borderColor: `${THEMES[active].stage}99`, color: THEMES[active].stage, opacity: "1" }); }}
                onMouseLeave={e => { Object.assign((e.currentTarget as HTMLButtonElement).style, { borderColor: "rgba(237,233,225,0.14)", color: "rgba(237,233,225,0.80)", opacity: active === total - 1 ? "0.22" : "0.80" }); }}
              >→</button>
            </div>

            {/* Progress bar */}
            <div style={{ width: "120px", height: "1px", background: "rgba(237,233,225,0.10)", position: "relative", overflow: "hidden" }}>
              <motion.div
                animate={{ width: `${((active + 1) / total) * 100}%`, background: THEMES[active].stage }}
                transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
                style={{ height: "100%", position: "absolute", left: 0, top: 0, opacity: 0.70 }}
              />
            </div>
          </div>
        </motion.div>

        <p style={{ fontFamily: INTER, fontSize: "11px", color: "rgba(237,233,225,0.18)", marginTop: "1.5rem", letterSpacing: "0.02em", textAlign: "center" }}>
          Camping tickets sold separately and must be paired with a festival pass.
        </p>
      </div>
    </section>
  );
}
