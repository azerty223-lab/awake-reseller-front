"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ArrowRight, CalendarDays, MapPin } from "lucide-react";
import { CountdownTimer } from "@/frontend/components/ui/CountdownTimer";

const FESTIVAL_DATE = new Date("2026-07-10T15:00:00+02:00");

export function HeroSection() {
  const router = useRouter();

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-[#050507]">
      {/* Background image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=1920&auto=format&fit=crop"
          alt="Awakenings Festival"
          fill
          style={{ objectFit: "cover" }}
          className="opacity-30 scale-105"
          priority
        />
      </div>

      {/* Gradient overlays */}
      <div className="absolute inset-0 z-10 bg-gradient-to-t from-[#050507] via-[#050507]/50 to-transparent" />
      <div className="absolute inset-0 z-10 bg-gradient-to-b from-[#050507]/60 to-transparent" />
      <div
        className="absolute inset-0 z-10"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 40%, #050507 100%)",
        }}
      />

      {/* Decorative orbs */}
      <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-[#C9A84C]/10 rounded-full blur-3xl animate-pulse pointer-events-none z-10" />
      <div className="absolute bottom-1/3 left-1/4 w-80 h-80 bg-purple-900/15 rounded-full blur-3xl pointer-events-none z-10" />

      {/* Main content */}
      <div className="relative z-20 flex flex-col items-center text-center px-4 sm:px-6 max-w-5xl mx-auto">

        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0 }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.06] border border-white/[0.1] backdrop-blur-sm mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-[#C9A84C] animate-pulse" />
            <span className="text-[11px] uppercase tracking-[0.25em] text-zinc-300 font-medium">
              Official Ticket Resale — 2026
            </span>
          </div>
        </motion.div>

        {/* Main title */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
        >
          <h1 className="font-[var(--font-playfair)] font-black leading-none mb-6">
            <span className="block text-7xl sm:text-8xl lg:text-[9rem] bg-gradient-to-r from-[#C9A84C] via-[#E4BA65] to-[#C9A84C] bg-clip-text text-transparent">
              AWAKENINGS
            </span>
            <span className="block text-5xl sm:text-6xl lg:text-7xl text-white mt-2">
              FESTIVAL 2026
            </span>
          </h1>
        </motion.div>

        {/* Date / Location row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex items-center justify-center gap-4 mb-10 text-zinc-400 text-sm"
        >
          <span className="flex items-center gap-1.5">
            <CalendarDays className="w-4 h-4" />
            July 10–12, 2026
          </span>
          <span className="w-1 h-1 rounded-full bg-zinc-600" />
          <span className="flex items-center gap-1.5">
            <MapPin className="w-4 h-4" />
            Hilvarenbeek, NL
          </span>
        </motion.div>

        {/* Countdown */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mb-2"
        >
          <p className="text-[9px] uppercase tracking-[0.2em] text-zinc-500 mb-4">
            Countdown to festival
          </p>
          <CountdownTimer
            targetDate={FESTIVAL_DATE}
            className="[&_.glass-dark]:bg-white/[0.06] [&_.glass-dark]:backdrop-blur-sm [&_.glass-dark]:border-white/[0.08] [&_.glass-dark]:rounded-2xl [&_.glass-dark]:min-w-[80px] [&_.glass-dark]:px-5 [&_.glass-dark]:py-4 [&_.glass-dark]:h-auto [&_.glass-dark]:w-auto [&_span.text-2xl]:text-4xl [&_span.text-2xl]:font-black [&_span.text-2xl]:font-[var(--font-playfair)] [&_span.text-3xl]:text-4xl [&_span.text-3xl]:font-black"
          />
        </motion.div>

        {/* CTA buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <div className="flex flex-col sm:flex-row gap-4 mt-10 justify-center">
            <button
              onClick={() => router.push("/tickets")}
              className="px-8 py-4 rounded-2xl bg-gradient-to-r from-[#C9A84C] to-[#E4BA65] text-black font-bold text-sm tracking-wide hover:shadow-[0_0_40px_rgba(201,168,76,0.4)] hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2"
            >
              Browse Tickets
              <ArrowRight className="w-4 h-4" />
            </button>
            <button className="px-8 py-4 rounded-2xl border border-white/20 text-white font-medium text-sm hover:bg-white/[0.07] hover:border-white/40 transition-all duration-300 backdrop-blur-sm">
              Learn More
            </button>
          </div>
        </motion.div>
      </div>

      {/* Trust row — pinned to bottom */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.5 }}
        className="absolute bottom-8 left-0 right-0 flex justify-center z-20"
      >
        <div className="flex items-center gap-6 text-zinc-600 text-[11px]">
          <span>&#10003; Verified seller</span>
          <span className="w-1 h-1 rounded-full bg-zinc-700" />
          <span>&#10003; Stripe secured</span>
          <span className="w-1 h-1 rounded-full bg-zinc-700" />
          <span>&#10003; Name transfer guaranteed</span>
        </div>
      </motion.div>
    </section>
  );
}
