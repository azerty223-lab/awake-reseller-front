"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ShoppingCart, Check, ArrowRight } from "lucide-react";
import Link from "next/link";
import { LineReveal } from "@/frontend/components/ui/LineReveal";
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

const COL = {
  index:    "w-10 shrink-0",
  category: "hidden sm:block shrink-0 w-[88px]",
  stock:    "hidden md:flex shrink-0 items-center gap-1.5 w-[96px]",
  price:    "shrink-0 w-[88px] text-right",
  action:   "shrink-0 w-[72px] flex justify-end",
} as const;

const INTER = "var(--font-inter, Inter, system-ui, sans-serif)";

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
      initial={{ x: -24, opacity: 0 }}
      whileInView={{ x: 0, opacity: 1 }}
      viewport={{ once: true, margin: "0px 0px -30px 0px" }}
      transition={{ duration: 0.65, delay: index * 0.07 + index * index * 0.005, ease: [0.16, 1, 0.3, 1] }}
    >
      <Link
        href={`/tickets/${ticket.slug}`}
        className="group flex items-center gap-4 py-4 border-b border-white/[0.06]
                   hover:bg-white/[0.03] transition-colors duration-300 relative"
      >
        {/* Left accent â€” appears on hover */}
        <div className="absolute left-0 top-0 bottom-0 w-px bg-[#06B6D4]/0 group-hover:bg-[#06B6D4]/35
                        transition-colors duration-500" />

        <span className={`${COL.index} text-sm font-bold text-zinc-700 group-hover:text-zinc-500
                          transition-colors duration-200 tabular-nums select-none pl-2`}>
          {String(index + 1).padStart(2, "0")}
        </span>

        <div className="flex-1 min-w-0">
          <p className="text-[0.9375rem] font-medium text-zinc-200 truncate group-hover:text-white
                        transition-colors duration-200">
            {ticket.name}
          </p>
          {ticket.dayLabel && (
            <p className="text-xs text-zinc-600 mt-0.5 truncate">{ticket.dayLabel}</p>
          )}
        </div>

        <span className={`${COL.category} text-[11px] text-zinc-600 font-medium`}>
          {CATEGORY_LABEL[ticket.category] ?? ticket.category}
        </span>

        <div className={COL.stock}>
          {isAvail ? (
            isLow ? (
              /* LOW STOCK — amber pill, prominent */
              <span style={{
                display:       "inline-flex",
                alignItems:    "center",
                gap:           "5px",
                fontFamily:    INTER,
                fontSize:      "10px",
                fontWeight:    700,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                color:         "#F59E0B",
                background:    "rgba(245,158,11,0.10)",
                border:        "1px solid rgba(245,158,11,0.28)",
                borderRadius:  "4px",
                padding:       "3px 8px 3px 6px",
              }}>
                <span style={{ width: "4px", height: "4px", borderRadius: "50%", background: "#F59E0B", flexShrink: 0 }} />
                {available === 1 ? "Last one" : `${available} left`}
              </span>
            ) : (
              <span style={{ display: "inline-flex", alignItems: "center", gap: "5px" }}>
                <span className="w-1.5 h-1.5 rounded-full shrink-0 bg-emerald-500/55" />
                <span className="text-[11px] text-zinc-600">{available} left</span>
              </span>
            )
          ) : (
            /* SOLD OUT — visible but muted, creates scarcity FOMO */
            <span style={{
              fontFamily:    INTER,
              fontSize:      "10px",
              fontWeight:    600,
              letterSpacing: "0.10em",
              textTransform: "uppercase",
              color:         "rgba(113,113,122,0.55)",
              background:    "rgba(255,255,255,0.025)",
              border:        "1px solid rgba(255,255,255,0.05)",
              borderRadius:  "4px",
              padding:       "3px 8px",
              display:       "inline-block",
            }}>
              Sold out
            </span>
          )}
        </div>

        <div className={COL.price}>
          <span className="text-[0.9375rem] font-semibold text-white tabular-nums"
                style={{ letterSpacing: "-0.015em" }}>
            {formatPrice(ticket.resalePrice, ticket.currency)}
          </span>
        </div>

        <div className={COL.action}>
          {inCart ? (
            /* IN CART — prompt to checkout */
            <Link
              href="/checkout"
              onClick={e => e.stopPropagation()}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-sm text-[11px] font-semibold
                         transition-all duration-300 select-none whitespace-nowrap"
              style={{
                background: "rgba(6,182,212,0.10)",
                border:     "1px solid rgba(6,182,212,0.30)",
                color:      "rgba(6,182,212,0.90)",
              }}
            >
              <Check className="w-3 h-3" />
              Pay now
            </Link>
          ) : (
            <button
              onClick={handleAdd}
              disabled={!isAvail}
              className={[
                "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-sm text-[11px] font-semibold",
                "transition-all duration-300 disabled:opacity-35 disabled:cursor-not-allowed select-none",
                isAvail
                  ? "bg-[#06B6D4]/90 text-[#0C0900] hover:bg-[#06B6D4] active:scale-[0.97]"
                  : "bg-white/[0.03] text-zinc-600 border border-white/[0.05]",
              ].join(" ")}
            >
              {added
                ? <><Check className="w-3 h-3" />Done</>
                : isAvail
                  ? <><ShoppingCart className="w-3 h-3" />Add</>
                  : <span style={{ letterSpacing: "0.06em", fontSize: "10px" }}>Sold out</span>
              }
            </button>
          )}
        </div>
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
    <section className="relative py-5 overflow-hidden">

      {/* Top rule */}

      <div className="max-w-5xl mx-auto px-6 sm:px-12 lg:px-20">

        {/* Section header */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9 }}
          className="mb-5"
        >
          {/* "Available now" and "All tickets" on the same row */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.75rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <span style={{ width: "16px", height: "1px", background: "rgba(6,182,212,0.45)", flexShrink: 0 }} />
              <span style={{ fontFamily: INTER, fontSize: "0.9375rem", fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: "rgba(237,233,225,0.82)" }}>
                Limited stock — act now
              </span>
            </div>
            <Link
              href="/tickets"
              className="hidden sm:flex items-center gap-2 group"
              style={{
                fontFamily:    INTER,
                fontSize:      "12px",
                fontWeight:    400,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color:         "rgba(237,233,225,0.55)",
                transition:    "color 0.4s ease",
              }}
              onMouseEnter={e => (e.currentTarget.style.color = "rgba(6,182,212,0.90)")}
              onMouseLeave={e => (e.currentTarget.style.color = "rgba(237,233,225,0.55)")}
            >
              All tickets
              <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform duration-300" />
            </Link>
          </div>

          <h2
            className="font-[var(--font-playfair)] font-black text-white"
            style={{ fontSize: "clamp(2rem, 4.5vw, 3.25rem)", letterSpacing: "-0.025em", lineHeight: 0.92 }}
          >
            <LineReveal>Last Available</LineReveal>
            <LineReveal delay={0.07}>
              <span style={{ color: "rgba(237,233,225,0.42)" }}>Tickets</span>
            </LineReveal>
          </h2>
        </motion.div>

        {/* Column headers */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="flex items-center gap-4 pb-3 border-b border-white/[0.06]"
        >
          <span className={COL.index} />
          <span className="flex-1 text-[10px] uppercase tracking-[0.20em] text-zinc-700"
                style={{ fontFamily: INTER }}>Ticket</span>
          <span className={`${COL.category} text-[10px] uppercase tracking-[0.20em] text-zinc-700`}
                style={{ fontFamily: INTER }}>Type</span>
          <span className="w-[96px] hidden md:block text-[10px] uppercase tracking-[0.20em] text-zinc-700"
                style={{ fontFamily: INTER }}>Stock</span>
          <span className={`${COL.price} text-[10px] uppercase tracking-[0.20em] text-zinc-700`}
                style={{ fontFamily: INTER }}>Price</span>
          <span className={COL.action} />
        </motion.div>

        {/* Rows */}
        {loading ? (
          <div>
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="flex items-center gap-4 py-4 border-b border-white/[0.04]">
                <div className={`${COL.index} h-3 bg-white/[0.03] rounded animate-pulse`} />
                <div className="flex-1 space-y-1.5">
                  <div className="h-3 w-3/5 bg-white/[0.04] rounded animate-pulse" />
                  <div className="h-2.5 w-2/5 bg-white/[0.02] rounded animate-pulse" />
                </div>
                <div className="hidden sm:block w-[88px] h-3 bg-white/[0.03] rounded animate-pulse" />
                <div className="hidden md:block w-[96px] h-3 bg-white/[0.03] rounded animate-pulse" />
                <div className="w-[88px] h-3 bg-white/[0.04] rounded animate-pulse" />
              </div>
            ))}
          </div>
        ) : tickets.length === 0 ? (
          <p style={{ fontFamily: INTER, color: "rgba(113,113,122,0.7)", fontSize: "0.875rem", paddingTop: "3rem", paddingBottom: "3rem" }}>
            No featured tickets right now.
          </p>
        ) : (
          <div>
            {tickets.map((t, i) => <TicketRow key={t.id} ticket={t} index={i} />)}
          </div>
        )}

        {!loading && tickets.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex pt-6 sm:hidden"
          >
            <Link
              href="/tickets"
              className="flex items-center gap-2"
              style={{
                fontFamily:    INTER,
                fontSize:      "12px",
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color:         "rgba(237,233,225,0.55)",
              }}
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

