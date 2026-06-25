"use client";

import { useRef, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { LineReveal } from "@/frontend/components/ui/LineReveal";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const TIERS = [
  {
    id:    "grand",
    index: "01",
    title: "Grand Camping",
    label: "Outdoor",
    description:
      "Dedicated campsite directly adjacent to the festival grounds. Shared shower and toilet facilities, 24-hour security, and full power access points.",
    details: [
      { label: "Site type",    value: "Personal tent space" },
      { label: "Facilities",  value: "Shared showers + WC" },
      { label: "Access",      value: "Festival + camping wristband" },
      { label: "Duration",    value: "Thursday check-in — Monday checkout" },
    ],
    note: "Bring your own tent",
  },
  {
    id:    "comfort",
    index: "02",
    title: "Comfort Camping",
    label: "Equipped",
    description:
      "Pre-pitched bell tents with proper sleeping infrastructure. Camping beds, bedding, electricity, and a dedicated lounge area. Everything set up before you arrive.",
    details: [
      { label: "Tent type",   value: "Pre-pitched bell tent" },
      { label: "Included",    value: "Beds, bedding, electricity" },
      { label: "Facilities",  value: "Upgraded shower block" },
      { label: "Duration",    value: "Friday check-in — Monday checkout" },
    ],
    note: "Most popular upgrade",
  },
  {
    id:    "resort",
    index: "03",
    title: "Relax Resort",
    label: "Luxury",
    description:
      "Private glamping pods with ensuite facilities, air conditioning, and a dedicated concierge. The most refined way to experience Awakenings.",
    details: [
      { label: "Unit type",   value: "Private glamping pod" },
      { label: "Facilities",  value: "Private shower + WC, A/C" },
      { label: "Included",    value: "Concierge, welcome package" },
      { label: "Duration",    value: "Friday check-in — Monday checkout" },
    ],
    note: "Limited availability",
  },
];

const INTER = "var(--font-inter, Inter, system-ui, sans-serif)";
const SERIF = "var(--font-playfair)";

export function AccommodationSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      sectionRef.current!.querySelectorAll<HTMLElement>(".acc-ghost").forEach(el => {
        gsap.fromTo(el,
          { opacity: 0, x: 30 },
          {
            opacity:  0.045,
            x:        0,
            ease:     "none",
            scrollTrigger: {
              trigger: el.closest(".acc-row")!,
              start:   "top 85%",
              end:     "top 25%",
              scrub:   1.0,
            },
          }
        );
      });
    }, sectionRef.current);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative py-5 overflow-hidden">

      <div className="max-w-5xl mx-auto px-6 sm:px-12 lg:px-20">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9 }}
          className="mb-5"
        >
          <div style={{ display: "flex", alignItems: "center", gap: "14px", marginBottom: "0.75rem" }}>
            <span style={{ width: "16px", height: "1px", background: "rgba(184,146,58,0.45)", flexShrink: 0 }} />
            <span style={{ fontFamily: INTER, fontSize: "0.9375rem", fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: "rgba(237,233,225,0.82)" }}>
              Camping & Resort
            </span>
          </div>
          <h2
            className="font-[var(--font-playfair)] font-black text-white"
            style={{ fontSize: "clamp(2rem, 4.5vw, 3.25rem)", letterSpacing: "-0.03em", lineHeight: 0.92 }}
          >
            <LineReveal>Stay on-site.</LineReveal>
            <LineReveal delay={0.09}>
              <span style={{ color: "rgba(237,233,225,0.45)" }}>Three tiers.</span>
            </LineReveal>
          </h2>
        </motion.div>

        {/* Accommodation rows */}
        {TIERS.map((tier, i) => (
          <div
            key={tier.id}
            className="acc-row group relative border-t border-white/[0.06] py-12 sm:py-16"
          >
            {/* Ghost number — GSAP scroll-scrubbed */}
            <span
              className="acc-ghost absolute right-0 top-1/2 -translate-y-1/2 font-[var(--font-playfair)] font-black pointer-events-none select-none"
              style={{
                fontFamily:    SERIF,
                fontSize:      "clamp(7rem, 20vw, 16rem)",
                lineHeight:    1,
                letterSpacing: "-0.06em",
                color:         "#EDE9E1",
                opacity:       0,
              }}
              aria-hidden="true"
            >
              {tier.index}
            </span>

            <div className="relative grid grid-cols-1 lg:grid-cols-[1fr_1.2fr] gap-10 lg:gap-16 items-start">

              {/* Left: index + title + label */}
              <div>
                <motion.div
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: 0.05 }}
                  style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1.25rem" }}
                >
                  <span style={{
                    fontFamily:    INTER,
                    fontSize:      "11px",
                    letterSpacing: "0.28em",
                    textTransform: "uppercase",
                    color:         "rgba(184,146,58,0.65)",
                  }}>
                    {tier.index}
                  </span>
                  <span style={{ width: "24px", height: "1px", background: "rgba(237,233,225,0.10)" }} />
                  <span style={{
                    fontFamily:    INTER,
                    fontSize:      "10px",
                    letterSpacing: "0.24em",
                    textTransform: "uppercase",
                    color:         "rgba(237,233,225,0.30)",
                  }}>
                    {tier.label}
                  </span>
                </motion.div>

                <h3
                  className="font-[var(--font-playfair)] font-black text-white"
                  style={{ fontSize: "clamp(1.875rem, 4vw, 3rem)", letterSpacing: "-0.03em", lineHeight: 0.95, marginBottom: "1.25rem" }}
                >
                  <LineReveal delay={0.08 + i * 0.03}>{tier.title}</LineReveal>
                </h3>

                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.9, delay: 0.20, ease: [0.16, 1, 0.3, 1] }}
                  style={{
                    fontFamily: INTER,
                    fontSize:   "0.9375rem",
                    lineHeight: 1.8,
                    color:      "rgba(161,161,170,1)",
                  }}
                >
                  {tier.description}
                </motion.p>
              </div>

              {/* Right: detail rows + note + link */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.9, delay: 0.18, ease: [0.16, 1, 0.3, 1] }}
              >
                {/* Detail table */}
                <div style={{ marginBottom: "1.75rem" }}>
                  {tier.details.map(({ label, value }) => (
                    <div key={label} style={{
                      display:         "flex",
                      justifyContent:  "space-between",
                      alignItems:      "baseline",
                      padding:         "0.75rem 0",
                      borderBottom:    "1px solid rgba(237,233,225,0.05)",
                    }}>
                      <span style={{ fontFamily: INTER, fontSize: "12px", letterSpacing: "0.16em", textTransform: "uppercase", color: "rgba(161,161,170,0.55)" }}>
                        {label}
                      </span>
                      <span style={{ fontFamily: INTER, fontSize: "0.9375rem", color: "rgba(237,233,225,0.85)" }}>
                        {value}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Note + link row */}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  {tier.note && (
                    <span style={{
                      fontFamily:    INTER,
                      fontSize:      "10px",
                      letterSpacing: "0.22em",
                      textTransform: "uppercase",
                      color:         "rgba(184,146,58,0.50)",
                    }}>
                      {tier.note}
                    </span>
                  )}
                  <Link
                    href="/tickets"
                    className="group/lnk inline-flex items-center gap-2 ml-auto"
                    style={{
                      fontFamily:    INTER,
                      fontSize:      "11px",
                      letterSpacing: "0.20em",
                      textTransform: "uppercase",
                      color:         "rgba(237,233,225,0.40)",
                      transition:    "color 0.3s ease",
                    }}
                    onMouseEnter={e => (e.currentTarget.style.color = "rgba(184,146,58,0.80)")}
                    onMouseLeave={e => (e.currentTarget.style.color = "rgba(237,233,225,0.40)")}
                  >
                    View tickets
                    <ArrowRight
                      className="group-hover/lnk:translate-x-0.5 transition-transform duration-300"
                      style={{ width: "11px", height: "11px" }}
                    />
                  </Link>
                </div>
              </motion.div>
            </div>

            {/* Hover gold accent */}
            <div className="absolute bottom-0 left-0 h-px w-0 group-hover:w-full transition-all duration-700"
                 style={{ background: "rgba(184,146,58,0.15)" }} />
          </div>
        ))}

        <div className="border-t border-white/[0.06]" />
      </div>
    </section>
  );
}

