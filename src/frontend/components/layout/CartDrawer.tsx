"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { useCartStore } from "@/frontend/store/cart";
import { formatPrice } from "@/backend/lib/utils";
import { X, Minus, Plus, ShoppingCart, ArrowRight, Ticket } from "lucide-react";
import Link from "next/link";
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

        {/* Overlay — pure CSS opacity, no Framer Motion */}
        <Dialog.Overlay
          forceMount
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.75)",
            zIndex: 60,
            opacity: open ? 1 : 0,
            transition: "opacity 200ms ease",
            pointerEvents: open ? "auto" : "none",
          }}
        />

        {/* Panel — pure CSS translateX, no Framer Motion, will-change pre-promoted */}
        <Dialog.Content
          forceMount
          aria-describedby={undefined}
          style={{
            position: "fixed",
            top: 0,
            right: 0,
            height: "100%",
            width: "100%",
            maxWidth: "384px",
            background: "#0E0E11",
            borderLeft: "1px solid rgba(255,255,255,0.07)",
            zIndex: 70,
            display: "flex",
            flexDirection: "column",
            outline: "none",
            transform: open ? "translateX(0)" : "translateX(100%)",
            transition: "transform 320ms cubic-bezier(0.32, 0.72, 0, 1)",
            willChange: "transform",
          }}
        >

          {/* Header */}
          <div style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "20px 24px",
            borderBottom: "1px solid rgba(255,255,255,0.07)",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <div style={{
                width: 32, height: 32, borderRadius: 8,
                background: "rgba(201,168,76,0.08)",
                border: "1px solid rgba(201,168,76,0.18)",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <ShoppingCart size={16} color="#C9A84C" />
              </div>
              <Dialog.Title style={{ color: "#fff", fontWeight: 700, fontSize: 17, margin: 0 }}>
                Your Cart
              </Dialog.Title>
              {itemCount > 0 && (
                <span style={{
                  background: "linear-gradient(135deg, #C9A84C, #E4BA65)",
                  color: "#000",
                  fontSize: 11,
                  fontWeight: 800,
                  padding: "2px 8px",
                  borderRadius: 99,
                }}>
                  {itemCount}
                </span>
              )}
            </div>
            <Dialog.Close style={{
              width: 32, height: 32, borderRadius: 8, border: "none",
              background: "transparent", cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center",
              color: "#71717A",
            }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.color = "#fff"; (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.06)"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.color = "#71717A"; (e.currentTarget as HTMLButtonElement).style.background = "transparent"; }}
            >
              <X size={16} />
            </Dialog.Close>
          </div>

          {/* Items area */}
          <div style={{ flex: 1, overflowY: "auto", padding: "16px 20px" }}>
            {items.length === 0 ? (
              <div style={{
                display: "flex", flexDirection: "column", alignItems: "center",
                justifyContent: "center", height: "100%", gap: 20, textAlign: "center",
                padding: "60px 0",
              }}>
                <div style={{
                  width: 72, height: 72, borderRadius: 16,
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.07)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <Ticket size={28} color="#3F3F46" />
                </div>
                <div>
                  <p style={{ color: "#fff", fontWeight: 600, marginBottom: 6 }}>Cart is empty</p>
                  <p style={{ color: "#52525B", fontSize: 13 }}>Add tickets to get started</p>
                </div>
                <Dialog.Close asChild>
                  <Link href="/tickets" style={{
                    display: "inline-flex", alignItems: "center", gap: 6,
                    padding: "10px 20px", borderRadius: 12, fontSize: 13, fontWeight: 700,
                    background: "linear-gradient(135deg, #C9A84C, #E4BA65)", color: "#000",
                    textDecoration: "none",
                  }}>
                    Browse Tickets <ArrowRight size={14} />
                  </Link>
                </Dialog.Close>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {items.map((item) => (
                  <div
                    key={item.ticketId}
                    style={{
                      background: "rgba(255,255,255,0.04)",
                      border: "1px solid rgba(255,255,255,0.07)",
                      borderRadius: 16,
                      padding: 16,
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12 }}>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{
                          color: "#fff", fontWeight: 600, fontSize: 14,
                          marginBottom: 2, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
                        }}>
                          {item.name}
                        </p>
                        {item.dayLabel && (
                          <p style={{
                            color: "#52525B", fontSize: 10, fontWeight: 600,
                            textTransform: "uppercase", letterSpacing: "0.15em", marginBottom: 8,
                          }}>
                            {item.dayLabel}
                          </p>
                        )}
                        <p style={{
                          fontWeight: 700, fontSize: 15,
                          background: "linear-gradient(135deg, #C9A84C, #E4BA65)",
                          WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
                        }}>
                          {formatPrice(item.resalePrice * item.quantity)}
                        </p>
                        {item.quantity > 1 && (
                          <p style={{ color: "#52525B", fontSize: 11, marginTop: 2 }}>
                            {formatPrice(item.resalePrice)} each
                          </p>
                        )}
                      </div>

                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        {/* Quantity */}
                        <div style={{
                          display: "flex", alignItems: "center", gap: 2,
                          background: "rgba(0,0,0,0.4)", borderRadius: 99,
                          border: "1px solid rgba(255,255,255,0.07)", padding: "2px 4px",
                        }}>
                          <button
                            onClick={() => updateQuantity(item.ticketId, item.quantity - 1)}
                            style={{
                              width: 28, height: 28, borderRadius: "50%", border: "none",
                              background: "transparent", cursor: "pointer", color: "#71717A",
                              display: "flex", alignItems: "center", justifyContent: "center",
                            }}
                          >
                            <Minus size={12} />
                          </button>
                          <span style={{ color: "#fff", fontSize: 13, fontWeight: 600, width: 22, textAlign: "center" }}>
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.ticketId, item.quantity + 1)}
                            disabled={item.quantity >= item.maxQuantity}
                            style={{
                              width: 28, height: 28, borderRadius: "50%", border: "none",
                              background: "transparent", cursor: item.quantity >= item.maxQuantity ? "not-allowed" : "pointer",
                              color: item.quantity >= item.maxQuantity ? "#3F3F46" : "#71717A",
                              display: "flex", alignItems: "center", justifyContent: "center",
                            }}
                          >
                            <Plus size={12} />
                          </button>
                        </div>

                        {/* Remove */}
                        <button
                          onClick={() => removeItem(item.ticketId)}
                          style={{
                            width: 28, height: 28, borderRadius: "50%", border: "none",
                            background: "transparent", cursor: "pointer", color: "#52525B",
                            display: "flex", alignItems: "center", justifyContent: "center",
                          }}
                          onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.color = "#f87171"; }}
                          onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.color = "#52525B"; }}
                        >
                          <X size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {items.length > 0 && (
            <div style={{
              borderTop: "1px solid rgba(255,255,255,0.07)",
              padding: "20px",
              background: "#0A0A0C",
              display: "flex", flexDirection: "column", gap: 12,
            }}>
              <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between" }}>
                <div>
                  <p style={{ color: "#52525B", fontSize: 10, textTransform: "uppercase", letterSpacing: "0.2em", fontWeight: 600, marginBottom: 4 }}>
                    Subtotal
                  </p>
                  <p style={{
                    fontSize: 22, fontWeight: 700,
                    background: "linear-gradient(135deg, #C9A84C, #E4BA65)",
                    WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
                  }}>
                    {formatPrice(total)}
                  </p>
                </div>
                <div style={{ textAlign: "right" }}>
                  <p style={{ color: "#52525B", fontSize: 12, marginBottom: 4 }}>
                    {itemCount} ticket{itemCount !== 1 ? "s" : ""}
                  </p>
                  <Badge variant="success" size="sm">Secure checkout</Badge>
                </div>
              </div>

              <Dialog.Close asChild>
                <Link href="/checkout" style={{
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                  padding: "15px", borderRadius: 12, fontWeight: 700, fontSize: 15,
                  background: "linear-gradient(135deg, #C9A84C, #E4BA65)", color: "#000",
                  textDecoration: "none",
                }}>
                  Proceed to Checkout <ArrowRight size={16} />
                </Link>
              </Dialog.Close>

              <Dialog.Close asChild>
                <button style={{
                  width: "100%", padding: "11px", borderRadius: 12, cursor: "pointer",
                  border: "1px solid rgba(255,255,255,0.14)", background: "transparent",
                  color: "#fff", fontSize: 13, fontWeight: 500,
                }}>
                  Continue Shopping
                </button>
              </Dialog.Close>
            </div>
          )}

        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
