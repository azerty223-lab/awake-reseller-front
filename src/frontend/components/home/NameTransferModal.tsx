"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

const I = "var(--font-inter, Inter, system-ui, sans-serif)";
const C = "#06B6D4";
const W = "#EDE9E1";

/* ── Step data ──────────────────────────────────────────────────── */
const STEPS = [
  {
    num:   "01",
    icon:  (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2" />
        <rect x="9" y="3" width="6" height="4" rx="1" />
        <path d="M9 14l2 2 4-4" />
      </svg>
    ),
    title: "We verify your ticket",
    body:  "As soon as your order is confirmed, we cross-check your ticket against the Awakenings registry to verify it is valid, unused, and eligible for a name change.",
  },
  {
    num:   "02",
    icon:  (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
        <path d="m15 5 4 4" />
      </svg>
    ),
    title: "We submit the name change",
    body:  "We initiate the official name transfer through the Awakenings resale portal — the same system used for authorized ticket transfers. This cannot be done by the buyer directly.",
  },
  {
    num:   "03",
    icon:  (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="4" width="20" height="16" rx="2" />
        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
      </svg>
    ),
    title: "Your e-ticket arrives by email",
    body:  "Awakenings re-issues the ticket bearing your full name. You receive a personalised PDF e-ticket on July 8th, two days before the festival opens — exactly when Awakenings dispatches all tickets.",
  },
];

/* ── Modal ──────────────────────────────────────────────────────── */
interface Props {
  open:    boolean;
  onClose: () => void;
}

