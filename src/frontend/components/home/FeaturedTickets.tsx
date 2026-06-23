"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";
import { TicketCard } from "@/frontend/components/tickets/TicketCard";
import Link from "next/link";
import type { Ticket as PrismaTicket } from "@prisma/client";

export function FeaturedTickets() {
  const [tickets, setTickets] = useState<PrismaTicket[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/tickets?featured=true&visible=true")
      .then((r) => r.json())
      .then((data) => {
        setTickets(Array.isArray(data) ? data : data.tickets ?? []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <section className="py-24 bg-[#050507] relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-[#C9A84C]/20 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex items-end justify-between mb-10"
        >
          <div>
            <p className="text-[10px] uppercase tracking-[0.2em] text-[#C9A84C] font-semibold mb-3">
              Featured
            </p>
            <h2 className="font-[var(--font-playfair)] text-4xl sm:text-5xl font-black text-white">
              Top Picks
            </h2>
            <p className="text-zinc-500 text-sm mt-3">
              Most sought-after tickets for Awakenings 2026
            </p>
          </div>
          <Link
            href="/tickets"
            className="hidden sm:flex items-center gap-2 text-[#C9A84C] text-sm font-medium hover:gap-3 transition-all duration-300"
          >
            View all <ChevronRight className="w-4 h-4" />
          </Link>
        </motion.div>

        {/* Scrollable row */}
        {loading ? (
          <div className="relative">
            <div className="absolute left-0 top-0 bottom-6 w-12 bg-gradient-to-r from-[#050507] to-transparent z-10 pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-6 w-12 bg-gradient-to-l from-[#050507] to-transparent z-10 pointer-events-none" />
            <div className="flex gap-5 overflow-x-auto pb-6 pt-2 hide-scrollbar">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="flex-shrink-0 w-72 h-80 rounded-2xl bg-white/[0.04] animate-pulse border border-white/[0.04]"
                />
              ))}
            </div>
          </div>
        ) : tickets.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-zinc-500">No featured tickets available right now.</p>
          </div>
        ) : (
          <div className="relative">
            <div className="absolute left-0 top-0 bottom-6 w-12 bg-gradient-to-r from-[#050507] to-transparent z-10 pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-6 w-12 bg-gradient-to-l from-[#050507] to-transparent z-10 pointer-events-none" />
            <div className="flex gap-5 overflow-x-auto pb-6 pt-2 hide-scrollbar">
              {tickets.map((ticket, index) => (
                <motion.div
                  key={ticket.id}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="flex-shrink-0 w-[300px]"
                >
                  <TicketCard ticket={ticket} />
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Mobile "View all" link */}
        <div className="mt-6 flex justify-center sm:hidden">
          <Link
            href="/tickets"
            className="flex items-center gap-2 text-[#C9A84C] text-sm font-medium"
          >
            View all tickets <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
