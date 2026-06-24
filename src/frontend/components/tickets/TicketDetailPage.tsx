"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft, Check, ShoppingCart, Shield,
  Truck, Edit3, Tag, Clock, Minus, Plus,
} from "lucide-react";
import { Badge } from "@/frontend/components/ui/Badge";
import { Button } from "@/frontend/components/ui/Button";
import { useCartStore } from "@/frontend/store/cart";
import { formatPrice } from "@/backend/lib/utils";
import { DeliveryMethod, TicketCategory, type Ticket } from "@/frontend/types/tickets";
import { motion } from "framer-motion";

function getCategoryBadgeVariant(
  category: TicketCategory
): "gold" | "info" | "success" | "purple" | "rose" | "default" {
  switch (category) {
    case TicketCategory.WEEKEND:          return "gold";
    case TicketCategory.SATURDAY:
    case TicketCategory.SUNDAY:           return "info";
    case TicketCategory.CAMPING:
    case TicketCategory.COMFORT_CAMPING:
    case TicketCategory.CAR_CAMPING:      return "success";
    case TicketCategory.PREMIUM:          return "purple";
    case TicketCategory.ACCOMMODATION:    return "rose";
    default:                              return "default";
  }
}

// Section label style: uppercase tracking-widest at zinc-500 establishes
// structural navigation infrastructure vs body copy at zinc-400.
// Color contrast alone is insufficient; label style (uppercase+tracking) creates
// the distinction without inflating visual weight.
const SECTION_LABEL = "text-[10px] font-medium text-zinc-500 uppercase tracking-widest mb-3";

interface TicketDetailPageProps {
  ticket: Ticket;
}

