"use client";

import Link from "next/link";
import { ArrowRight, ShoppingCart, Check, Lock, Tag, Edit3, Truck, Shield } from "lucide-react";
import { useCartStore } from "@/frontend/store/cart";
import { formatPrice } from "@/backend/lib/utils";
import {
  DeliveryMethod,
  PersonalizationStatus,
  TicketCategory,
  type Ticket,
} from "@/frontend/types/tickets";
import { useState } from "react";
import { motion } from "framer-motion";

/* ── Category identity system ──────────────────────────────────────
   Each category gets its own RGB triplet. All derived colors
   (borders, glows, badges, chips) are computed from these values
   so the entire card is always visually consistent.              */
type CatMeta = { label: string; r: number; g: number; b: number };

const CAT: Partial<Record<TicketCategory, CatMeta>> = {
  [TicketCategory.WEEKEND]:         { label: "Weekend",  r: 139, g: 92,  b: 246 },
  [TicketCategory.SATURDAY]:        { label: "Saturday", r: 59,  g: 130, b: 246 },
  [TicketCategory.SUNDAY]:          { label: "Sunday",   r: 6,   g: 182, b: 212 },
  [TicketCategory.CAMPING]:         { label: "Camping",  r: 16,  g: 185, b: 129 },
  [TicketCategory.COMFORT_CAMPING]: { label: "Comfort",  r: 20,  g: 184, b: 166 },
  [TicketCategory.CAR_CAMPING]:     { label: "Car Camp", r: 16,  g: 185, b: 129 },
  [TicketCategory.PREMIUM]:         { label: "Premium",  r: 245, g: 158, b: 11  },
  [TicketCategory.ACCOMMODATION]:   { label: "Stay",     r: 244, g: 63,  b: 94  },
};

function getCat(category: TicketCategory): CatMeta {
  return CAT[category] ?? {
    label: String(category).replace(/_/g, " "),
    r: 113, g: 113, b: 122,
  };
}

/* ── Delivery helpers ────────────────────────────────────────────── */
function getDelivery(method: DeliveryMethod) {
  switch (method) {
    case DeliveryMethod.DIGITAL:     return { label: "Digital",      Icon: Tag,   isTransfer: false };
    case DeliveryMethod.PHYSICAL:    return { label: "Shipped",       Icon: Truck, isTransfer: false };
    case DeliveryMethod.NAME_CHANGE: return { label: "Name transfer", Icon: Edit3, isTransfer: true  };
    default:                         return { label: "Digital",       Icon: Tag,   isTransfer: false };
  }
}

const I = "var(--font-inter, Inter, system-ui, sans-serif)";

