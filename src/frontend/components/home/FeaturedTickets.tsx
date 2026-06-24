"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, ShoppingCart, Check } from "lucide-react";
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

function TicketRow({ ticket, index }: { ticket: PrismaTicket; index: number }) {
  const addItem = useCartStore((s) => s.addItem);
  const items = useCartStore((s) => s.items);
  const [added, setAdded] = useState(false);

  const available = ticket.quantity - ticket.sold;
  const isAvailable = available > 0 && ticket.isVisible;
  const isLowStock = isAvailable && available <= 3;
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
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.45, delay: index * 0.055, ease: "easeOut" }}
    >
      <Link
        href={`/tickets/${ticket.slug}`}
        className="group flex items-center gap-5 py-5 border-b border-white/[0.06] hover:border-white/[0.1] transition-colors duration-200"
      >
        {/* Index */}
        <span
          className="shrink-0 font-[var(--font-playfair)] font-black text-zinc-800 group-hover:text-zinc-600 transition-colors duration-200 tabular-nums select-none"
          style={{ fontSize: "clamp(1rem, 2vw, 1.3rem)", letterSpacing: "-0.01em", minWidth: "2.5rem" }}
        >
          {String(index + 1).padStart(2, "0")}
        </span>

        {/* Name + day label */}
        <div className="flex-1 min-w-0">
          <p
            className="text-white font-medium truncate group-hover:text-zinc-200 transition-colors duration-150"
            style={{ fontSize: "clamp(0.875rem, 1.4vw, 1.05rem)" }}
          >
            {ticket.name}
          </p>
          {ticket.dayLabel && (
            <p className="text-zinc-600 text-xs mt-0.5 truncate">{ticket.dayLabel}</p>
          )}
        </div>

        {/* Category */}
        <span className="hidden sm:block shrink-0 text-[10px] uppercase tracking-[0.13em] text-zinc-500 font-medium min-w-[80px]">
          {CATEGORY_LABEL[ticket.category] ?? ticket.category}
        </span>

        {/* Availability */}
        <div className="hidden md:flex shrink-0 items-center gap-1.5 min-w-[90px]">
          {isAvailable ? (
            <>
              <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${isLowStock ? "bg-amber-400" : "bg-emerald-500"}`} />
              <span className={`text-xs ${isLowStock ? "text-amber-400/80 font-medium" : "text-zinc-500"}`}>
                {available === 1 ? "Last one" : `${available} left`}
              </span>
            </>
          ) : (
            <>
              <span className="w-1.5 h-1.5 rounded-full shrink-0 bg-zinc-700" />
              <span className="text-xs text-zinc-600">Sold out</span>
            </>
          )}
        </div>

        {/* Price */}
        <div className="shrink-0 text-right min-w-[90px]">
          <span
            className="font-bold text-white tabular-nums"
            style={{ fontSize: "clamp(0.95rem, 1.7vw, 1.2rem)", letterSpacing: "-0.015em" }}
          >
            {formatPrice(ticket.resalePrice, ticket.currency)}
          </span>
        </div>

        {/* Add button */}
        <button
          onClick={handleAdd}
          disabled={!isAvailable}
          className={[
            "shrink-0 inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold",
            "transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed select-none",
            added || inCart
              ? "bg-white/[0.05] text-zinc-500 border border-white/[0.08]"
              : "bg-gradient-to-r from-[#C9A84C] to-[#E4BA65] text-black hover:opacity-90 active:scale-[0.97]",
          ].join(" ")}
        >
          {added ? (
            <><Check className="w-3 h-3" />Done</>
          ) : inCart ? (
            <><ShoppingCart className="w-3 h-3" />In cart</>
          ) : (
            <><ShoppingCart className="w-3 h-3" />Add</>
          )}
        </button>

        {/* Row arrow */}
        <ArrowRight
          className="shrink-0 w-3.5 h-3.5 text-zinc-700 group-hover:text-zinc-400 group-hover:translate-x-0.5 transition-all duration-200"
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
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55 }}
          className="flex items-end justify-between mb-14"
        >
          <div>
            <p className="text-[10px] uppercase tracking-[0.25em] text-zinc-600 mb-3 font-medium">
              Available now
            </p>
            <h2
              className="font-[var(--font-playfair)] font-black text-white leading-tight"
              style={{ fontSize: "clamp(1.9rem, 4.5vw, 3.25rem)", letterSpacing: "-0.02em" }}
            >
              Top Picks
            </h2>
          </div>
          <Link
            href="/tickets"
            className="hidden sm:flex items-center gap-1.5 text-xs text-zinc-600 hover:text-[#C9A84C] transition-colors duration-200 group uppercase tracking-[0.12em] font-medium"
          >
            All tickets
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </motion.div>

        {/* Column headers */}
        <div className="flex items-center gap-5 pb-3 border-b border-white/[0.06]">
          <span className="w-10 shrink-0" />
          <span className="flex-1 text-[10px] uppercase tracking-[0.14em] text-zinc-500">Ticket</span>
          <span className="hidden sm:block min-w-[80px] text-[10px] uppercase tracking-[0.14em] text-zinc-500">Type</span>
          <span className="hidden md:block min-w-[90px] text-[10px] uppercase tracking-[0.14em] text-zinc-500">Stock</span>
          <span className="min-w-[90px] text-right text-[10px] uppercase tracking-[0.14em] text-zinc-500">Price</span>
          <span className="w-[4.5rem]" />
          <span className="w-3.5" />
        </div>

        {/* Rows */}
        {loading ? (
          <div>
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-center gap-5 py-5 border-b border-white/[0.04]">
                <div className="w-10 h-3.5 bg-white/[0.04] rounded animate-pulse" />
                <div className="flex-1 h-3.5 bg-white/[0.04] rounded animate-pulse" />
                <div className="hidden sm:block w-20 h-3.5 bg-white/[0.04] rounded animate-pulse" />
                <div className="hidden md:block w-16 h-3.5 bg-white/[0.04] rounded animate-pulse" />
                <div className="w-16 h-3.5 bg-white/[0.04] rounded animate-pulse" />
              </div>
            ))}
          </div>
        ) : tickets.length === 0 ? (
          <p className="text-zinc-700 py-14 text-sm">No featured tickets right now.</p>
        ) : (
          <div>
            {tickets.map((t, i) => (
              <TicketRow key={t.id} ticket={t} index={i} />
            ))}
          </div>
        )}

        {/* Mobile footer link */}
        {!loading && tickets.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.25 }}
            className="flex items-center justify-start pt-7 sm:hidden"
          >
            <Link
              href="/tickets"
              className="flex items-center gap-1.5 text-xs text-zinc-600 hover:text-[#C9A84C] transition-colors uppercase tracking-[0.12em] font-medium"
            >
              Browse all tickets
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </motion.div>
        )}

      </div>
    </section>
  );
}
