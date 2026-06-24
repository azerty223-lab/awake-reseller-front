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

// Muted, sophisticated badge palette — no oversaturation
const CATEGORY_STYLES: Partial<Record<TicketCategory, { label: string; cls: string }>> = {
  [TicketCategory.WEEKEND]:         { label: "Weekend",      cls: "bg-violet-500/[0.1]  text-violet-300/75  ring-1 ring-violet-500/[0.14]" },
  [TicketCategory.SATURDAY]:        { label: "Saturday",     cls: "bg-blue-500/[0.1]    text-blue-300/75    ring-1 ring-blue-500/[0.14]" },
  [TicketCategory.SUNDAY]:          { label: "Sunday",       cls: "bg-sky-500/[0.1]     text-sky-300/75     ring-1 ring-sky-500/[0.14]" },
  [TicketCategory.CAMPING]:         { label: "Camping",      cls: "bg-emerald-500/[0.1] text-emerald-300/75 ring-1 ring-emerald-500/[0.14]" },
  [TicketCategory.COMFORT_CAMPING]: { label: "Comfort Camp", cls: "bg-emerald-500/[0.1] text-emerald-300/75 ring-1 ring-emerald-500/[0.14]" },
  [TicketCategory.CAR_CAMPING]:     { label: "Car Camp",     cls: "bg-emerald-500/[0.1] text-emerald-300/75 ring-1 ring-emerald-500/[0.14]" },
  [TicketCategory.PREMIUM]:         { label: "Premium",      cls: "bg-[#C9A84C]/[0.1]   text-[#D4AF5A]      ring-1 ring-[#C9A84C]/[0.18]" },
  [TicketCategory.ACCOMMODATION]:   { label: "Stay",         cls: "bg-rose-500/[0.1]    text-rose-300/75    ring-1 ring-rose-500/[0.14]" },
};

function getDeliveryInfo(method: DeliveryMethod) {
  switch (method) {
    case DeliveryMethod.DIGITAL:     return { label: "Digital",       Icon: Tag };
    case DeliveryMethod.PHYSICAL:    return { label: "Physical",      Icon: Truck };
    case DeliveryMethod.NAME_CHANGE: return { label: "Name transfer", Icon: Edit3 };
    default:                         return { label: "Digital",       Icon: Tag };
  }
}

interface TicketCardProps {
  ticket: Ticket;
}

