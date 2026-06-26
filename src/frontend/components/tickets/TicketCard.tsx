"use client";

import { useRouter } from "next/navigation";
import { ShoppingCart, Check, Lock, Tag, Edit3, Truck, Shield, ArrowRight } from "lucide-react";
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

/* ── Per-category RGB identity ──────────────────────────────────────
   Every derived colour — border, glow, badge, accent bar —
   is computed from one RGB triplet so each category is visually
   unique while staying coherent.                                  */
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
  return CAT[category] ?? { label: String(category).replace(/_/g, " "), r: 113, g: 113, b: 122 };
}

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
  const router  = useRouter();
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
  const savePct   = ticket.originalPrice > 0 ? Math.round((savings / ticket.originalPrice) * 100) : 0;
  const hasSavings = savings > 0 && isAvail;

  const { r, g, b, label: catLabel } = getCat(ticket.category);
  const deliv  = getDelivery(ticket.deliveryMethod);
  const ca     = (a: number) => `rgba(${r},${g},${b},${a})`;
  const accent = `rgb(${r},${g},${b})`;

  /* ── Navigation: whole card is the tap target ────────────────── */
  const goToDetail = () => router.push(`/tickets/${ticket.slug}`);

  /* ── Add-to-cart: stop propagation so card click doesn't fire ─ */
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

  /* ── Arrow detail button: navigate without double-firing card ── */
  const handleDetailsClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    goToDetail();
  };

  return (
    <motion.div
      onClick={goToDetail}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      whileHover={{ y: isAvail ? -4 : 0 }}
      transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
      role="article"
      aria-label={`${ticket.name}${!isAvail ? " — sold out" : ""}, ${formatPrice(ticket.resalePrice, ticket.currency)}`}
      className="relative flex flex-col rounded-2xl overflow-hidden cursor-pointer select-none"
      style={{
        /* Diagonal category-colour sweep from top-left */
        background: `linear-gradient(140deg, ${ca(hovered ? 0.16 : 0.10)} 0%, #101115 36%, #0D0E12 100%)`,
        /* Right + bottom border at low opacity; left accent bar is the dominant marker */
        border:     `1px solid ${ca(hovered ? 0.32 : ticket.isFeatured ? 0.22 : 0.12)}`,
        borderLeft: `3px solid ${ca(hovered ? 0.85 : ticket.isFeatured ? 0.65 : 0.42)}`,
        boxShadow:  hovered && isAvail
          ? `0 0 0 1px ${ca(0.12)}, 0 28px 72px rgba(0,0,0,0.70), 0 0 48px ${ca(0.09)}`
          : `0 1px 0 rgba(255,255,255,0.03) inset, 0 4px 18px rgba(0,0,0,0.28)`,
        opacity:    !isAvail ? 0.48 : 1,
        transition: "background 0.30s ease, border-color 0.22s ease, box-shadow 0.22s ease",
      }}
    >
      {/* Featured: thin top accent line */}
      {ticket.isFeatured && (
        <div
          aria-hidden="true"
          className="absolute top-0 inset-x-0 pointer-events-none"
          style={{ height: "1.5px", background: `linear-gradient(to right, transparent, ${ca(0.85)}, transparent)` }}
        />
      )}

      {/* ── Main content ────────────────────────────────────────── */}
      <div className="relative flex flex-col flex-1 px-5 pt-5 pb-5">

        {/* ── Header: category pill + status chip ─────────────── */}
        <div className="flex items-center justify-between mb-4">

          <span
            className="inline-flex items-center gap-1.5 px-2.5 py-[5px] rounded-full shrink-0 leading-none"
            style={{
              background:    ca(0.13),
              border:        `1px solid ${ca(0.26)}`,
              fontFamily:    I,
              fontSize:      "9.5px",
              fontWeight:    700,
              letterSpacing: "0.09em",
              textTransform: "uppercase" as const,
              color:         accent,
            }}
          >
            <span aria-hidden="true" className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: accent, opacity: 0.80 }} />
            {catLabel}
          </span>

          {/* Status chips */}
          {inCart ? (
            <span className="inline-flex items-center gap-1 px-2 py-[3px] rounded-full shrink-0" style={{ background: "rgba(6,182,212,0.10)", border: "1px solid rgba(6,182,212,0.22)", fontFamily: I, fontSize: "9.5px", fontWeight: 600, color: "rgba(6,182,212,0.90)", whiteSpace: "nowrap" }}>
              <Check className="w-2.5 h-2.5 shrink-0" aria-hidden="true" /> In cart
            </span>
          ) : isLow ? (
            <span className="inline-flex items-center gap-1 px-2 py-[3px] rounded-full shrink-0" style={{ background: ca(0.10), border: `1px solid ${ca(0.24)}`, fontFamily: I, fontSize: "9.5px", fontWeight: 600, color: accent, whiteSpace: "nowrap" }}>
              <span aria-hidden="true" className="w-1 h-1 rounded-full shrink-0" style={{ background: accent }} />
              {isLast ? "Last one" : `${available} left`}
            </span>
          ) : !isAvail ? (
            <span className="inline-flex items-center px-2 py-[3px] rounded-full shrink-0" style={{ background: "rgba(113,113,122,0.08)", border: "1px solid rgba(113,113,122,0.16)", fontFamily: I, fontSize: "9.5px", fontWeight: 600, color: "rgba(113,113,122,0.50)" }}>
              Sold out
            </span>
          ) : ticket.personalizationStatus === PersonalizationStatus.COMPLETED ? (
            <span className="inline-flex items-center gap-1 px-2 py-[3px] rounded-full shrink-0" style={{ background: "rgba(52,211,153,0.08)", border: "1px solid rgba(52,211,153,0.18)", fontFamily: I, fontSize: "9.5px", fontWeight: 600, color: "rgba(52,211,153,0.82)", whiteSpace: "nowrap" }}>
              <Check className="w-2.5 h-2.5 shrink-0" aria-hidden="true" /> Ready
            </span>
          ) : null}
        </div>

        {/* ── Ticket name + date ──────────────────────────────── */}
        <div className="mb-4 min-h-[52px]">
          <h3
            style={{ fontFamily: I, fontSize: "1rem", fontWeight: 700, color: "#FFFFFF", lineHeight: 1.28, letterSpacing: "-0.016em", margin: 0 }}
          >
            {ticket.name}
          </h3>
          {ticket.dayLabel && (
            <p className="mt-1" style={{ fontFamily: I, fontSize: "11.5px", color: "rgba(161,161,170,0.44)", letterSpacing: "0.01em", margin: 0 }}>
              {ticket.dayLabel}
            </p>
          )}
        </div>

        {/* ── Category hairline separator ──────────────────────── */}
        <div
          className="mb-4"
          style={{ height: "1px", background: `linear-gradient(to right, ${ca(0.25)}, ${ca(0.05)})` }}
          aria-hidden="true"
        />

        {/* ── Price block ─────────────────────────────────────── */}
        <div className="flex items-end justify-between gap-2 mb-4">
          <div>
            <span
              className="block tabular-nums leading-none text-white"
              style={{ fontFamily: I, fontSize: "2rem", fontWeight: 800, letterSpacing: "-0.038em" }}
            >
              {formatPrice(ticket.resalePrice, ticket.currency)}
            </span>
            <div className="flex items-center gap-1.5 mt-1.5">
              <span className="tabular-nums line-through" style={{ fontFamily: I, fontSize: "11px", color: "rgba(113,113,122,0.48)" }}>
                {formatPrice(ticket.originalPrice, ticket.currency)}
              </span>
              <span style={{ fontFamily: I, fontSize: "9px", color: "rgba(113,113,122,0.32)", letterSpacing: "0.06em", textTransform: "uppercase" as const }}>
                face
              </span>
            </div>
          </div>

          {hasSavings && (
            <span
              className="shrink-0 mb-[3px] px-2 py-[5px] rounded-lg tabular-nums"
              style={{ fontFamily: I, fontSize: "10.5px", fontWeight: 700, background: "rgba(52,211,153,0.07)", border: "1px solid rgba(52,211,153,0.14)", color: "rgba(52,211,153,0.82)" }}
            >
              −{savePct}%
            </span>
          )}
        </div>

        {/* ── Delivery + verification ──────────────────────────── */}
        <div className="flex items-center gap-2.5 mb-5">
          <span
            className="inline-flex items-center gap-1 shrink-0"
            style={{ fontFamily: I, fontSize: "10.5px", color: deliv.isTransfer ? "rgba(245,158,11,0.60)" : "rgba(113,113,122,0.46)" }}
          >
            <deliv.Icon className="w-3 h-3 shrink-0" strokeWidth={1.5} aria-hidden="true" />
            {deliv.label}
            {deliv.isTransfer && (
              <Lock className="w-2.5 h-2.5 shrink-0 ml-0.5" style={{ color: "rgba(180,120,0,0.40)" }} strokeWidth={2} aria-hidden="true" />
            )}
          </span>
          <span aria-hidden="true" style={{ color: "rgba(63,63,70,0.38)", fontSize: "10px", userSelect: "none" as const }}>·</span>
          <span className="inline-flex items-center gap-1 shrink-0" style={{ fontFamily: I, fontSize: "10.5px", color: "rgba(6,182,212,0.44)" }}>
            <Shield className="w-3 h-3 shrink-0" strokeWidth={1.5} aria-hidden="true" />
            Verified
          </span>
        </div>

        {/* ── CTA area ─────────────────────────────────────────── */}
        <div className="mt-auto">
          {/* Neutral hairline above CTA */}
          <div className="mb-4" aria-hidden="true" style={{ height: "1px", background: "rgba(255,255,255,0.06)" }} />

          <div className="flex items-center gap-2">

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
              whileTap={isAvail ? { scale: 0.96 } : undefined}
              className="flex-1 h-10 inline-flex items-center justify-center gap-1.5 rounded-xl"
              style={{
                fontFamily: I, fontSize: "11.5px", fontWeight: 700, letterSpacing: "0.02em",
                transition: "all 0.15s ease",
                ...(added
                  ? { background: "rgba(52,211,153,0.10)", border: "1px solid rgba(52,211,153,0.22)", color: "rgba(52,211,153,0.92)", cursor: "default" }
                  : inCart
                    ? { background: "rgba(6,182,212,0.08)", border: "1px solid rgba(6,182,212,0.22)", color: "rgba(6,182,212,0.82)", cursor: "pointer" }
                    : isAvail
                      ? { background: hovered ? "#22D3EE" : "#06B6D4", color: "#030305", cursor: "pointer", boxShadow: hovered ? "0 4px 22px rgba(6,182,212,0.32)" : "none" }
                      : { background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", color: "rgba(113,113,122,0.34)", cursor: "not-allowed", fontWeight: 500 }
                ),
              }}
            >
              {added   ? <><Check        className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />Added</>
              : inCart ? <><ShoppingCart className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />In cart</>
              : isAvail? <><ShoppingCart className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />Add to cart</>
              : "Sold out"}
            </motion.button>

            {/* Secondary: view details — stops propagation to avoid double router.push */}
            <button
              onClick={handleDetailsClick}
              className="w-10 h-10 inline-flex items-center justify-center rounded-xl shrink-0 transition-all duration-200"
              style={{
                border:     `1px solid ${hovered && isAvail ? ca(0.30) : "rgba(255,255,255,0.08)"}`,
                color:      hovered && isAvail ? accent : "rgba(113,113,122,0.56)",
                background: hovered && isAvail ? ca(0.07) : "transparent",
                cursor:     "pointer",
              }}
              aria-label={`View details for ${ticket.name}`}
            >
              <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
            </button>
          </div>
        </div>

      </div>
    </motion.div>
  );
}
