"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { useCartStore } from "@/frontend/store/cart";
import { formatPrice } from "@/backend/lib/utils";
import { X, Minus, Plus, ShoppingCart, Trash2, ArrowRight, Ticket } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "@/frontend/components/ui/Badge";

interface CartDrawerProps {
  open: boolean;
  onClose: () => void;
}

const panelVariants = {
  hidden: { x: "100%", opacity: 0 },
  visible: {
    x: 0,
    opacity: 1,
    transition: { type: "spring" as const, stiffness: 320, damping: 36, mass: 0.8 },
  },
  exit: {
    x: "100%",
    opacity: 0,
    transition: { duration: 0.25, ease: [0.32, 0, 0.67, 0] as const },
  },
};

const overlayVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.2 } },
  exit: { opacity: 0, transition: { duration: 0.2 } },
};

const itemVariants = {
  hidden: { opacity: 0, x: 24 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.28, ease: "easeOut" as const } },
  exit: { opacity: 0, x: -16, scale: 0.97, transition: { duration: 0.18 } },
};

export function CartDrawer({ open, onClose }: CartDrawerProps) {
  const { items, updateQuantity, removeItem, total, itemCount } = useCartStore();

  return (
    <Dialog.Root open={open} onOpenChange={(v) => !v && onClose()}>
      <Dialog.Portal>
        <AnimatePresence>
          {open && (
            <>
              {/* Overlay */}
              <Dialog.Overlay asChild forceMount>
                <motion.div
                  className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[60]"
                  variants={overlayVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                />
              </Dialog.Overlay>

              {/* Panel */}
              <Dialog.Content asChild forceMount>
                <motion.div
                  className="fixed right-0 top-0 h-full w-full max-w-sm bg-[#0A0A0C]/95 backdrop-blur-xl border-l border-white/[0.07] z-[70] flex flex-col shadow-[0_0_80px_rgba(0,0,0,0.9)] outline-none"
                  variants={panelVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                >
                  {/* Header */}
                  <div className="flex items-center justify-between px-6 py-5 border-b border-white/[0.07]">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#C9A84C]/20 to-[#E4BA65]/10 border border-[#C9A84C]/20 flex items-center justify-center">
                        <ShoppingCart className="w-4 h-4 text-[#C9A84C]" />
                      </div>
                      <Dialog.Title className="text-white font-bold text-lg tracking-tight">
                        Your Cart
                      </Dialog.Title>
                      <AnimatePresence>
                        {itemCount > 0 && (
                          <motion.span
                            key="badge"
                            initial={{ scale: 0.6, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.6, opacity: 0 }}
                            className="bg-gradient-to-r from-[#C9A84C] to-[#E4BA65] text-black text-[11px] font-bold px-2 py-0.5 rounded-full min-w-[22px] text-center"
                          >
                            {itemCount}
                          </motion.span>
                        )}
                      </AnimatePresence>
                    </div>
                    <Dialog.Close className="w-8 h-8 rounded-lg flex items-center justify-center text-zinc-500 hover:text-white hover:bg-white/[0.07] border border-transparent hover:border-white/[0.07] transition-all duration-200">
                      <X className="w-4 h-4" />
                    </Dialog.Close>
                  </div>

                  {/* Items */}
                  <div className="flex-1 overflow-y-auto py-5 px-5 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-white/10">
                    {items.length === 0 ? (
                      /* Empty State */
                      <div className="flex flex-col items-center justify-center h-full gap-5 text-center py-20">
                        <div className="relative">
                          <div className="w-20 h-20 rounded-2xl bg-white/[0.04] border border-white/[0.07] flex items-center justify-center">
                            <Ticket className="w-8 h-8 text-zinc-600" />
                          </div>
                          <div className="absolute inset-0 rounded-2xl bg-[#C9A84C]/5 blur-xl" />
                        </div>
                        <div className="space-y-1.5">
                          <p className="text-white font-semibold text-base">Your cart is empty</p>
                          <p className="text-zinc-500 text-sm leading-relaxed">
                            Find the perfect tickets and<br />add them here
                          </p>
                        </div>
                        <Dialog.Close asChild>
                          <Link
                            href="/tickets"
                            className="mt-1 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#C9A84C] to-[#E4BA65] text-black text-sm font-bold hover:shadow-[0_0_30px_rgba(201,168,76,0.35)] transition-all duration-300"
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
                              variants={itemVariants}
                              initial="hidden"
                              animate="visible"
                              exit="exit"
                              className="group bg-white/[0.04] backdrop-blur-md border border-white/[0.07] rounded-2xl p-4 hover:bg-white/[0.07] hover:border-white/[0.12] transition-all duration-300"
                            >
                              <div className="flex items-start justify-between gap-3">
                                <div className="flex-1 min-w-0">
                                  <p className="text-white font-semibold text-sm truncate mb-0.5 leading-snug">
                                    {item.name}
                                  </p>
                                  {item.dayLabel && (
                                    <p className="text-[10px] uppercase tracking-[0.15em] font-semibold text-zinc-500 mb-2.5">
                                      {item.dayLabel}
                                    </p>
                                  )}
                                  <p className="bg-gradient-to-r from-[#C9A84C] to-[#E4BA65] bg-clip-text text-transparent font-bold text-base">
                                    {formatPrice(item.resalePrice * item.quantity)}
                                  </p>
                                  {item.quantity > 1 && (
                                    <p className="text-zinc-600 text-xs mt-0.5">
                                      {formatPrice(item.resalePrice)} each
                                    </p>
                                  )}
                                </div>

                                <div className="flex items-center gap-2 mt-0.5">
                                  {/* Quantity pill controls */}
                                  <div className="flex items-center gap-0.5 bg-black/40 rounded-full border border-white/[0.07] p-0.5">
                                    <button
                                      onClick={() =>
                                        updateQuantity(item.ticketId, item.quantity - 1)
                                      }
                                      className="w-7 h-7 rounded-full flex items-center justify-center text-zinc-400 hover:text-[#C9A84C] hover:bg-[#C9A84C]/10 transition-all duration-200"
                                      aria-label="Decrease quantity"
                                    >
                                      <Minus className="w-3 h-3" />
                                    </button>
                                    <span className="text-white text-sm font-semibold w-6 text-center tabular-nums">
                                      {item.quantity}
                                    </span>
                                    <button
                                      onClick={() =>
                                        updateQuantity(item.ticketId, item.quantity + 1)
                                      }
                                      disabled={item.quantity >= item.maxQuantity}
                                      className="w-7 h-7 rounded-full flex items-center justify-center text-zinc-400 hover:text-[#C9A84C] hover:bg-[#C9A84C]/10 transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed"
                                      aria-label="Increase quantity"
                                    >
                                      <Plus className="w-3 h-3" />
                                    </button>
                                  </div>

                                  {/* Remove */}
                                  <button
                                    onClick={() => removeItem(item.ticketId)}
                                    className="w-7 h-7 rounded-full flex items-center justify-center text-zinc-600 hover:text-red-400 hover:bg-red-400/10 border border-transparent hover:border-red-400/20 transition-all duration-200"
                                    aria-label="Remove item"
                                  >
                                    <X className="w-3.5 h-3.5" />
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
                  <AnimatePresence>
                    {items.length > 0 && (
                      <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 16 }}
                        transition={{ duration: 0.22 }}
                        className="border-t border-white/[0.07] px-5 py-5 space-y-4 bg-black/30 backdrop-blur-sm"
                      >
                        {/* Subtotal row */}
                        <div className="flex items-end justify-between">
                          <div>
                            <p className="text-[10px] uppercase tracking-[0.2em] font-semibold text-zinc-500 mb-1">
                              Subtotal
                            </p>
                            <p className="bg-gradient-to-r from-[#C9A84C] to-[#E4BA65] bg-clip-text text-transparent text-2xl font-bold leading-none">
                              {formatPrice(total)}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-zinc-500 text-xs mb-1">
                              {itemCount} ticket{itemCount !== 1 ? "s" : ""}
                            </p>
                            <Badge variant="success" size="sm">Secure checkout</Badge>
                          </div>
                        </div>

                        {/* Checkout CTA */}
                        <Dialog.Close asChild>
                          <Link
                            href="/checkout"
                            className="flex items-center justify-center gap-2 w-full py-4 rounded-xl bg-gradient-to-r from-[#C9A84C] to-[#E4BA65] text-black font-bold text-base hover:shadow-[0_0_40px_rgba(201,168,76,0.4)] active:scale-[0.98] transition-all duration-300"
                          >
                            Proceed to Checkout
                            <ArrowRight className="w-4 h-4" />
                          </Link>
                        </Dialog.Close>

                        {/* Continue shopping ghost button */}
                        <Dialog.Close asChild>
                          <button className="w-full py-2.5 rounded-xl border border-white/20 text-white text-sm font-medium hover:bg-white/[0.07] hover:border-white/40 transition-all duration-300">
                            Continue Shopping
                          </button>
                        </Dialog.Close>

                        <p className="text-center text-zinc-600 text-[11px]">
                          Powered by Stripe · Secure &amp; Encrypted
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              </Dialog.Content>
            </>
          )}
        </AnimatePresence>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
