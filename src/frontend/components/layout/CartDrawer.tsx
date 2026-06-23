"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { useCartStore } from "@/frontend/store/cart";
import { formatPrice } from "@/backend/lib/utils";
import { X, Minus, Plus, ShoppingCart, Trash2, ArrowRight } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "@/frontend/components/ui/Badge";

interface CartDrawerProps {
  open: boolean;
  onClose: () => void;
}

export function CartDrawer({ open, onClose }: CartDrawerProps) {
  const { items, updateQuantity, removeItem, total, itemCount } = useCartStore();

  return (
    <Dialog.Root open={open} onOpenChange={(v) => !v && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[60] data-[state=open]:animate-[fadeIn_0.2s_ease-out]" />
        <Dialog.Content
          className="fixed right-0 top-0 h-full w-full sm:w-[420px] bg-[#0d0d0d] border-l border-[#2a2a2a] z-[70] flex flex-col shadow-2xl outline-none data-[state=open]:animate-[slideUp_0.3s_ease-out]"
          style={{ animation: open ? "slideInRight 0.3s ease-out" : undefined }}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-[#2a2a2a]">
            <div className="flex items-center gap-3">
              <ShoppingCart className="w-5 h-5 text-[#c9a84c]" />
              <Dialog.Title className="text-white font-semibold text-lg">
                Your Cart
              </Dialog.Title>
              {itemCount > 0 && (
                <span className="bg-[#c9a84c] text-black text-xs font-bold px-2 py-0.5 rounded-full">
                  {itemCount}
                </span>
              )}
            </div>
            <Dialog.Close className="w-8 h-8 rounded-lg flex items-center justify-center text-zinc-500 hover:text-white hover:bg-white/10 transition-all">
              <X className="w-4 h-4" />
            </Dialog.Close>
          </div>

          {/* Items */}
          <div className="flex-1 overflow-y-auto py-4 px-6">
            {items.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full gap-4 text-center py-20">
                <div className="w-16 h-16 rounded-full bg-[#161616] border border-[#2a2a2a] flex items-center justify-center">
                  <ShoppingCart className="w-7 h-7 text-zinc-600" />
                </div>
                <div>
                  <p className="text-white font-medium mb-1">Your cart is empty</p>
                  <p className="text-zinc-500 text-sm">Add tickets to get started</p>
                </div>
                <Dialog.Close asChild>
                  <Link
                    href="/tickets"
                    className="mt-2 inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#c9a84c] text-black text-sm font-medium hover:bg-[#e8c05a] transition-colors"
                  >
                    Browse Tickets
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </Dialog.Close>
              </div>
            ) : (
              <div className="space-y-3">
                <AnimatePresence mode="popLayout">
                  {items.map((item) => (
                    <motion.div
                      key={item.ticketId}
                      layout
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="bg-[#161616] border border-[#2a2a2a] rounded-xl p-4 hover:border-[#3a3a3a] transition-colors"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <p className="text-white font-medium text-sm truncate mb-1">
                            {item.name}
                          </p>
                          {item.dayLabel && (
                            <p className="text-zinc-500 text-xs mb-2">{item.dayLabel}</p>
                          )}
                          <p className="text-[#c9a84c] font-bold">
                            {formatPrice(item.resalePrice * item.quantity)}
                          </p>
                          {item.quantity > 1 && (
                            <p className="text-zinc-600 text-xs mt-0.5">
                              {formatPrice(item.resalePrice)} each
                            </p>
                          )}
                        </div>

                        <div className="flex items-center gap-2">
                          {/* Quantity controls */}
                          <div className="flex items-center gap-1 bg-[#0a0a0a] rounded-lg border border-[#2a2a2a] p-1">
                            <button
                              onClick={() =>
                                updateQuantity(item.ticketId, item.quantity - 1)
                              }
                              className="w-6 h-6 rounded flex items-center justify-center text-zinc-400 hover:text-white hover:bg-white/10 transition-all"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="text-white text-sm w-5 text-center tabular-nums">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() =>
                                updateQuantity(item.ticketId, item.quantity + 1)
                              }
                              disabled={item.quantity >= item.maxQuantity}
                              className="w-6 h-6 rounded flex items-center justify-center text-zinc-400 hover:text-white hover:bg-white/10 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                            >
<Plus className="w-3 h-3" />
                            </button>
                          </div>

                          {/* Remove */}
                          <button
                            onClick={() => removeItem(item.ticketId)}
                            className="w-8 h-8 rounded-lg flex items-center justify-center text-zinc-600 hover:text-red-400 hover:bg-red-400/10 transition-all"
                            aria-label="Remove item"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </div>

          {/* Footer */}
          {items.length > 0 && (
            <div className="border-t border-[#2a2a2a] px-6 py-5 space-y-4 bg-[#0a0a0a]">
              {/* Total */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-zinc-500 text-xs uppercase tracking-wider">Total</p>
                  <p className="text-white text-2xl font-bold mt-0.5">
                    {formatPrice(total)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-zinc-500 text-xs">{itemCount} ticket{itemCount !== 1 ? "s" : ""}</p>
                  <Badge variant="success" size="sm" className="mt-1">Secure checkout</Badge>
                </div>
              </div>

              {/* Checkout CTA */}
              <Dialog.Close asChild>
                <Link
                  href="/checkout"
                  className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl bg-[#c9a84c] text-black font-semibold hover:bg-[#e8c05a] active:bg-[#b89438] transition-colors shadow-lg shadow-[#c9a84c]/20"
                >
                  Proceed to Checkout
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </Dialog.Close>

              <p className="text-center text-zinc-600 text-xs">
                Powered by Stripe · Secure & Encrypted
              </p>
            </div>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