/* ── Component ───────────────────────────────────────────────────── */
export function TicketCard({ ticket }: { ticket: Ticket }) {
  const addItem = useCartStore(s => s.addItem);
  const items   = useCartStore(s => s.items);
  const [added,   setAdded]   = useState(false);
  const [hovered, setHovered] = useState(false);

  const inCart    = !!items.find(i => i.ticketId === ticket.id);
  const available = ticket.quantity - ticket.sold;
  const isAvail   = available > 0 && ticket.isVisible;
  const isLow     = isAvail && available <= 3;
  const isLast    = isAvail && available === 1;
  const savings   = ticket.originalPrice - ticket.resalePrice;
  const savePct   = ticket.originalPrice > 0
    ? Math.round((savings / ticket.originalPrice) * 100)
    : 0;
  const hasSavings = savings > 0 && isAvail;

  const { r, g, b, label: catLabel } = getCat(ticket.category);
  const deliv = getDelivery(ticket.deliveryMethod);

  /* Inline alpha helper — keeps template readable */
  const ca = (a: number) => `rgba(${r},${g},${b},${a})`;
  const accent = `rgb(${r},${g},${b})`;

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
    setTimeout(() => setAdded(false), 2200);
  };

  /* ── Derived border + shadow values ─────────────────────────── */
  const borderAlpha = hovered && isAvail
    ? 0.40
    : ticket.isFeatured ? 0.22 : 0.10;

  const boxShadow = hovered && isAvail
    ? `0 0 0 1px ${ca(0.14)}, 0 20px 56px rgba(0,0,0,0.60), 0 0 40px ${ca(0.08)}`
    : "0 2px 14px rgba(0,0,0,0.32)";

  /* ── CTA button style — derived at render time ───────────────── */
  const ctaStyle = (() => {
    const base: React.CSSProperties = {
      fontFamily: I, fontSize: "11.5px", fontWeight: 700,
      letterSpacing: "0.03em", transition: "all 0.15s ease",
    };
    if (added) return {
      ...base, fontWeight: 600,
      background: "rgba(52,211,153,0.10)",
      border: "1px solid rgba(52,211,153,0.22)",
      color: "rgba(52,211,153,0.90)", cursor: "default",
    };
    if (inCart) return {
      ...base, fontWeight: 600,
      background: "rgba(6,182,212,0.08)",
      border: "1px solid rgba(6,182,212,0.22)",
      color: "rgba(6,182,212,0.80)", cursor: "pointer",
    };
    if (isAvail) return {
      ...base,
      background: hovered ? "#22D3EE" : "#06B6D4",
      color: "#030305", cursor: "pointer",
      boxShadow: hovered ? "0 4px 20px rgba(6,182,212,0.28)" : "none",
    };
    return {
      ...base, fontWeight: 500,
      background: "rgba(255,255,255,0.03)",
      border: "1px solid rgba(255,255,255,0.06)",
      color: "rgba(113,113,122,0.38)", cursor: "not-allowed",
    };
  })();

  return (
    <motion.div
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      whileHover={{ y: isAvail ? -3 : 0 }}
      transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
      className="relative flex flex-col rounded-2xl overflow-hidden"
      style={{
        background:  "linear-gradient(158deg, #0F1014 0%, #0C0D11 100%)",
        border:      `1px solid ${ca(borderAlpha)}`,
        boxShadow,
        opacity:     !isAvail ? 0.52 : 1,
        transition:  "border-color 0.25s ease, box-shadow 0.25s ease",
      }}
    >
      {/* ── Atmospheric glow — top-right, category colour ─────── */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse 55% 40% at 100% 0%, ${ca(hovered ? 0.13 : 0.06)} 0%, transparent 100%)`,
          transition: "opacity 0.3s ease",
          borderRadius: "inherit",
        }}
      />

      {/* ── Featured: horizontal top accent line ──────────────── */}
      {ticket.isFeatured && (
        <div
          aria-hidden="true"
          className="absolute top-0 inset-x-0 h-px pointer-events-none"
          style={{ background: `linear-gradient(to right, transparent 0%, ${ca(0.70)} 50%, transparent 100%)` }}
        />
      )}

      {/* ── Card body ─────────────────────────────────────────── */}
      <div className="relative flex flex-col flex-1 p-5">

        {/* ── Row 1: category badge + status chips ───────────── */}
        <div className="flex items-center justify-between mb-[18px]">

          {/* Category pill — accent-coloured per ticket type */}
          <span
            className="inline-flex items-center gap-1.5 px-2.5 py-[5px] rounded-full shrink-0"
            style={{
              background:    ca(0.11),
              border:        `1px solid ${ca(0.24)}`,
              fontFamily:    I,
              fontSize:      "9.5px",
              fontWeight:    700,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color:         accent,
            }}
          >
            <span
              aria-hidden="true"
              className="w-1.5 h-1.5 rounded-full shrink-0"
              style={{ background: accent, opacity: 0.75 }}
            />
            {catLabel}
          </span>

          {/* Right-side status chips — priority: in-cart > stock > sold-out */}
          <div className="flex items-center gap-1.5 pl-2 shrink-0">
            {inCart ? (
              <span
                className="inline-flex items-center gap-1 px-2 py-[3px] rounded-full"
                style={{
                  background: "rgba(6,182,212,0.10)",
                  border:     "1px solid rgba(6,182,212,0.22)",
                  fontFamily: I, fontSize: "9.5px", fontWeight: 600,
                  color:      "rgba(6,182,212,0.90)",
                  whiteSpace: "nowrap",
                }}
              >
                <Check className="w-2.5 h-2.5 shrink-0" aria-hidden="true" />
                In cart
              </span>
            ) : isLow ? (
              /* Scarcity chip — uses category colour, NOT loud amber banner */
              <span
                className="inline-flex items-center gap-1 px-2 py-[3px] rounded-full"
                style={{
                  background: ca(0.09),
                  border:     `1px solid ${ca(0.22)}`,
                  fontFamily: I, fontSize: "9.5px", fontWeight: 600,
                  color:      accent, whiteSpace: "nowrap",
                }}
              >
                <span
                  aria-hidden="true"
                  className="w-1 h-1 rounded-full shrink-0"
                  style={{ background: accent }}
                />
                {isLast ? "Last one" : `${available} left`}
              </span>
            ) : !isAvail ? (
              <span
                className="inline-flex items-center px-2 py-[3px] rounded-full"
                style={{
                  background: "rgba(113,113,122,0.08)",
                  border:     "1px solid rgba(113,113,122,0.16)",
                  fontFamily: I, fontSize: "9.5px", fontWeight: 600,
                  color:      "rgba(113,113,122,0.50)",
                }}
              >
                Sold out
              </span>
            ) : ticket.personalizationStatus === PersonalizationStatus.COMPLETED ? (
              <span
                className="inline-flex items-center gap-1 px-2 py-[3px] rounded-full"
                style={{
                  background: "rgba(52,211,153,0.08)",
                  border:     "1px solid rgba(52,211,153,0.18)",
                  fontFamily: I, fontSize: "9.5px", fontWeight: 600,
                  color:      "rgba(52,211,153,0.80)",
                  whiteSpace: "nowrap",
                }}
              >
                <Check className="w-2.5 h-2.5 shrink-0" aria-hidden="true" />
                Ready
              </span>
            ) : null}
          </div>
        </div>

        {/* ── Row 2: ticket name + date ─────────────────────── */}
        <div className="mb-[18px] min-h-[44px]">
          <h3
            className="text-white leading-snug"
            style={{ fontFamily: I, fontSize: "0.9375rem", fontWeight: 600, letterSpacing: "-0.014em" }}
          >
            {ticket.name}
          </h3>
          {ticket.dayLabel && (
            <p
              className="mt-[3px]"
              style={{ fontFamily: I, fontSize: "11px", color: "rgba(161,161,170,0.46)", letterSpacing: "0.02em" }}
            >
              {ticket.dayLabel}
            </p>
          )}
        </div>

        {/* ── Row 3: price block ────────────────────────────── */}
        <div className="flex items-end justify-between gap-2 mb-[18px]">
          <div>
            <span
              className="block text-white tabular-nums leading-none"
              style={{ fontFamily: I, fontSize: "1.625rem", fontWeight: 700, letterSpacing: "-0.032em" }}
            >
              {formatPrice(ticket.resalePrice, ticket.currency)}
            </span>
            <div className="flex items-center gap-1.5 mt-[5px]">
              <span
                className="tabular-nums line-through"
                style={{ fontFamily: I, fontSize: "11px", color: "rgba(113,113,122,0.52)" }}
              >
                {formatPrice(ticket.originalPrice, ticket.currency)}
              </span>
              <span
                style={{ fontFamily: I, fontSize: "9px", color: "rgba(113,113,122,0.36)", letterSpacing: "0.06em", textTransform: "uppercase" }}
              >
                face
              </span>
            </div>
          </div>

          {hasSavings && (
            <span
              className="shrink-0 mb-[3px] px-2 py-[5px] rounded-lg tabular-nums"
              style={{
                fontFamily: I, fontSize: "10.5px", fontWeight: 700,
                background: "rgba(52,211,153,0.07)",
                border:     "1px solid rgba(52,211,153,0.14)",
                color:      "rgba(52,211,153,0.78)",
              }}
            >
              -{savePct}%
            </span>
          )}
        </div>

        {/* ── Row 4: delivery + verification metadata ───────── */}
        <div className="flex items-center gap-2.5 mb-5">
          <span
            className="inline-flex items-center gap-1 shrink-0"
            style={{
              fontFamily: I, fontSize: "10.5px",
              color: deliv.isTransfer ? "rgba(245,158,11,0.58)" : "rgba(113,113,122,0.48)",
            }}
          >
            <deliv.Icon className="w-3 h-3 shrink-0" strokeWidth={1.5} aria-hidden="true" />
            {deliv.label}
            {deliv.isTransfer && (
              <Lock className="w-2.5 h-2.5 shrink-0 ml-0.5 text-amber-600/35" strokeWidth={2} aria-hidden="true" />
            )}
          </span>

          <span aria-hidden="true" style={{ color: "rgba(63,63,70,0.40)", fontSize: "10px", userSelect: "none" }}>·</span>

          <span
            className="inline-flex items-center gap-1 shrink-0"
            style={{ fontFamily: I, fontSize: "10.5px", color: "rgba(6,182,212,0.42)" }}
          >
            <Shield className="w-3 h-3 shrink-0" strokeWidth={1.5} aria-hidden="true" />
            Verified
          </span>
        </div>

        {/* ── Row 5: CTA ────────────────────────────────────── */}
        <div className="flex items-center gap-2 mt-auto">

          {/* Primary: add to cart */}
          <motion.button
            onClick={handleAdd}
            disabled={!isAvail}
            aria-label={
              !isAvail ? `${ticket.name} — sold out`
              : added   ? "Added to cart"
              : inCart  ? `Add another ${ticket.name}`
              :           `Add ${ticket.name} to cart`
            }
            whileTap={isAvail ? { scale: 0.97 } : undefined}
            className="flex-1 h-10 inline-flex items-center justify-center gap-1.5 rounded-xl select-none"
            style={ctaStyle}
          >
            {added ? (
              <><Check className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />Added</>
            ) : inCart ? (
              <><ShoppingCart className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />In cart</>
            ) : isAvail ? (
              <><ShoppingCart className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />Add to cart</>
            ) : (
              "Sold out"
            )}
          </motion.button>

          {/* Secondary: view details */}
          <Link
            href={`/tickets/${ticket.slug}`}
            className="w-10 h-10 inline-flex items-center justify-center rounded-xl shrink-0 transition-all duration-200"
            style={{
              border:     `1px solid ${hovered && isAvail ? ca(0.28) : "rgba(255,255,255,0.08)"}`,
              color:      hovered && isAvail ? accent : "rgba(113,113,122,0.58)",
              background: hovered && isAvail ? ca(0.06) : "transparent",
            }}
            aria-label={`View details for ${ticket.name}`}
          >
            <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
          </Link>
        </div>

      </div>
    </motion.div>
  );
}
