"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Check, ShoppingCart, Shield, Truck, Edit3, Tag, Clock, Minus, Plus } from "lucide-react";
import { Badge } from "@/frontend/components/ui/Badge";
import { Button } from "@/frontend/components/ui/Button";
import { useCartStore } from "@/frontend/store/cart";
import { formatPrice } from "@/backend/lib/utils";
import { DeliveryMethod, TicketCategory, type Ticket } from "@/frontend/types/tickets";
import { motion } from "framer-motion";

function getCategoryBadgeVariant(category: TicketCategory): "gold" | "info" | "success" | "purple" | "rose" | "default" {
  switch (category) {
    case TicketCategory.WEEKEND: return "gold";
    case TicketCategory.SATURDAY:
    case TicketCategory.SUNDAY: return "info";
    case TicketCategory.CAMPING:
    case TicketCategory.COMFORT_CAMPING:
    case TicketCategory.CAR_CAMPING: return "success";
    case TicketCategory.PREMIUM: return "purple";
    case TicketCategory.ACCOMMODATION: return "rose";
    default: return "default";
  }
}

interface TicketDetailPageProps {
  ticket: Ticket;
}

export function TicketDetailPage({ ticket }: TicketDetailPageProps) {
  const addItem = useCartStore((s) => s.addItem);
  const [added, setAdded] = useState(false);
  const [qty, setQty] = useState(1);

  const available = ticket.quantity - ticket.sold;
  const savings = ticket.originalPrice - ticket.resalePrice;

  const handleAddToCart = () => {
    addItem({
      ticketId: ticket.id,
      name: ticket.name,
      slug: ticket.slug,
      resalePrice: ticket.resalePrice,
      currency: ticket.currency,
      maxQuantity: available,
      category: ticket.category,
      dayLabel: ticket.dayLabel,
      deliveryMethod: ticket.deliveryMethod,
      quantity: qty,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] py-10 px-4">
      <div className="max-w-4xl mx-auto">

        {/* Back nav */}
        <Link
          href="/tickets"
          className="inline-flex items-center gap-2 text-zinc-500 hover:text-white transition-colors text-sm mb-10 group"
        >
          <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
          Back to tickets
        </Link>

        <div className="grid md:grid-cols-5 gap-8 items-start">

          {/* Left column: details */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="md:col-span-3 space-y-5"
          >
            {/* Header */}
            <div className="pb-5 border-b border-white/[0.06]">
              <div className="flex items-center gap-2 mb-4">
                <Badge variant={getCategoryBadgeVariant(ticket.category)}>
                  {ticket.category.replace(/_/g, " ")}
                </Badge>
                {ticket.isFeatured && <Badge variant="gold">Featured</Badge>}
              </div>
              <h1
                className="font-[var(--font-playfair)] font-bold text-white mb-2"
                style={{ fontSize: "clamp(1.75rem, 3.5vw, 2.5rem)", letterSpacing: "-0.02em", lineHeight: 1.15 }}
              >
                {ticket.name}
              </h1>
              {ticket.dayLabel && (
                <p className="text-zinc-400 text-base mt-1">{ticket.dayLabel}</p>
              )}
            </div>

            {/* Description */}
            <div className="bg-white/[0.02] border border-white/[0.07] rounded-2xl p-6">
              <h2 className="text-[10px] uppercase tracking-[0.14em] text-zinc-500 font-semibold mb-3">
                About this ticket
              </h2>
              <p className="text-zinc-400 text-sm leading-relaxed">{ticket.description}</p>
            </div>

            {/* What's included */}
            {ticket.includes.length > 0 && (
              <div className="bg-white/[0.02] border border-white/[0.07] rounded-2xl p-6">
                <h2 className="text-[10px] uppercase tracking-[0.14em] text-zinc-500 font-semibold mb-4">
                  What&apos;s included
                </h2>
                <ul className="space-y-3">
                  {ticket.includes.map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-zinc-400">
                      <div className="w-5 h-5 rounded-full bg-[#c9a84c]/10 border border-[#c9a84c]/20 flex items-center justify-center shrink-0 mt-0.5">
                        <Check className="w-3 h-3 text-[#c9a84c]" />
                      </div>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Delivery info */}
            <div className="bg-white/[0.02] border border-white/[0.07] rounded-2xl p-6">
              <h2 className="text-[10px] uppercase tracking-[0.14em] text-zinc-500 font-semibold mb-4">
                Delivery &amp; Transfer
              </h2>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-[#c9a84c]/10 border border-[#c9a84c]/15 flex items-center justify-center shrink-0">
                  {ticket.deliveryMethod === DeliveryMethod.NAME_CHANGE && <Edit3 className="w-4 h-4 text-[#c9a84c]" />}
                  {ticket.deliveryMethod === DeliveryMethod.DIGITAL && <Tag className="w-4 h-4 text-[#c9a84c]" />}
                  {ticket.deliveryMethod === DeliveryMethod.PHYSICAL && <Truck className="w-4 h-4 text-[#c9a84c]" />}
                </div>
                <div>
                  <p className="text-white font-medium text-sm mb-1">
                    {ticket.deliveryMethod === DeliveryMethod.NAME_CHANGE && "Name Transfer Service"}
                    {ticket.deliveryMethod === DeliveryMethod.DIGITAL && "Digital Delivery"}
                    {ticket.deliveryMethod === DeliveryMethod.PHYSICAL && "Physical Delivery"}
                  </p>
                  <p className="text-zinc-500 text-xs leading-relaxed">
                    {ticket.deliveryMethod === DeliveryMethod.NAME_CHANGE &&
                      "We handle the official name change with Awakenings. After payment, we initiate the transfer process. Your personalized e-ticket arrives within 3–5 business days."}
                    {ticket.deliveryMethod === DeliveryMethod.DIGITAL &&
                      "Your e-ticket will be sent to your email address immediately after payment confirmation."}
                    {ticket.deliveryMethod === DeliveryMethod.PHYSICAL &&
                      "Ticket will be shipped to your specified address. Allow 3–7 business days."}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right column: purchase sidebar */}
          <motion.div
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.08 }}
            className="md:col-span-2"
          >
            <div className="bg-[#0D0D0F] border border-white/[0.09] rounded-2xl p-6 sticky top-24">

              {/* Price */}
              <div className="mb-5 pb-5 border-b border-white/[0.06]">
                <p className="text-[10px] uppercase tracking-[0.14em] text-zinc-600 mb-2.5">Resale price</p>
                <div className="flex items-baseline gap-3">
                  <span
                    className="font-bold text-[#c9a84c] tabular-nums"
                    style={{ fontSize: "2.25rem", letterSpacing: "-0.03em", lineHeight: 1 }}
                  >
                    {formatPrice(ticket.resalePrice, ticket.currency)}
                  </span>
                </div>
                <div className="flex items-center flex-wrap gap-2 mt-2">
                  <span className="text-zinc-600 text-sm line-through tabular-nums">
                    {formatPrice(ticket.originalPrice, ticket.currency)}
                  </span>
                  <span className="text-zinc-700 text-xs">face value</span>
                  {savings > 0 && (
                    <span className="text-[10px] font-semibold text-emerald-400 bg-emerald-400/10 border border-emerald-400/15 px-1.5 py-0.5 rounded-md">
                      -{formatPrice(savings, ticket.currency)}
                    </span>
                  )}
                </div>
              </div>

              {/* Availability */}
              <div className="mb-5">
                {available > 0 ? (
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full shrink-0 ${available <= 3 ? "bg-amber-400 animate-pulse" : "bg-emerald-400 animate-pulse"}`} />
                    <span className={`text-sm font-medium ${available <= 3 ? "text-amber-400/90" : "text-emerald-400"}`}>
                      {available === 1 ? "Last ticket available" : `${available} tickets available`}
                    </span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full shrink-0 bg-zinc-700" />
                    <span className="text-zinc-500 text-sm">Sold out</span>
                  </div>
                )}
              </div>

              {/* Quantity selector */}
              {available > 1 && (
                <div className="mb-5 pb-5 border-b border-white/[0.06]">
                  <p className="text-xs text-zinc-500 uppercase tracking-wider font-medium mb-3">Quantity</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center border border-white/[0.1] rounded-xl overflow-hidden bg-white/[0.03]">
                      <button
                        onClick={() => setQty((q) => Math.max(1, q - 1))}
                        className="w-10 h-10 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-white/[0.07] transition-all border-r border-white/[0.08]"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="w-12 text-center text-white font-semibold tabular-nums text-sm">{qty}</span>
                      <button
                        onClick={() => setQty((q) => Math.min(available, q + 1))}
                        className="w-10 h-10 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-white/[0.07] transition-all border-l border-white/[0.08]"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    {qty > 1 && (
                      <p className="text-sm">
                        <span className="text-white font-semibold">{formatPrice(ticket.resalePrice * qty, ticket.currency)}</span>
                        <span className="text-zinc-600 ml-1 text-xs">total</span>
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* CTA */}
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

              <Link
                href="/checkout"
                className="block text-center py-2.5 rounded-xl border border-white/[0.08] text-zinc-400 text-sm font-medium hover:border-[#c9a84c]/35 hover:text-[#c9a84c] transition-all duration-200"
              >
                Checkout now
              </Link>

              {/* Trust signals */}
              <div className="mt-5 pt-4 border-t border-white/[0.05] space-y-2.5">
                <div className="flex items-center gap-2.5 text-zinc-600">
                  <div className="w-5 h-5 flex items-center justify-center shrink-0">
                    <Shield className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-xs">Secure payment via Stripe</span>
                </div>
                <div className="flex items-center gap-2.5 text-zinc-600">
                  <div className="w-5 h-5 flex items-center justify-center shrink-0">
                    <Clock className="w-3.5 h-3.5" />
                  </div>
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
