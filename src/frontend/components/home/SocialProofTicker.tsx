"use client";

import { motion } from "framer-motion";

const PURCHASES = [
  { name: "Ana B.",     city: "Rotterdam",  ticket: "Weekend GA",       time: "14 min ago" },
  { name: "Lukas S.",   city: "Berlin",     ticket: "Saturday Day",     time: "32 min ago" },
  { name: "Marieke V.", city: "Amsterdam",  ticket: "Sunday Closing",   time: "1 hr ago"   },
  { name: "Tom H.",     city: "Antwerp",    ticket: "Weekend GA",       time: "2 hrs ago"  },
  { name: "Sophie L.",  city: "Paris",      ticket: "Saturday Day",     time: "3 hrs ago"  },
  { name: "Daan K.",    city: "Utrecht",    ticket: "Weekend GA",       time: "4 hrs ago"  },
  { name: "Felix R.",   city: "Hamburg",    ticket: "Sunday Closing",   time: "5 hrs ago"  },
  { name: "Noa M.",     city: "Brussels",   ticket: "Weekend GA",       time: "6 hrs ago"  },
];

const I = "var(--font-inter, Inter, system-ui, sans-serif)";
const CYAN = "rgba(6,182,212,0.80)";

const doubled = [...PURCHASES, ...PURCHASES];

export function SocialProofTicker() {
  return (
    <div
      className="relative overflow-hidden"
      style={{
        paddingTop:    "10px",
        paddingBottom: "10px",
        background:    "rgba(6,182,212,0.035)",
        borderTop:    "1px solid rgba(6,182,212,0.10)",
        borderBottom: "1px solid rgba(6,182,212,0.10)",
      }}
      aria-hidden="true"
    >
      {/* Left fade mask */}
      <div
        className="pointer-events-none absolute inset-y-0 left-0 z-10"
        style={{ width: "6rem", background: "linear-gradient(to right, #050507, transparent)" }}
      />
      {/* Right fade mask */}
      <div
        className="pointer-events-none absolute inset-y-0 right-0 z-10"
        style={{ width: "6rem", background: "linear-gradient(to left, #050507, transparent)" }}
      />

      <motion.div
        animate={{ x: ["0%", "-50%"] }}
        transition={{ duration: 48, repeat: Infinity, ease: "linear" }}
        style={{ display: "flex", whiteSpace: "nowrap" }}
      >
        {doubled.map((p, i) => (
          <span
            key={i}
            style={{
              display:     "inline-flex",
              alignItems:  "center",
              gap:         "8px",
              padding:     "0 2.75rem",
              fontFamily:  I,
              fontSize:    "11px",
              letterSpacing: "0.04em",
            }}
          >
            {/* Live dot */}
            <span style={{
              width: "5px", height: "5px", borderRadius: "50%",
              background: CYAN, flexShrink: 0, opacity: 0.85,
            }} />

            <span style={{ color: "rgba(237,233,225,0.80)", fontWeight: 600 }}>
              {p.name}
            </span>
            <span style={{ color: "rgba(237,233,225,0.38)" }}>from {p.city}</span>

            <span style={{ color: "rgba(237,233,225,0.30)" }}>purchased</span>

            <span style={{ color: CYAN, fontWeight: 600 }}>
              {p.ticket}
            </span>

            <span style={{
              color:         "rgba(237,233,225,0.22)",
              fontSize:      "10px",
              letterSpacing: "0.08em",
            }}>
              · {p.time}
            </span>
          </span>
        ))}
      </motion.div>
    </div>
  );
}
