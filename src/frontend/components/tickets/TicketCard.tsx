"use client";

import Link from "next/link";
import { ArrowRight, ShoppingCart, Truck, Edit3, Tag, Check } from "lucide-react";
import { useCartStore } from "@/frontend/store/cart";
import { formatPrice } from "@/backend/lib/utils";
import {
  DeliveryMethod,
  PersonalizationStatus,
  TicketCategory,
  type Ticket,
} from "@/frontend/types/tickets";
import { useState } from "react";

function getCategoryStyle(category: TicketCategory): { label: string; cls: string } {
  switch (category) {
    case TicketCategory.WEEKEND:
      return { label: "Weekend", cls: "bg-violet-500/10 text-violet-300 ring-1 ring-violet-500/20" };
    case TicketCategory.SATURDAY:
      return { label: "Saturday", cls: "bg-blue-500/10 text-blue-300 ring-1 ring-blue-500/20" };
    case TicketCategory.SUNDAY:
      return { label: "Sunday", cls: "bg-sky-500/10 text-sky-300 ring-1 ring-sky-500/20" };
    case TicketCategory.CAMPING:
      return { label: "Camping", cls: "bg-emerald-500/10 text-emerald-300 ring-1 ring-emerald-500/20" };
    case TicketCategory.COMFORT_CAMPING:
      return { label: "Comfort Camp", cls: "bg-emerald-500/10 text-emerald-300 ring-1 ring-emerald-500/20" };
    case TicketCategory.CAR_CAMPING:
      return { label: "Car Camp", cls: "bg-emerald-500/10 text-emerald-300 ring-1 ring-emerald-500/20" };
    case TicketCategory.PREMIUM:
      return { label: "Premium", cls: "bg-[#C9A84C]/10 text-[#E4BA65] ring-1 ring-[#C9A84C]/25" };
    case TicketCategory.ACCOMMODATION:
      return { label: "Accommodation", cls: "bg-rose-500/10 text-rose-300 ring-1 ring-rose-500/20" };
    default:
      return { label: String(category).replace(/_/g, " "), cls: "bg-zinc-700/20 text-zinc-400 ring-1 ring-zinc-700/30" };
  }
}

function getDeliveryInfo(method: DeliveryMethod) {
  switch (method) {
    case DeliveryMethod.DIGITAL:
      return { label: "Digital", Icon: Tag };
    case DeliveryMethod.PHYSICAL:
      return { label: "Physical", Icon: Truck };
    case DeliveryMethod.NAME_CHANGE:
      return { label: "Name transfer", Icon: Edit3 };
    default:
      return { label: "Digital", Icon: Tag };
  }
}

interface TicketCardProps {
  ticket: Ticket;
}

