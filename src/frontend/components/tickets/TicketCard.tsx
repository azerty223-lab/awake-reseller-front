"use client";

import { useRouter } from "next/navigation";
import { ShoppingCart, Check, ShieldCheck } from "lucide-react";
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

/* ── Category registry ──────────────────────────────────────────────
   The dot and label text are the only places category colour appears.
   No card borders, no gradients, no full-width accents.             */
type Cat = { label: string; r: number; g: number; b: number };

const CATS: Partial<Record<TicketCategory, Cat>> = {
  [TicketCategory.WEEKEND]:         { label: "Weekend Pass",   r: 139, g: 92,  b: 246 },
  [TicketCategory.SATURDAY]:        { label: "Saturday",       r: 59,  g: 130, b: 246 },
  [TicketCategory.SUNDAY]:          { label: "Sunday",         r: 6,   g: 182, b: 212 },
  [TicketCategory.CAMPING]:         { label: "Camping",        r: 16,  g: 185, b: 129 },
  [TicketCategory.COMFORT_CAMPING]: { label: "Comfort Camp",   r: 20,  g: 184, b: 166 },
  [TicketCategory.CAR_CAMPING]:     { label: "Car Camping",    r: 16,  g: 185, b: 129 },
  [TicketCategory.PREMIUM]:         { label: "Premium",        r: 245, g: 158, b: 11  },
  [TicketCategory.ACCOMMODATION]:   { label: "Accommodation",  r: 244, g: 63,  b: 94  },
};

function getCat(c: TicketCategory): Cat {
  return CATS[c] ?? { label: String(c).replace(/_/g, " "), r: 113, g: 113, b: 122 };
}

/* ── Delivery copy ──────────────────────────────────────────────── */
function getDeliveryLabel(m: DeliveryMethod): { text: string; warn: boolean } {
  switch (m) {
    case DeliveryMethod.DIGITAL:     return { text: "Digital e-ticket",  warn: false };
    case DeliveryMethod.PHYSICAL:    return { text: "Physical delivery", warn: false };
    case DeliveryMethod.NAME_CHANGE: return { text: "Name transfer req.", warn: true  };
    default:                         return { text: "Digital e-ticket",  warn: false };
  }
}

const F = "var(--font-inter, Inter, system-ui, sans-serif)";

