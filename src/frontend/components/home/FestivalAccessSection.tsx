"use client";

import { useState, useCallback, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { LineReveal } from "@/frontend/components/ui/LineReveal";

const PASSES = [
  {
    id:          "weekend",
    label:       "Weekend Pass",
    title:       "3-Day Access",
    dates:       "July 10–12",
    description: "The complete Awakenings experience. Three days across all six stages — from the Friday evening opening through Sunday's closing ceremony.",
    includes:    ["All 6+ stages", "Friday evening entry", "Saturday & Sunday full day", "Camping add-on available"],
    note:        "Recommended",
    accent:      true,
  },
  {
    id:          "saturday",
    label:       "Saturday",
    title:       "Day Access",
    dates:       "July 11",
    description: "The peak day. Maximum capacity with headline acts running across every stage simultaneously.",
    includes:    ["All active stages", "13:00 – 01:00", "Day wristband included"],
    note:        null,
    accent:      false,
  },
  {
    id:          "sunday",
    label:       "Sunday",
    title:       "Day Access",
    dates:       "July 12",
    description: "The closing day. Charlotte de Witte, Richie Hawtin, and the ceremonial final hours of the festival.",
    includes:    ["All active stages", "13:00 – 23:00", "Day wristband included"],
    note:        "Closing ceremony",
    accent:      false,
  },
];

const INTER = "var(--font-inter, Inter, system-ui, sans-serif)";
const SERIF = "var(--font-playfair)";

// Position-based 3D transform for each card slot
function getTransform(pos: number) {
  if (pos === 0)  return { x: 0,    rotateY: 0,   scale: 1,    opacity: 1,    zIndex: 20 };
  if (pos === -1) return { x: -252, rotateY: 16,  scale: 0.81, opacity: 0.44, zIndex: 10 };
  if (pos === 1)  return { x: 252,  rotateY: -16, scale: 0.81, opacity: 0.44, zIndex: 10 };
  return           { x: pos < 0 ? -700 : 700, rotateY: 0, scale: 0.5, opacity: 0, zIndex: 0 };
}

export function FestivalAccessSection() {
  const [active, setActive] = useState(0);
  const total = PASSES.length;

  const prev = useCallback(() => setActive(a => Math.max(0, a - 1)), []);
  const next = useCallback(() => setActive(a => Math.min(total - 1, a + 1)), [total]);

  // Keyboard navigation
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft")  prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [prev, next]);

  // Touch / pointer swipe
  let pointerStartX = 0;
  const onPointerDown = (e: React.PointerEvent) => { pointerStartX = e.clientX; };
  const onPointerUp   = (e: React.PointerEvent) => {
    const delta = e.clientX - pointerStartX;
    if (delta < -50) next();
    if (delta >  50) prev();
  };

  return (
    <section className="relative py-5 overflow-hidden">
      <div className="max-w-5xl mx-auto px-6 sm:px-12 lg:px-20">

        {/* Header */}
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

        {/* ── 3D Carousel ─────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, delay: 0.15 }}
        >
          {/* Perspective wrapper — must NOT have overflow:hidden */}
          <div style={{ perspective: "1100px", perspectiveOrigin: "50% 40%" }}>
            {/* Clipping wrapper */}
            <div
              style={{ position: "relative", height: "clamp(460px, 58vh, 520px)", overflow: "hidden" }}
              onPointerDown={onPointerDown}
              onPointerUp={onPointerUp}
            >
              {PASSES.map((pass, i) => {
                const position = i - active;
                const t = getTransform(position);
                const isActive = position === 0;

                return (
                  <motion.div
                    key={pass.id}
                    animate={{ x: t.x, rotateY: t.rotateY, scale: t.scale, opacity: t.opacity, zIndex: t.zIndex }}
                    transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1], zIndex: { duration: 0 } }}
                    onClick={() => { if (!isActive) position < 0 ? prev() : next(); }}
                    style={{
                      position:   "absolute",
                      top:        0,
                      left:       "50%",
                      marginLeft: "-170px",
                      width:      "340px",
                      height:     "100%",
                      cursor:     isActive ? "default" : "pointer",
                    }}
                  >
                    {/* Card */}
                    <div style={{
                      width:        "100%",
                      height:       "100%",
                      background:   isActive
                        ? "linear-gradient(160deg, rgba(16,13,9,1) 0%, rgba(9,9,12,1) 100%)"
                        : "rgba(9,9,11,0.65)",
                      border:       `1px solid ${isActive ? "rgba(184,146,58,0.32)" : "rgba(237,233,225,0.07)"}`,
                      borderRadius: "3px",
                      padding:      "2.25rem 2rem 2rem",
                      display:      "flex",
                      flexDirection: "column",
                      boxShadow:    isActive
                        ? "0 36px 90px rgba(0,0,0,0.72), 0 0 50px rgba(184,146,58,0.07)"
                        : "0 8px 40px rgba(0,0,0,0.50)",
                      position:     "relative",
                      overflow:     "hidden",
                      userSelect:   "none",
                    }}>

                      {/* Gold gradient top line */}
                      <div style={{
                        position:   "absolute",
                        top: 0, left: 0, right: 0,
                        height:     "1px",
                        background: isActive
                          ? "linear-gradient(90deg, transparent 0%, rgba(184,146,58,0.70) 40%, rgba(184,146,58,0.70) 60%, transparent 100%)"
                          : "rgba(237,233,225,0.06)",
                      }} />

                      {/* Ambient radial glow — active only */}
                      {isActive && (
                        <div style={{
                          position:       "absolute",
                          top:            "-40%", left: "-10%",
                          width:          "120%", height: "65%",
                          background:     "radial-gradient(ellipse at 50% 0%, rgba(184,146,58,0.07), transparent 65%)",
                          pointerEvents:  "none",
                        }} />
                      )}

                      {/* Label */}
                      <span style={{
                        fontFamily:    INTER,
                        fontSize:      "9px",
                        fontWeight:    400,
                        letterSpacing: "0.34em",
                        textTransform: "uppercase",
                        color:         pass.accent && isActive ? "rgba(184,146,58,0.65)" : "rgba(237,233,225,0.28)",
                        display:       "block",
                        marginBottom:  "0.625rem",
                      }}>
                        {pass.label}
                      </span>

                      {/* Title */}
                      <h3 style={{
                        fontFamily:    SERIF,
                        fontWeight:    900,
                        fontSize:      "clamp(1.875rem, 5vw, 2.5rem)",
                        letterSpacing: "-0.03em",
                        lineHeight:    0.95,
                        color:         isActive ? "rgba(237,233,225,0.96)" : "rgba(237,233,225,0.42)",
                        marginBottom:  "0.375rem",
                      }}>
                        {pass.title}
                      </h3>

                      {/* Date */}
                      <span style={{
                        fontFamily:    INTER,
                        fontSize:      "10px",
                        letterSpacing: "0.22em",
                        textTransform: "uppercase",
                        color:         "rgba(237,233,225,0.28)",
                        display:       "block",
                        marginBottom:  "1.5rem",
                      }}>
                        {pass.dates}
                      </span>

                      {/* Divider */}
                      <div style={{ width: "100%", height: "1px", background: "rgba(237,233,225,0.06)", marginBottom: "1.5rem" }} />

                      {/* Description */}
                      <p style={{
                        fontFamily:   INTER,
                        fontSize:     "0.875rem",
                        lineHeight:   1.75,
                        color:        isActive ? "rgba(161,161,170,0.90)" : "rgba(161,161,170,0.35)",
                        marginBottom: "1.5rem",
                        flex:         1,
                      }}>
                        {pass.description}
                      </p>

                      {/* Features */}
                      <ul style={{ listStyle: "none", padding: 0, margin: 0, marginBottom: "1.75rem" }}>
                        {pass.includes.map(feat => (
                          <li key={feat} style={{
                            display:       "flex",
                            alignItems:    "baseline",
                            gap:           "0.75rem",
                            paddingBottom: "0.4rem",
                            fontFamily:    INTER,
                            fontSize:      "12px",
                            color:         isActive ? "rgba(237,233,225,0.52)" : "rgba(237,233,225,0.18)",
                          }}>
                            <span style={{ color: isActive ? "rgba(184,146,58,0.50)" : "rgba(184,146,58,0.18)", flexShrink: 0 }}>—</span>
                            {feat}
                          </li>
                        ))}
                      </ul>

                      {/* Footer */}
                      {isActive && (
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "auto" }}>
                          {pass.note && (
                            <span style={{ fontFamily: INTER, fontSize: "9px", letterSpacing: "0.24em", textTransform: "uppercase", color: "rgba(184,146,58,0.48)" }}>
                              {pass.note}
                            </span>
                          )}
                          <Link
                            href="/tickets"
                            className="group/lnk inline-flex items-center gap-2 ml-auto"
                            style={{ fontFamily: INTER, fontSize: "10px", letterSpacing: "0.22em", textTransform: "uppercase", color: "rgba(237,233,225,0.40)", transition: "color 0.3s ease" }}
                            onMouseEnter={e => (e.currentTarget.style.color = "rgba(184,146,58,0.85)")}
                            onMouseLeave={e => (e.currentTarget.style.color = "rgba(237,233,225,0.40)")}
                          >
                            Browse
                            <ArrowRight className="group-hover/lnk:translate-x-0.5 transition-transform duration-300" style={{ width: "10px", height: "10px" }} />
                          </Link>
                        </div>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* ── Navigation ──────────────────────────────────── */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "1.25rem", marginTop: "1.75rem" }}>

            {/* Prev */}
            <motion.button
              onClick={prev}
              disabled={active === 0}
              whileHover={active > 0 ? { scale: 1.08 } : {}}
              whileTap={active > 0 ? { scale: 0.94 } : {}}
              style={{
                width:           "42px", height: "42px",
                borderRadius:    "50%",
                border:          "1px solid rgba(237,233,225,0.14)",
                background:      "rgba(237,233,225,0.03)",
                display:         "flex", alignItems: "center", justifyContent: "center",
                cursor:          active === 0 ? "not-allowed" : "pointer",
                opacity:         active === 0 ? 0.28 : 1,
                color:           "rgba(237,233,225,0.65)",
                transition:      "border-color 0.3s ease, color 0.3s ease",
                flexShrink:      0,
              }}
              onMouseEnter={e => { if (active > 0) { (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(184,146,58,0.55)"; (e.currentTarget as HTMLButtonElement).style.color = "rgba(184,146,58,0.90)"; } }}
              onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(237,233,225,0.14)"; (e.currentTarget as HTMLButtonElement).style.color = "rgba(237,233,225,0.65)"; }}
            >
              <ChevronLeft style={{ width: "16px", height: "16px" }} />
            </motion.button>

            {/* Indicator dots */}
            {PASSES.map((_, i) => (
              <motion.button
                key={i}
                onClick={() => setActive(i)}
                animate={{ width: i === active ? "28px" : "6px", background: i === active ? "rgba(184,146,58,0.82)" : "rgba(237,233,225,0.22)" }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                style={{ height: "6px", borderRadius: "3px", border: "none", cursor: "pointer", padding: 0, flexShrink: 0 }}
              />
            ))}

            {/* Next */}
            <motion.button
              onClick={next}
              disabled={active === total - 1}
              whileHover={active < total - 1 ? { scale: 1.08 } : {}}
              whileTap={active < total - 1 ? { scale: 0.94 } : {}}
              style={{
                width:           "42px", height: "42px",
                borderRadius:    "50%",
                border:          "1px solid rgba(237,233,225,0.14)",
                background:      "rgba(237,233,225,0.03)",
                display:         "flex", alignItems: "center", justifyContent: "center",
                cursor:          active === total - 1 ? "not-allowed" : "pointer",
                opacity:         active === total - 1 ? 0.28 : 1,
                color:           "rgba(237,233,225,0.65)",
                transition:      "border-color 0.3s ease, color 0.3s ease",
                flexShrink:      0,
              }}
              onMouseEnter={e => { if (active < total - 1) { (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(184,146,58,0.55)"; (e.currentTarget as HTMLButtonElement).style.color = "rgba(184,146,58,0.90)"; } }}
              onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(237,233,225,0.14)"; (e.currentTarget as HTMLButtonElement).style.color = "rgba(237,233,225,0.65)"; }}
            >
              <ChevronRight style={{ width: "16px", height: "16px" }} />
            </motion.button>

          </div>
        </motion.div>

        {/* Footnote */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3 }}
          style={{ fontFamily: INTER, fontSize: "12px", color: "rgba(237,233,225,0.22)", marginTop: "1.5rem", letterSpacing: "0.02em", textAlign: "center" }}
        >
          Camping tickets sold separately and must be paired with a festival pass.
        </motion.p>

      </div>
    </section>
  );
}
