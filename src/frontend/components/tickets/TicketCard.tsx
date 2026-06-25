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

// Pure bg+text badges — no ring complexity that contributes nothing at dark-mode opacity levels
const CATEGORY_STYLES: Partial<Record<TicketCategory, { label: string; cls: string }>> = {
  [TicketCategory.WEEKEND]:         { label: "Weekend",      cls: "bg-violet-500/[0.12]  text-violet-300/80" },
  [TicketCategory.SATURDAY]:        { label: "Saturday",     cls: "bg-blue-500/[0.12]    text-blue-300/80" },
  [TicketCategory.SUNDAY]:          { label: "Sunday",       cls: "bg-sky-500/[0.12]     text-sky-300/80" },
  [TicketCategory.CAMPING]:         { label: "Camping",      cls: "bg-emerald-500/[0.12] text-emerald-300/80" },
  [TicketCategory.COMFORT_CAMPING]: { label: "Comfort Camp", cls: "bg-emerald-500/[0.12] text-emerald-300/80" },
  [TicketCategory.CAR_CAMPING]:     { label: "Car Camp",     cls: "bg-emerald-500/[0.12] text-emerald-300/80" },
  [TicketCategory.PREMIUM]:         { label: "Premium",      cls: "bg-[#06B6D4]/[0.12]   text-[#D4B050]" },
  [TicketCategory.ACCOMMODATION]:   { label: "Stay",         cls: "bg-rose-500/[0.12]    text-rose-300/80" },
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
  // Low-stock threshold: urgency messaging must be proportional to scarcity
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
    cls: "bg-zinc-700/20 text-zinc-400",
  };
  const deliv   = getDeliveryInfo(ticket.deliveryMethod);

  return (
    <div
      className={[
        "group relative flex flex-col bg-[#0F1013] border rounded-xl transition-colors duration-200",
        ticket.isFeatured
          ? "border-[#06B6D4]/[0.18] hover:border-[#06B6D4]/[0.40]"
          : "border-white/[0.09] hover:border-white/[0.16]",
        !isAvail ? "opacity-50" : "",
      ].join(" ")}
    >
      {/* Featured: 1px top accent — signals elevation without decoration */}
      {ticket.isFeatured && (
        <div className="absolute top-0 inset-x-0 h-px rounded-t-xl bg-gradient-to-r from-transparent via-[#06B6D4]/45 to-transparent pointer-events-none" />
      )}

      {/* ── Body ─────────────────────────────────── */}
      <div className="flex flex-col flex-1 p-4">

        {/* Badge row — category only, left-aligned */}
        <div className="mb-3">
          <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium leading-tight ${cat.cls}`}>
            {cat.label}
          </span>
        </div>

        {/* Name block — min-height anchors price Y-position across grid */}
        <div className="min-h-[52px] mb-4">
          <h3
            className="text-[0.9375rem] font-medium text-zinc-100 leading-snug"
            style={{ letterSpacing: "-0.006em" }}
          >
            {ticket.name}
          </h3>
          {ticket.dayLabel && (
            <p className="text-xs text-zinc-600 mt-1">{ticket.dayLabel}</p>
          )}
        </div>

        {/* Price block */}
        <div className="flex items-baseline justify-between gap-2 mb-2">
          <span
            className="text-[1.1875rem] font-semibold text-white tabular-nums leading-none"
            style={{ letterSpacing: "-0.022em" }}
          >
            {formatPrice(ticket.resalePrice, ticket.currency)}
          </span>
          <span className="text-[11px] text-zinc-700 line-through tabular-nums leading-none">
            {formatPrice(ticket.originalPrice, ticket.currency)}
          </span>
        </div>

        {/* Availability + delivery — grouped: both answer "how/when do I get this" */}
        <div className="flex items-center justify-between h-4">
          <div className="flex items-center gap-1.5 min-w-0">
            {isAvail ? (
              <>
                <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${isLow ? "bg-amber-400" : "bg-emerald-500/60"}`} />
                {/* Low-stock urgency: semibold at 90% amber — must register, not whisper */}
                <span className={`text-[11px] ${isLow ? "text-amber-400/90 font-semibold" : "text-zinc-600"}`}>
                  {available === 1 ? "Last one" : `${available} left`}
                </span>
                <span className="text-zinc-800 text-[11px] select-none mx-0.5">·</span>
                <span className="text-[11px] text-zinc-700 truncate">{deliv.label}</span>
              </>
            ) : (
              <span className="text-[11px] text-zinc-700">Sold out</span>
            )}
          </div>
          {ticket.personalizationStatus === PersonalizationStatus.COMPLETED && isAvail && (
            <span className="flex items-center gap-1 text-[10px] text-emerald-500/60 shrink-0 select-none ml-2">
              <Check className="w-2.5 h-2.5" />
              Ready
            </span>
          )}
        </div>
      </div>

      {/* Separator — full-width, consistent with footer px-4 */}
      <div className="h-px bg-white/[0.06]" />

      {/* ── Action footer ─────────────────────────── */}
      <div className="flex items-center gap-2 px-4 py-3">
        {/* CTA: h-9 (36px) signals primary commercial action, not utility chip */}
        <button
          onClick={handleAdd}
          disabled={!isAvail}
          className={[
            "flex-1 h-9 inline-flex items-center justify-center gap-1.5 rounded-lg",
            "text-[11px] font-semibold transition-colors duration-150 select-none",
            added || inCart
              ? "bg-white/[0.06] text-zinc-500"
              : isAvail
                ? "bg-[#06B6D4] text-[#0C0900] hover:bg-[#D4B855] active:scale-[0.97]"
                : "text-zinc-700 cursor-not-allowed",
          ].join(" ")}
        >
          {added
            ? <><Check className="w-3 h-3" />Added</>
            : inCart
              ? <><ShoppingCart className="w-3 h-3" />In cart</>
              : <><ShoppingCart className="w-3 h-3" />Add to cart</>
          }
        </button>

        {/* View link: no border, w-7 h-7 — visually subordinate to CTA */}
        <Link
          href={`/tickets/${ticket.slug}`}
          className="w-7 h-7 inline-flex items-center justify-center rounded-lg text-zinc-700 hover:text-zinc-300 hover:bg-white/[0.05] transition-colors duration-150 shrink-0"
          aria-label="View ticket details"
        >
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}
