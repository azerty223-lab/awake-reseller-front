"use client";

import { useScroll, useTransform, motion } from "framer-motion";

// Grain texture as inline SVG data URI — no file needed
const GRAIN_URL =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='256' height='256'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.88' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='256' height='256' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E\")";

export function AnimatedBackground() {
  const { scrollYProgress } = useScroll();

  // Scroll-driven atmosphere layers — each atmosphere fades in and out
  // as the corresponding section enters the viewport
  const purpleOp  = useTransform(scrollYProgress, [0,    0.12, 0.28], [0.9, 0.7, 0]);
  const amberOp   = useTransform(scrollYProgress, [0.12, 0.28, 0.44], [0,   1,   0]);
  const orangeOp  = useTransform(scrollYProgress, [0.32, 0.46, 0.58], [0,   1,   0]);
  const blueOp    = useTransform(scrollYProgress, [0.50, 0.62, 0.74], [0,   1,   0]);
  const magentaOp = useTransform(scrollYProgress, [0.66, 0.78, 0.92], [0,   1,   0]);
  const indigoOp  = useTransform(scrollYProgress, [0.84, 0.93, 1.0 ], [0,   1,   0.5]);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: -1 }}>

      {/* ── Base animated gradient mesh ─────────────────── */}
      <div
        className="absolute inset-0 animate-mesh"
        style={{
          background:
            "linear-gradient(135deg, #020203 0%, #06020E 20%, #020408 40%, #080208 60%, #030206 80%, #020203 100%)",
        }}
      />

      {/* ── Scroll-driven color atmospheres ─────────────── */}

      {/* Hero: deep violet */}
      <motion.div
        className="absolute inset-0"
        style={{
          opacity: purpleOp,
          background:
            "radial-gradient(ellipse 80% 60% at 68% 35%, rgba(88,28,135,0.35) 0%, transparent 55%)",
        }}
      />

      {/* Featured: warm amber/gold */}
      <motion.div
        className="absolute inset-0"
        style={{
          opacity: amberOp,
          background:
            "radial-gradient(ellipse 70% 55% at 28% 60%, rgba(120,53,15,0.32) 0%, transparent 55%)",
        }}
      />

      {/* Festival info: deep orange */}
      <motion.div
        className="absolute inset-0"
        style={{
          opacity: orangeOp,
          background:
            "radial-gradient(ellipse 65% 50% at 65% 50%, rgba(124,45,18,0.28) 0%, transparent 55%)",
        }}
      />

      {/* Trust/confidence: electric blue */}
      <motion.div
        className="absolute inset-0"
        style={{
          opacity: blueOp,
          background:
            "radial-gradient(ellipse 70% 55% at 32% 48%, rgba(29,78,216,0.22) 0%, transparent 55%)",
        }}
      />

      {/* Newsletter: deep magenta */}
      <motion.div
        className="absolute inset-0"
        style={{
          opacity: magentaOp,
          background:
            "radial-gradient(ellipse 75% 55% at 68% 52%, rgba(112,26,117,0.28) 0%, transparent 55%)",
        }}
      />

      {/* Footer wind-down: cool indigo */}
      <motion.div
        className="absolute inset-0"
        style={{
          opacity: indigoOp,
          background:
            "radial-gradient(ellipse 60% 45% at 50% 80%, rgba(49,46,129,0.2) 0%, transparent 55%)",
        }}
      />

      {/* ── Floating ambient orbs ────────────────────────── */}
      {/* These drift independently of scroll — always alive */}

      {/* Violet — top right */}
      <div
        className="absolute rounded-full animate-orb-a parallax-layer"
        style={{
          width: 700,
          height: 700,
          top: "8%",
          right: "6%",
          background: "rgba(88,28,135,1)",
          filter: "blur(160px)",
          opacity: 0.18,
        }}
      />

      {/* Amber — center left */}
      <div
        className="absolute rounded-full animate-orb-b parallax-layer"
        style={{
          width: 550,
          height: 550,
          top: "38%",
          left: "3%",
          background: "rgba(180,83,9,1)",
          filter: "blur(140px)",
          opacity: 0.14,
        }}
      />

      {/* Electric blue — bottom right */}
      <div
        className="absolute rounded-full animate-orb-c parallax-layer"
        style={{
          width: 600,
          height: 600,
          bottom: "8%",
          right: "15%",
          background: "rgba(29,78,216,1)",
          filter: "blur(150px)",
          opacity: 0.13,
        }}
      />

      {/* Magenta — lower left */}
      <div
        className="absolute rounded-full animate-orb-d parallax-layer"
        style={{
          width: 450,
          height: 450,
          bottom: "28%",
          left: "18%",
          background: "rgba(162,28,175,1)",
          filter: "blur(130px)",
          opacity: 0.11,
        }}
      />

      {/* Gold — top center */}
      <div
        className="absolute rounded-full animate-orb-b parallax-layer"
        style={{
          width: 400,
          height: 400,
          top: "20%",
          left: "42%",
          background: "rgba(180,120,9,1)",
          filter: "blur(120px)",
          opacity: 0.09,
          animationDelay: "-12s",
        }}
      />

      {/* ── Cinematic noise/grain ─────────────────────────── */}
      <div
        className="absolute inset-0 animate-grain"
        style={{
          backgroundImage: GRAIN_URL,
          backgroundRepeat: "repeat",
          backgroundSize: "256px 256px",
          mixBlendMode: "overlay",
          opacity: 0.045,
        }}
      />

      {/* ── Subtle vignette edges ─────────────────────────── */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 100% 100% at 50% 50%, transparent 40%, rgba(2,2,3,0.55) 100%)",
        }}
      />
    </div>
  );
}
