"use client";

import { useRouter }   from "next/navigation";
import { ShoppingCart, Check } from "lucide-react";
import { useCartStore } from "@/frontend/store/cart";
import { formatPrice }  from "@/backend/lib/utils";
import { TicketCategory, type Ticket } from "@/frontend/types/tickets";
import { useState } from "react";
import { motion }    from "framer-motion";

/* ── 3-colour palette ───────────────────────────────────────────────
   #FFFFFF / #EDEDED  →  primary text  (name, price)
   rgba(161,161,170,…) →  secondary text (date, labels, face value)
   #06B6D4             →  brand accent  (CTA button + in-cart only)

   Status is communicated through weight and opacity, not extra hues. */

const MUTED   = "rgba(161,161,170,0.52)";
const MUTED_2 = "rgba(113,113,122,0.45)";
const CYAN    = "#06B6D4";
const CYAN_HV = "#22D3EE";
const F       = "var(--font-inter, Inter, system-ui, sans-serif)";

/* ── Festival photo backgrounds by category ────────────────────────
   Each ticket category maps to one of the 3 festival photos.
   A dark gradient overlay is always layered on top so text stays legible. */
const CAT_BG: Partial<Record<TicketCategory, { src: string; pos: string }>> = {
  [TicketCategory.WEEKEND]:         { src: "/ticket-bg-1.jpg", pos: "center 35%" },
  [TicketCategory.SATURDAY]:        { src: "/ticket-bg-2.jpg", pos: "center 40%" },
  [TicketCategory.SUNDAY]:          { src: "/ticket-bg-3.jpg", pos: "center 55%" },
  [TicketCategory.CAMPING]:         { src: "/bg-weekend-camping.jpg", pos: "center 45%" },
  [TicketCategory.COMFORT_CAMPING]: { src: "/bg-comfort-camping.jpg", pos: "center 40%" },
  [TicketCategory.CAR_CAMPING]:     { src: "/bg-car-camping.jpg", pos: "center 45%" },
  [TicketCategory.PREMIUM]:         { src: "/ticket-bg-1.jpg", pos: "center 30%" },
  [TicketCategory.ACCOMMODATION]:   { src: "/ticket-bg-2.jpg", pos: "center 50%" },
};

/* ── Category labels (text only — no per-category colours) ────────── */
const CAT_LABELS: Partial<Record<TicketCategory, string>> = {
  [TicketCategory.WEEKEND]:         "Weekend Pass",
  [TicketCategory.SATURDAY]:        "Saturday",
  [TicketCategory.SUNDAY]:          "Sunday",
  [TicketCategory.CAMPING]:         "Camping",
  [TicketCategory.COMFORT_CAMPING]: "Comfort Camp",
  [TicketCategory.CAR_CAMPING]:     "Car Camping",
  [TicketCategory.PREMIUM]:         "Premium",
  [TicketCategory.ACCOMMODATION]:   "Accommodation",
};

const catLabel = (c: TicketCategory) =>
  CAT_LABELS[c] ?? String(c).replace(/_/g, " ");

