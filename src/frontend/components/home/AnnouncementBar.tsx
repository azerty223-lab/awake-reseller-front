"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

/* ── Design tokens ──────────────────────────────────────────────── */
const I = "var(--font-inter, Inter, system-ui, sans-serif)";

/* ── Seeded inventory signal (swap for API fetch in production) ─── */
const TICKETS_LEFT = 8;

/* ── Component ──────────────────────────────────────────────────── */
export function AnnouncementBar() {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <div
      style={{
        background:    "rgba(4,4,6,0.97)",
        borderBottom:  "1px solid rgba(6,182,212,0.14)",
        display:       "flex",
        alignItems:    "center",
        justifyContent: "center",
        padding:       "10px 48px",
        position:      "relative",
        gap:           "10px",
      }}
      role="banner"
      aria-label="Ticket availability"
    >
      {/* ── Pulsing urgency dot ─────────────────────────── */}
      <div style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "center", width: "8px", height: "8px", flexShrink: 0 }}>
        <motion.span
          animate={{ scale: [1, 1.9, 1], opacity: [0.55, 0, 0.55] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: "easeOut" }}
          style={{
            position:     "absolute",
            inset:        "-3px",
            borderRadius: "50%",
            background:   "rgba(239,68,68,0.30)",
            display:      "block",
          }}
        />
        <span style={{
          display:      "block",
          width:        "6px",
          height:       "6px",
          borderRadius: "50%",
          background:   "#EF4444",
          position:     "relative",
        }} />
      </div>

      {/* ── Copy ───────────────────────────────────────── */}
      <p style={{
        fontFamily:    I,
        fontSize:      "12px",
        fontWeight:    500,
        color:         "rgba(237,233,225,0.78)",
        letterSpacing: "0.03em",
        margin:        0,
        whiteSpace:    "nowrap",
      }}>
        <span style={{ color: "#EF4444", fontWeight: 700 }}>
          Only {TICKETS_LEFT} tickets left
        </span>

        <span style={{ color: "rgba(237,233,225,0.35)", margin: "0 6px" }}>·</span>

        {/* Trim non-critical info on small screens */}
        <span className="hidden sm:inline" style={{ color: "rgba(237,233,225,0.60)" }}>
          Delivering July 8
          <span style={{ color: "rgba(237,233,225,0.35)", margin: "0 6px" }}>·</span>
        </span>

        <Link
          href="/tickets"
          style={{
            color:          "rgba(6,182,212,0.90)",
            fontWeight:     600,
            textDecoration: "none",
            transition:     "color 0.2s ease",
          }}
          onMouseEnter={e => (e.currentTarget.style.color = "#06B6D4")}
          onMouseLeave={e => (e.currentTarget.style.color = "rgba(6,182,212,0.90)")}
        >
          Stripe secured checkout →
        </Link>
      </p>

      {/* ── Dismiss ─────────────────────────────────────── */}
      <button
        onClick={() => setDismissed(true)}
        aria-label="Dismiss announcement"
        style={{
          position:   "absolute",
          right:      "14px",
          top:        "50%",
          transform:  "translateY(-50%)",
          background: "transparent",
          border:     "none",
          padding:    "5px",
          cursor:     "pointer",
          color:      "rgba(237,233,225,0.22)",
          display:    "flex",
          alignItems: "center",
          transition: "color 0.2s ease",
        }}
        onMouseEnter={e => (e.currentTarget.style.color = "rgba(237,233,225,0.58)")}
        onMouseLeave={e => (e.currentTarget.style.color = "rgba(237,233,225,0.22)")}
      >
        <X style={{ width: "11px", height: "11px" }} />
      </button>
    </div>
  );
}