export function TicketCard({ ticket }: TicketCardProps) {
  const addItem = useCartStore((s) => s.addItem);
  const items = useCartStore((s) => s.items);
  const [added, setAdded] = useState(false);

  const inCart = !!items.find((i) => i.ticketId === ticket.id);
  const available = ticket.quantity - ticket.sold;
  const isAvailable = available > 0 && ticket.isVisible;
  const isLowStock = isAvailable && available <= 3;

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

  const { label: catLabel, cls: catCls } = getCategoryStyle(ticket.category);
  const { label: delivLabel, Icon: DelivIcon } = getDeliveryInfo(ticket.deliveryMethod);

  return (
    <div
      className={[
        "group relative flex flex-col rounded-2xl overflow-hidden bg-[#0D0D0F]",
        "border transition-all duration-300",
        ticket.isFeatured
          ? "border-[#C9A84C]/20 hover:border-[#C9A84C]/45 hover:shadow-[0_12px_40px_rgba(0,0,0,0.55)]"
          : "border-white/[0.07] hover:border-white/[0.15] hover:shadow-[0_12px_40px_rgba(0,0,0,0.55)]",
      ].join(" ")}
    >
      {/* Featured: top accent line + warm ambient glow */}
      {ticket.isFeatured && (
        <>
          <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[#C9A84C]/55 to-transparent pointer-events-none" />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/5 h-20 bg-[#C9A84C]/[0.05] blur-2xl pointer-events-none" />
        </>
      )}

      {/* Content */}
      <div className="relative flex flex-col flex-1 px-5 pt-5 pb-4">

        {/* Top row: category badge + delivery method */}
        <div className="flex items-center justify-between gap-2 mb-4">
          <span className={`inline-flex items-center px-2 py-[3px] rounded-[5px] text-[10px] font-semibold uppercase tracking-[0.08em] leading-none ${catCls}`}>
            {catLabel}
          </span>
          <div className="flex items-center gap-1 text-[10px] text-zinc-600 shrink-0">
            <DelivIcon className="w-2.5 h-2.5 shrink-0" />
            <span>{delivLabel}</span>
          </div>
        </div>

        {/* Ticket name + day label */}
        <div className="flex-1 mb-5">
          <h3 className="text-white font-semibold leading-snug" style={{ fontSize: "0.95rem", letterSpacing: "-0.01em" }}>
            {ticket.name}
          </h3>
          {ticket.dayLabel && (
            <p className="text-zinc-500 text-xs mt-1">{ticket.dayLabel}</p>
          )}
        </div>

        {/* Price + original */}
        <div className="flex items-baseline gap-2.5 mb-3">
          <span
            className="text-white font-bold tabular-nums leading-none"
            style={{ fontSize: "1.45rem", letterSpacing: "-0.025em" }}
          >
            {formatPrice(ticket.resalePrice, ticket.currency)}
          </span>
          <span className="text-zinc-600 text-xs line-through tabular-nums">
            {formatPrice(ticket.originalPrice, ticket.currency)}
          </span>
        </div>

        {/* Availability row */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            {isAvailable ? (
              <>
                <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${isLowStock ? "bg-amber-400" : "bg-emerald-400"}`} />
                <span className={`text-xs ${isLowStock ? "text-amber-400/90 font-medium" : "text-zinc-500"}`}>
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
          {ticket.personalizationStatus === PersonalizationStatus.COMPLETED && isAvailable && (
            <span className="flex items-center gap-1 text-[10px] text-emerald-400/70">
              <Check className="w-2.5 h-2.5" />
              Transfer ready
            </span>
          )}
        </div>
      </div>

      {/* Divider */}
      <div className="mx-5 h-px bg-white/[0.05]" />

      {/* Action row */}
      <div className="flex items-center gap-2 px-5 py-3.5">
        <button
          onClick={handleAddToCart}
          disabled={!isAvailable}
          className={[
            "flex-1 h-9 inline-flex items-center justify-center gap-2 rounded-lg text-xs font-semibold",
            "transition-all duration-200 select-none",
            added || inCart
              ? "bg-white/[0.05] text-zinc-400 border border-white/[0.08]"
              : isAvailable
                ? "bg-gradient-to-r from-[#C9A84C] to-[#E4BA65] text-black hover:opacity-90 hover:shadow-[0_4px_14px_rgba(201,168,76,0.25)] active:scale-[0.98]"
                : "bg-transparent text-zinc-700 cursor-not-allowed border border-white/[0.05]",
          ].join(" ")}
        >
          <ShoppingCart className="w-3.5 h-3.5 shrink-0" />
          {added ? "Added!" : inCart ? "In cart" : "Add to cart"}
        </button>

        <Link
          href={`/tickets/${ticket.slug}`}
          className="w-9 h-9 inline-flex items-center justify-center rounded-lg border border-white/[0.08] text-zinc-600 hover:text-zinc-200 hover:border-white/[0.18] hover:bg-white/[0.04] transition-all duration-200 shrink-0"
          aria-label="View details"
        >
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Sold-out veil */}
      {!isAvailable && (
        <div className="absolute inset-0 rounded-2xl bg-[#080809]/60 flex items-center justify-center pointer-events-none z-10">
          <span className="px-3 py-1.5 bg-zinc-950 border border-zinc-800/70 rounded-lg text-zinc-500 text-[10px] font-semibold uppercase tracking-widest">
            Sold Out
          </span>
        </div>
      )}
    </div>
  );
}