/* ── Component ──────────────────────────────────────────────────────── */
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
  const savePct   = ticket.originalPrice > 0
    ? Math.round((savings / ticket.originalPrice) * 100) : 0;
  const hasSavings = savings > 0 && isAvail;

  /* Navigation */
  const go = () => router.push(`/tickets/${ticket.slug}`);
  const trap = (e: React.MouseEvent, fn?: () => void) => {
    e.stopPropagation();
    fn?.();
  };

  const handleAdd = (e: React.MouseEvent) => {
    trap(e);
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

  /* ── Availability text ───────────────────────────────────────────
     Low-stock urgency is expressed through white + bold weight, not
     through a separate hue. Only in-cart uses the brand cyan.      */
  const avail = (() => {
    if (inCart)    return { text: "In cart",            color: CYAN,    bold: true  };
    if (!isAvail)  return { text: "Sold out",           color: MUTED_2, bold: false };
    if (isLast)    return { text: "Last ticket",        color: "#EDEDED",bold: true  };
    if (isLow)     return { text: `${available} left`,  color: "#EDEDED",bold: true  };
    return               { text: `${available} avail.`, color: MUTED_2, bold: false };
  })();

  /* ── CTA style ───────────────────────────────────────────────────
     Solid cyan for "Add to cart" — the single dominant accent on
     the card. All other states stay within neutral/white/cyan.     */
  const ctaStyle = (): React.CSSProperties => {
    const base: React.CSSProperties = {
      fontFamily: F, fontSize: "12.5px", fontWeight: 600,
      letterSpacing: "0.005em", transition: "all 0.14s ease",
      cursor: isAvail ? "pointer" : "not-allowed",
    };
    if (added) return {
      ...base,
      background: "rgba(255,255,255,0.06)",
      border: "1px solid rgba(255,255,255,0.10)",
      color: "rgba(237,233,225,0.80)",
    };
    if (inCart) return {
      ...base,
      background: `rgba(6,182,212,0.10)`,
      border: `1px solid rgba(6,182,212,0.22)`,
      color: CYAN,
    };
    if (isAvail) return {
      ...base,
      background: hovered ? CYAN_HV : CYAN,
      color: "#020204",
      boxShadow: hovered ? "0 2px 14px rgba(6,182,212,0.22)" : "none",
    };
    return {
      ...base,
      background: "rgba(255,255,255,0.04)",
      border: "1px solid rgba(255,255,255,0.07)",
      color: "rgba(113,113,122,0.38)",
      fontWeight: 500,
    };
  };

  const bg = CAT_BG[ticket.category] ?? { src: "/ticket-bg-1.jpg", pos: "center 40%" };

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
        border:       `1px solid ${hovered && isAvail ? "rgba(255,255,255,0.18)" : "rgba(255,255,255,0.10)"}`,
        borderRadius: "12px",
        boxShadow:    hovered && isAvail
          ? "0 0 0 1px rgba(6,182,212,0.14), 0 12px 40px rgba(0,0,0,0.65)"
          : "0 4px 20px rgba(0,0,0,0.50)",
        opacity:      !isAvail ? 0.55 : 1,
        transition:   "border-color 0.18s ease, box-shadow 0.18s ease",
      }}
    >
      {/* ── Festival photo background ─────────────────────────────── */}
      <div
        aria-hidden="true"
        style={{
          position:           "absolute",
          inset:              0,
          backgroundImage:    `url(${bg.src})`,
          backgroundSize:     "cover",
          backgroundPosition: bg.pos,
          zIndex:             0,
        }}
      />
      {/* Dark gradient overlay — lighter at top to reveal photo */}
      <div
        aria-hidden="true"
        style={{
          position:   "absolute",
          inset:      0,
          background: hovered && isAvail
            ? "linear-gradient(175deg, rgba(0,0,0,0.30) 0%, rgba(0,0,0,0.62) 50%, rgba(0,0,0,0.82) 100%)"
            : "linear-gradient(175deg, rgba(0,0,0,0.42) 0%, rgba(0,0,0,0.72) 50%, rgba(0,0,0,0.88) 100%)",
          zIndex:     1,
          transition: "background 0.22s ease",
        }}
      />
      {/* All card content sits above the photo layers */}
      <div className="relative flex flex-col flex-1" style={{ zIndex: 2 }}>

      {/* ── HEADER — category type + availability ───────────────────
          Both elements use the same muted type scale. Availability
          breaks to bold white (or cyan for in-cart) when it matters.  */}
      <div className="flex items-center justify-between px-5 pt-4 pb-3">
        <span style={{
          fontFamily: F, fontSize: "9.5px", fontWeight: 700,
          letterSpacing: "0.08em", textTransform: "uppercase" as const,
          color: "rgba(255,255,255,0.55)",
          background: "rgba(0,0,0,0.35)",
          padding: "2px 7px", borderRadius: "4px",
          backdropFilter: "blur(4px)",
        }}>
          {catLabel(ticket.category)}
        </span>

        <span style={{
          fontFamily: F, fontSize: "11px",
          fontWeight: avail.bold ? 600 : 400,
          color: avail.color,
          whiteSpace: "nowrap" as const,
        }}>
          {inCart && (
            <Check className="inline w-3 h-3 mr-0.5 -mt-px shrink-0"
              strokeWidth={2.5} aria-hidden="true" />
          )}
          {avail.text}
        </span>
      </div>

      {/* ── BODY — name, date, price ─────────────────────────────────
          Three lines: bold white name → muted date → bold white price.
          Face value sits right-aligned on the same row as the price.  */}
      <div className="px-5 pb-4">

        {/* Name */}
        <h3 style={{
          fontFamily: F, fontSize: "15px", fontWeight: 600,
          color: "#EDEDED", letterSpacing: "-0.012em", lineHeight: 1.28,
          margin: "0 0 3px",
        }}>
          {ticket.name}
        </h3>

        {/* Date */}
        <p style={{
          fontFamily: F, fontSize: "12px", color: "rgba(255,255,255,0.50)",
          margin: "0 0 16px", minHeight: "17px",
          textShadow: "0 1px 3px rgba(0,0,0,0.6)",
        }}>
          {ticket.dayLabel ?? ""}
        </p>

        {/* Price + face value on one baseline */}
        <div className="flex items-baseline justify-between gap-3">
          <span style={{
            fontFamily: F, fontSize: "1.375rem", fontWeight: 700,
            color: "#FFFFFF", letterSpacing: "-0.028em", lineHeight: 1,
          }}>
            {formatPrice(ticket.resalePrice, ticket.currency)}
          </span>

          <span style={{
            fontFamily: F, fontSize: "11.5px",
            color: MUTED_2, textDecoration: "line-through",
          }}>
            {formatPrice(ticket.originalPrice, ticket.currency)}
            {" "}
            <span style={{
              textDecoration: "none", fontSize: "9.5px",
              color: "rgba(113,113,122,0.30)",
              textTransform: "uppercase" as const, letterSpacing: "0.04em",
            }}>
              face
            </span>
          </span>
        </div>

        {/* Savings — neutral tint, same white family, no green */}
        {hasSavings && (
          <div className="mt-2.5">
            <span style={{
              fontFamily: F, fontSize: "10.5px", fontWeight: 600,
              color: "rgba(237,233,225,0.68)",
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.09)",
              borderRadius: "4px", padding: "2px 7px",
            }}>
              −{savePct}% below face value
            </span>
          </div>
        )}
      </div>

      {/* ── FOOTER — add to cart + view details ─────────────────────
          The CTA is the only cyan element. "View details" is muted
          text that reveals itself on hover — no competing chrome.  */}
      <div
        className="flex items-center gap-3 px-5 py-3"
        style={{
          borderTop:  "1px solid rgba(255,255,255,0.12)",
          background: "rgba(0,0,0,0.40)",
          backdropFilter: "blur(8px)",
        }}
      >
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
          :           "Sold out"}
        </motion.button>

        <button
          onClick={(e) => trap(e, go)}
          style={{
            fontFamily: F, fontSize: "12px", fontWeight: 500,
            color: hovered ? "rgba(237,233,225,0.65)" : "rgba(113,113,122,0.42)",
            background: "transparent", border: "none",
            cursor: "pointer", padding: "0 2px",
            textDecoration: hovered ? "underline" : "none",
            textUnderlineOffset: "3px",
            textDecorationColor: "rgba(237,233,225,0.22)",
            transition: "color 0.15s ease",
            whiteSpace: "nowrap" as const,
          }}
          aria-label={`View full details for ${ticket.name}`}
        >
          View details
        </button>
      </div>

      </div>{/* end content wrapper */}
    </motion.article>
  );
}
