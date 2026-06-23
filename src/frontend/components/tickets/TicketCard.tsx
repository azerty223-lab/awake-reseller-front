"use client";

import Link from "next/link";
import { ShoppingCart, Eye, Truck, Edit3, Tag } from "lucide-react";
import { useCartStore } from "@/frontend/store/cart";
import { formatPrice } from "@/backend/lib/utils";
import {
  DeliveryMethod,
  PersonalizationStatus,
  TicketCategory,
  type Ticket,
} from "@/frontend/types/tickets";
import { motion } from "framer-motion";
import { useState } from "react";

function getCategoryBadgeClasses(category: TicketCategory): string {
  const base =
    "text-[10px] font-bold uppercase tracking-[0.15em] px-2 py-0.5 rounded-full";
  switch (category) {
    case TicketCategory.WEEKEND:
      return `${base} bg-violet-500/20 text-violet-300 border border-violet-500/20`;
    case TicketCategory.SATURDAY:
      return `${base} bg-blue-500/20 text-blue-300 border border-blue-500/20`;
    case TicketCategory.SUNDAY:
      return `${base} bg-sky-500/20 text-sky-300 border border-sky-500/20`;
    case TicketCategory.CAMPING:
    case TicketCategory.COMFORT_CAMPING:
    case TicketCategory.CAR_CAMPING:
      return `${base} bg-emerald-500/20 text-emerald-300 border border-emerald-500/20`;
    case TicketCategory.PREMIUM:
      return `${base} bg-[#C9A84C]/20 text-[#E4BA65] border border-[#C9A84C]/20`;
    default:
      return `${base} bg-zinc-500/20 text-zinc-300 border border-zinc-700`;
  }
}

function getCategoryLabel(category: TicketCategory): string {
  return category.replace("_", " ");
}

function getDeliveryIcon(method: DeliveryMethod) {
  switch (method) {
    case DeliveryMethod.DIGITAL:
      return <Tag className="w-3 h-3" />;
    case DeliveryMethod.PHYSICAL:
      return <Truck className="w-3 h-3" />;
    case DeliveryMethod.NAME_CHANGE:
      return <Edit3 className="w-3 h-3" />;
    default:
      return <Tag className="w-3 h-3" />;
  }
}

function getDeliveryLabel(method: DeliveryMethod): string {
  switch (method) {
    case DeliveryMethod.DIGITAL:
      return "Digital";
    case DeliveryMethod.PHYSICAL:
      return "Physical";
    case DeliveryMethod.NAME_CHANGE:
      return "Name transfer";
    default:
      return "Digital";
  }
}

interface TicketCardProps {
  ticket: Ticket;
}

