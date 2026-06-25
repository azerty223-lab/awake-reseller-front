"use client";

import { motion } from "framer-motion";
import { BadgeCheck, ShieldCheck, Zap, Headphones } from "lucide-react";

const STATS = [
  { Icon: BadgeCheck,  value: "100%",     label: "Verified tickets" },
  { Icon: ShieldCheck, value: "Stripe",   label: "Secured payment" },
  { Icon: Zap,         value: "< 2 min",  label: "Checkout time" },
  { Icon: Headphones,  value: "24 h",     label: "Support available" },
];

export function StatsBar() {
  return (
    <section
      className="relative border-y border-white/[0.05]"
      style={{ background: "rgba(255,255,255,0.015)" }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-white/[0.05]"
        >
          {STATS.map(({ Icon, value, label }, i) => (
            <div
              key={i}
              className="flex items-center gap-3.5 px-5 sm:px-7 py-6 sm:py-8"
            >
              <div className="w-9 h-9 rounded-xl bg-[#C9A84C]/10 border border-[#C9A84C]/20 flex items-center justify-center shrink-0">
                <Icon className="w-4 h-4 text-[#C9A84C]" />
              </div>
              <div className="min-w-0">
                <p
                  className="text-white font-bold tabular-nums leading-none"
                  style={{ fontSize: "1.0625rem", letterSpacing: "-0.01em" }}
                >
                  {value}
                </p>
                <p className="text-[11px] text-zinc-600 mt-0.5 leading-tight">{label}</p>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

