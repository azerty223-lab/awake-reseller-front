"use client";

import { useRouter } from "next/navigation";
import {
  ShoppingCart, Check, Lock, Tag, Edit3,
  Truck, ShieldCheck, ChevronRight,
} from "lucide-react";
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

/* ── Category colour system ─────────────────────────────────────────
   One RGB triplet per category. Every derived colour — header wash,
   accent rail, badge, status chip — is computed from the same values
   so the card is always visually coherent.                         */
type Cat = { label: string; r: number; g: number; b: number };

const CATS: Partial<Record<TicketCategory, Cat>> = {
  [TicketCategory.WEEKEND]:         { label: "Weekend Pass",  r: 139, g: 92,  b: 246 },
  [TicketCategory.SATURDAY]:        { label: "Saturday",      r: 59,  g: 130, b: 246 },
  [TicketCategory.SUNDAY]:          { label: "Sunday",        r: 6,   g: 182, b: 212 },
  [TicketCategory.CAMPING]:         { label: "Camping",       r: 16,  g: 185, b: 129 },
  [TicketCategory.COMFORT_CAMPING]: { label: "Comfort Camp",  r: 20,  g: 184, b: 166 },
  [TicketCategory.CAR_CAMPING]:     { label: "Car Camping",   r: 16,  g: 185, b: 129 },
  [TicketCategory.PREMIUM]:         { label: "Premium",       r: 245, g: 158, b: 11  },
  [TicketCategory.ACCOMMODATION]:   { label: "Accommodation", r: 244, g: 63,  b: 94  },
};

function getCat(c: TicketCategory): Cat {
  return CATS[c] ?? { label: String(c).replace(/_/g, " "), r: 113, g: 113, b: 122 };
}

function getDelivery(m: DeliveryMethod) {
  switch (m) {
    case DeliveryMethod.DIGITAL:     return { label: "Digital e-ticket",   Icon: Tag,   isTransfer: false };
    case DeliveryMethod.PHYSICAL:    return { label: "Physical delivery",  Icon: Truck, isTransfer: false };
    case DeliveryMethod.NAME_CHANGE: return { label: "Name transfer req.", Icon: Edit3, isTransfer: true  };
    default:                         return { label: "Digital e-ticket",   Icon: Tag,   isTransfer: false };
  }
}

const F = "var(--font-inter, Inter, system-ui, sans-serif)";