export function NameTransferModal({ open, onClose }: Props) {
  /* Lock body scroll while open */
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  /* Close on Escape */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (open) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={onClose}
            style={{
              position:   "fixed",
              inset:      0,
              zIndex:     100,
              background: "rgba(2,2,4,0.82)",
              backdropFilter: "blur(8px)",
              WebkitBackdropFilter: "blur(8px)",
            }}
          />

          {/* Panel */}
          <motion.div
            key="panel"
            initial={{ opacity: 0, y: 32, scale: 0.97 }}
            animate={{ opacity: 1, y: 0,  scale: 1    }}
            exit={{ opacity: 0,  y: 16, scale: 0.98   }}
            transition={{ duration: 0.38, ease: [0.16, 1, 0.3, 1] }}
            style={{
              position:    "fixed",
              inset:       0,
              zIndex:      101,
              display:     "flex",
              alignItems:  "center",
              justifyContent: "center",
              padding:     "1.5rem",
              pointerEvents: "none",
            }}
          >
            <div
              onClick={e => e.stopPropagation()}
              style={{
                width:              "100%",
                maxWidth:           "560px",
                maxHeight:          "90vh",
                overflowY:          "auto",
                background:         "rgba(7,7,11,0.98)",
                border:             "1px solid rgba(6,182,212,0.20)",
                borderRadius:       "12px",
                padding:            "clamp(1.5rem, 4vw, 2.5rem)",
                pointerEvents:      "auto",
                position:           "relative",
              }}
            >
              {/* Close button */}
              <button
                onClick={onClose}
                aria-label="Close"
                style={{
                  position:    "absolute",
                  top:         "1.25rem",
                  right:       "1.25rem",
                  background:  "transparent",
                  border:      "none",
                  cursor:      "pointer",
                  color:       "rgba(237,233,225,0.30)",
                  padding:     "4px",
                  display:     "flex",
                  alignItems:  "center",
                  transition:  "color 0.2s ease",
                }}
                onMouseEnter={e => (e.currentTarget.style.color = "rgba(237,233,225,0.70)")}
                onMouseLeave={e => (e.currentTarget.style.color = "rgba(237,233,225,0.30)")}
              >
                <X style={{ width: "16px", height: "16px" }} />
              </button>

              {/* Header */}
              <div style={{ marginBottom: "1.75rem", paddingRight: "2rem" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "0.75rem" }}>
                  <div style={{ width: "14px", height: "1px", background: "rgba(6,182,212,0.55)", flexShrink: 0 }} />
                  <span style={{
                    fontFamily:    I,
                    fontSize:      "10px",
                    fontWeight:    600,
                    letterSpacing: "0.28em",
                    textTransform: "uppercase",
                    color:         "rgba(6,182,212,0.70)",
                  }}>
                    Official process
                  </span>
                </div>
                <h2 style={{
                  fontFamily:    I,
                  fontWeight:    800,
                  fontSize:      "clamp(1.25rem, 3.5vw, 1.625rem)",
                  letterSpacing: "0.02em",
                  color:         W,
                  lineHeight:    1.15,
                  margin:        0,
                }}>
                  How the name transfer works
                </h2>
                <p style={{
                  fontFamily:  I,
                  fontSize:    "0.875rem",
                  lineHeight:  1.65,
                  color:       "rgba(161,161,170,0.70)",
                  marginTop:   "0.625rem",
                }}>
                  Every ticket goes through the official Awakenings name-change system.
                  The process is handled entirely by us — you only need to provide
                  the name you want on the ticket at checkout.
                </p>
              </div>

              {/* Steps */}
              <div style={{ position: "relative" }}>
                {/* Vertical rail */}
                <div style={{
                  position:   "absolute",
                  left:       "18px",
                  top:        "22px",
                  bottom:     "22px",
                  width:      "1px",
                  background: "linear-gradient(to bottom, rgba(6,182,212,0.30), rgba(6,182,212,0.06))",
                }} />

                <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                  {STEPS.map((step, i) => (
                    <div key={step.num} style={{ display: "flex", gap: "1rem", alignItems: "flex-start" }}>

                      {/* Node */}
                      <div style={{ position: "relative", zIndex: 1, flexShrink: 0 }}>
                        <div style={{
                          width:          "36px",
                          height:         "36px",
                          borderRadius:   "50%",
                          background:     i === STEPS.length - 1 ? "rgba(6,182,212,0.12)" : "rgba(6,182,212,0.06)",
                          border:         `1.5px solid rgba(6,182,212,${i === STEPS.length - 1 ? "0.50" : "0.28"})`,
                          display:        "flex",
                          alignItems:     "center",
                          justifyContent: "center",
                          color:          `rgba(6,182,212,${i === STEPS.length - 1 ? "0.90" : "0.60"})`,
                        }}>
                          {step.icon}
                        </div>
                      </div>

                      {/* Content */}
                      <div style={{ paddingTop: "6px", flex: 1 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "0.375rem" }}>
                          <span style={{
                            fontFamily:    I,
                            fontSize:      "9px",
                            fontWeight:    600,
                            letterSpacing: "0.26em",
                            textTransform: "uppercase",
                            color:         "rgba(6,182,212,0.45)",
                          }}>
                            {step.num}
                          </span>
                          <h3 style={{
                            fontFamily:  I,
                            fontWeight:  700,
                            fontSize:    "0.9375rem",
                            color:       "rgba(237,233,225,0.92)",
                            margin:      0,
                            lineHeight:  1.2,
                          }}>
                            {step.title}
                          </h3>
                        </div>
                        <p style={{
                          fontFamily: I,
                          fontSize:   "0.8125rem",
                          lineHeight: 1.70,
                          color:      "rgba(161,161,170,0.65)",
                          margin:     0,
                        }}>
                          {step.body}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Trust footer */}
              <div style={{
                marginTop:    "1.75rem",
                paddingTop:   "1.5rem",
                borderTop:    "1px solid rgba(237,233,225,0.07)",
                display:      "flex",
                flexWrap:     "wrap",
                gap:          "0.75rem",
                alignItems:   "center",
              }}>
                {[
                  "Official Awakenings transfer system",
                  "Protected under Dutch consumer law",
                  "Stripe-secured payment",
                ].map(label => (
                  <span key={label} style={{
                    display:       "inline-flex",
                    alignItems:    "center",
                    gap:           "5px",
                    fontFamily:    I,
                    fontSize:      "10px",
                    fontWeight:    500,
                    letterSpacing: "0.05em",
                    color:         "rgba(237,233,225,0.50)",
                    background:    "rgba(237,233,225,0.03)",
                    border:        "1px solid rgba(237,233,225,0.08)",
                    padding:       "4px 10px 4px 8px",
                    borderRadius:  "4px",
                  }}>
                    <span style={{ width: "4px", height: "4px", borderRadius: "50%", background: "rgba(6,182,212,0.75)", flexShrink: 0 }} />
                    {label}
                  </span>
                ))}
              </div>

            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
