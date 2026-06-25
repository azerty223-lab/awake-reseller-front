"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { LineReveal } from "@/frontend/components/ui/LineReveal";
import { Reveal } from "@/frontend/components/ui/Reveal";
import { Marquee } from "@/frontend/components/ui/Marquee";

const artists = [
  "Adam Beyer", "Charlotte de Witte", "Amelie Lens", "Richie Hawtin",
  "Sven VÃ¤th", "Matador", "Alignment", "I Hate Models",
  "Paula Temple", "Boris Brejcha", "Enrico Sangiuliano", "SPFDJ",
];

const facts = [
  { label: "Festival dates", value: "July 10â€“12, 2026" },
  { label: "Venue",          value: "Hilvarenbeek, Netherlands" },
  { label: "Stages",         value: "5 stages, indoor & outdoor" },
  { label: "Capacity",       value: "35,000+ attendees" },
];

const INTER = "var(--font-inter, Inter, system-ui, sans-serif)";

export function FestivalInfo() {
  return (
    <section className="relative py-5 overflow-hidden">

      {/* Top rule */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/[0.07] to-transparent" />

      <div className="max-w-5xl mx-auto px-6 sm:px-12 lg:px-20">

        {/* Two-column editorial composition */}
        <div className="grid lg:grid-cols-2 gap-20 lg:gap-28 items-start">

          {/* â”€â”€ Left: headline + description â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
          <div>
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.9 }}
              style={{ display: "flex", alignItems: "center", gap: "14px", marginBottom: "0.75rem" }}
            >
              <span style={{ width: "16px", height: "1px", background: "rgba(184,146,58,0.45)", flexShrink: 0 }} />
              <span style={{
                fontFamily:    INTER,
                fontSize:      "11px",
                fontWeight:    400,
                letterSpacing: "0.28em",
                textTransform: "uppercase",
                color:         "rgba(237,233,225,0.50)",
              }}>
                The festival
              </span>
            </motion.div>

            <h2
              className="font-[var(--font-playfair)] font-black text-white leading-[0.92] mb-10"
              style={{ fontSize: "clamp(2.75rem, 5.5vw, 4.25rem)", letterSpacing: "-0.03em" }}
            >
              <LineReveal>Europe&apos;s premier</LineReveal>
              <LineReveal delay={0.09}>
                <span style={{ color: "#B8923A" }}>
                  techno festival
                </span>
              </LineReveal>
            </h2>

            <motion.p
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.9, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              style={{
                fontFamily: INTER,
                fontSize:   "clamp(0.9rem, 1.5vw, 1rem)",
                lineHeight: 1.9,
                color:      "rgba(161,161,170,1)",
                marginBottom: "2.5rem",
              }}
            >
              Since its founding, Awakenings has become the benchmark for
              electronic music worldwide â€” known for uncompromising sound,
              visionary production, and a community built around a shared
              love of the music.
            </motion.p>

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.35 }}
            >
              <Link
                href="https://www.awakenings.com/en/events/2026/07/awakenings-festival/378057/"
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-2"
                style={{
                  fontFamily:    INTER,
                  fontSize:      "12px",
                  fontWeight:    400,
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                  color:         "rgba(237,233,225,0.60)",
                  transition:    "color 0.4s ease",
                }}
                onMouseEnter={e => (e.currentTarget.style.color = "rgba(184,146,58,0.90)")}
                onMouseLeave={e => (e.currentTarget.style.color = "rgba(237,233,225,0.60)")}
              >
                Official event page
                <ArrowUpRight
                  className="group-hover:translate-x-px group-hover:-translate-y-px transition-transform duration-300"
                  style={{ width: "10px", height: "10px" }}
                />
              </Link>
            </motion.div>
          </div>

          {/* â”€â”€ Right: fact list + artist marquee â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
          <div className="space-y-14">

            {/* Key facts â€” Reveal wipes each row in */}
            <div>
              {facts.map(({ label, value }, i) => (
                <Reveal key={label} delay={0.08 + i * 0.07} direction="left">
                  <div className="flex items-baseline justify-between py-4 border-b border-white/[0.06] last:border-0">
                    <span style={{
                      fontFamily:    INTER,
                      fontSize:      "12px",
                      fontWeight:    400,
                      letterSpacing: "0.16em",
                      textTransform: "uppercase",
                      color:         "rgba(161,161,170,0.80)",
                    }}>
                      {label}
                    </span>
                    <span style={{
                      fontFamily:    INTER,
                      fontSize:      "0.9375rem",
                      fontWeight:    400,
                      color:         "rgba(237,233,225,0.90)",
                    }}>
                      {value}
                    </span>
                  </div>
                </Reveal>
              ))}
            </div>

            {/* Artist marquee */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.0, delay: 0.4 }}
            >
              <span style={{
                display:       "block",
                fontFamily:    INTER,
                fontSize:      "11px",
                fontWeight:    400,
                letterSpacing: "0.28em",
                textTransform: "uppercase",
                color:         "rgba(237,233,225,0.45)",
                marginBottom:  "1.25rem",
              }}>
                Confirmed artists
              </span>

              <div className="border-t border-white/[0.06] pt-4 space-y-3">
                {/* Two opposing marquees â€” visual depth */}
                <Marquee
                  items={artists}
                  speed={60}
                  direction="left"
                  itemClassName="text-[11px] tracking-[0.18em] uppercase font-light"
                  className="text-zinc-500"
                />
                <Marquee
                  items={[...artists].reverse()}
                  speed={80}
                  direction="right"
                  itemClassName="text-[11px] tracking-[0.18em] uppercase font-light"
                  className="text-zinc-700"
                />
              </div>
            </motion.div>

          </div>
        </div>
      </div>
    </section>
  );
}

