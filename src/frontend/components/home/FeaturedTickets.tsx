"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, ShoppingCart, Zap } from "lucide-react";
import Link from "next/link";
import type { Ticket as PrismaTicket } from "@prisma/client";
import { useCartStore } from "@/frontend/store/cart";
import { formatPrice } from "@/backend/lib/utils";

function FeaturedHeroCard({ ticket }: { ticket: PrismaTicket }) {
  const addItem = useCartStore((s) => s.addItem);
  const items = useCartStore((s) => s.items);
  const available = ticket.quantity - ticket.sold;
  const isAvailable = available > 0 && ticket.isVisible;
  const inCart = items.find((i) => i.ticketId === ticket.id);

  const handleAdd = () => {
    if (!isAvailable) return;
    addItem({
      ticketId: ticket.id,
      name: ticket.name,
      slug: ticket.slug,
      resalePrice: ticket.resalePrice,
      currency: ticket.currency,
      maxQuantity: available,
      category: ticket.category as never,
      dayLabel: ticket.dayLabel,
      deliveryMethod: ticket.deliveryMethod as never,
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7 }}
      className="group relative rounded-3xl overflow-hidden bg-[#0A0A0C] border border-white/[0.07] h-full min-h-[420px] flex flex-col justify-end
                 hover:border-[#C9A84C]/25 transition-all duration-500"
    >
      {/* Background atmosphere */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#C9A84C]/5 via-transparent to-indigo-900/10" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0C] via-[#0A0A0C]/60 to-transparent" />

      {/* Decorative top line */}
      <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-[#C9A84C] to-transparent opacity-60" />

      {/* Featured badge */}
      <div className="absolute top-5 right-5">
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#C9A84C]/10 border border-[#C9A84C]/25 backdrop-blur-sm">
          <Zap className="w-3 h-3 text-[#C9A84C]" />
          <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#E4BA65]">Featured</span>
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 p-8">
        {ticket.dayLabel && (
          <p className="text-[10px] uppercase tracking-[0.2em] text-zinc-500 font-medium mb-3">
            {ticket.dayLabel}
          </p>
        )}
        <h3 className="font-[var(--font-playfair)] text-3xl font-black text-white leading-tight mb-2">
          {ticket.name}
        </h3>

        <div className="flex items-baseline gap-3 mb-6 mt-4">
          <span className="text-4xl font-black text-white">
            {formatPrice(ticket.resalePrice, ticket.currency)}
          </span>
          <span className="text-zinc-600 text-sm line-through">
            {formatPrice(ticket.originalPrice, ticket.currency)}
          </span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleAdd}
            disabled={!isAvailable}
            className="flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm text-black
                       bg-gradient-to-r from-[#C9A84C] to-[#E4BA65]
                       hover:shadow-[0_0_30px_rgba(201,168,76,0.35)] hover:scale-[1.03]
                       transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <ShoppingCart className="w-4 h-4" />
            {inCart ? "In Cart" : "Add to Cart"}
          </button>
          <Link
            href={`/tickets/${ticket.slug}`}
            className="px-5 py-3 rounded-xl border border-white/15 text-white/70 text-sm font-medium
                       hover:bg-white/[0.07] hover:text-white hover:border-white/25 transition-all duration-200"
          >
            Details
          </Link>
        </div>

        <div className="flex items-center gap-2 mt-4">
          <span className={`w-1.5 h-1.5 rounded-full ${isAvailable ? "bg-emerald-400" : "bg-red-500"}`} />
          <span className="text-xs text-zinc-600">
            {isAvailable ? `${available} available` : "Sold out"}
          </span>
        </div>
      </div>
    </motion.div>
  );
}

function CompactTicketCard({ ticket, index }: { ticket: PrismaTicket; index: number }) {
  const addItem = useCartStore((s) => s.addItem);
  const items = useCartStore((s) => s.items);
  const available = ticket.quantity - ticket.sold;
  const isAvailable = available > 0 && ticket.isVisible;
  const inCart = items.find((i) => i.ticketId === ticket.id);

  const handleAdd = () => {
    if (!isAvailable) return;
    addItem({
      ticketId: ticket.id,
      name: ticket.name,
      slug: ticket.slug,
      resalePrice: ticket.resalePrice,
      currency: ticket.currency,
      maxQuantity: available,
      category: ticket.category as never,
      dayLabel: ticket.dayLabel,
      deliveryMethod: ticket.deliveryMethod as never,
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 30 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="group relative flex items-center gap-5 p-5 rounded-2xl
                 bg-white/[0.03] border border-white/[0.06]
                 hover:bg-white/[0.06] hover:border-white/[0.12]
                 hover:-translate-x-1 transition-all duration-300 cursor-pointer"
    >
      {/* Accent left border */}
      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-2/3 rounded-full bg-gradient-to-b from-[#C9A84C]/0 via-[#C9A84C]/60 to-[#C9A84C]/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      {/* Index number */}
      <div className="shrink-0 w-10 h-10 rounded-xl bg-[#C9A84C]/8 border border-[#C9A84C]/15 flex items-center justify-center">
        <span className="font-[var(--font-playfair)] text-[#C9A84C] font-black text-sm">
          {String(index + 1).padStart(2, "0")}
        </span>
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="text-white font-semibold text-sm truncate">{ticket.name}</p>
        {ticket.dayLabel && (
          <p className="text-zinc-600 text-xs mt-0.5 truncate">{ticket.dayLabel}</p>
        )}
      </div>

      {/* Price + action */}
      <div className="shrink-0 flex flex-col items-end gap-2">
        <span className="text-white font-black text-base">
          {formatPrice(ticket.resalePrice, ticket.currency)}
        </span>
        <button
          onClick={handleAdd}
          disabled={!isAvailable}
          className="text-[10px] font-bold uppercase tracking-[0.1em] px-3 py-1.5 rounded-lg
                     bg-gradient-to-r from-[#C9A84C] to-[#E4BA65] text-black
                     hover:shadow-[0_0_15px_rgba(201,168,76,0.3)] transition-all duration-200
                     disabled:opacity-30 disabled:cursor-not-allowed"
        >
          {inCart ? "✓" : "+ Cart"}
        </button>
      </div>
    </motion.div>
  );
}

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

  const [featured, ...rest] = tickets;

  return (
    <section className="py-24 bg-transparent relative overflow-hidden">
      {/* Top rule */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#C9A84C]/15 to-transparent" />
      {/* Local ambient glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-[#C9A84C]/5 blur-[100px] pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex items-end justify-between mb-12"
        >
          <div>
            <p className="text-[10px] uppercase tracking-[0.25em] text-[#C9A84C] font-semibold mb-2">
              Top Picks
            </p>
            <h2 className="font-[var(--font-playfair)] text-4xl sm:text-5xl font-black text-white leading-tight">
              Most Sought-After
            </h2>
          </div>
          <Link
            href="/tickets"
            className="hidden sm:flex items-center gap-2 text-zinc-500 text-sm font-medium hover:text-[#C9A84C] transition-colors duration-200 group"
          >
            Browse all
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>

        {/* Loading */}
        {loading && (
          <div className="grid lg:grid-cols-5 gap-5 h-[420px]">
            <div className="lg:col-span-3 rounded-3xl bg-white/[0.03] animate-pulse border border-white/[0.04]" />
            <div className="lg:col-span-2 flex flex-col gap-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-20 rounded-2xl bg-white/[0.03] animate-pulse border border-white/[0.04]" />
              ))}
            </div>
          </div>
        )}

        {/* Editorial grid */}
        {!loading && tickets.length > 0 && (
          <div className="grid lg:grid-cols-5 gap-5">
            {/* Featured hero ticket — spans 3 cols */}
            <div className="lg:col-span-3">
              {featured && <FeaturedHeroCard ticket={featured} />}
            </div>

            {/* Compact list — spans 2 cols */}
            <div className="lg:col-span-2 flex flex-col justify-between gap-3">
              {rest.slice(0, 3).map((ticket, i) => (
                <CompactTicketCard key={ticket.id} ticket={ticket} index={i} />
              ))}

              {/* View all CTA */}
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <Link
                  href="/tickets"
                  className="flex items-center justify-between w-full px-5 py-4 rounded-2xl
                             border border-[#C9A84C]/15 text-[#C9A84C] text-sm font-semibold
                             hover:bg-[#C9A84C]/5 hover:border-[#C9A84C]/30 transition-all duration-200 group"
                >
                  <span>View all tickets</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </motion.div>
            </div>
          </div>
        )}

        {/* Empty */}
        {!loading && tickets.length === 0 && (
          <p className="text-center text-zinc-600 py-16">No featured tickets right now.</p>
        )}
      </div>
    </section>
  );
}
