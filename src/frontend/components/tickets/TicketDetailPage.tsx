"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Check, ShoppingCart, Shield, Truck, Edit3, Tag, Clock } from "lucide-react";
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
    <div className="min-h-screen bg-[#0a0a0a] py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Back */}
        <Link
          href="/tickets"
          className="inline-flex items-center gap-2 text-zinc-500 hover:text-white transition-colors text-sm mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to tickets
        </Link>

        <div className="grid md:grid-cols-5 gap-8">
          {/* Main content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="md:col-span-3 space-y-6"
          >
            {/* Header */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Badge variant={getCategoryBadgeVariant(ticket.category)}>
                  {ticket.category.replace("_", " ")}
                </Badge>
                {ticket.isFeatured && <Badge variant="gold">Featured</Badge>}
              </div>
              <h1 className="font-[var(--font-playfair)] text-3xl sm:text-4xl font-bold text-white mb-2">
                {ticket.name}
              </h1>
              {ticket.dayLabel && (
                <p className="text-zinc-400 text-lg">{ticket.dayLabel}</p>
              )}
            </div>

            {/* Description */}
            <div className="bg-[#111111] border border-[#2a2a2a] rounded-2xl p-6">
              <h2 className="text-white font-semibold mb-3">About this ticket</h2>
              <p className="text-zinc-400 text-sm leading-relaxed">{ticket.description}</p>
            </div>

            {/* Includes */}
            {ticket.includes.length > 0 && (
              <div className="bg-[#111111] border border-[#2a2a2a] rounded-2xl p-6">
                <h2 className="text-white font-semibold mb-4">What&apos;s included</h2>
                <ul className="space-y-3">
                  {ticket.includes.map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-zinc-400">
                      <div className="w-5 h-5 rounded-full bg-[#c9a84c]/10 border border-[#c9a84c]/30 flex items-center justify-center shrink-0 mt-0.5">
                        <Check className="w-3 h-3 text-[#c9a84c]" />
                      </div>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Delivery info */}
            <div className="bg-[#111111] border border-[#2a2a2a] rounded-2xl p-6">
              <h2 className="text-white font-semibold mb-4">Delivery & Transfer</h2>
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-lg bg-[#c9a84c]/10 flex items-center justify-center shrink-0">
                  {ticket.deliveryMethod === DeliveryMethod.NAME_CHANGE && <Edit3 className="w-4 h-4 text-[#c9a84c]" />}
                  {ticket.deliveryMethod === DeliveryMethod.DIGITAL && <Tag className="w-4 h-4 text-[#c9a84c]" />}
                  {ticket.deliveryMethod === DeliveryMethod.PHYSICAL && <Truck className="w-4 h-4 text-[#c9a84c]" />}
                </div>
                <div>
                  <p className="text-white font-medium text-sm">
                    {ticket.deliveryMethod === DeliveryMethod.NAME_CHANGE && "Name Transfer Service"}
                    {ticket.deliveryMethod === DeliveryMethod.DIGITAL && "Digital Delivery"}
                    {ticket.deliveryMethod === DeliveryMethod.PHYSICAL && "Physical Delivery"}
                  </p>
                  <p className="text-zinc-500 text-xs mt-1 leading-relaxed">
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

          {/* Sidebar: purchase */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="md:col-span-2 space-y-4"
          >
            <div className="bg-[#111111] border border-[#2a2a2a] rounded-2xl p-6 sticky top-24">
              {/* Price */}
              <div className="mb-5">
                <p className="text-zinc-500 text-xs uppercase tracking-wider mb-1">Resale Price</p>
                <p className="text-[#c9a84c] text-4xl font-bold">
                  {formatPrice(ticket.resalePrice, ticket.currency)}
                </p>
                <p className="text-zinc-600 text-sm mt-1">
                  Original:{" "}
                  <span className="line-through">{formatPrice(ticket.originalPrice, ticket.currency)}</span>
                </p>
              </div>

              {/* Availability */}
              <div className="mb-5 pb-5 border-b border-[#2a2a2a]">
                {available > 0 ? (
                  <div className="flex items-center gap-2 text-emerald-400 text-sm">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    {available === 1 ? "Last ticket available" : `${available} tickets available`}
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-zinc-600 text-sm">
                    <span className="w-2 h-2 rounded-full bg-zinc-600" />
                    Sold out
                  </div>
                )}
              </div>

              {/* Quantity */}
              {available > 1 && (
                <div className="mb-5">
                  <p className="text-white text-sm font-medium mb-2">Quantity</p>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 bg-[#0a0a0a] rounded-lg border border-[#2a2a2a] p-1">
                      <button
                        onClick={() => setQty((q) => Math.max(1, q - 1))}
                        className="w-8 h-8 rounded flex items-center justify-center text-zinc-400 hover:text-white hover:bg-white/10 transition-all"
                      >
                        −
                      </button>
                      <span className="text-white w-6 text-center tabular-nums">{qty}</span>
                      <button
                        onClick={() => setQty((q) => Math.min(available, q + 1))}
                        className="w-8 h-8 rounded flex items-center justify-center text-zinc-400 hover:text-white hover:bg-white/10 transition-all"
                      >
                        +
                      </button>
                    </div>
                    {qty > 1 && (
                      <p className="text-zinc-500 text-sm">
                        = <span className="text-[#c9a84c] font-semibold">{formatPrice(ticket.resalePrice * qty, ticket.currency)}</span>
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
                leftIcon={added ? <Check className="w-5 h-5" /> : <ShoppingCart className="w-5 h-5" />}
              >
                {available === 0 ? "Sold Out" : added ? "Added to Cart!" : "Add to Cart"}
              </Button>

              <Link
                href="/checkout"
                className="block text-center py-3 rounded-xl border border-[#2a2a2a] text-zinc-400 text-sm font-medium hover:border-[#c9a84c]/40 hover:text-[#c9a84c] transition-all"
              >
                Checkout now
              </Link>

              {/* Trust */}
              <div className="mt-4 space-y-2 text-zinc-600 text-xs">
                <div className="flex items-center gap-2">
                  <Shield className="w-3.5 h-3.5 shrink-0" />
                  <span>Secure payment via Stripe</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5 shrink-0" />
                  <span>Name transfer: 3–5 business days</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