export function TicketCard({ ticket }: TicketCardProps) {
  const addItem = useCartStore((s) => s.addItem);
  const items   = useCartStore((s) => s.items);
  const [added, setAdded] = useState(false);

  const inCart    = !!items.find((i) => i.ticketId === ticket.id);
  const available = ticket.quantity - ticket.sold;
  const isAvail   = available > 0 && ticket.isVisible;
  const isLow     = isAvail && available <= 3;

  const handleAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isAvail) return;
    addItem({
      ticketId:       ticket.id,
      name:           ticket.name,
      slug:           ticket.slug,
      resalePrice:    ticket.resalePrice,
      currency:       ticket.currency,
      maxQuantity:    available,
      category:       ticket.category,
      dayLabel:       ticket.dayLabel,
      deliveryMethod: ticket.deliveryMethod,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const cat   = CATEGORY_STYLES[ticket.category] ?? {
    label: String(ticket.category).replace(/_/g, " "),
    cls: "bg-zinc-700/20 text-zinc-400 ring-1 ring-zinc-700/25",
  };
  const deliv   = getDeliveryInfo(ticket.deliveryMethod);
  const DelIcon = deliv.Icon;

  return (
    <div
      className={[
        // Base surface — fractional elevation above page background
        "group relative flex flex-col bg-[#0F1013] border rounded-xl",
        // Only transition border — no shadow transforms, no translate
        "transition-colors duration-200",
        ticket.isFeatured
          ? "border-[#C9A84C]/[0.16] hover:border-[#C9A84C]/[0.38]"
          : "border-white/[0.07] hover:border-white/[0.14]",
        // Sold-out: dim in place, no overlay divs
        !isAvail ? "opacity-50" : "",
      ].join(" ")}
    >
      {/* Featured: single pixel top rule, no glows */}
      {ticket.isFeatured && (
        <div className="absolute top-0 inset-x-0 h-px rounded-t-xl bg-gradient-to-r from-transparent via-[#C9A84C]/40 to-transparent pointer-events-none" />
      )}

      {/* ── Card body ─────────────────────────────── */}
      <div className="flex flex-col flex-1 p-4 gap-0">

        {/* Meta row — badge left, delivery right */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[11px] font-medium leading-tight ${cat.cls}`}>
            {cat.label}
          </span>
          <div className="flex items-center gap-1 text-[11px] text-zinc-700 select-none">
            <DelIcon className="w-3 h-3 shrink-0" />
            <span>{deliv.label}</span>
          </div>
        </div>

        {/* Ticket name — primary identifier */}
        <h3
          className="text-[0.9375rem] font-medium text-zinc-100 leading-snug mb-1"
          style={{ letterSpacing: "-0.006em" }}
        >
          {ticket.name}
        </h3>
        {ticket.dayLabel && (
          <p className="text-xs text-zinc-600 mb-0">{ticket.dayLabel}</p>
        )}

        {/* Spacer — pushes price to bottom of content area */}
        <div className="flex-1 min-h-[16px]" />

        {/* Price block */}
        <div className="mt-4">
          <div className="flex items-baseline justify-between gap-2 mb-2">
            <span
              className="text-[1.1875rem] font-semibold text-white tabular-nums leading-none"
              style={{ letterSpacing: "-0.02em" }}
            >
              {formatPrice(ticket.resalePrice, ticket.currency)}
            </span>
            <span className="text-[11px] text-zinc-700 line-through tabular-nums leading-none">
              {formatPrice(ticket.originalPrice, ticket.currency)}
            </span>
          </div>

          {/* Availability status */}
          <div className="flex items-center justify-between h-4">
            <div className="flex items-center gap-1.5">
              {isAvail ? (
                <>
                  <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${isLow ? "bg-amber-400/75" : "bg-emerald-500/55"}`} />
                  <span className={`text-[11px] ${isLow ? "text-amber-400/65 font-medium" : "text-zinc-600"}`}>
                    {available === 1 ? "Last one" : `${available} left`}
                  </span>
                </>
              ) : (
                <>
                  <span className="w-1.5 h-1.5 rounded-full shrink-0 bg-zinc-800" />
                  <span className="text-[11px] text-zinc-700">Sold out</span>
                </>
              )}
            </div>
            {ticket.personalizationStatus === PersonalizationStatus.COMPLETED && isAvail && (
              <span className="flex items-center gap-1 text-[10px] text-emerald-500/55 select-none">
                <Check className="w-2.5 h-2.5" />
                Ready
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Separator */}
      <div className="mx-4 h-px bg-white/[0.05]" />

      {/* ── Action footer ─────────────────────────── */}
      <div className="flex items-center gap-2 p-3">
        <button
          onClick={handleAdd}
          disabled={!isAvail}
          className={[
            "flex-1 h-8 inline-flex items-center justify-center gap-1.5 rounded-lg",
            "text-[11px] font-semibold transition-colors duration-150 select-none",
            added || inCart
              ? "bg-white/[0.05] text-zinc-500 ring-1 ring-white/[0.07]"
              : isAvail
                ? "bg-[#C9A84C] text-[#0C0900] hover:bg-[#D4B855] active:scale-[0.97]"
                : "bg-transparent text-zinc-700 ring-1 ring-white/[0.06] cursor-not-allowed",
          ].join(" ")}
        >
          {added
            ? <><Check className="w-3 h-3" />Added</>
            : inCart
              ? <><ShoppingCart className="w-3 h-3" />In cart</>
              : <><ShoppingCart className="w-3 h-3" />Add to cart</>
          }
        </button>

        <Link
          href={`/tickets/${ticket.slug}`}
          className="w-8 h-8 inline-flex items-center justify-center rounded-lg text-zinc-700 hover:text-zinc-300 hover:bg-white/[0.05] transition-colors duration-150 shrink-0"
          aria-label="View details"
          // Keep navigable even when card is sold-out-dimmed
          style={!isAvail ? { pointerEvents: "auto", opacity: 1 } : undefined}
        >
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}
