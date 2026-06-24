"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ShoppingCart, Check, ArrowRight } from "lucide-react";
import Link from "next/link";
import { EchoHeading } from "@/frontend/components/ui/EchoHeading";
import type { Ticket as PrismaTicket } from "@prisma/client";
import { useCartStore } from "@/frontend/store/cart";
import { formatPrice } from "@/backend/lib/utils";

const CATEGORY_LABEL: Record<string, string> = {
  WEEKEND:         "Weekend",
  SATURDAY:        "Saturday",
  SUNDAY:          "Sunday",
  CAMPING:         "Camping",
  COMFORT_CAMPING: "Comfort Camp",
  CAR_CAMPING:     "Car Camp",
  PREMIUM:         "Premium",
  ACCOMMODATION:   "Stay",
};

// Shared between header and rows — prevents structural misalignment when button states change width
const COL = {
  index:    "w-10 shrink-0",
  category: "hidden sm:block shrink-0 w-[88px]",
  stock:    "hidden md:flex shrink-0 items-center gap-1.5 w-[96px]",
  price:    "shrink-0 w-[88px] text-right",
  action:   "shrink-0 w-[72px] flex justify-end",
} as const;

function TicketRow({ ticket, index }: { ticket: PrismaTicket; index: number }) {
  const addItem = useCartStore((s) => s.addItem);
  const items   = useCartStore((s) => s.items);
  const [added, setAdded] = useState(false);

  const available = ticket.quantity - ticket.sold;
  const isAvail   = available > 0 && ticket.isVisible;
  const isLow     = isAvail && available <= 3;
  const inCart    = !!items.find((i) => i.ticketId === ticket.id);

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!isAvail) return;
    addItem({
      ticketId:       ticket.id,
      name:           ticket.name,
      slug:           ticket.slug,
      resalePrice:    ticket.resalePrice,
      currency:       ticket.currency,
      maxQuantity:    available,
      category:       ticket.category as never,
      dayLabel:       ticket.dayLabel,
      deliveryMethod: ticket.deliveryMethod as never,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.38, delay: index * 0.05, ease: "easeOut" }}
    >
      <Link
        href={`/tickets/${ticket.slug}`}
        // hover:bg-white/[0.04] — 4% is minimum perceptible surface shift on #050507 at standard calibration
        className="group flex items-center gap-4 py-4 border-b border-white/[0.06] hover:bg-white/[0.04] transition-colors duration-150"
      >
        {/* Index — fixed text-sm: two clamp curves on adjacent columns create misalignment at all but one viewport width */}
        <span className={`${COL.index} text-sm font-bold text-zinc-700 group-hover:text-zinc-500 transition-colors duration-150 tabular-nums select-none`}>
          {String(index + 1).padStart(2, "0")}
        </span>

        {/* Name + day */}
        <div className="flex-1 min-w-0">
          <p className="text-[0.9375rem] font-medium text-zinc-200 truncate group-hover:text-white transition-colors duration-150">
            {ticket.name}
          </p>
          {ticket.dayLabel && (
            <p className="text-xs text-zinc-600 mt-0.5 truncate">{ticket.dayLabel}</p>
          )}
        </div>

        {/* Category */}
        <span className={`${COL.category} text-[11px] text-zinc-600 font-medium`}>
          {CATEGORY_LABEL[ticket.category] ?? ticket.category}
        </span>

        {/* Stock */}
        <div className={COL.stock}>
          {isAvail ? (
            <>
              <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${isLow ? "bg-amber-400" : "bg-emerald-500/60"}`} />
              <span className={`text-[11px] ${isLow ? "text-amber-400/90 font-semibold" : "text-zinc-600"}`}>
                {available === 1 ? "Last one" : `${available} left`}
              </span>
            </>
          ) : (
            <span className="text-[11px] text-zinc-700">Sold out</span>
          )}
        </div>

        {/* Price */}
        <div className={COL.price}>
          <span className="text-[0.9375rem] font-semibold text-white tabular-nums" style={{ letterSpacing: "-0.015em" }}>
            {formatPrice(ticket.resalePrice, ticket.currency)}
          </span>
        </div>

        {/* Add button
            opacity-40 (not 25): disabled ≠ invisible — 25% removes the element from
            the user's awareness entirely, preventing them from understanding the state */}
        <div className={COL.action}>
          <button
            onClick={handleAdd}
            disabled={!isAvail}
            className={[
              "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-semibold",
              "transition-colors duration-150 disabled:opacity-40 disabled:cursor-not-allowed select-none",
              added || inCart
                ? "bg-white/[0.05] text-zinc-500"
                : "bg-[#C9A84C] text-[#0C0900] hover:bg-[#D4B855] active:scale-[0.97]",
            ].join(" ")}
          >
            {added
              ? <><Check className="w-3 h-3" />Done</>
              : inCart
                ? <><ShoppingCart className="w-3 h-3" />In cart</>
                : <><ShoppingCart className="w-3 h-3" />Add</>
            }
          </button>
        </div>
        {/* No ArrowRight: the row is a link — cursor + hover bg communicate affordance.
            An end arrow creates false visual weight at the rightmost position,
            drawing the eye away from price (the last meaningful datum). */}
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
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.48 }}
          className="flex items-end justify-between mb-12"
        >
          <div>
            <p className="text-[11px] uppercase tracking-[0.22em] text-zinc-600 mb-3 font-medium">
              Available now
            </p>
            <EchoHeading
              as="h2"
              className="font-[var(--font-playfair)] font-black text-white leading-tight"
              style={{ fontSize: "clamp(1.875rem, 4.5vw, 3rem)", letterSpacing: "-0.02em" }}
            >
              Top Picks
            </EchoHeading>
          </div>
          <Link
            href="/tickets"
            className="hidden sm:flex items-center gap-1.5 text-xs text-zinc-600 hover:text-[#C9A84C] transition-colors group uppercase tracking-[0.1em] font-medium"
          >
            All tickets
            <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </motion.div>

        {/* Column headers — widths must precisely mirror COL constants */}
        <div className="flex items-center gap-4 pb-2.5 border-b border-white/[0.06]">
          <span className={COL.index} />
          <span className="flex-1 text-[11px] uppercase tracking-[0.12em] text-zinc-600">Ticket</span>
          <span className={`${COL.category} text-[11px] uppercase tracking-[0.12em] text-zinc-600`}>Type</span>
          <span className="w-[96px] hidden md:block text-[11px] uppercase tracking-[0.12em] text-zinc-600">Stock</span>
          <span className={`${COL.price} text-[11px] uppercase tracking-[0.12em] text-zinc-600`}>Price</span>
          <span className={COL.action} />
        </div>

        {/* Rows */}
        {loading ? (
          <div>
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="flex items-center gap-4 py-4 border-b border-white/[0.04]">
                <div className={`${COL.index} h-3 bg-white/[0.04] rounded animate-pulse`} />
                <div className="flex-1 space-y-1.5">
                  <div className="h-3 w-3/5 bg-white/[0.05] rounded animate-pulse" />
                  <div className="h-2.5 w-2/5 bg-white/[0.03] rounded animate-pulse" />
                </div>
                <div className="hidden sm:block w-[88px] h-3 bg-white/[0.04] rounded animate-pulse" />
                <div className="hidden md:block w-[96px] h-3 bg-white/[0.04] rounded animate-pulse" />
                <div className="w-[88px] h-3 bg-white/[0.05] rounded animate-pulse" />
              </div>
            ))}
          </div>
        ) : tickets.length === 0 ? (
          <p className="text-zinc-700 py-12 text-sm">No featured tickets right now.</p>
        ) : (
          <div>
            {tickets.map((t, i) => <TicketRow key={t.id} ticket={t} index={i} />)}
          </div>
        )}

        {/* Mobile footer link */}
        {!loading && tickets.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.38, delay: 0.18 }}
            className="flex pt-6 sm:hidden"
          >
            <Link
              href="/tickets"
              className="flex items-center gap-1.5 text-xs text-zinc-600 hover:text-[#C9A84C] transition-colors uppercase tracking-[0.1em] font-medium"
            >
              Browse all tickets
              <ArrowRight className="w-3 h-3" />
            </Link>
          </motion.div>
        )}

      </div>
    </section>
  );
}
