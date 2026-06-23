"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, MapPin, Calendar } from "lucide-react";
import { CountdownTimer } from "@/frontend/components/ui/CountdownTimer";
import { getPossibleInstrumentationHookFilenames } from "next/dist/build/utils";

const FESTIVAL_DATE = new Date("2026-07-10T15:00:00+02:00");

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-[#0a0a0a]">
      {/* Background gradient */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a] via-[#0a0a0a] to-[#0a0a0a]" />
        {/* Animated orbs */}
        <div className="orb-1 absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-[#c9a84c]/5 blur-[100px]" />
        <div className="orb-2 absolute bottom-1/3 right-1/4 w-80 h-80 rounded-full bg-[#c9a84c]/8 blur-[120px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-[#c9a84c]/3 blur-[150px]" />
        {/* Grid overlay */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(rgba(201,168,76,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(201,168,76,0.5) 1px, transparent 1px)`,
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center text-center px-4 sm:px-6 max-w-5xl mx-auto">
        {/* Label */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="inline-flex items-center gap-2 mb-8 px-4 py-2 rounded-full bg-[#c9a84c]/10 border border-[#c9a84c]/30"
        >
          <span className="w-2 h-2 rounded-full bg-[#c9a84c] animate-pulse" />
          <span className="text-[#c9a84c] text-xs font-semibold tracking-widest uppercase">
             Ticket Resale — 2026
          </span>
        </motion.div>

        {/* Main heading */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="font-[var(--font-playfair)] text-5xl sm:text-7xl lg:text-8xl font-bold leading-none tracking-tight mb-2"
        >
          <span className="gradient-text">AWAKENINGS</span>
        </motion.h1>
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.35 }}
          className="font-[var(--font-playfair)] text-5xl sm:text-7xl lg:text-8xl font-bold leading-none tracking-tight mb-8 text-white"
        >
          FESTIVAL 2026
        </motion.h1>

        {/* Date & Location */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="flex flex-col sm:flex-row items-center gap-4 sm:gap-8 mb-12 text-zinc-400"
        >
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-[#c9a84c]" />
            <span className="text-sm font-medium tracking-wide">JULY 10–12, 2026</span>
          </div>
          <div className="hidden sm:block w-px h-4 bg-[#2a2a2a]" />
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-[#c9a84c]" />
            <span className="text-sm font-medium tracking-wide">HILVARENBEEK</span>
          </div>
        </motion.div>

        {/* Countdown */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mb-12"
        >
          <p className="text-zinc-600 text-xs uppercase tracking-widest mb-4 font-medium">
            Countdown to festival
          </p>
          <CountdownTimer targetDate={FESTIVAL_DATE} />
        </motion.div>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="flex flex-col sm:flex-row items-center gap-4"
        >
          <Link
            href="/tickets"
            className="group flex items-center gap-3 px-8 py-4 rounded-xl bg-[#c9a84c] text-black font-semibold text-sm tracking-wide hover:bg-[#e8c05a] active:bg-[#b89438] transition-all shadow-lg shadow-[#c9a84c]/30 hover:shadow-[#c9a84c]/50"
          >
            Browse Tickets
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
          <Link
            href="/about"
            className="flex items-center gap-3 px-8 py-4 rounded-xl border border-[#3a3a3a] text-zinc-300 font-medium text-sm tracking-wide hover:border-[#c9a84c]/50 hover:text-[#c9a84c] hover:bg-[#c9a84c]/5 transition-all"
          >
            Learn More
          </Link>
        </motion.div>

        {/* Trust note */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1 }}
          className="mt-8 text-zinc-600 text-xs"
        >
          Verified seller · Secured Payment · Name transfer guaranteed
        </motion.p>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="text-zinc-600 text-[10px] uppercase tracking-widest">Scroll</span>
        <div className="w-px h-8 bg-gradient-to-b from-[#c9a84c]/40 to-transparent" />
      </motion.div>
    </section>
  );
}
