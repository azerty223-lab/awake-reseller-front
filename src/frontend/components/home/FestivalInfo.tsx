import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

const artists = [
  "Adam Beyer", "Charlotte de Witte", "Amelie Lens", "Richie Hawtin",
  "Sven Väth", "Matador", "Alignment", "I Hate Models",
  "Paula Temple", "Boris Brejcha", "Enrico Sangiuliano", "SPFDJ",
];

const facts = [
  { label: "Festival dates", value: "July 10–12, 2026" },
  { label: "Venue", value: "Hilvarenbeek, Netherlands" },
  { label: "Stages", value: "5 stages, indoor & outdoor" },
  { label: "Capacity", value: "35,000+ attendees" },
];

export function FestivalInfo() {
  return (
    <section className="relative py-32 sm:py-44 overflow-hidden">

      {/* Large atmospheric image — intentional placement */}
      <div className="absolute inset-0 z-0">
        <Image
          src="https://images.unsplash.com/photo-1459749411175-04bf5292ceea?q=80&w=1920&auto=format&fit=crop"
          alt=""
          fill
          style={{ objectFit: "cover", objectPosition: "center 60%", opacity: 0.08 }}
        />
      </div>
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-transparent via-transparent to-[#020203]/80" />

      <div className="relative z-10 max-w-5xl mx-auto px-6 sm:px-12 lg:px-20">

        {/* Two-column composition */}
        <div className="grid lg:grid-cols-2 gap-20 lg:gap-32 items-start">

          {/* Left: headline + description */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <p className="text-[10px] uppercase tracking-[0.25em] text-zinc-600 mb-8 font-medium">
              The festival
            </p>
            <h2
              className="font-[var(--font-playfair)] font-black text-white leading-[0.95] mb-8"
              style={{ fontSize: "clamp(2.5rem, 5vw, 4rem)", letterSpacing: "-0.02em" }}
            >
              Europe's premier
              <br />
              <span style={{
                background: "linear-gradient(135deg, #C9A84C 0%, #E4BA65 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}>
                techno festival
              </span>
            </h2>
            <p className="text-zinc-400 text-base leading-[1.8] mb-10">
              Since its founding, Awakenings has become the benchmark for electronic
              music worldwide — known for uncompromising sound, visionary production,
              and a community built around a shared love of the music.
            </p>
            <Link
              href="https://www.awakenings.com/en/events/2026/07/awakenings-festival/378057/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.15em] font-medium text-zinc-500 hover:text-[#C9A84C] transition-colors duration-200 group"
            >
              Official event page
              <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </Link>
          </motion.div>

          {/* Right: clean fact list + artists */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="space-y-12"
          >
            {/* Key facts */}
            <div className="space-y-0">
              {facts.map(({ label, value }, i) => (
                <div
                  key={label}
                  className="flex items-baseline justify-between py-4 border-b border-white/[0.06] last:border-0"
                >
                  <span className="text-xs text-zinc-600 uppercase tracking-[0.12em] font-medium">{label}</span>
                  <span className="text-sm text-white font-medium text-right">{value}</span>
                </div>
              ))}
            </div>

            {/* Artist names — flowing text, not pills */}
            <div>
              <p className="text-[10px] uppercase tracking-[0.2em] text-zinc-700 mb-4 font-medium">
                Confirmed artists
              </p>
              <p className="text-zinc-500 text-sm leading-[1.9]">
                {artists.join(" · ")}
                <span className="text-zinc-700"> · and many more</span>
              </p>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