export function TicketDetailPage({ ticket }: TicketDetailPageProps) {
  const addItem = useCartStore((s) => s.addItem);
  const [added, setAdded] = useState(false);
  const [qty, setQty]     = useState(1);

  const available = ticket.quantity - ticket.sold;
  const savings   = ticket.originalPrice - ticket.resalePrice;
  const isLow     = available > 0 && available <= 3;

  const handleAddToCart = () => {
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
      quantity:       qty,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] py-10 px-4">
      <div className="max-w-5xl mx-auto">

        <Link
          href="/tickets"
          className="inline-flex items-center gap-1.5 text-xs text-zinc-600 hover:text-zinc-300 transition-colors mb-10 group"
        >
          <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
          Tickets
        </Link>

        <div className="grid md:grid-cols-[1fr_348px] gap-10 items-start">

          {/* ── Left: content flow ─────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.28 }}
          >
            {/* Header */}
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-4">
                <Badge variant={getCategoryBadgeVariant(ticket.category)}>
                  {ticket.category.replace(/_/g, " ")}
                </Badge>
                {ticket.isFeatured && <Badge variant="gold">Featured</Badge>}
              </div>
              <h1
                className="font-[var(--font-playfair)] font-bold text-white mb-2"
                style={{
                  fontSize: "clamp(1.75rem, 3.5vw, 2.625rem)",
                  letterSpacing: "-0.025em",
                  lineHeight: 1.12,
                }}
              >
                {ticket.name}
              </h1>
              {ticket.dayLabel && (
                <p className="text-zinc-500 text-base mt-1.5">{ticket.dayLabel}</p>
              )}
            </div>

            <div className="h-px bg-white/[0.06] mb-8" />

            {/* About */}
            <section className="mb-8">
              <h2 className={SECTION_LABEL}>About this ticket</h2>
              <p className="text-zinc-400 text-sm leading-relaxed">{ticket.description}</p>
            </section>

            {/* Includes */}
            {ticket.includes.length > 0 && (
              <>
                <div className="h-px bg-white/[0.06] mb-8" />
                <section className="mb-8">
                  <h2 className={SECTION_LABEL}>What&apos;s included</h2>
                  <ul className="space-y-2.5">
                    {ticket.includes.map((item, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <div className="w-4 h-4 rounded-full bg-[#C9A84C]/10 border border-[#C9A84C]/20 flex items-center justify-center shrink-0 mt-0.5">
                          <Check className="w-2.5 h-2.5 text-[#C9A84C]/70" />
                        </div>
                        <span className="text-sm text-zinc-400">{item}</span>
                      </li>
                    ))}
                  </ul>
                </section>
              </>
            )}

            {/* Delivery */}
            <div className="h-px bg-white/[0.06] mb-8" />
            <section>
              <h2 className={SECTION_LABEL}>Delivery &amp; Transfer</h2>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-white/[0.04] border border-white/[0.07] flex items-center justify-center shrink-0">
                  {ticket.deliveryMethod === DeliveryMethod.NAME_CHANGE && <Edit3 className="w-3.5 h-3.5 text-zinc-400" />}
                  {ticket.deliveryMethod === DeliveryMethod.DIGITAL      && <Tag   className="w-3.5 h-3.5 text-zinc-400" />}
                  {ticket.deliveryMethod === DeliveryMethod.PHYSICAL     && <Truck className="w-3.5 h-3.5 text-zinc-400" />}
                </div>
                <div>
                  <p className="text-sm font-medium text-zinc-200 mb-1">
                    {ticket.deliveryMethod === DeliveryMethod.NAME_CHANGE && "Name Transfer Service"}
                    {ticket.deliveryMethod === DeliveryMethod.DIGITAL      && "Digital Delivery"}
                    {ticket.deliveryMethod === DeliveryMethod.PHYSICAL     && "Physical Delivery"}
                  </p>
                  <p className="text-xs text-zinc-500 leading-relaxed max-w-md">
                    {ticket.deliveryMethod === DeliveryMethod.NAME_CHANGE &&
                      "We handle the official name change with Awakenings. After payment, we initiate the transfer process. Your personalized e-ticket arrives within 3–5 business days."}
                    {ticket.deliveryMethod === DeliveryMethod.DIGITAL &&
                      "Your e-ticket will be sent to your email address immediately after payment confirmation."}
                    {ticket.deliveryMethod === DeliveryMethod.PHYSICAL &&
                      "Ticket will be shipped to your specified address. Allow 3–7 business days for delivery."}
                  </p>
                </div>
              </div>
            </section>
          </motion.div>

          {/* ── Right: purchase sidebar ────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.06, duration: 0.28 }}
          >
            <div className="bg-[#0F1013] border border-white/[0.09] rounded-xl p-5 sticky top-24">

              {/* Price — text-white: the purchase amount must be neutral/high-contrast.
                  Gold color communicates branding; white communicates transaction value.
                  These are different cognitive frames. Prices are always white in
                  professional commerce (Stripe, Airbnb, Ticketmaster). */}
              <div className="mb-5 pb-5 border-b border-white/[0.06]">
                <p className={`${SECTION_LABEL} mb-2`}>Resale price</p>
                <span
                  className="block font-semibold text-white tabular-nums leading-none"
                  style={{ fontSize: "2rem", letterSpacing: "-0.03em" }}
                >
                  {formatPrice(ticket.resalePrice, ticket.currency)}
                </span>
                <div className="flex items-center gap-2 mt-2 flex-wrap">
                  <span className="text-xs text-zinc-600 line-through tabular-nums">
                    {formatPrice(ticket.originalPrice, ticket.currency)}
                  </span>
                  <span className="text-xs text-zinc-700">face value</span>
                  {savings > 0 && (
                    <span className="text-[10px] font-semibold text-emerald-400/80 bg-emerald-400/[0.08] border border-emerald-400/[0.12] px-1.5 py-0.5 rounded">
                      −{formatPrice(savings, ticket.currency)}
                    </span>
                  )}
                </div>
              </div>

              {/* Availability — no animate-pulse: perpetual motion in the purchase
                  decision zone continuously interrupts focused attention. Color alone
                  communicates state. Animation adds no information, only distraction. */}
              <div className="mb-5">
                {available > 0 ? (
                  <div className="flex items-center gap-2">
                    <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${isLow ? "bg-amber-400" : "bg-emerald-500/60"}`} />
                    <span className={`text-xs font-medium ${isLow ? "text-amber-400/90" : "text-emerald-500/70"}`}>
                      {available === 1 ? "Last ticket available" : `${available} tickets available`}
                    </span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full shrink-0 bg-zinc-700" />
                    <span className="text-xs text-zinc-600">Sold out</span>
                  </div>
                )}
              </div>

              {/* Quantity */}
              {available > 1 && (
                <div className="mb-5 pb-5 border-b border-white/[0.06]">
                  <p className={`${SECTION_LABEL} mb-3`}>Quantity</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center border border-white/[0.09] rounded-lg overflow-hidden bg-white/[0.02]">
                      <button
                        onClick={() => setQty((q) => Math.max(1, q - 1))}
                        className="w-9 h-9 flex items-center justify-center text-zinc-500 hover:text-white hover:bg-white/[0.06] transition-colors border-r border-white/[0.07]"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="w-10 text-center text-sm font-medium text-white tabular-nums">{qty}</span>
                      <button
                        onClick={() => setQty((q) => Math.min(available, q + 1))}
                        className="w-9 h-9 flex items-center justify-center text-zinc-500 hover:text-white hover:bg-white/[0.06] transition-colors border-l border-white/[0.07]"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                    {qty > 1 && (
                      <p className="text-sm">
                        <span className="text-white font-semibold tabular-nums">
                          {formatPrice(ticket.resalePrice * qty, ticket.currency)}
                        </span>
                        <span className="text-zinc-700 text-xs ml-1">total</span>
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Primary CTA */}
              <Button
                variant={added ? "secondary" : "primary"}
                size="lg"
                className="w-full mb-3"
                disabled={available === 0}
                onClick={handleAddToCart}
                leftIcon={added ? <Check className="w-4 h-4" /> : <ShoppingCart className="w-4 h-4" />}
              >
                {available === 0 ? "Sold Out" : added ? "Added to Cart" : "Add to Cart"}
              </Button>

              {/* Secondary CTA — plain text link, not a button.
                  Two visually weighted CTAs produce decision paralysis.
                  The secondary action must be unmistakably subordinate
                  to prevent "which one is right?" cognitive load. */}
              <Link
                href="/checkout"
                className="block text-center py-2 text-xs text-zinc-600 hover:text-zinc-300 transition-colors"
              >
                Or checkout now
              </Link>

              {/* Trust signals — zinc-500: must be readable.
                  At zinc-700, these signals are effectively invisible.
                  An unreadable trust signal provides zero confidence reduction.
                  The cost of misplaced anxiety at checkout is cart abandonment. */}
              <div className="mt-5 pt-4 border-t border-white/[0.05] space-y-2">
                <div className="flex items-center gap-2.5 text-zinc-500">
                  <Shield className="w-3.5 h-3.5 shrink-0" />
                  <span className="text-xs">Secure payment via Stripe</span>
                </div>
                <div className="flex items-center gap-2.5 text-zinc-500">
                  <Clock className="w-3.5 h-3.5 shrink-0" />
                  <span className="text-xs">Name transfer within 3–5 business days</span>
                </div>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </div>
  );
}
