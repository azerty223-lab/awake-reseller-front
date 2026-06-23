"use client";

import Image from "next/image";
import { MapPin, Calendar, Music2, Users, ExternalLink, Clock, Ticket } from "lucide-react";
import { motion } from "framer-motion";

const artists = [
  "Adam Beyer",
  "Charlotte de Witte",
  "Amelie Lens",
  "Richie Hawtin",
  "Sven Väth",
  "Matador",
  "Alignment",
  "I Hate Models",
  "Paula Temple",
  "Boris Brejcha",
  "Enrico Sangiuliano",
  "SPFDJ",
];

const stats = [
  { number: "3", label: "Days of Music" },
  { number: "July 10–12", label: "Festival Dates" },
  { number: "Hilvarenbeek", label: "North Brabant" },
];

const infoCards = [
  {
    icon: Calendar,
    label: "Dates",
    value: "July 10–12, 2026",
    sub: "Friday to Sunday",
  },
  {
    icon: MapPin,
    label: "Venue",
    value: "Hilvarenbeek",
    sub: "North Brabant",
  },
  {
    icon: Users,
    label: "Capacity",
    value: "35,000+",
    sub: "Attendees expected",
  },
  {
    icon: Music2,
    label: "Stages",
    value: "5 Stages",
    sub: "Outdoor & Indoor",
  },
];

const features = [
  "World-class techno and electronic lineups across five stages",
  "Iconic outdoor venue in the heart of North Brabant",
  "Immersive light, sound, and production design",
  "Three days of non-stop music from dusk to dawn",
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.12 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } },
};

