"use client";

import Link from "next/link";
import { ArrowRight, ShoppingCart, Truck, Edit3, Tag, Check, AlertTriangle, Lock } from "lucide-react";
import { useCartStore } from "@/frontend/store/cart";
import { formatPrice } from "@/backend/lib/utils";
import {
  DeliveryMethod,
  PersonalizationStatus,
  TicketCategory,
  type Ticket,
} from "@/frontend/types/tickets";
import { useState } from "react";

const CATEGORY_STYLES: Partial<Record<TicketCategory, { label: string; cls: string; accent: string }>> = {
  [TicketCategory.WEEKEND]:         { label: "Weekend",      cls: "bg-violet-500/[0.12]  text-violet-300",   accent: "rgba(139,92,246,0.55)"  },
  [TicketCategory.SATURDAY]:        { label: "Saturday",     cls: "bg-blue-500/[0.12]    text-blue-300",     accent: "rgba(59,130,246,0.55)"  },
  [TicketCategory.SUNDAY]:          { label: "Sunday",       cls: "bg-sky-500/[0.12]     text-sky-300",      accent: "rgba(14,165,233,0.55)"  },
  [TicketCategory.CAMPING]:         { label: "Camping",      cls: "bg-emerald-500/[0.12] text-emerald-300",  accent: "rgba(16,185,129,0.55)"  },
  [TicketCategory.COMFORT_CAMPING]: { label: "Comfort",      cls: "bg-teal-500/[0.12]    text-teal-300",     accent: "rgba(20,184,166,0.55)"  },
  [TicketCategory.CAR_CAMPING]:     { label: "Car Camp",     cls: "bg-emerald-500/[0.12] text-emerald-300",  accent: "rgba(16,185,129,0.55)"  },
  [TicketCategory.PREMIUM]:         { label: "Premium",      cls: "bg-amber-500/[0.12]   text-amber-300",    accent: "rgba(245,158,11,0.60)"  },
  [TicketCategory.ACCOMMODATION]:   { label: "Stay",         cls: "bg-rose-500/[0.12]    text-rose-300",     accent: "rgba(244,63,94,0.50)"   },
};

function getDeliveryInfo(method: DeliveryMethod) {
  switch (method) {
    case DeliveryMethod.DIGITAL:     return { label: "Digital delivery",  Icon: Tag,   isNameTransfer: false };
    case DeliveryMethod.PHYSICAL:    return { label: "Physical delivery", Icon: Truck, isNameTransfer: false };
    case DeliveryMethod.NAME_CHANGE: return { label: "Name transfer",     Icon: Edit3, isNameTransfer: true  };
    default:                         return { label: "Digital delivery",  Icon: Tag,   isNameTransfer: false };
  }
}

interface TicketCardProps {
  ticket: Ticket;
}

const I = "var(--font-inter, Inter, system-ui, sans-serif)";