export function TicketCard({ ticket }: TicketCardProps) {
  const addItem = useCartStore((s) => s.addItem);
  const items = useCartStore((s) => s.items);
  const [added, setAdded] = useState(false);

  const inCart = items.find((i) => i.ticketId === ticket.id);
  const available = ticket.quantity - ticket.sold;
  const isAvailable = available > 0 && ticket.isVisible;
  const soldOut = !isAvailable;

  const handleAddToCart = () => {
    if (!isAvailable) return;
    addItem({
      ticketId: ticket.id,
      name: ticket.name,
      slug: ticket.slug,
      resalePrice: ticket.resalePrice,
      currency: ticket.currency,
      maxQuantity: available,
      category: ticket.category,
      dayLabel: ticket.dayLabel,
      deliveryMethod: ticket.deliveryMethod,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <motion.div
      transition={{ duration: 0.2 }}
      className="group relative bg-[#0D0D0F] border border-white/[0.07] rounded-2xl overflow-hidden hover:border-[#C9A84C]/30 hover:shadow-[0_20px_60px_rgba(0,0,0,0.6)] hover:-translate-y-1 transition-all duration-300 cursor-pointer flex flex-col"
    >
      {/* Hover golden glow overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#C9A84C]/[0.03] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-0" />

      {/* Featured shimmer top border */}
      {ticket.isFeatured && (
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-[#C9A84C] to-transparent z-10" />
      )}

      {/* Top section: category + delivery badges */}
      <div className="relative px-5 pt-4 pb-0 flex items-center justify-between gap-2 z-[1]">
        <span className={getCategoryBadgeClasses(ticket.category)}>
          {getCategoryLabel(ticket.category)}
        </span>
        <span className="text-zinc-600 text-[10px] flex items-center gap-1">
          {getDeliveryIcon(ticket.deliveryMethod)}
          {getDeliveryLabel(ticket.deliveryMethod)}
        </span>
      </div>

      {/* Main content */}
      <div className="relative px-5 pt-4 pb-4 flex-1 flex flex-col z-[1]">
        {/* Ticket name */}
        <h3 className="text-white font-bold text-base leading-tight mb-1">
          {ticket.name}
        </h3>

        {/* Day label */}
        {ticket.dayLabel && (
          <p className="text-zinc-600 text-xs mb-4">{ticket.dayLabel}</p>
        )}
        {!ticket.dayLabel && <div className="mb-4" />}

        {/* Price row */}
        <div className="flex items-baseline gap-0 flex-1">
          <span className="text-2xl font-black text-white">
            {formatPrice(ticket.resalePrice, ticket.currency)}
          </span>
          <span className="text-zinc-600 text-xs line-through ml-2">
            {formatPrice(ticket.originalPrice, ticket.currency)} orig.
          </span>
        </div>

        {/* Availability row */}
        <div className="flex items-center gap-1.5 mt-3">
          {isAvailable ? (
            <>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <span className="text-xs text-zinc-500">
                {available === 1 ? "Last one" : `${available} available`}
              </span>
            </>
          ) : (
            <>
              <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
              <span className="text-xs text-zinc-500">Sold out</span>
            </>
          )}
          {ticket.personalizationStatus === PersonalizationStatus.COMPLETED && (
            <span className="flex items-center gap-1 text-emerald-400 text-[10px] ml-2">
              &#10003; Transfer ready
            </span>
          )}
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-white/[0.06] mx-5 relative z-[1]" />

      {/* Bottom action bar */}
      <div className="relative px-5 py-4 flex items-center gap-2 z-[1]">
        {inCart && !added ? (
          <button
            className="flex-1 py-2.5 rounded-xl bg-white/[0.07] text-white text-xs font-medium border border-white/[0.1] flex items-center justify-center gap-1.5"
            onClick={handleAddToCart}
            disabled={!isAvailable}
          >
            <ShoppingCart className="w-3.5 h-3.5" />
            In cart
          </button>
        ) : (
          <button
            className={
              added
                ? "flex-1 py-2.5 rounded-xl bg-white/[0.07] text-white text-xs font-medium border border-white/[0.1] flex items-center justify-center gap-1.5"
                : "flex-1 py-2.5 rounded-xl bg-gradient-to-r from-[#C9A84C] to-[#E4BA65] text-black text-xs font-bold hover:shadow-[0_0_20px_rgba(201,168,76,0.3)] transition-all duration-200 flex items-center justify-center gap-1.5 disabled:opacity-40 disabled:cursor-not-allowed"
            }
            onClick={handleAddToCart}
            disabled={!isAvailable}
          >
            <ShoppingCart className="w-3.5 h-3.5" />
            {added ? "Added!" : "Add to Cart"}
          </button>
        )}

        <Link
          href={`/tickets/${ticket.slug}`}
          className="w-8 h-8 rounded-xl border border-white/[0.07] bg-white/[0.04] flex items-center justify-center text-zinc-600 hover:text-white hover:border-white/20 transition-all"
          aria-label="View details"
        >
          <Eye className="w-4 h-4" />
        </Link>
      </div>

      {/* Sold out overlay */}
      {soldOut && (
        <div className="absolute inset-0 bg-[#050507]/80 backdrop-blur-[2px] flex items-center justify-center z-10">
          <span className="px-4 py-2 bg-zinc-900 border border-zinc-700 rounded-xl text-zinc-500 text-xs font-bold uppercase tracking-widest">
            Sold Out
          </span>
        </div>
      )}
    </motion.div>
  );
}