/* ── Component ──────────────────────────────────────────────────── */
export function TicketCard({ ticket }: { ticket: Ticket }) {
  const router  = useRouter();
  const addItem = useCartStore(s => s.addItem);
  const items   = useCartStore(s => s.items);
  const [added,   setAdded]   = useState(false);
  const [hovered, setHovered] = useState(false);

  const inCart     = !!items.find(i => i.ticketId === ticket.id);
  const available  = ticket.quantity - ticket.sold;
  const isAvail    = available > 0 && ticket.isVisible;
  const isLow      = isAvail && available <= 3;
  const isLast     = isAvail && available === 1;
  const savings    = ticket.originalPrice - ticket.resalePrice;
  const savePct    = ticket.originalPrice > 0
    ? Math.round((savings / ticket.originalPrice) * 100) : 0;
  const hasSavings = savings > 0 && isAvail;

  const { r, g, b, label: catLabel } = getCat(ticket.category);
  const delivery = getDeliveryLabel(ticket.deliveryMethod);
  const ca = (a: number) => `rgba(${r},${g},${b},${a})`;

  /* Navigation */
  const go = () => router.push(`/tickets/${ticket.slug}`);
  const intercepted = (e: React.MouseEvent, fn?: () => void) => {
    e.stopPropagation();
    fn?.();
  };

  /* Add to cart */
  const handleAdd = (e: React.MouseEvent) => {
    intercepted(e);
    if (!isAvail || inCart) return;
    addItem({
      ticketId: ticket.id, name: ticket.name, slug: ticket.slug,
      resalePrice: ticket.resalePrice, currency: ticket.currency,
      maxQuantity: available, category: ticket.category,
      dayLabel: ticket.dayLabel, deliveryMethod: ticket.deliveryMethod,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2400);
  };

  /* CTA style — function so TypeScript is happy with the union */
  const ctaStyle = (): React.CSSProperties => {
    const base: React.CSSProperties = {
      fontFamily: F, fontSize: "12.5px", fontWeight: 600,
      letterSpacing: "0.005em", transition: "all 0.14s ease",
      cursor: isAvail ? "pointer" : "not-allowed",
    };
    if (added) return {
      ...base,
      background: "rgba(52,211,153,0.09)",
      border:     "1px solid rgba(52,211,153,0.20)",
      color:      "rgba(52,211,153,0.90)",
    };
    if (inCart) return {
      ...base,
      background: "rgba(6,182,212,0.08)",
      border:     "1px solid rgba(6,182,212,0.18)",
      color:      "rgba(6,182,212,0.85)",
    };
    if (isAvail) return {
      ...base,
      background: hovered ? "#22D3EE" : "#06B6D4",
      color:      "#030305",
      boxShadow:  hovered ? "0 2px 14px rgba(6,182,212,0.22)" : "none",
    };
    return {
      ...base,
      background: "rgba(255,255,255,0.04)",
      border:     "1px solid rgba(255,255,255,0.07)",
      color:      "rgba(113,113,122,0.40)",
      fontWeight: 500,
    };
  };

  /* Availability text + colour */
  const avail = (() => {
    if (!isAvail) return { text: "Sold out",         color: "rgba(113,113,122,0.60)", bold: false };
    if (isLast)   return { text: "Last ticket",      color: "rgba(239,68,68,0.82)",   bold: true  };
    if (isLow)    return { text: `${available} left`, color: "rgba(234,179,8,0.82)",  bold: true  };
    if (inCart)   return { text: "In cart",           color: "rgba(6,182,212,0.85)",  bold: true  };
    return              { text: `${available} avail.`, color: "rgba(113,113,122,0.50)", bold: false };
  })();

  return (
    <motion.article
      onClick={go}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      whileHover={{ y: isAvail ? -2 : 0 }}
      transition={{ duration: 0.16, ease: [0.16, 1, 0.3, 1] }}
      aria-label={`${ticket.name}, ${formatPrice(ticket.resalePrice, ticket.currency)}${!isAvail ? ", sold out" : ""}`}
      className="relative flex flex-col overflow-hidden cursor-pointer select-none"
      style={{
        background:    hovered ? "#18191E" : "#141418",
        border:        "1px solid rgba(255,255,255,0.08)",
        borderRadius:  "12px",
        boxShadow:     hovered && isAvail
          ? "0 8px 28px rgba(0,0,0,0.48), 0 2px 8px rgba(0,0,0,0.22)"
          : "0 1px 4px rgba(0,0,0,0.20)",
        opacity:       !isAvail ? 0.50 : 1,
        transition:    "background 0.18s ease, box-shadow 0.18s ease",
      }}
    >

      {/* ── HEADER ROW ────────────────────────────────────────────
          Category label (dot + small-caps text) on the left.
          Availability plain text on the right.
          No badges, no chips, no chrome.                        */}
      <div className="flex items-center justify-between px-5 pt-4 pb-3">

        {/* Category: 6px dot + small-caps label */}
        <div className="flex items-center gap-1.5 min-w-0">
          <span
            aria-hidden="true"
            className="shrink-0 rounded-full"
            style={{ width: "6px", height: "6px", background: ca(0.80) }}
          />
          <span
            className="truncate"
            style={{
              fontFamily: F, fontSize: "9.5px", fontWeight: 700,
              letterSpacing: "0.08em", textTransform: "uppercase" as const,
              color: ca(0.72),
            }}
          >
            {catLabel}
          </span>
        </div>

        {/* Availability: plain text, no badge wrapper */}
        <span
          style={{
            fontFamily: F, fontSize: "11px",
            fontWeight: avail.bold ? 600 : 400,
            color: avail.color,
            whiteSpace: "nowrap" as const,
          }}
        >
          {inCart ? (
            <>
              <Check
                className="inline w-3 h-3 mr-0.5 -mt-px"
                aria-hidden="true"
                strokeWidth={2.5}
              />
              In cart
            </>
          ) : (
            avail.text
          )}
        </span>
      </div>

      {/* ── BODY ──────────────────────────────────────────────────
          Name → date → price → metadata.
          Each element anchored and consistently spaced.         */}
      <div className="px-5 pb-4">

        {/* Ticket name */}
        <h3
          style={{
            fontFamily: F, fontSize: "15px", fontWeight: 600,
            color: "#EDEDEE", letterSpacing: "-0.012em", lineHeight: 1.28,
            margin: "0 0 3px",
          }}
        >
          {ticket.name}
        </h3>

        {/* Date / day label */}
        <p
          style={{
            fontFamily: F, fontSize: "12px",
            color: "rgba(161,161,170,0.52)",
            margin: "0 0 16px", lineHeight: 1.4,
            /* Reserve space even when empty so all cards align */
            minHeight: "17px",
          }}
        >
          {ticket.dayLabel ?? ""}
        </p>

        {/* Price + face value — baseline-aligned */}
        <div className="flex items-baseline justify-between gap-4 mb-1">
          <span
            style={{
              fontFamily: F, fontSize: "1.375rem", fontWeight: 700,
              color: "#FFFFFF", letterSpacing: "-0.028em", lineHeight: 1,
            }}
          >
            {formatPrice(ticket.resalePrice, ticket.currency)}
          </span>
          <span
            className="shrink-0"
            style={{
              fontFamily: F, fontSize: "11.5px",
              color: "rgba(113,113,122,0.50)",
              textDecoration: "line-through",
            }}
          >
            {formatPrice(ticket.originalPrice, ticket.currency)}
            {" "}
            <span
              style={{
                textDecoration: "none",
                fontSize: "9.5px",
                color: "rgba(113,113,122,0.34)",
                textTransform: "uppercase" as const,
                letterSpacing: "0.04em",
              }}
            >
              face
            </span>
          </span>
        </div>

        {/* Savings pill — only when resale genuinely below face */}
        {hasSavings && (
          <div className="mb-3 mt-2">
            <span
              style={{
                fontFamily: F, fontSize: "10.5px", fontWeight: 600,
                color: "rgba(52,211,153,0.85)",
                background: "rgba(52,211,153,0.07)",
                border: "1px solid rgba(52,211,153,0.14)",
                borderRadius: "4px", padding: "2px 7px",
              }}
            >
              −{savePct}% below face value
            </span>
          </div>
        )}

        {/* Meta row: delivery · verified */}
        <div
          className="flex items-center gap-2 mt-3"
          style={{ fontFamily: F, fontSize: "11px" }}
        >
          <span
            style={{
              color: delivery.warn
                ? "rgba(234,179,8,0.68)"
                : "rgba(113,113,122,0.50)",
            }}
          >
            {delivery.text}
          </span>
          <span
            aria-hidden="true"
            style={{ color: "rgba(63,63,70,0.40)", userSelect: "none" as const }}
          >
            ·
          </span>
          <span
            className="inline-flex items-center gap-1"
            style={{ color: "rgba(6,182,212,0.55)" }}
          >
            <ShieldCheck className="w-3 h-3 shrink-0" strokeWidth={1.75} aria-hidden="true" />
            Verified source
          </span>
        </div>
      </div>

      {/* ── FOOTER ────────────────────────────────────────────────
          Add to cart (flex-1) + "View details" text link.
          Hairline top-border and a barely-there dark fill
          signal "here is where you act" without a loud zone.   */}
      <div
        className="flex items-center gap-3 px-5 py-3"
        style={{
          borderTop:  "1px solid rgba(255,255,255,0.06)",
          background: "rgba(0,0,0,0.16)",
        }}
      >
        {/* Primary */}
        <motion.button
          onClick={handleAdd}
          disabled={!isAvail}
          whileTap={isAvail ? { scale: 0.98 } : undefined}
          aria-label={
            !isAvail ? `${ticket.name} — sold out`
            : added   ? "Added to cart"
            : inCart  ? `Add another ${ticket.name} to cart`
            :           `Add ${ticket.name} to cart`
          }
          className="flex-1 h-9 inline-flex items-center justify-center gap-1.5 rounded-lg"
          style={ctaStyle()}
        >
          {added    ? <><Check        className="w-3 h-3 shrink-0" aria-hidden="true" /> Added</>
          : inCart  ? <><ShoppingCart className="w-3 h-3 shrink-0" aria-hidden="true" /> In cart</>
          : isAvail ? <><ShoppingCart className="w-3 h-3 shrink-0" aria-hidden="true" /> Add to cart</>
          : "Sold out"}
        </motion.button>

        {/* Secondary — plain text link */}
        <button
          onClick={(e) => intercepted(e, go)}
          style={{
            fontFamily: F, fontSize: "12px", fontWeight: 500,
            color: hovered ? "rgba(237,233,225,0.68)" : "rgba(113,113,122,0.48)",
            background: "transparent", border: "none",
            cursor: "pointer", padding: "0 2px",
            textDecoration: hovered ? "underline" : "none",
            textUnderlineOffset: "3px",
            textDecorationColor: "rgba(237,233,225,0.25)",
            transition: "color 0.15s ease",
            whiteSpace: "nowrap" as const,
          }}
          aria-label={`View full details for ${ticket.name}`}
        >
          View details
        </button>
      </div>

    </motion.article>
  );
}
