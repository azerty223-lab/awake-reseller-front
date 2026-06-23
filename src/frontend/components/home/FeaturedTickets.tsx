"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, ShoppingCart } from "lucide-react";
import Link from "next/link";
import type { Ticket as PrismaTicket } from "@prisma/client";
import { useCartStore } from "@/frontend/store/cart";
import { formatPrice } from "@/backend/lib/utils";

const CATEGORY_LABEL: Record<string, string> = {
  WEEKEND: "Weekend",
  SATURDAY: "Saturday",
  SUNDAY: "Sunday",
  CAMPING: "Camping",
  COMFORT_CAMPING: "Comfort Camp",
  CAR_CAMPING: "Car Camp",
  PREMIUM: "Premium",
  ACCOMMODATION: "Accommodation",
};

function TicketRow({
  ticket,
  index,
}: {
  ticket: PrismaTicket;
  index: number;
}) {
  const addItem = useCartStore((s) => s.addItem);
  const items = useCartStore((s) => s.items);
  const available = ticket.quantity - ticket.sold;
  const isAvailable = available > 0 && ticket.isVisible;
  const inCart = !!items.find((i) => i.ticketId === ticket.id);

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
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
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.06, ease: "easeOut" }}
    >
      <Link
        href={`/tickets/${ticket.slug}`}
        className="group flex items-center gap-6 py-6 border-b border-white/[0.06] hover:border-white/[0.12] transition-colors duration-300"
      >
        {/* Index */}
        <span
          className="shrink-0 font-[var(--font-playfair)] font-black text-zinc-800 group-hover:text-zinc-600 transition-colors duration-300 tabular-nums"
          style={{ fontSize: "clamp(1.1rem, 2vw, 1.4rem)", letterSpacing: "-0.01em", minWidth: "2.5rem" }}
        >
          {String(index + 1).padStart(2, "0")}
        </span>

        {/* Name + day label */}
        <div className="flex-1 min-w-0">
          <p
            className="text-white font-semibold truncate group-hover:text-zinc-200 transition-colors duration-200"
            style={{ fontSize: "clamp(0.95rem, 1.5vw, 1.1rem)" }}
          >
            {ticket.name}
          </p>
          {ticket.dayLabel && (
            <p className="text-zinc-600 text-xs mt-0.5 truncate">{ticket.dayLabel}</p>
          )}
        </div>

        {/* Category */}
        <span className="hidden sm:block shrink-0 text-[10px] uppercase tracking-[0.15em] text-zinc-600 font-medium min-w-[80px]">
          {CATEGORY_LABEL[ticket.category] ?? ticket.category}
        </span>

        {/* Availability */}
        <div className="hidden md:flex shrink-0 items-center gap-1.5 min-w-[80px]">
          <span className={`w-1.5 h-1.5 rounded-full ${isAvailable ? "bg-emerald-500" : "bg-zinc-700"}`} />
          <span className="text-xs text-zinc-600">
            {isAvailable ? `${available} left` : "Sold out"}
          </span>
        </div>

        {/* Price */}
        <div className="shrink-0 text-right min-w-[90px]">
          <span
            className="font-black text-white tabular-nums"
            style={{ fontSize: "clamp(1rem, 1.8vw, 1.25rem)", letterSpacing: "-0.01em" }}
          >
            {formatPrice(ticket.resalePrice, ticket.currency)}
          </span>
        </div>

        {/* Action */}
        <button
          onClick={handleAdd}
          disabled={!isAvailable}
          className="shrink-0 flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed"
          style={
            inCart
              ? { background: "rgba(255,255,255,0.06)", color: "#71717A", border: "1px solid rgba(255,255,255,0.08)" }
              : { background: "linear-gradient(135deg, #C9A84C, #E4BA65)", color: "#000" }
          }
        >
          <ShoppingCart className="w-3.5 h-3.5" />
          {inCart ? "In cart" : "Add"}
        </button>

        {/* Arrow */}
        <ArrowRight
          className="shrink-0 w-4 h-4 text-zinc-700 group-hover:text-zinc-400 group-hover:translate-x-0.5 transition-all duration-200"
        />
      </Link>
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

  return (
    <section className="relative py-32 sm:py-40 overflow-hidden">
      <div className="max-w-5xl mx-auto px-6 sm:px-12 lg:px-20">

        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex items-end justify-between mb-16"
        >
          <div>
            <p className="text-[10px] uppercase tracking-[0.25em] text-zinc-600 mb-4 font-medium">
              Available now
            </p>
            <h2
              className="font-[var(--font-playfair)] font-black text-white leading-tight"
              style={{ fontSize: "clamp(2rem, 4.5vw, 3.5rem)", letterSpacing: "-0.02em" }}
            >
              Top Picks
            </h2>
          </div>
          <Link
            href="/tickets"
            className="hidden sm:flex items-center gap-2 text-xs text-zinc-600 hover:text-[#C9A84C] transition-colors duration-200 group uppercase tracking-[0.12em] font-medium"
          >
            All tickets
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </motion.div>

        {/* Column headers */}
        <div className="flex items-center gap-6 pb-3 border-b border-white/[0.06] mb-0">
          <span className="w-10 shrink-0" />
          <span className="flex-1 text-[10px] uppercase tracking-[0.15em] text-zinc-700">Ticket</span>
          <span className="hidden sm:block min-w-[80px] text-[10px] uppercase tracking-[0.15em] text-zinc-700">Type</span>
          <span className="hidden md:block min-w-[80px] text-[10px] uppercase tracking-[0.15em] text-zinc-700">Stock</span>
          <span className="min-w-[90px] text-right text-[10px] uppercase tracking-[0.15em] text-zinc-700">Price</span>
          <span className="w-20" />
          <span className="w-4" />
        </div>

        {/* Rows */}
        {loading ? (
          <div className="space-y-0">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-center gap-6 py-6 border-b border-white/[0.04]">
                <div className="w-10 h-4 bg-white/[0.04] rounded animate-pulse" />
                <div className="flex-1 h-4 bg-white/[0.04] rounded animate-pulse" />
                <div className="w-20 h-4 bg-white/[0.04] rounded animate-pulse" />
              </div>
            ))}
          </div>
        ) : tickets.length === 0 ? (
          <p className="text-zinc-700 py-16 text-sm">No featured tickets right now.</p>
        ) : (
          <div>
            {tickets.map((t, i) => (
              <TicketRow key={t.id} ticket={t} index={i} />
            ))}
          </div>
        )}

        {/* Footer link */}
        {!loading && tickets.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex items-center justify-between pt-8 sm:hidden"
          >
            <Link
              href="/tickets"
              className="flex items-center gap-2 text-xs text-zinc-600 hover:text-[#C9A84C] transition-colors uppercase tracking-[0.12em] font-medium"
            >
              Browse all tickets <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </motion.div>
        )}

      </div>
    </section>
  );
}