export function FestivalInfo() {
  return (
    <section className="py-24 bg-transparent relative overflow-hidden">
      {/* Local orange/amber glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-orange-900/10 blur-[120px] pointer-events-none rounded-full" />
      {/* Background image */}
      <div className="absolute inset-0">
        <Image
          src="https://images.unsplash.com/photo-1429514513361-8a632ff5f4b8?q=80&w=1920&auto=format&fit=crop"
          alt=""
          fill
          style={{ objectFit: "cover" }}
          className="opacity-[0.06] select-none"
        />
      </div>
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-transparent" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section label */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="h-px w-8 bg-gradient-to-r from-transparent to-[#C9A84C]" />
            <span className="text-[10px] uppercase tracking-[0.2em] font-semibold text-zinc-500">
              The Festival
            </span>
            <div className="h-px w-8 bg-gradient-to-l from-transparent to-[#C9A84C]" />
          </div>
          <h2 className="font-[var(--font-playfair)] text-4xl sm:text-5xl font-black text-white mb-4">
            Awakenings{" "}
            <span className="bg-gradient-to-r from-[#C9A84C] to-[#E4BA65] bg-clip-text text-transparent">
              2026
            </span>
          </h2>
          <p className="text-zinc-500 text-sm max-w-xl mx-auto leading-relaxed">
            Europe&apos;s leading techno festival returns to Hilvarenbeek for another unforgettable
            edition. Three days of world-class electronic music across five stages.
          </p>
        </motion.div>

        {/* ── Top stat row ── */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-16"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {stats.map(({ number, label }) => (
            <motion.div
              key={label}
              variants={itemVariants}
              className="bg-white/[0.04] backdrop-blur-md border border-white/[0.07] rounded-2xl p-8 text-center hover:bg-white/[0.07] hover:border-white/[0.12] hover:shadow-[0_20px_60px_rgba(0,0,0,0.6)] hover:-translate-y-1 transition-all duration-300"
            >
              <p className="font-[var(--font-playfair)] text-4xl sm:text-5xl font-black bg-gradient-to-r from-[#C9A84C] to-[#E4BA65] bg-clip-text text-transparent mb-2 leading-none">
                {number}
              </p>
              <p className="text-[10px] uppercase tracking-[0.2em] font-semibold text-zinc-500">
                {label}
              </p>
            </motion.div>
          ))}
        </motion.div>

        {/* ── Info section: left description + right details card ── */}
        <motion.div
          className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          {/* Left: description + features */}
          <div className="flex flex-col justify-center">
            <span className="text-[10px] uppercase tracking-[0.2em] font-semibold text-zinc-500 mb-4">
              About the event
            </span>
            <p className="text-zinc-300 text-base leading-relaxed mb-6">
              Awakenings Festival is a three-day immersive electronic music experience held in the
              picturesque fields of Hilvarenbeek, North Brabant. Since its founding, Awakenings has
              become the benchmark for techno festivals worldwide — known for uncompromising sound
              quality, visionary production, and a community built on a shared love of the music.
            </p>
            <ul className="space-y-3">
              {features.map((f) => (
                <li key={f} className="flex items-start gap-3 text-sm text-zinc-400">
                  <span className="mt-1 flex-shrink-0 w-4 h-4 rounded-full bg-gradient-to-r from-[#C9A84C] to-[#E4BA65] flex items-center justify-center">
                    <svg width="8" height="6" viewBox="0 0 8 6" fill="none">
                      <path d="M1 3l2 2 4-4" stroke="#000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                  {f}
                </li>
              ))}
            </ul>
          </div>

          {/* Right: key details card */}
          <div className="bg-white/[0.04] backdrop-blur-md border border-white/[0.07] rounded-2xl p-7 shadow-[0_0_40px_rgba(201,168,76,0.08)]">
            <div className="flex items-center gap-3 mb-6 pb-5 border-b border-white/[0.07]">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-r from-[#C9A84C] to-[#E4BA65] flex items-center justify-center flex-shrink-0">
                <Music2 className="w-4 h-4 text-black" />
              </div>
              <div>
                <p className="text-white font-bold text-sm">Key Details</p>
                <p className="text-zinc-500 text-xs">Awakenings Festival 2026</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {infoCards.map(({ icon: Icon, label, value, sub }) => (
                <div
                  key={label}
                  className="bg-white/[0.03] border border-white/[0.05] rounded-xl p-4 hover:bg-white/[0.06] hover:border-white/[0.10] transition-all duration-300"
                >
                  <div className="w-8 h-8 rounded-lg bg-[#C9A84C]/10 flex items-center justify-center mb-3">
                    <Icon className="w-3.5 h-3.5 text-[#C9A84C]" />
                  </div>
                  <p className="text-[10px] uppercase tracking-[0.15em] font-semibold text-zinc-600 mb-1">
                    {label}
                  </p>
                  <p className="text-white font-bold text-sm leading-tight">{value}</p>
                  <p className="text-zinc-500 text-xs mt-0.5">{sub}</p>
                </div>
              ))}
            </div>

            {/* Tickets remaining indicator */}
            <div className="mt-5 pt-5 border-t border-white/[0.07] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Ticket className="w-4 h-4 text-[#C9A84C]" />
                <span className="text-xs text-zinc-400">Resale tickets available</span>
              </div>
              <span className="text-[10px] uppercase tracking-widest font-bold text-[#C9A84C]">
                Limited
              </span>
            </div>
          </div>
        </motion.div>

        {/* ── Confirmed Lineup ── */}
        <motion.div
          className="bg-white/[0.04] backdrop-blur-md border border-white/[0.07] rounded-2xl p-8 mb-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.15 }}
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 rounded-lg bg-[#C9A84C]/10 flex items-center justify-center">
              <Music2 className="w-4 h-4 text-[#C9A84C]" />
            </div>
            <div>
              <h3 className="text-white font-bold">Confirmed Lineup</h3>
              <p className="text-zinc-500 text-xs">Awakenings Festival 2026 artists</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            {artists.map((artist) => (
              <div
                key={artist}
                className="px-4 py-2 rounded-xl bg-white/[0.03] border border-white/[0.07] text-sm font-medium text-zinc-300 hover:border-[#C9A84C]/40 hover:text-[#C9A84C] hover:bg-[#C9A84C]/5 transition-all duration-300 cursor-default"
              >
                {artist}
              </div>
            ))}
            <div className="px-4 py-2 rounded-xl bg-[#C9A84C]/10 border border-[#C9A84C]/30 text-sm font-medium text-[#C9A84C]">
              + Many more TBA
            </div>
          </div>

          <p className="text-zinc-600 text-xs mt-6">
            * Lineup subject to change. All artists confirmed as of announcement.
            Ticket purchase is not dependent on specific artist appearances.
          </p>
        </motion.div>

        {/* ── Bottom CTA ── */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <a
            href="https://www.awakenings.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 border border-white/20 text-white rounded-xl px-6 py-3 text-sm font-medium hover:bg-white/[0.07] hover:border-white/40 transition-all duration-300"
          >
            <span>Get official info</span>
            <ExternalLink className="w-4 h-4 text-zinc-400" />
          </a>
        </motion.div>
      </div>
    </section>
  );
}
