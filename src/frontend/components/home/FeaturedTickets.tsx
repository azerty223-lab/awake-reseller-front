"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Ticket, ChevronRight } from "lucide-react";
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
    <section className="py-20 bg-[#0a0a0a]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex items-end justify-between mb-10"
        >
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Ticket className="w-4 h-4 text-[#c9a84c]" />
              <span className="text-[#c9a84c] text-xs uppercase tracking-widest font-semibold">
                Featured
              </span>
            </div>
            <h2 className="font-[var(--font-playfair)] text-3xl sm:text-4xl font-bold text-white">
              Top Picks
            </h2>
            <p className="text-zinc-500 text-sm mt-2">
              The most sought-after tickets for Awakenings 2026
            </p>
          </div>
          <Link
            href="/tickets"
            className="hidden sm:flex items-center gap-2 text-[#c9a84c] text-sm font-medium hover:gap-3 transition-all"
          >
            View all <ChevronRight className="w-4 h-4" />
          </Link>
        </motion.div>

        {/* Scrollable row */}
        {loading ? (
          <div className="flex gap-5 overflow-x-auto pb-4 hide-scrollbar">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="flex-shrink-0 w-72 h-80 rounded-2xl bg-[#161616] border border-[#2a2a2a] animate-pulse"
              />
            ))}
          </div>
        ) : tickets.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-zinc-500">No featured tickets available right now.</p>
          </div>
        ) : (
          <div className="flex gap-5 overflow-x-auto pb-4 hide-scrollbar">
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
        )}

        <div className="mt-6 flex justify-center sm:hidden">
          <Link
            href="/tickets"
            className="flex items-center gap-2 text-[#c9a84c] text-sm font-medium"
          >
            View all tickets <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
