"use client";

import { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { X, ShoppingCart, Check, Truck, Edit3, Tag, Shield, Info } from "lucide-react";
import { Badge } from "@/frontend/components/ui/Badge";
import { Button } from "@/frontend/components/ui/Button";
import { useCartStore } from "@/frontend/store/cart";
import { formatPrice } from "@/backend/lib/utils";
import type { Ticket } from "@prisma/client";
import { DeliveryMethod, PersonalizationStatus, TicketCategory } from "@prisma/client";
import { motion, AnimatePresence } from "framer-motion";

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

interface TicketDetailModalProps {
  ticket: Ticket;
  open: boolean;
  onClose: () => void;
}

export function TicketDetailModal({ ticket, open, onClose }: TicketDetailModalProps) {
  const addItem = useCartStore((s) => s.addItem);
  const items = useCartStore((s) => s.items);
  const [added, setAdded] = useState(false);
  const [qty, setQty] = useState(1);

  const available = ticket.quantity - ticket.sold;
  const inCart = items.find((i) => i.ticketId === ticket.id);

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
    setTimeout(() => { setAdded(false); onClose(); }, 1500);
  };

  return (
    <Dialog.Root open={open} onOpenChange={(v) => !v && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[80]" />
        <Dialog.Content className="fixed inset-x-4 top-1/2 -translate-y-1/2 max-w-2xl mx-auto bg-[#0d0d0d] border border-[#2a2a2a] rounded-2xl z-[90] outline-none max-h-[90vh] overflow-y-auto shadow-2xl">
          {/* Header */}
          <div className="flex items-start justify-between p-6 border-b border-[#2a2a2a]">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <Badge variant={getCategoryBadgeVariant(ticket.category)}>
                  {ticket.category.replace("_", " ")}
                </Badge>
                {ticket.isFeatured && (
                  <Badge variant="gold">Featured</Badge>
                )}
              </div>
              <Dialog.Title className="text-white font-bold text-xl">
                {ticket.name}
              </Dialog.Title>
              {ticket.dayLabel && (
                <Dialog.Description className="text-zinc-500 text-sm mt-1">
                  {ticket.dayLabel}
                </Dialog.Description>
              )}
            </div>
            <Dialog.Close className="w-8 h-8 rounded-lg flex items-center justify-center text-zinc-500 hover:text-white hover:bg-white/10 transition-all ml-4 shrink-0">
              <X className="w-4 h-4" />
            </Dialog.Close>
          </div>

          <div className="p-6 space-y-6">
            {/* Price section */}
            <div className="bg-[#161616] border border-[#2a2a2a] rounded-xl p-5">
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-zinc-500 text-xs uppercase tracking-wider mb-1">Resale Price</p>
                  <p className="text-[#c9a84c] text-4xl font-bold">
                    {formatPrice(ticket.resalePrice, ticket.currency)}
                  </p>
                  <p className="text-zinc-600 text-sm mt-1">
                    Original:{" "}
                    <span className="line-through">
                      {formatPrice(ticket.originalPrice, ticket.currency)}
                    </span>
                  </p>
                </div>
                <div className="text-right">
                  {available > 0 ? (
                    <span className="flex items-center gap-2 text-emerald-400 text-sm font-medium">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                      {available === 1 ? "Last available" : `${available} left`}
                    </span>
                  ) : (
                    <span className="text-zinc-600 text-sm">Sold out</span>
                  )}
                </div>
              </div>
            </div>

            {/* Description */}
            <div>
              <h4 className="text-white font-semibold mb-3">About this ticket</h4>
              <p className="text-zinc-400 text-sm leading-relaxed">{ticket.description}</p>
            </div>

            {/* Includes */}
            {ticket.includes.length > 0 && (
              <div>
                <h4 className="text-white font-semibold mb-3">What&apos;s included</h4>
                <ul className="space-y-2">
                  {ticket.includes.map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-zinc-400">
                      <Check className="w-4 h-4 text-[#c9a84c] shrink-0 mt-0.5" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Delivery info */}
            <div className="bg-[#161616] border border-[#2a2a2a] rounded-xl p-4">
              <div className="flex items-center gap-3">
                {ticket.deliveryMethod === DeliveryMethod.NAME_CHANGE && (
                  <Edit3 className="w-5 h-5 text-[#c9a84c]" />
                )}
                {ticket.deliveryMethod === DeliveryMethod.DIGITAL && (
                  <Tag className="w-5 h-5 text-[#c9a84c]" />
                )}
                {ticket.deliveryMethod === DeliveryMethod.PHYSICAL && (
                  <Truck className="w-5 h-5 text-[#c9a84c]" />
                )}
                <div>
                  <p className="text-white text-sm font-medium">
                    {ticket.deliveryMethod === DeliveryMethod.NAME_CHANGE && "Name Transfer Required"}
                    {ticket.deliveryMethod === DeliveryMethod.DIGITAL && "Digital Delivery"}
                    {ticket.deliveryMethod === DeliveryMethod.PHYSICAL && "Physical Delivery"}
                  </p>
                  <p className="text-zinc-500 text-xs mt-0.5">
                    {ticket.deliveryMethod === DeliveryMethod.NAME_CHANGE &&
                      "We handle the name change with Awakenings. You'll receive your personalized e-ticket within 3–5 business days."}
                    {ticket.deliveryMethod === DeliveryMethod.DIGITAL &&
                      "Your e-ticket will be sent to your email immediately after payment confirmation."}
                    {ticket.deliveryMethod === DeliveryMethod.PHYSICAL &&
                      "Ticket will be shipped to your address. Allow 3–7 business days for delivery."}
                  </p>
                </div>
              </div>
            </div>

            {/* Quantity + Add to Cart */}
            {available > 0 && (
              <div className="space-y-3">
                {available > 1 && (
                  <div className="flex items-center gap-3">
                    <p className="text-white text-sm font-medium">Quantity:</p>
                    <div className="flex items-center gap-2 bg-[#161616] rounded-lg border border-[#2a2a2a] p-1">
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
                    <p className="text-zinc-500 text-sm">
                      Total: <span className="text-[#c9a84c] font-semibold">{formatPrice(ticket.resalePrice * qty, ticket.currency)}</span>
                    </p>
                  </div>
                )}

                <Button
                  variant={added ? "secondary" : "primary"}
                  size="lg"
                  className="w-full"
                  onClick={handleAddToCart}
                  leftIcon={added ? <Check className="w-5 h-5" /> : <ShoppingCart className="w-5 h-5" />}
                >
                  {added ? "Added to Cart!" : "Add to Cart"}
                </Button>
              </div>
            )}

            {/* Trust note */}
            <div className="flex items-center gap-2 text-zinc-600 text-xs">
              <Shield className="w-3.5 h-3.5" />
              <span>Secure checkout via Stripe · Money-back guarantee if event is cancelled</span>
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
