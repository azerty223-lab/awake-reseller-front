"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { X, ShoppingCart } from "lucide-react";
import { useCartStore } from "@/frontend/store/cart";
import { formatPrice } from "@/backend/lib/utils";

/* ── Design tokens ──────────────────────────────────────────────── */
const I = "var(--font-inter, Inter, system-ui, sans-serif)";
const C = "#06B6D4";

/* ── Component ──────────────────────────────────────────────────── */
export function StickyBuyBar() {
  const router    = useRouter();
  const itemCount = useCartStore(s => s.itemCount);
  const total     = useCartStore(s => s.total);

  const [visible,   setVisible]   = useState(false);
  const [dismissed, setDismissed] = useState(false);

  const hasCart = itemCount > 0;

  /* Show after user scrolls past 75% of the viewport height */
  useEffect(() => {
    const threshold = typeof window !== "undefined" ? window.innerHeight * 0.75 : 600;
    const onScroll = () => setVisible(window.scrollY > threshold);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* Re-show whenever items are added */
  useEffect(() => {
    if (hasCart) setDismissed(false);
  }, [hasCart]);

  if (dismissed) return null;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: "110%" }}
          animate={{ y: 0 }}
          exit={{ y: "110%" }}
          transition={{ type: "spring", damping: 32, stiffness: 340 }}
          style={{ position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 49 }}
          role="complementary"
          aria-label="Purchase bar"
        >
          {/* ── Bar body ─────────────────────────────────────────── */}
          <div style={{
            background:           "rgba(4,4,6,0.97)",
            borderTop:            "1px solid rgba(6,182,212,0.16)",
            backdropFilter:       "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            /* iOS safe-area so the bar clears the home indicator */
            paddingBottom:        "env(safe-area-inset-bottom, 0px)",
          }}>
            <div style={{
              maxWidth:   "1380px",
              margin:     "0 auto",
              padding:    "10px 16px",
              display:    "flex",
              alignItems: "center",
              gap:        "10px",
            }}>

              {hasCart ? (
                /* ── CART STATE ────────────────────────────────── */
                <>
                  <motion.span
                    animate={{ opacity: [1, 0.3, 1] }}
                    transition={{ duration: 1.4, repeat: Infinity }}
                    style={{
                      width: "6px", height: "6px", borderRadius: "50%",
                      background: C, flexShrink: 0, display: "inline-block",
                    }}
                    aria-hidden="true"
                  />

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{
                      fontFamily:   I,
                      fontSize:     "12px",
                      fontWeight:   600,
                      color:        "rgba(237,233,225,0.92)",
                      letterSpacing:"0.01em",
                      margin:       0,
                      overflow:     "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace:   "nowrap",
                    }}>
                      <span style={{ color: C }}>
                        {itemCount} ticket{itemCount > 1 ? "s" : ""}
                      </span>
                      {" "}
                      <span style={{ color: "rgba(237,233,225,0.55)" }}>
                        · {formatPrice(total)}
                      </span>
                      {" — "}complete your checkout
                    </p>
                    <p style={{
                      fontFamily:    I,
                      fontSize:      "10px",
                      color:         "rgba(237,233,225,0.28)",
                      letterSpacing: "0.10em",
                      textTransform: "uppercase",
                      margin:        "2px 0 0",
                    }}>
                      Not reserved until payment complete
                    </p>
                  </div>

                  <button
                    onClick={() => router.push("/checkout")}
                    style={{
                      display:       "inline-flex",
                      alignItems:    "center",
                      gap:           "6px",
                      background:    C,
                      border:        "none",
                      padding:       "11px 22px",
                      cursor:        "pointer",
                      fontFamily:    I,
                      fontWeight:    800,
                      fontSize:      "11px",
                      letterSpacing: "0.20em",
                      textTransform: "uppercase",
                      color:         "#040404",
                      whiteSpace:    "nowrap",
                      flexShrink:    0,
                      transition:    "background 0.2s ease",
                    }}
                    onMouseEnter={e => (e.currentTarget.style.background = "#22D3EE")}
                    onMouseLeave={e => (e.currentTarget.style.background = C)}
                  >
                    <ShoppingCart style={{ width: "13px", height: "13px" }} aria-hidden="true" />
                    Checkout →
                  </button>
                </>
              ) : (
                /* ── BROWSE STATE — no fake numbers ────────────── */
                <>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{
                      fontFamily:   I,
                      fontSize:     "12px",
                      fontWeight:   600,
                      color:        "rgba(237,233,225,0.90)",
                      letterSpacing:"0.01em",
                      margin:       0,
                      overflow:     "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace:   "nowrap",
                    }}>
                      Awakenings Festival 2026
                      <span style={{ color: "rgba(237,233,225,0.38)", fontWeight: 400 }}>
                        {" "}· July 10–12 · Hilvarenbeek
                      </span>
                    </p>
                  </div>

                  <button
                    onClick={() => router.push("/tickets")}
                    style={{
                      background:    C,
                      border:        "none",
                      padding:       "11px 20px",
                      cursor:        "pointer",
                      fontFamily:    I,
                      fontWeight:    800,
                      fontSize:      "11px",
                      letterSpacing: "0.20em",
                      textTransform: "uppercase",
                      color:         "#040404",
                      whiteSpace:    "nowrap",
                      flexShrink:    0,
                      transition:    "background 0.2s ease",
                    }}
                    onMouseEnter={e => (e.currentTarget.style.background = "#22D3EE")}
                    onMouseLeave={e => (e.currentTarget.style.background = C)}
                  >
                    View Tickets →
                  </button>
                </>
              )}

              {/* ── Dismiss ──────────────────────────────────────── */}
              <button
                onClick={() => setDismissed(true)}
                aria-label="Dismiss bar"
                style={{
                  background:  "transparent",
                  border:      "none",
                  padding:     "6px 2px",
                  cursor:      "pointer",
                  color:       "rgba(237,233,225,0.22)",
                  flexShrink:  0,
                  display:     "flex",
                  alignItems:  "center",
                  transition:  "color 0.2s ease",
                }}
                onMouseEnter={e => (e.currentTarget.style.color = "rgba(237,233,225,0.55)")}
                onMouseLeave={e => (e.currentTarget.style.color = "rgba(237,233,225,0.22)")}
              >
                <X style={{ width: "13px", height: "13px" }} />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
