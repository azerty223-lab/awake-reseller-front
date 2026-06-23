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
    <section className="relative min-h-screen overflow-hidden bg-[#020203]">

      {/* Background — image at real cinematic brightness */}
      <div className="absolute inset-0 z-0">
        <Image
          src="https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=1920&auto=format&fit=crop"
          alt="Awakenings Festival"
          fill
          style={{ objectFit: "cover", objectPosition: "center 35%", opacity: 0.55 }}
          className="scale-[1.03]"
          priority
        />
      </div>

      {/* Cinematic gradient — bottom ONLY, minimal top */}
      <div className="absolute inset-0 z-10 bg-gradient-to-t from-[#020203] via-[#020203]/40 to-transparent" />
      {/* Side vignette for depth */}
      <div className="absolute inset-0 z-10 bg-gradient-to-r from-[#020203]/70 via-transparent to-[#020203]/50" />

      {/* Floating glow orbs */}
      <div className="absolute top-1/3 right-1/3 w-[500px] h-[500px] rounded-full bg-[#C9A84C]/8 blur-[120px] pointer-events-none z-10 animate-pulse" />
      <div className="absolute bottom-1/4 left-1/4 w-[400px] h-[400px] rounded-full bg-indigo-900/20 blur-[100px] pointer-events-none z-10" />

      {/* Top editorial bar */}
      <div className="absolute top-28 left-0 right-0 z-20 px-6 sm:px-12 lg:px-20">
        <div className="flex items-center gap-6 max-w-7xl mx-auto">
          <div className="h-px w-12 bg-[#C9A84C]/50" />
          <span className="text-[10px] uppercase tracking-[0.3em] text-white/30 font-medium">
            Official Ticket Resale Platform
          </span>
          <div className="h-px flex-1 bg-white/[0.06]" />
        </div>
      </div>

      {/* Content — bottom-left aligned */}
      <div className="relative z-20 min-h-screen flex flex-col justify-end pb-24 sm:pb-32">
        <div className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-20 w-full">

          {/* Live badge */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-6"
          >
            <div className="inline-flex items-center gap-2.5">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#C9A84C] opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#C9A84C]" />
              </span>
              <span className="text-[11px] uppercase tracking-[0.28em] text-[#C9A84C] font-semibold">
                Tickets Available — 2026
              </span>
            </div>
          </motion.div>

          {/* Massive title */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          >
            <h1
              className="font-[var(--font-playfair)] font-black leading-[0.88] mb-8"
              style={{ fontSize: "clamp(3.5rem, 11vw, 9.5rem)" }}
            >
              <span className="block text-white">AWAKENINGS</span>
              <span
                className="block"
                style={{
                  fontSize: "clamp(2.2rem, 7vw, 6.5rem)",
                  background: "linear-gradient(135deg, #C9A84C 0%, #E4BA65 50%, #C9A84C 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                FESTIVAL 2026
              </span>
            </h1>
          </motion.div>

          {/* Info strip + divider */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="flex flex-wrap items-center gap-5 pb-8 mb-10 border-b border-white/[0.08] max-w-2xl"
          >
            <div className="flex items-center gap-2 text-zinc-300 text-sm">
              <CalendarDays className="w-4 h-4 text-[#C9A84C] shrink-0" />
              <span>July 10–12, 2026</span>
            </div>
            <div className="w-px h-4 bg-white/20" />
            <div className="flex items-center gap-2 text-zinc-300 text-sm">
              <MapPin className="w-4 h-4 text-[#C9A84C] shrink-0" />
              <span>Hilvarenbeek Recreation Area</span>
            </div>
            <div className="w-px h-4 bg-white/20" />
            <span className="text-zinc-500 text-sm">Netherlands</span>
          </motion.div>

          {/* Bottom row: countdown + CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="flex flex-col lg:flex-row items-start lg:items-center gap-8"
          >
            {/* Countdown */}
            <div>
              <p className="text-[9px] uppercase tracking-[0.25em] text-zinc-600 mb-3 font-medium">
                Countdown to festival
              </p>
              <CountdownTimer targetDate={FESTIVAL_DATE} />
            </div>

            {/* Vertical divider */}
            <div className="hidden lg:block h-14 w-px bg-white/10" />

            {/* CTAs */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.push("/tickets")}
                className="group flex items-center gap-3 px-8 py-4 rounded-2xl font-black text-sm tracking-wide text-black transition-all duration-300 hover:scale-[1.04]"
                style={{
                  background: "linear-gradient(135deg, #C9A84C 0%, #E4BA65 100%)",
                  boxShadow: "0 0 0 0 rgba(201,168,76,0)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = "0 0 50px 0 rgba(201,168,76,0.45)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = "0 0 0 0 rgba(201,168,76,0)";
                }}
              >
                Browse Tickets
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
              </button>
              <button
                className="px-7 py-4 rounded-2xl border border-white/15 text-white/80 font-medium text-sm
                           hover:bg-white/[0.08] hover:border-white/30 hover:text-white
                           transition-all duration-300 backdrop-blur-sm"
              >
                Learn More
              </button>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Trust badges — bottom right, desktop only */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.8 }}
        className="absolute bottom-8 right-6 sm:right-12 hidden lg:flex items-center gap-5 z-20"
      >
        {["Verified seller", "Stripe secured", "Name transfer"].map((t) => (
          <div key={t} className="flex items-center gap-1.5">
            <span className="text-[#C9A84C] text-[10px]">✓</span>
            <span className="text-zinc-600 text-[10px] uppercase tracking-[0.12em]">{t}</span>
          </div>
        ))}
      </motion.div>
    </section>
  );
}
