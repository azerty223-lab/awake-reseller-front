"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft, Check, ShoppingCart, Shield,
  Truck, Edit3, Tag, Clock, Minus, Plus,
  BadgeCheck, RefreshCw, UserCheck, Lock, AlertTriangle,
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

const SECTION_LABEL = "text-[10px] font-medium text-zinc-500 uppercase tracking-widest mb-3";

interface TicketDetailPageProps {
  ticket: Ticket;
}

const BUYER_PROTECTION = [
  {
    Icon: BadgeCheck,
    title: "Sourced from Awakenings.nl",
    body: "Every ticket on this platform was originally purchased from the official Awakenings box office — not via third-party channels.",
  },
  {
    Icon: Shield,
    title: "Secured by Stripe",
    body: "Your payment is encrypted and processed by Stripe. Card details are never stored on our servers.",
  },
  {
    Icon: UserCheck,
    title: "Seller payout held until delivery",
    body: "The seller doesn't receive their payout until your ticket is confirmed delivered or transferred to your name.",
  },
  {
    Icon: RefreshCw,
    title: "Full refund if the event is cancelled",
    body: "If Awakenings 2026 is cancelled by the organiser, you receive a full refund automatically.",
  },
] as const;

export function TicketDetailPage({ ticket }: TicketDetailPageProps) {
  const addItem  = useCartStore((s) => s.addItem);
  const items    = useCartStore((s) => s.items);
  const [added, setAdded] = useState(false);
  const [qty, setQty]     = useState(1);

  const inCart    = !!items.find((i) => i.ticketId === ticket.id);
  const available = ticket.quantity - ticket.sold;
  const savings   = ticket.originalPrice - ticket.resalePrice;
  const isLow     = available > 0 && available <= 3;
  const isAvail   = available > 0;
  const isNameTransfer = ticket.deliveryMethod === DeliveryMethod.NAME_CHANGE;

  const handleAddToCart = () => {
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
      quantity:       qty,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#030305] py-10 px-4">
      <div className="max-w-5xl mx-auto">

        <Link
          href="/tickets"
          className="inline-flex items-center gap-1.5 text-xs text-zinc-600 hover:text-zinc-300 transition-colors mb-8 group"
        >
          <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" aria-hidden="true" />
          All tickets
        </Link>

        {/* On mobile the grid stacks: purchase panel first, content below.
            On desktop: content left, sticky sidebar right. */}
        <div className="grid md:grid-cols-[1fr_348px] gap-10 items-start">

          {/* ── Left: content (order-2 on mobile, order-1 on desktop) ── */}
          <motion.div
            className="order-2 md:order-1"
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
                <p className="flex items-center gap-1.5 text-zinc-500 text-sm mt-1.5">
                  <Clock className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                  {ticket.dayLabel}
                </p>
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
                        <div className="w-4 h-4 rounded-full bg-[#06B6D4]/10 border border-[#06B6D4]/20 flex items-center justify-center shrink-0 mt-0.5">
                          <Check className="w-2.5 h-2.5 text-[#06B6D4]/70" aria-hidden="true" />
                        </div>
                        <span className="text-sm text-zinc-400">{item}</span>
                      </li>
                    ))}
                  </ul>
                </section>
              </>
            )}

            {/* Delivery & Transfer */}
            <div className="h-px bg-white/[0.06] mb-8" />
            <section className="mb-8">
              <h2 className={SECTION_LABEL}>Delivery &amp; Transfer</h2>
              <div
                className="flex items-start gap-3 rounded-xl p-4"
                style={{
                  background: isNameTransfer ? "rgba(245,158,11,0.04)" : "rgba(255,255,255,0.02)",
                  border: isNameTransfer ? "1px solid rgba(245,158,11,0.14)" : "1px solid rgba(255,255,255,0.06)",
                }}
              >
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5"
                  style={{
                    background: isNameTransfer ? "rgba(245,158,11,0.10)" : "rgba(6,182,212,0.08)",
                    border: isNameTransfer ? "1px solid rgba(245,158,11,0.20)" : "1px solid rgba(6,182,212,0.15)",
                  }}
                >
                  {ticket.deliveryMethod === DeliveryMethod.NAME_CHANGE && (
                    <Edit3 className="w-3.5 h-3.5 text-amber-400" aria-hidden="true" />
                  )}
                  {ticket.deliveryMethod === DeliveryMethod.DIGITAL && (
                    <Tag className="w-3.5 h-3.5 text-[#06B6D4]/80" aria-hidden="true" />
                  )}
                  {ticket.deliveryMethod === DeliveryMethod.PHYSICAL && (
                    <Truck className="w-3.5 h-3.5 text-zinc-400" aria-hidden="true" />
                  )}
                </div>
                <div className="flex-1">
                  <p
                    className="text-sm font-semibold mb-1.5"
                    style={{ color: isNameTransfer ? "rgba(245,158,11,0.90)" : "rgba(237,233,225,0.85)" }}
                  >
                    {ticket.deliveryMethod === DeliveryMethod.NAME_CHANGE && "Official Name Transfer"}
                    {ticket.deliveryMethod === DeliveryMethod.DIGITAL && "Digital Delivery"}
                    {ticket.deliveryMethod === DeliveryMethod.PHYSICAL && "Physical Delivery"}
                  </p>
                  <p className="text-xs text-zinc-500 leading-relaxed">
                    {ticket.deliveryMethod === DeliveryMethod.NAME_CHANGE &&
                      "We manage the official name change directly with Awakenings.nl. After payment, we initiate the transfer process. Your personalised e-ticket arrives by July 8, 2026 — fully registered in your name and gate-ready."}
                    {ticket.deliveryMethod === DeliveryMethod.DIGITAL &&
                      "Your e-ticket will be sent to your email address immediately after payment confirmation. No transfer required — the ticket is already prepared and ready to use."}
                    {ticket.deliveryMethod === DeliveryMethod.PHYSICAL &&
                      "Ticket will be shipped to your specified address. Allow 3–7 business days for delivery."}
                  </p>
                  {isNameTransfer && (
                    <p className="flex items-center gap-1.5 mt-2.5" style={{ fontSize: "10.5px", color: "rgba(245,158,11,0.60)", fontWeight: 500 }}>
                      <Lock className="w-3 h-3 shrink-0" strokeWidth={2} aria-hidden="true" />
                      Your name only — non-transferable after Awakenings registers it
                    </p>
                  )}
                </div>
              </div>
            </section>

            {/* Buyer Protection */}
            <div className="h-px bg-white/[0.06] mb-8" />
            <section>
              <h2 className={SECTION_LABEL}>Buyer protection</h2>
              <div className="space-y-4">
                {BUYER_PROTECTION.map(({ Icon, title, body }) => (
                  <div key={title} className="flex items-start gap-3">
                    <div className="w-7 h-7 rounded-lg bg-[#06B6D4]/[0.07] border border-[#06B6D4]/[0.12] flex items-center justify-center shrink-0 mt-0.5">
                      <Icon className="w-3.5 h-3.5 text-[#06B6D4]/70" strokeWidth={1.75} aria-hidden="true" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-zinc-300 mb-0.5">{title}</p>
                      <p className="text-xs text-zinc-600 leading-relaxed">{body}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </motion.div>

          {/* ── Right: purchase panel (order-1 on mobile, order-2 on desktop) ── */}
          <motion.div
            className="order-1 md:order-2"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.06, duration: 0.28 }}
          >
            <div
              className="rounded-xl p-5 md:sticky md:top-24"
              style={{ background: "#0F1013", border: "1px solid rgba(255,255,255,0.09)" }}
            >

              {/* Price block */}
              <div className="mb-5 pb-5 border-b border-white/[0.06]">
                <p className={`${SECTION_LABEL} mb-2`}>Resale price</p>
                <span
                  className="block font-bold text-white tabular-nums leading-none"
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
                    <span
                      className="text-[10px] font-semibold tabular-nums px-1.5 py-0.5 rounded"
                      style={{
                        color: "rgba(52,211,153,0.85)",
                        background: "rgba(52,211,153,0.08)",
                        border: "1px solid rgba(52,211,153,0.15)",
                      }}
                    >
                      −{formatPrice(savings, ticket.currency)}
                    </span>
                  )}
                </div>
              </div>

              {/* Availability */}
              <div className="mb-5">
                {isAvail ? (
                  isLow ? (
                    <div
                      className="flex items-center gap-2 rounded-lg px-3 py-2"
                      style={{ background: "rgba(6,182,212,0.07)", border: "1px solid rgba(6,182,212,0.20)" }}
                    >
                      <AlertTriangle className="w-3.5 h-3.5 shrink-0" style={{ color: "rgba(6,182,212,0.90)" }} strokeWidth={2} aria-hidden="true" />
                      <span className="text-xs font-medium" style={{ color: "rgba(6,182,212,0.90)" }}>
                        {available === 1 ? "Last ticket — secure yours now" : `Only ${available} tickets remaining`}
                      </span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full shrink-0 bg-emerald-500/60" aria-hidden="true" />
                      <span className="text-xs font-medium text-emerald-500/70">
                        {available} tickets available
                      </span>
                    </div>
                  )
                ) : (
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full shrink-0 bg-zinc-700" aria-hidden="true" />
                    <span className="text-xs text-zinc-600">Sold out</span>
                  </div>
                )}
              </div>

              {/* Quantity selector */}
              {isAvail && available > 1 && (
                <div className="mb-5 pb-5 border-b border-white/[0.06]">
                  <p className={`${SECTION_LABEL} mb-3`}>Quantity</p>
                  <div className="flex items-center justify-between">
                    <div
                      className="flex items-center rounded-lg overflow-hidden"
                      style={{ border: "1px solid rgba(255,255,255,0.09)", background: "rgba(255,255,255,0.02)" }}
                    >
                      <button
                        onClick={() => setQty((q) => Math.max(1, q - 1))}
                        className="w-9 h-9 flex items-center justify-center text-zinc-500 hover:text-white hover:bg-white/[0.06] transition-colors cursor-pointer"
                        style={{ borderRight: "1px solid rgba(255,255,255,0.07)" }}
                        aria-label="Decrease quantity"
                      >
                        <Minus className="w-3 h-3" aria-hidden="true" />
                      </button>
                      <span className="w-10 text-center text-sm font-medium text-white tabular-nums" aria-live="polite">
                        {qty}
                      </span>
                      <button
                        onClick={() => setQty((q) => Math.min(available, q + 1))}
                        className="w-9 h-9 flex items-center justify-center text-zinc-500 hover:text-white hover:bg-white/[0.06] transition-colors cursor-pointer"
                        style={{ borderLeft: "1px solid rgba(255,255,255,0.07)" }}
                        aria-label="Increase quantity"
                      >
                        <Plus className="w-3 h-3" aria-hidden="true" />
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
                disabled={!isAvail}
                onClick={handleAddToCart}
                leftIcon={added ? <Check className="w-4 h-4" aria-hidden="true" /> : <ShoppingCart className="w-4 h-4" aria-hidden="true" />}
              >
                {!isAvail ? "Sold Out" : added ? "Added to Cart" : inCart ? "Add More" : "Add to Cart"}
              </Button>

              {/* Secondary CTA — visually subordinate to prevent decision paralysis */}
              <Link
                href="/checkout"
                className="block text-center py-2 text-xs text-zinc-600 hover:text-zinc-300 transition-colors"
              >
                Or checkout now →
              </Link>

              {/* Trust signals — specific, not vague */}
              <div className="mt-5 pt-4 border-t border-white/[0.05] space-y-3">
                <div className="flex items-start gap-2.5">
                  <BadgeCheck className="w-3.5 h-3.5 shrink-0 text-[#06B6D4]/80 mt-0.5" strokeWidth={1.75} aria-hidden="true" />
                  <span className="text-xs text-zinc-500 leading-relaxed">
                    Purchased directly from <strong className="text-zinc-400 font-medium">Awakenings.nl</strong>
                  </span>
                </div>
                <div className="flex items-start gap-2.5">
                  <Clock className="w-3.5 h-3.5 shrink-0 text-zinc-600 mt-0.5" aria-hidden="true" />
                  <span className="text-xs text-zinc-500 leading-relaxed">
                    E-ticket delivered by <strong className="text-zinc-300 font-semibold">July 8, 2026</strong>
                  </span>
                </div>
                <div className="flex items-start gap-2.5">
                  <Shield className="w-3.5 h-3.5 shrink-0 text-zinc-600 mt-0.5" aria-hidden="true" />
                  <span className="text-xs text-zinc-500 leading-relaxed">
                    Secure payment via <strong className="text-zinc-400 font-medium">Stripe</strong>
                  </span>
                </div>
                <div className="flex items-start gap-2.5">
                  <UserCheck className="w-3.5 h-3.5 shrink-0 text-zinc-600 mt-0.5" aria-hidden="true" />
                  <span className="text-xs text-zinc-500 leading-relaxed">
                    Seller payout held until your ticket is delivered
                  </span>
                </div>
                <div className="flex items-start gap-2.5">
                  <RefreshCw className="w-3.5 h-3.5 shrink-0 text-zinc-600 mt-0.5" aria-hidden="true" />
                  <span className="text-xs text-zinc-500 leading-relaxed">
                    Full refund if the event is cancelled
                  </span>
                </div>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </div>
  );
}
