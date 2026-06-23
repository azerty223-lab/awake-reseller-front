"use client";

import { CheckCircle, Shield, Repeat, MessageCircle } from "lucide-react";
import { motion } from "framer-motion";

const trustItems = [
  {
    icon: CheckCircle,
    title: "100% Verified",
    description: "Every ticket authenticated before listing",
    color: "#C9A84C",
    bgColor: "rgba(201,168,76,0.08)",
    borderColor: "rgba(201,168,76,0.2)",
  },
  {
    icon: Shield,
    title: "Secure Payments",
    description: "Stripe-powered checkout",
    color: "#3b82f6",
    bgColor: "rgba(59,130,246,0.08)",
    borderColor: "rgba(59,130,246,0.2)",
  },
  {
    icon: Repeat,
    title: "Name Transfer",
    description: "Full personalization service included",
    color: "#10b981",
    bgColor: "rgba(16,185,129,0.08)",
    borderColor: "rgba(16,185,129,0.2)",
  },
  {
    icon: MessageCircle,
    title: "Fast Support",
    description: "Response within 4 hours",
    color: "#a855f7",
    bgColor: "rgba(168,85,247,0.08)",
    borderColor: "rgba(168,85,247,0.2)",
  },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export function TrustSection() {
  return (
    <section className="py-24 bg-[#050507] relative overflow-hidden">
      {/* Subtle top border */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/[0.07] to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <p className="text-[10px] uppercase tracking-[0.2em] font-semibold text-zinc-500 mb-4">
            Why AW Tickets
          </p>
          <h2 className="font-[var(--font-playfair)] text-4xl sm:text-5xl font-black text-white mb-4">
            Buy with Confidence
          </h2>
          <p className="text-zinc-500 text-sm max-w-md mx-auto">
            Every ticket verified, every transfer guaranteed
          </p>
        </motion.div>

        {/* Feature cards grid */}
        <motion.div
          className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {trustItems.map(({ icon: Icon, title, description, color, bgColor, borderColor }) => (
            <motion.div
              key={title}
              variants={itemVariants}
              className="group p-6 bg-white/[0.03] border border-white/[0.06] rounded-2xl
                         hover:bg-white/[0.06] hover:border-white/[0.1] hover:-translate-y-1 transition-all duration-300"
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                style={{ backgroundColor: bgColor, border: `1px solid ${borderColor}` }}
              >
                <Icon className="w-5 h-5" style={{ color }} />
              </div>
              <h3 className="text-white font-bold text-base mb-2">{title}</h3>
              <p className="text-zinc-500 text-sm leading-relaxed">{description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
