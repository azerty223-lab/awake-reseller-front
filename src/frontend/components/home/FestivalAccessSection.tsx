"use client";

import { useState, useCallback, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { LineReveal } from "@/frontend/components/ui/LineReveal";

const PASSES = [
  {
    id:          "weekend",
    label:       "Weekend Pass",
    index:       "01",
    title:       "3-Day Access",
    dates:       "July 10 — 12",
    description: "The complete Awakenings experience. Three days across all six stages — from the Friday evening opening through Sunday's closing ceremony.",
    includes:    ["All 6+ stages", "Friday evening entry", "Saturday & Sunday full day", "Camping add-on available"],
    note:        "Recommended",
  },
  {
    id:          "saturday",
    label:       "Saturday",
    index:       "02",
    title:       "Day Access",
    dates:       "July 11",
    description: "The peak day. Maximum capacity with headline acts running across every stage simultaneously.",
    includes:    ["All active stages", "13:00 – 01:00", "Day wristband included"],
    note:        null,
  },
  {
    id:          "sunday",
    label:       "Sunday",
    index:       "03",
    title:       "Day Access",
    dates:       "July 12",
    description: "The closing day. Charlotte de Witte, Richie Hawtin, and the ceremonial final hours of the festival.",
    includes:    ["All active stages", "13:00 – 23:00", "Day wristband included"],
    note:        "Closing ceremony",
  },
];

const INTER = "var(--font-inter, Inter, system-ui, sans-serif)";
const SERIF = "var(--font-playfair)";

function getSlotStyle(pos: number) {
  if (pos === 0)  return { x: 0,    rotateY: 0,   scale: 1,    opacity: 1,    zIndex: 30, blur: 0 };
  if (pos === -1) return { x: -310, rotateY: 22,  scale: 0.76, opacity: 0.28, zIndex: 10, blur: 2 };
  if (pos === 1)  return { x: 310,  rotateY: -22, scale: 0.76, opacity: 0.28, zIndex: 10, blur: 2 };
  return           { x: pos < 0 ? -800 : 800, rotateY: 0, scale: 0.5, opacity: 0, zIndex: 0, blur: 0 };
}

export function FestivalAccessSection() {
  const [active, setActive] = useState(0);
  const [dir, setDir]       = useState<1 | -1>(1);
  const total = PASSES.length;

  const go = useCallback((next: number) => {
    setDir(next > active ? 1 : -1);
    setActive(next);
  }, [active]);

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

  let swipeStartX = 0;

  return (
    <section className="relative py-5 overflow-hidden">
      <div className="max-w-5xl mx-auto px-6 sm:px-12 lg:px-20">

        {/* Section header */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9 }}
          className="mb-5"
        >
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "0.75rem" }}>
            <span style={{ width: "16px", height: "1px", background: "rgba(184,146,58,0.45)", flexShrink: 0 }} />
            <span style={{ fontFamily: INTER, fontSize: "0.9375rem", fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: "rgba(237,233,225,0.82)" }}>
              Festival Access
            </span>
          </div>
          <h2
            className="font-[var(--font-playfair)] font-black text-white"
            style={{ fontSize: "clamp(2rem, 4.5vw, 3.25rem)", letterSpacing: "-0.025em", lineHeight: 0.92 }}
          >
            <LineReveal>Choose your</LineReveal>
            <LineReveal delay={0.09}>access</LineReveal>
          </h2>
        </motion.div>

        {/* ── Carousel ──────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1.0, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Stage */}
          <div style={{ perspective: "900px", perspectiveOrigin: "50% 38%" }}>
            <div
              style={{ position: "relative", height: "clamp(480px, 60vh, 540px)", overflow: "hidden" }}
              onPointerDown={e => { swipeStartX = e.clientX; }}
              onPointerUp={e => {
                const d = e.clientX - swipeStartX;
                if (d < -52) next();
                if (d >  52) prev();
              }}
            >
              {PASSES.map((pass, i) => {
                const pos = i - active;
                const s = getSlotStyle(pos);
                const isActive = pos === 0;

                return (
                  <motion.div
                    key={pass.id}
                    animate={{
                      x:       s.x,
                      rotateY: s.rotateY,
                      scale:   s.scale,
                      opacity: s.opacity,
                      zIndex:  s.zIndex,
                      filter:  `blur(${s.blur}px)`,
                    }}
                    transition={{
                      duration:                    0.72,
                      ease:                        [0.16, 1, 0.3, 1],
                      zIndex:                      { duration: 0 },
                      filter:                      { duration: 0.4 },
                    }}
                    onClick={() => !isActive && (pos < 0 ? prev() : next())}
                    style={{
                      position:   "absolute",
                      top:        0,
                      left:       "50%",
                      width:      "390px",
                      marginLeft: "-195px",
                      height:     "100%",
                      cursor:     isActive ? "default" : "pointer",
                    }}
                  >
                    {/* ── Card ── */}
                    <div style={{
                      width:           "100%",
                      height:          "100%",
                      position:        "relative",
                      overflow:        "hidden",
                      borderRadius:    "4px",
                      border:          isActive
                        ? "1px solid rgba(184,146,58,0.38)"
                        : "1px solid rgba(237,233,225,0.06)",
                      background:      isActive
                        ? "linear-gradient(150deg, rgba(19,15,9,1) 0%, rgba(10,9,14,1) 100%)"
                        : "rgba(8,8,11,0.70)",
                      boxShadow:       isActive
                        ? [
                            "0 2px 0 0 rgba(184,146,58,0.18) inset",     // top inner glow
                            "0 48px 100px rgba(0,0,0,0.80)",
                            "0 8px 32px rgba(184,146,58,0.06)",
                          ].join(", ")
                        : "0 12px 48px rgba(0,0,0,0.55)",
                      padding:         "2.5rem 2.25rem 2rem",
                      display:         "flex",
                      flexDirection:   "column",
                      userSelect:      "none",
                    }}>

                      {/* Top gradient line */}
                      <div style={{
                        position:   "absolute",
                        top: 0, left: 0, right: 0,
                        height:     "1px",
                        background: isActive
                          ? "linear-gradient(90deg, transparent, rgba(184,146,58,0.80) 35%, rgba(184,146,58,0.80) 65%, transparent)"
                          : "rgba(237,233,225,0.05)",
                      }} />

                      {/* Ambient top glow */}
                      {isActive && (
                        <div style={{
                          position:   "absolute",
                          top: "-60%", left: "-20%",
                          width:      "140%",
                          height:     "80%",
                          background: "radial-gradient(ellipse at 50% 0%, rgba(184,146,58,0.09) 0%, transparent 60%)",
                          pointerEvents: "none",
                        }} />
                      )}

                      {/* Ghost index number — architectural texture */}
                      <span
                        aria-hidden="true"
                        style={{
                          position:      "absolute",
                          bottom:        "-0.1em",
                          right:         "-0.05em",
                          fontFamily:    SERIF,
                          fontWeight:    900,
                          fontSize:      "clamp(6rem, 16vw, 10rem)",
                          lineHeight:    1,
                          letterSpacing: "-0.06em",
                          color:         isActive ? "rgba(184,146,58,0.06)" : "rgba(237,233,225,0.03)",
                          pointerEvents: "none",
                          userSelect:    "none",
                        }}
                      >
                        {pass.index}
                      </span>

                      {/* Label */}
                      <span style={{
                        fontFamily:    INTER,
                        fontSize:      "9px",
                        fontWeight:    400,
                        letterSpacing: "0.36em",
                        textTransform: "uppercase",
                        color:         isActive ? "rgba(184,146,58,0.65)" : "rgba(237,233,225,0.22)",
                        display:       "block",
                        marginBottom:  "0.75rem",
                      }}>
                        {pass.label}
                      </span>

                      {/* Title */}
                      <h3 style={{
                        fontFamily:    SERIF,
                        fontWeight:    900,
                        fontSize:      "clamp(2rem, 5.5vw, 2.75rem)",
                        letterSpacing: "-0.04em",
                        lineHeight:    0.92,
                        color:         isActive ? "rgba(237,233,225,0.96)" : "rgba(237,233,225,0.35)",
                        marginBottom:  "0.5rem",
                      }}>
                        {pass.title}
                      </h3>

                      {/* Dates */}
                      <span style={{
                        fontFamily:    INTER,
                        fontSize:      "11px",
                        letterSpacing: "0.20em",
                        textTransform: "uppercase",
                        color:         isActive ? "rgba(184,146,58,0.55)" : "rgba(237,233,225,0.18)",
                        display:       "block",
                        marginBottom:  "1.75rem",
                      }}>
                        {pass.dates}
                      </span>

                      {/* Divider */}
                      <div style={{ width: "100%", height: "1px", background: "rgba(237,233,225,0.07)", marginBottom: "1.5rem" }} />

                      {/* Description */}
                      <p style={{
                        fontFamily:   INTER,
                        fontSize:     "0.875rem",
                        lineHeight:   1.8,
                        color:        isActive ? "rgba(161,161,170,0.88)" : "rgba(161,161,170,0.28)",
                        marginBottom: "1.5rem",
                        flex:         1,
                      }}>
                        {pass.description}
                      </p>

                      {/* Features */}
                      <ul style={{ listStyle: "none", padding: 0, margin: 0, marginBottom: "2rem" }}>
                        {pass.includes.map(f => (
                          <li key={f} style={{
                            display:       "flex",
                            alignItems:    "baseline",
                            gap:           "0.75rem",
                            paddingBottom: "0.45rem",
                            fontFamily:    INTER,
                            fontSize:      "13px",
                            color:         isActive ? "rgba(237,233,225,0.52)" : "rgba(237,233,225,0.14)",
                          }}>
                            <span style={{ color: isActive ? "rgba(184,146,58,0.55)" : "rgba(184,146,58,0.14)", flexShrink: 0 }}>—</span>
                            {f}
                          </li>
                        ))}
                      </ul>

                      {/* Footer */}
                      {isActive && (
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "auto" }}>
                          <span style={{ fontFamily: INTER, fontSize: "9px", letterSpacing: "0.26em", textTransform: "uppercase", color: "rgba(184,146,58,0.45)" }}>
                            {pass.note ?? ""}
                          </span>
                          <Link
                            href="/tickets"
                            className="group/b inline-flex items-center gap-2"
                            style={{ fontFamily: INTER, fontSize: "10px", letterSpacing: "0.24em", textTransform: "uppercase", color: "rgba(237,233,225,0.42)", transition: "color 0.3s ease" }}
                            onMouseEnter={e => (e.currentTarget.style.color = "rgba(184,146,58,0.90)")}
                            onMouseLeave={e => (e.currentTarget.style.color = "rgba(237,233,225,0.42)")}
                          >
                            Browse tickets
                            <ArrowRight className="group-hover/b:translate-x-0.5 transition-transform duration-300" style={{ width: "10px", height: "10px" }} />
                          </Link>
                        </div>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* ── Navigation bar ──────────────────────────── */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "2rem", paddingLeft: "0.25rem", paddingRight: "0.25rem" }}>

            {/* Pass name label */}
            <motion.span
              key={active}
              initial={{ opacity: 0, x: dir * -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              style={{ fontFamily: INTER, fontSize: "0.875rem", fontWeight: 500, color: "rgba(237,233,225,0.55)", letterSpacing: "0.04em", minWidth: "120px" }}
            >
              {PASSES[active].label}
            </motion.span>

            {/* Arrows + counter */}
            <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
              {/* Prev */}
              <button
                onClick={prev}
                disabled={active === 0}
                style={{
                  width: "36px", height: "36px",
                  borderRadius: "50%",
                  border: "1px solid rgba(237,233,225,0.14)",
                  background: "transparent",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  cursor: active === 0 ? "not-allowed" : "pointer",
                  opacity: active === 0 ? 0.22 : 0.80,
                  color: "rgba(237,233,225,0.80)",
                  transition: "all 0.3s ease",
                  fontSize: "16px",
                  lineHeight: 1,
                }}
                onMouseEnter={e => { if (active > 0) { Object.assign((e.currentTarget as HTMLButtonElement).style, { borderColor: "rgba(184,146,58,0.55)", color: "rgba(184,146,58,1)", opacity: "1" }); } }}
                onMouseLeave={e => { Object.assign((e.currentTarget as HTMLButtonElement).style, { borderColor: "rgba(237,233,225,0.14)", color: "rgba(237,233,225,0.80)", opacity: active === 0 ? "0.22" : "0.80" }); }}
              >
                ←
              </button>

              {/* Index counter */}
              <span style={{ fontFamily: INTER, fontSize: "11px", letterSpacing: "0.18em", color: "rgba(237,233,225,0.30)", minWidth: "3.5rem", textAlign: "center" }}>
                <motion.span
                  key={active}
                  initial={{ opacity: 0, y: dir * -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35 }}
                  style={{ color: "rgba(237,233,225,0.75)", fontWeight: 500 }}
                >
                  {PASSES[active].index}
                </motion.span>
                {" / "}
                {String(total).padStart(2, "0")}
              </span>

              {/* Next */}
              <button
                onClick={next}
                disabled={active === total - 1}
                style={{
                  width: "36px", height: "36px",
                  borderRadius: "50%",
                  border: "1px solid rgba(237,233,225,0.14)",
                  background: "transparent",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  cursor: active === total - 1 ? "not-allowed" : "pointer",
                  opacity: active === total - 1 ? 0.22 : 0.80,
                  color: "rgba(237,233,225,0.80)",
                  transition: "all 0.3s ease",
                  fontSize: "16px",
                  lineHeight: 1,
                }}
                onMouseEnter={e => { if (active < total - 1) { Object.assign((e.currentTarget as HTMLButtonElement).style, { borderColor: "rgba(184,146,58,0.55)", color: "rgba(184,146,58,1)", opacity: "1" }); } }}
                onMouseLeave={e => { Object.assign((e.currentTarget as HTMLButtonElement).style, { borderColor: "rgba(237,233,225,0.14)", color: "rgba(237,233,225,0.80)", opacity: active === total - 1 ? "0.22" : "0.80" }); }}
              >
                →
              </button>
            </div>

            {/* Progress bar */}
            <div style={{ width: "120px", height: "1px", background: "rgba(237,233,225,0.10)", position: "relative", overflow: "hidden" }}>
              <motion.div
                animate={{ width: `${((active + 1) / total) * 100}%` }}
                transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
                style={{ height: "100%", background: "rgba(184,146,58,0.65)", position: "absolute", left: 0, top: 0 }}
              />
            </div>

          </div>
        </motion.div>

        {/* Footnote */}
        <p style={{ fontFamily: INTER, fontSize: "11px", color: "rgba(237,233,225,0.20)", marginTop: "1.5rem", letterSpacing: "0.02em", textAlign: "center" }}>
          Camping tickets sold separately and must be paired with a festival pass.
        </p>

      </div>
    </section>
  );
}
