"use client";

import { useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { LineReveal } from "@/frontend/components/ui/LineReveal";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const STEPS = [
  {
    number: "01",
    title:  "Find your pass",
    body:   "Browse verified resale tickets across every area and day. Real-time availability, fully transparent prices â€” no hidden fees, no guesswork.",
  },
  {
    number: "02",
    title:  "Pay securely",
    body:   "Complete checkout with Stripe or crypto. Your data is encrypted end-to-end. Order confirmation lands in your inbox in seconds.",
  },
  {
    number: "03",
    title:  "Receive your ticket",
    body:   "We handle the official Awakenings name-change process. Your personalised e-ticket arrives within 3â€“5 business days, ready to scan at the gate.",
  },
];

const INTER = "var(--font-inter, Inter, system-ui, sans-serif)";

export function HowItWorks() {
  const sectionRef = useRef<HTMLElement>(null);

  // GSAP ScrollTrigger: ghost numbers scrub from invisible to subtle as each
  // row enters the viewport, then fade back out as it exits â€” creates depth
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    if (!sectionRef.current) return;

    const nums = sectionRef.current.querySelectorAll<HTMLElement>(".step-ghost");
    const ctx  = gsap.context(() => {
      nums.forEach((el) => {
        gsap.fromTo(
          el,
          { opacity: 0, y: 28 },
          {
            opacity: 0.055,
            y:       0,
            ease:    "none",
            scrollTrigger: {
              trigger: el.closest(".step-row")!,
              start:   "top 85%",
              end:     "top 20%",
              scrub:   0.9,
            },
          }
        );
      });
    }, sectionRef.current);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative py-5 overflow-hidden">

      {/* Top rule */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/[0.07] to-transparent" />

      <div className="max-w-5xl mx-auto px-6 sm:px-12 lg:px-20">

        {/* Section header */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9 }}
          className="mb-6"
        >
          <div style={{ display: "flex", alignItems: "center", gap: "14px", marginBottom: "0.75rem" }}>
            <span style={{ width: "16px", height: "1px", background: "rgba(184,146,58,0.45)", flexShrink: 0 }} />
            <span style={{
              fontFamily:    INTER,
              fontSize:      "11px",
              fontWeight:    400,
              letterSpacing: "0.28em",
              textTransform: "uppercase",
              color:         "rgba(237,233,225,0.50)",
            }}>
              The process
            </span>
          </div>

          <h2
            className="font-[var(--font-playfair)] font-black text-white"
            style={{ fontSize: "clamp(2.25rem, 5vw, 3.75rem)", letterSpacing: "-0.025em", lineHeight: 0.92 }}
          >
            <LineReveal>Your ticket,</LineReveal>
            <LineReveal delay={0.09}>three steps</LineReveal>
          </h2>
        </motion.div>

        {/* Editorial step rows */}
        <div>
          {STEPS.map((step, i) => (
            <div
              key={i}
              className="step-row group relative border-t border-white/[0.06] py-12 sm:py-16
                         hover:border-white/[0.10] transition-colors duration-700"
            >

              {/* Ghost number â€” GSAP scrub controls opacity */}
              <span
                className="step-ghost absolute right-0 top-1/2 -translate-y-1/2 font-[var(--font-playfair)] font-black
                           pointer-events-none select-none"
                style={{
                  fontSize:      "clamp(7rem, 20vw, 16rem)",
                  lineHeight:    1,
                  letterSpacing: "-0.06em",
                  color:         "#EDE9E1",
                  opacity:       0,
                }}
                aria-hidden="true"
              >
                {step.number}
              </span>

              {/* Content grid: index â€” title + body */}
              <div className="relative grid sm:grid-cols-[5rem_1fr] md:grid-cols-[8rem_1fr] gap-6 sm:gap-10 lg:gap-16 items-start">

                {/* Step index */}
                <motion.div
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: 0.05 }}
                  className="pt-1"
                >
                  <span style={{
                    fontFamily:    INTER,
                    fontSize:      "11px",
                    fontWeight:    400,
                    letterSpacing: "0.28em",
                    textTransform: "uppercase",
                    color:         "rgba(184,146,58,0.70)",
                    display:       "block",
                  }}>
                    {step.number}
                  </span>
                </motion.div>

                {/* Title + body */}
                <div>
                  <h3
                    className="font-[var(--font-playfair)] font-black text-white mb-5"
                    style={{ fontSize: "clamp(1.6rem, 3.5vw, 2.5rem)", letterSpacing: "-0.025em", lineHeight: 0.95 }}
                  >
                    <LineReveal delay={0.1 + i * 0.04}>{step.title}</LineReveal>
                  </h3>
                  <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.9, delay: 0.22 + i * 0.04, ease: [0.16, 1, 0.3, 1] }}
                    style={{
                      fontFamily:  INTER,
                      fontSize:    "clamp(0.875rem, 1.5vw, 1rem)",
                      lineHeight:  1.85,
                      color:       "rgba(161,161,170,1)",
                      maxWidth:    "38rem",
                    }}
                  >
                    {step.body}
                  </motion.p>
                </div>
              </div>

              {/* Hover: gold accent wipes in from left */}
              <div
                className="absolute bottom-0 left-0 h-px w-0 group-hover:w-full transition-all duration-700"
                style={{ background: "rgba(184,146,58,0.18)" }}
              />
            </div>
          ))}

          {/* Closing rule */}
          <div className="border-t border-white/[0.06]" />
        </div>

      </div>
    </section>
  );
}

