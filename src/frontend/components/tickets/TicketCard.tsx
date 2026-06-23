"use client";

import Link from "next/link";
import { ShoppingCart, Eye, Truck, Edit3, Tag } from "lucide-react";
import { Badge } from "@/frontend/components/ui/Badge";
import { Button } from "@/frontend/components/ui/Button";
import { useCartStore } from "@/frontend/store/cart";
import { formatPrice } from "@/backend/lib/utils";
import {
  DeliveryMethod,
  PersonalizationStatus,
  TicketCategory,
  type Ticket,
} from "@/frontend/types/tickets";
import { motion } from "framer-motion";
import { useState } from "react";

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

function getCategoryLabel(category: TicketCategory): string {
  return category.replace("_", " ");
}

function getDeliveryIcon(method: DeliveryMethod) {
  switch (method) {
    case DeliveryMethod.DIGITAL: return <Tag className="w-3 h-3" />;
    case DeliveryMethod.PHYSICAL: return <Truck className="w-3 h-3" />;
    case DeliveryMethod.NAME_CHANGE: return <Edit3 className="w-3 h-3" />;
    default: return <Tag className="w-3 h-3" />;
  }
}

function getDeliveryLabel(method: DeliveryMethod): string {
  switch (method) {
    case DeliveryMethod.DIGITAL: return "Digital";
    case DeliveryMethod.PHYSICAL: return "Physical";
    case DeliveryMethod.NAME_CHANGE: return "Name transfer";
    default: return "Digital";
  }
}

interface TicketCardProps {
  ticket: Ticket;
}

export function TicketCard({ ticket }: TicketCardProps) {
  const addItem = useCartStore((s) => s.addItem);
  const items = useCartStore((s) => s.items);
  const [added, setAdded] = useState(false);

  const inCart = items.find((i) => i.ticketId === ticket.id);
  const available = ticket.quantity - ticket.sold;
  const isAvailable = available > 0 && ticket.isVisible;

  const handleAddToCart = () => {
    if (!isAvailable) return;
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
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className="group relative bg-[#111111] border border-[#2a2a2a] rounded-2xl overflow-hidden hover:border-[#c9a84c]/40 transition-colors flex flex-col"
    >
      {/* Featured shimmer top border */}
      {ticket.isFeatured && (
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-[#c9a84c] to-transparent" />
      )}

      <div className="p-5 flex-1 flex flex-col gap-3">
        {/* Top row: category + delivery */}
        <div className="flex items-center justify-between gap-2">
          <Badge variant={getCategoryBadgeVariant(ticket.category)} size="sm">
            {getCategoryLabel(ticket.category)}
          </Badge>
          <span className="flex items-center gap-1 text-zinc-600 text-[10px]">
            {getDeliveryIcon(ticket.deliveryMethod)}
            {getDeliveryLabel(ticket.deliveryMethod)}
          </span>
        </div>

        {/* Name */}
        <div>
          <h3 className="text-white font-semibold text-base leading-tight group-hover:text-[#c9a84c] transition-colors">
            {ticket.name}
          </h3>
          {ticket.dayLabel && (
            <p className="text-zinc-500 text-xs mt-1">{ticket.dayLabel}</p>
          )}
        </div>

        {/* Price block */}
        <div className="flex-1">
          <div className="flex items-end gap-2">
            <span className="text-[#c9a84c] font-bold text-2xl">
              {formatPrice(ticket.resalePrice, ticket.currency)}
            </span>
          </div>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-zinc-600 text-xs line-through">
              {formatPrice(ticket.originalPrice, ticket.currency)}
            </span>
            <span className="text-xs text-zinc-500">orig.</span>
          </div>
        </div>

        {/* Availability + personalization */}
        <div className="flex items-center gap-2 flex-wrap">
          {isAvailable ? (
            <span className="flex items-center gap-1.5 text-emerald-400 text-xs font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              {available === 1 ? "Last one" : `${available} available`}
            </span>
          ) : (
            <span className="flex items-center gap-1.5 text-zinc-600 text-xs font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-zinc-600" />
              Sold out
            </span>
          )}
          {ticket.personalizationStatus === PersonalizationStatus.COMPLETED && (
            <span className="flex items-center gap-1 text-emerald-400 text-[10px]">
              ✓ Transfer ready
            </span>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="px-5 pb-5 flex gap-2">
        <Button
          variant={added ? "secondary" : "primary"}
          size="sm"
          className="flex-1"
          disabled={!isAvailable}
          onClick={handleAddToCart}
          leftIcon={<ShoppingCart className="w-3.5 h-3.5" />}
        >
          {added ? "Added!" : inCart ? "In cart" : "Add to Cart"}
        </Button>
        <Link
          href={`/tickets/${ticket.slug}`}
          className="flex items-center justify-center w-9 h-9 rounded-lg border border-[#2a2a2a] text-zinc-500 hover:text-[#c9a84c] hover:border-[#c9a84c]/40 transition-all"
          aria-label="View details"
        >
          <Eye className="w-4 h-4" />
        </Link>
      </div>
    </motion.div>
  );
}