/* ── Card ─────────────────────────────────────────────────────────── */
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

  const cat   = getCat(ticket.category);
  const deliv = getDelivery(ticket.deliveryMethod);
  const { r, g, b } = cat;
  const ca = (a: number) => `rgba(${r},${g},${b},${a})`;

  /* Navigation */
  const go = () => router.push(`/tickets/${ticket.slug}`);
  const stopGo = (e: React.MouseEvent, fn?: () => void) => {
    e.stopPropagation();
    fn?.();
  };

  const handleAdd = (e: React.MouseEvent) => {
    stopGo(e);
    if (!isAvail || inCart) return;
    addItem({
      ticketId: ticket.id, name: ticket.name, slug: ticket.slug,
      resalePrice: ticket.resalePrice, currency: ticket.currency,
      maxQuantity: available, category: ticket.category,
      dayLabel: ticket.dayLabel, deliveryMethod: ticket.deliveryMethod,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2200);
  };

  /* ── CTA button styles ────────────────────────────────────────── */
  const ctaStyle = ((): React.CSSProperties => {
    const base: React.CSSProperties = {
      fontFamily: F, fontSize: "13px", fontWeight: 700,
      letterSpacing: "0.01em", transition: "all 0.15s ease",
      cursor: isAvail ? "pointer" : "not-allowed",
    };
    if (added)  return { ...base, background: "rgba(52,211,153,0.10)", border: "1px solid rgba(52,211,153,0.22)", color: "rgba(52,211,153,0.92)" };
    if (inCart) return { ...base, background: "rgba(6,182,212,0.09)",  border: "1px solid rgba(6,182,212,0.22)",  color: "rgba(6,182,212,0.88)"  };
    if (isAvail)return { ...base, background: hovered ? "#22D3EE" : "#06B6D4", color: "#020204", boxShadow: hovered ? "0 4px 24px rgba(6,182,212,0.30)" : "none" };
    return       { ...base, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)", color: "rgba(113,113,122,0.40)", fontWeight: 500 };
  })();

  /* ── Availability indicator ───────────────────────────────────── */
  const availChip = (() => {
    if (inCart) return (
      <span className="inline-flex items-center gap-1.5" style={{ fontFamily: F, fontSize: "11px", fontWeight: 600, color: "rgba(6,182,212,0.90)" }}>
        <Check className="w-3 h-3 shrink-0" aria-hidden="true" />
        In cart
      </span>
    );
    if (!isAvail) return (
      <span style={{ fontFamily: F, fontSize: "11px", fontWeight: 600, color: "rgba(113,113,122,0.55)" }}>Sold out</span>
    );
    if (isLast) return (
      <span className="inline-flex items-center gap-1.5" style={{ fontFamily: F, fontSize: "11px", fontWeight: 600, color: "rgba(239,68,68,0.88)" }}>
        <span className="w-1.5 h-1.5 rounded-full shrink-0 bg-red-500/80" aria-hidden="true" />
        Last ticket
      </span>
    );
    if (isLow) return (
      <span className="inline-flex items-center gap-1.5" style={{ fontFamily: F, fontSize: "11px", fontWeight: 600, color: "rgba(251,191,36,0.88)" }}>
        <span className="w-1.5 h-1.5 rounded-full shrink-0 bg-amber-400/80" aria-hidden="true" />
        {available} left
      </span>
    );
    return (
      <span className="inline-flex items-center gap-1.5" style={{ fontFamily: F, fontSize: "11px", color: "rgba(113,113,122,0.50)" }}>
        <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: "rgba(52,211,153,0.60)" }} aria-hidden="true" />
        {available} available
      </span>
    );
  })();

  return (
    <motion.article
      onClick={go}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      whileHover={{ y: isAvail ? -3 : 0 }}
      transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
      aria-label={`${ticket.name}, ${formatPrice(ticket.resalePrice, ticket.currency)}${!isAvail ? ", sold out" : ""}`}
      className="relative flex flex-col overflow-hidden select-none cursor-pointer"
      style={{
        background:  "#0D0F14",
        borderRadius: "12px",
        border:      `1px solid rgba(255,255,255,${hovered ? 0.11 : 0.07})`,
        borderLeft:  `4px solid ${ca(hovered ? 0.88 : 0.50)}`,
        boxShadow:   hovered && isAvail
          ? `0 24px 64px rgba(0,0,0,0.65), 0 0 0 1px ${ca(0.12)}`
          : "0 2px 12px rgba(0,0,0,0.25)",
        opacity:     !isAvail ? 0.48 : 1,
        transition:  "border-color 0.22s ease, box-shadow 0.22s ease",
      }}
    >
      {/* Featured: top accent line in category colour */}
      {ticket.isFeatured && (
        <div aria-hidden="true" className="absolute top-0 inset-x-0 pointer-events-none"
          style={{ height: "1.5px", background: `linear-gradient(to right, transparent, ${ca(0.85)}, transparent)` }} />
      )}

      {/* ══════════════════════════════════════════════
          ZONE 1 — Identity header
          Category type + availability status
          ════════════════════════════════════════════ */}
      <div
        className="flex items-center justify-between px-4 py-2.5 shrink-0"
        style={{
          background:   `linear-gradient(90deg, ${ca(0.12)} 0%, ${ca(0.03)} 60%, transparent 100%)`,
          borderBottom: "1px solid rgba(255,255,255,0.055)",
        }}
      >
        {/* Category badge */}
        <span
          className="inline-flex items-center gap-1.5 rounded-md leading-none shrink-0"
          style={{
            fontFamily: F, fontSize: "9.5px", fontWeight: 700,
            letterSpacing: "0.08em", textTransform: "uppercase" as const,
            color: ca(0.92),
            background: ca(0.13),
            border: `1px solid ${ca(0.24)}`,
            padding: "3px 8px",
          }}
        >
          {cat.label}
        </span>

        {/* Availability */}
        {availChip}
      </div>

      {/* ══════════════════════════════════════════════
          ZONE 2 — Ticket info + price
          Name, date, resale price, face value
          ════════════════════════════════════════════ */}
      <div className="flex-1 px-5 py-4">
        {/* Name */}
        <h3
          className="text-white"
          style={{ fontFamily: F, fontSize: "1.0625rem", fontWeight: 700, letterSpacing: "-0.016em", lineHeight: 1.26, margin: "0 0 3px" }}
        >
          {ticket.name}
        </h3>

        {/* Date */}
        <p
          style={{ fontFamily: F, fontSize: "11.5px", color: "rgba(161,161,170,0.50)", margin: "0 0 18px", letterSpacing: "0.01em", minHeight: "16px" }}
        >
          {ticket.dayLabel ?? ""}
        </p>

        {/* Price row */}
        <div className="flex items-end gap-3">
          <div>
            <span
              className="text-white block tabular-nums leading-none"
              style={{ fontFamily: F, fontSize: "2rem", fontWeight: 800, letterSpacing: "-0.038em" }}
            >
              {formatPrice(ticket.resalePrice, ticket.currency)}
            </span>
            <div className="flex items-center gap-1.5 mt-1.5">
              <span
                className="tabular-nums"
                style={{ fontFamily: F, fontSize: "11.5px", color: "rgba(113,113,122,0.50)", textDecoration: "line-through" }}
              >
                {formatPrice(ticket.originalPrice, ticket.currency)}
              </span>
              <span style={{ fontFamily: F, fontSize: "9.5px", color: "rgba(113,113,122,0.35)", textTransform: "uppercase" as const, letterSpacing: "0.05em" }}>
                face
              </span>
            </div>
          </div>

          {/* Savings pill — only when genuinely cheaper than face value */}
          {hasSavings && (
            <span
              className="mb-1 shrink-0"
              style={{
                fontFamily: F, fontSize: "11px", fontWeight: 700,
                color: "rgba(52,211,153,0.92)",
                background: "rgba(52,211,153,0.09)",
                border: "1px solid rgba(52,211,153,0.20)",
                borderRadius: "6px",
                padding: "3px 8px",
              }}
            >
              −{savePct}%
            </span>
          )}
        </div>
      </div>

      {/* ══════════════════════════════════════════════
          ZONE 3 — Trust strip
          Delivery method + verified source signal
          Gets a slightly lighter background so it
          stands visually apart from the price section
          ════════════════════════════════════════════ */}
      <div
        className="flex items-center gap-3 px-5 py-2.5 shrink-0"
        style={{
          background:   "rgba(255,255,255,0.028)",
          borderTop:    "1px solid rgba(255,255,255,0.055)",
          borderBottom: "1px solid rgba(255,255,255,0.055)",
        }}
      >
        {/* Delivery */}
        <span
          className="inline-flex items-center gap-1.5 shrink-0 min-w-0"
          style={{
            fontFamily: F, fontSize: "11px",
            color: deliv.isTransfer ? "rgba(245,158,11,0.72)" : "rgba(113,113,122,0.58)",
          }}
        >
          <deliv.Icon className="w-3 h-3 shrink-0" strokeWidth={1.5} aria-hidden="true" />
          <span className="truncate">{deliv.label}</span>
          {deliv.isTransfer && (
            <Lock className="w-2.5 h-2.5 shrink-0 text-amber-600/40" strokeWidth={2} aria-hidden="true" />
          )}
        </span>

        <span aria-hidden="true" style={{ color: "rgba(63,63,70,0.40)", fontSize: "10px", userSelect: "none" as const, flexShrink: 0 }}>·</span>

        {/* Verified */}
        <span
          className="inline-flex items-center gap-1.5 shrink-0"
          style={{ fontFamily: F, fontSize: "11px", color: "rgba(6,182,212,0.62)" }}
        >
          <ShieldCheck className="w-3 h-3 shrink-0" strokeWidth={1.75} aria-hidden="true" />
          Verified source
        </span>
      </div>

      {/* ══════════════════════════════════════════════
          ZONE 4 — Action strip
          Full-width primary CTA + text Details link
          Darker background = clear "do something here"
          ════════════════════════════════════════════ */}
      <div
        className="flex items-center gap-2 px-4 py-3 shrink-0"
        style={{ background: "rgba(0,0,0,0.22)" }}
      >
        {/* Primary CTA */}
        <motion.button
          onClick={handleAdd}
          disabled={!isAvail}
          whileTap={isAvail ? { scale: 0.97 } : undefined}
          aria-label={
            !isAvail ? `${ticket.name} — sold out`
            : added   ? "Added to cart"
            : inCart  ? `Add another ${ticket.name} to cart`
            :           `Add ${ticket.name} to cart`
          }
          className="flex-1 h-10 inline-flex items-center justify-center gap-2 rounded-lg"
          style={ctaStyle}
        >
          {added   ? <><Check        className="w-3.5 h-3.5 shrink-0" aria-hidden="true" /> Added to cart</>
          : inCart ? <><ShoppingCart className="w-3.5 h-3.5 shrink-0" aria-hidden="true" /> In your cart</>
          : isAvail? <><ShoppingCart className="w-3.5 h-3.5 shrink-0" aria-hidden="true" /> Add to cart</>
          : "Sold out"}
        </motion.button>

        {/* Details link */}
        <button
          onClick={(e) => stopGo(e, go)}
          className="h-10 px-3 inline-flex items-center gap-0.5 rounded-lg shrink-0 transition-all duration-200"
          style={{
            fontFamily: F, fontSize: "12px", fontWeight: 500,
            color:      hovered ? "rgba(237,233,225,0.72)" : "rgba(113,113,122,0.52)",
            background: hovered ? "rgba(255,255,255,0.07)" : "transparent",
            border:     `1px solid ${hovered ? "rgba(255,255,255,0.10)" : "rgba(255,255,255,0.06)"}`,
            cursor: "pointer",
          }}
          aria-label={`View full details for ${ticket.name}`}
        >
          Details
          <ChevronRight className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
        </button>
      </div>
    </motion.article>
  );
}