export function TicketCard({ ticket }: TicketCardProps) {
  const addItem = useCartStore((s) => s.addItem);
  const items   = useCartStore((s) => s.items);
  const [added, setAdded] = useState(false);

  const inCart    = !!items.find((i) => i.ticketId === ticket.id);
  const available = ticket.quantity - ticket.sold;
  const isAvail   = available > 0 && ticket.isVisible;
  const isLow     = isAvail && available <= 3;
  const savings   = ticket.originalPrice - ticket.resalePrice;
  const hasSavings = savings > 0 && isAvail;

  const handleAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isAvail || inCart) return;
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

  const cat = CATEGORY_STYLES[ticket.category] ?? {
    label: String(ticket.category).replace(/_/g, " "),
    cls:    "bg-zinc-700/20 text-zinc-400",
    accent: "rgba(113,113,122,0.40)",
  };
  const deliv = getDeliveryInfo(ticket.deliveryMethod);

  const borderBase = ticket.isFeatured ? "rgba(6,182,212,0.24)" : "rgba(255,255,255,0.07)";
  const shadowBase = ticket.isFeatured
    ? "0 1px 0 rgba(255,255,255,0.05) inset, 0 0 0 1px rgba(6,182,212,0.06) inset, 0 12px 40px rgba(0,0,0,0.45)"
    : "0 1px 0 rgba(255,255,255,0.03) inset, 0 4px 20px rgba(0,0,0,0.30)";

  return (
    <div
      className={[
        "group relative flex flex-col rounded-2xl overflow-hidden",
        "transition-all duration-200",
        ticket.isFeatured
          ? "hover:shadow-[0_16px_48px_rgba(0,0,0,0.55),0_0_0_1px_rgba(6,182,212,0.30)]"
          : "hover:shadow-[0_8px_32px_rgba(0,0,0,0.45),0_0_0_1px_rgba(255,255,255,0.12)]",
        !isAvail ? "opacity-50" : "",
      ].join(" ")}
      style={{
        background:  "linear-gradient(158deg, #101115 0%, #0C0D10 100%)",
        border:      `1px solid ${borderBase}`,
        borderLeft:  `3px solid ${cat.accent}`,
        boxShadow:   shadowBase,
      }}
    >
      {/* Featured: top glow line */}
      {ticket.isFeatured && (
        <div
          aria-hidden="true"
          className="absolute top-0 inset-x-0 h-px pointer-events-none"
          style={{ background: "linear-gradient(to right, transparent, rgba(6,182,212,0.55), transparent)" }}
        />
      )}

      {/* Low-stock urgency strip */}
      {isLow && (
        <div
          className="flex items-center justify-center gap-1.5 px-4 py-1.5"
          style={{ background: "rgba(251,191,36,0.07)", borderBottom: "1px solid rgba(251,191,36,0.14)" }}
        >
          <AlertTriangle className="w-3 h-3 text-amber-400 shrink-0" strokeWidth={2} aria-hidden="true" />
          <span style={{ fontFamily: I, fontSize: "10.5px", fontWeight: 600, color: "rgba(251,191,36,0.90)", letterSpacing: "0.04em" }}>
            {available === 1 ? "Last ticket" : `Only ${available} left`}
          </span>
        </div>
      )}

      {/* ── Body ─────────────────────────────────────────────── */}
      <div className="flex flex-col flex-1 px-5 pt-4 pb-3">

        {/* Row: category badge + status chip */}
        <div className="flex items-center justify-between mb-3">
          <span
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full leading-none ${cat.cls}`}
            style={{ fontFamily: I, fontSize: "10px", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase" }}
          >
            <span
              aria-hidden="true"
              className="w-1.5 h-1.5 rounded-full shrink-0"
              style={{ background: cat.accent }}
            />
            {cat.label}
          </span>

          {/* Status chip: in-cart takes priority, then personalization ready, then sold count */}
          {inCart ? (
            <span
              className="inline-flex items-center gap-1 shrink-0 px-2 py-0.5 rounded-full"
              style={{
                background: "rgba(6,182,212,0.10)",
                border: "1px solid rgba(6,182,212,0.20)",
                fontFamily: I, fontSize: "10px", fontWeight: 600,
                color: "rgba(6,182,212,0.85)",
              }}
            >
              <Check className="w-2.5 h-2.5" aria-hidden="true" />
              In cart
            </span>
          ) : ticket.personalizationStatus === PersonalizationStatus.COMPLETED && isAvail ? (
            <span
              className="inline-flex items-center gap-1 shrink-0"
              style={{ fontFamily: I, fontSize: "10px", fontWeight: 600, color: "rgba(52,211,153,0.75)" }}
            >
              <Check className="w-2.5 h-2.5" aria-hidden="true" />
              Ready
            </span>
          ) : ticket.sold >= 2 ? (
            <span
              className="shrink-0 select-none"
              style={{ fontFamily: I, fontSize: "10px", fontWeight: 600, color: "rgba(161,161,170,0.40)" }}
            >
              {ticket.sold} sold
            </span>
          ) : null}
        </div>

        {/* Name block — min-height anchors the price block's Y-position across grid */}
        <div className="mb-4 min-h-[44px]">
          <h3
            className="text-zinc-100 leading-snug"
            style={{ fontFamily: I, fontSize: "0.9375rem", fontWeight: 600, letterSpacing: "-0.014em" }}
          >
            {ticket.name}
          </h3>
          {ticket.dayLabel && (
            <p
              className="mt-1"
              style={{ fontFamily: I, fontSize: "11px", color: "rgba(161,161,170,0.50)", letterSpacing: "0.02em" }}
            >
              {ticket.dayLabel}
            </p>
          )}
        </div>

        {/* Price block */}
        <div className="flex items-end justify-between gap-2 mb-4">
          <div>
            <span
              className="text-white tabular-nums leading-none block"
              style={{ fontFamily: I, fontSize: "1.625rem", fontWeight: 700, letterSpacing: "-0.032em" }}
            >
              {formatPrice(ticket.resalePrice, ticket.currency)}
            </span>
            <div className="flex items-center gap-1.5 mt-1.5">
              <span
                className="tabular-nums line-through"
                style={{ fontFamily: I, fontSize: "11px", color: "rgba(113,113,122,0.60)" }}
              >
                {formatPrice(ticket.originalPrice, ticket.currency)}
              </span>
              <span style={{ fontFamily: I, fontSize: "9.5px", fontWeight: 500, color: "rgba(113,113,122,0.40)", letterSpacing: "0.06em", textTransform: "uppercase" }}>
                face
              </span>
            </div>
          </div>

          {/* Savings badge — only shown when there are actual savings and ticket is available */}
          {hasSavings && (
            <span
              className="shrink-0 px-2 py-1 rounded-lg tabular-nums"
              style={{
                fontFamily: I, fontSize: "11px", fontWeight: 700, letterSpacing: "-0.01em",
                background: "rgba(52,211,153,0.07)",
                border: "1px solid rgba(52,211,153,0.15)",
                color: "rgba(52,211,153,0.80)",
              }}
            >
              −{formatPrice(savings, ticket.currency)}
            </span>
          )}
        </div>

        {/* Availability + delivery row */}
        <div className="flex items-center gap-2 flex-wrap">
          {isAvail ? (
            <>
              <span
                aria-hidden="true"
                className={`w-1.5 h-1.5 rounded-full shrink-0 ${isLow ? "bg-amber-400" : "bg-emerald-500/60"}`}
              />
              <span
                style={{ fontFamily: I, fontSize: "11px", fontWeight: isLow ? 600 : 400, color: isLow ? "rgba(251,191,36,0.90)" : "rgba(161,161,170,0.50)" }}
              >
                {available === 1 ? "Last one" : `${available} left`}
              </span>
              <span aria-hidden="true" style={{ color: "rgba(63,63,70,0.6)", fontSize: "11px", userSelect: "none" }}>·</span>
              <span
                className="flex items-center gap-1"
                style={{
                  fontFamily: I, fontSize: "11px",
                  color: deliv.isNameTransfer ? "rgba(245,158,11,0.75)" : "rgba(113,113,122,0.65)",
                }}
              >
                <deliv.Icon className="w-3 h-3 shrink-0" strokeWidth={1.5} aria-hidden="true" />
                {deliv.label}
                {deliv.isNameTransfer && (
                  <Lock className="w-2.5 h-2.5 shrink-0 text-amber-500/50" strokeWidth={2} aria-hidden="true" />
                )}
              </span>
            </>
          ) : (
            <span style={{ fontFamily: I, fontSize: "11px", color: "rgba(113,113,122,0.55)" }}>Sold out</span>
          )}
        </div>
      </div>

      {/* ── Ticket-stub perforated divider ──────────────────── */}
      <div className="relative">
        <span
          aria-hidden="true"
          className="absolute w-3.5 h-3.5 rounded-full"
          style={{ background: "#020203", left: "-7px", top: "50%", transform: "translateY(-50%)", zIndex: 1 }}
        />
        <span
          aria-hidden="true"
          className="absolute w-3.5 h-3.5 rounded-full"
          style={{ background: "#020203", right: "-7px", top: "50%", transform: "translateY(-50%)", zIndex: 1 }}
        />
        <div
          className="mx-5 border-t border-dashed"
          style={{ borderColor: "rgba(255,255,255,0.07)" }}
        />
      </div>

      {/* ── Action footer ─────────────────────────────────── */}
      <div className="flex items-center gap-2 px-4 py-3.5">
        <button
          onClick={handleAdd}
          disabled={!isAvail}
          aria-label={added ? "Added to cart" : inCart ? "Already in cart" : `Add ${ticket.name} to cart`}
          className={[
            "flex-1 h-10 inline-flex items-center justify-center gap-2 rounded-xl",
            "transition-all duration-150 select-none",
            added
              ? "bg-emerald-500/[0.12] border border-emerald-500/20 text-emerald-400"
              : inCart
                ? "bg-[#06B6D4]/[0.08] border border-[#06B6D4]/20 text-[#06B6D4]/75"
                : isAvail
                  ? "bg-[#06B6D4] text-[#030305] hover:bg-[#22D3EE] active:scale-[0.97] cursor-pointer"
                  : "border border-white/[0.05] text-zinc-700 cursor-not-allowed",
          ].join(" ")}
          style={{ fontFamily: I, fontSize: "11.5px", fontWeight: 600, letterSpacing: "0.04em" }}
        >
          {added ? (
            <><Check className="w-3.5 h-3.5" aria-hidden="true" />Added</>
          ) : inCart ? (
            <><ShoppingCart className="w-3.5 h-3.5" aria-hidden="true" />In cart</>
          ) : (
            <><ShoppingCart className="w-3.5 h-3.5" aria-hidden="true" />Add to cart</>
          )}
        </button>

        {/* View details — clearly subordinate but has a defined hit target */}
        <Link
          href={`/tickets/${ticket.slug}`}
          className="w-10 h-10 inline-flex items-center justify-center rounded-xl shrink-0 transition-all duration-150 cursor-pointer"
          style={{ border: "1px solid rgba(255,255,255,0.07)", color: "rgba(113,113,122,0.75)" }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLAnchorElement).style.borderColor = "rgba(255,255,255,0.18)";
            (e.currentTarget as HTMLAnchorElement).style.color = "rgba(237,233,225,0.85)";
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLAnchorElement).style.borderColor = "rgba(255,255,255,0.07)";
            (e.currentTarget as HTMLAnchorElement).style.color = "rgba(113,113,122,0.75)";
          }}
          aria-label={`View details for ${ticket.name}`}
        >
          <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
        </Link>
      </div>
    </div>
  );
}
