"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { LineReveal } from "@/frontend/components/ui/LineReveal";

const INTER = "var(--font-inter, Inter, system-ui, sans-serif)";

const NOTIFICATIONS = [
  { tag: "New listing",  subject: "Weekend Pass — 3-Day Access",  time: "just now" },
  { tag: "Price alert",  subject: "Sunday Access — updated price", time: "2h ago"   },
  { tag: "Early access", subject: "Comfort Camping available",     time: "1d ago"   },
];

function InboxPreview() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 1.0, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
      aria-hidden="true"
      style={{
        marginBottom:  "2rem",
        border:        "1px solid rgba(237,233,225,0.08)",
        borderRadius:  "2px",
        overflow:      "hidden",
      }}
    >
      {NOTIFICATIONS.map((n, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, x: -8 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.2 + i * 0.1, ease: [0.16, 1, 0.3, 1] }}
          style={{
            display:       "flex",
            alignItems:    "center",
            gap:           "12px",
            padding:       "11px 16px",
            borderBottom:  i < 2 ? "1px solid rgba(237,233,225,0.05)" : "none",
            background:    i === 0 ? "rgba(184,146,58,0.04)" : "transparent",
            opacity:       1 - i * 0.22,
          }}
        >
          {/* Status dot */}
          <div style={{
            width:        i === 0 ? "6px" : "5px",
            height:       i === 0 ? "6px" : "5px",
            borderRadius: "50%",
            background:   i === 0 ? "rgba(184,146,58,0.80)" : "rgba(237,233,225,0.20)",
            flexShrink:   0,
          }} />

          {/* Tag + subject */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <span style={{
              fontFamily:    INTER,
              fontSize:      "9px",
              fontWeight:    600,
              letterSpacing: "0.20em",
              textTransform: "uppercase",
              color:         "rgba(184,146,58,0.55)",
              display:       "block",
              marginBottom:  "2px",
            }}>
              {n.tag}
            </span>
            <span style={{
              fontFamily:    INTER,
              fontSize:      "12px",
              fontWeight:    400,
              color:         "rgba(237,233,225,0.70)",
              display:       "block",
              overflow:      "hidden",
              textOverflow:  "ellipsis",
              whiteSpace:    "nowrap",
            }}>
              {n.subject}
            </span>
          </div>

          {/* Time */}
          <span style={{
            fontFamily:    INTER,
            fontSize:      "10px",
            color:         "rgba(237,233,225,0.22)",
            flexShrink:    0,
            letterSpacing: "0.04em",
          }}>
            {n.time}
          </span>
        </motion.div>
      ))}
    </motion.div>
  );
}

export function NewsletterSection() {
  const [email,  setEmail]  = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setStatus("loading");
    try {
      const res = await fetch("/api/newsletter", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ email }),
      });
      setStatus(res.ok ? "success" : "error");
      if (res.ok) setEmail("");
    } catch {
      setStatus("error");
    }
  };

  return (
    <section className="relative py-5 overflow-hidden">

      <div className="max-w-5xl mx-auto px-6 sm:px-12 lg:px-20">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-28 items-center">

          {/* Left: copy */}
          <div>
            {/* Eyebrow */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.9 }}
              style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "1.25rem" }}
            >
              <span style={{ width: "16px", height: "1px", background: "rgba(184,146,58,0.45)", flexShrink: 0 }} />
              <span style={{ fontFamily: INTER, fontSize: "0.9375rem", fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: "rgba(237,233,225,0.82)" }}>
                Stay informed
              </span>
            </motion.div>

            {/* Inbox preview — sits under the label */}
            <InboxPreview />

            {/* Headline */}
            <h2
              className="font-[var(--font-playfair)] font-black text-white leading-[0.90] mb-8"
              style={{ fontSize: "clamp(2rem, 4.5vw, 3.25rem)", letterSpacing: "-0.03em" }}
            >
              <LineReveal>Early access.</LineReveal>
              <LineReveal delay={0.09}>
                <span style={{ color: "rgba(237,233,225,0.62)" }}>No noise.</span>
              </LineReveal>
            </h2>

            <motion.p
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.9, delay: 0.22, ease: [0.16, 1, 0.3, 1] }}
              style={{ fontFamily: INTER, fontSize: "clamp(0.875rem, 1.5vw, 1rem)", lineHeight: 1.85, color: "rgba(161,161,170,1)" }}
            >
              New ticket listings, price changes, and sale alerts — straight
              to your inbox. Join 2,400+ people already subscribed.
            </motion.p>
          </div>

          {/* Right: form */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1.0, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          >
            {status === "success" ? (
              <div style={{ paddingTop: "1.5rem", paddingBottom: "1.5rem" }}>
                <p style={{ fontFamily: INTER, fontSize: "0.875rem", color: "rgba(237,233,225,0.55)", letterSpacing: "0.02em" }}>
                  You&apos;re subscribed. Watch your inbox.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div style={{ position: "relative", marginBottom: "1.5rem" }}>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); setStatus("idle"); }}
                    placeholder="your@email.com"
                    required
                    style={{
                      width:         "100%",
                      background:    "transparent",
                      border:        "none",
                      borderBottom:  "1px solid rgba(237,233,225,0.15)",
                      padding:       "1rem 0",
                      fontFamily:    INTER,
                      fontSize:      "0.9375rem",
                      fontWeight:    300,
                      letterSpacing: "0.02em",
                      color:         "rgba(237,233,225,0.80)",
                      outline:       "none",
                      transition:    "border-color 0.4s ease",
                    }}
                    onFocus={e => ((e.target as HTMLInputElement).style.borderBottomColor = "rgba(184,146,58,0.55)")}
                    onBlur={e  => ((e.target as HTMLInputElement).style.borderBottomColor = "rgba(237,233,225,0.15)")}
                  />
                </div>

                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <span style={{ fontFamily: INTER, fontSize: "11px", letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(237,233,225,0.40)" }}>
                    Unsubscribe anytime
                  </span>
                  <button
                    type="submit"
                    disabled={status === "loading"}
                    className="group flex items-center gap-2"
                    style={{
                      background:    "none",
                      border:        "none",
                      padding:       0,
                      cursor:        "pointer",
                      fontFamily:    INTER,
                      fontSize:      "12px",
                      fontWeight:    500,
                      letterSpacing: "0.18em",
                      textTransform: "uppercase",
                      color:         status === "loading" ? "rgba(237,233,225,0.40)" : "rgba(237,233,225,0.80)",
                      transition:    "color 0.4s ease",
                    }}
                    onMouseEnter={e => { if (status !== "loading") (e.currentTarget as HTMLButtonElement).style.color = "rgba(184,146,58,0.80)"; }}
                    onMouseLeave={e => { if (status !== "loading") (e.currentTarget as HTMLButtonElement).style.color = "rgba(237,233,225,0.80)"; }}
                  >
                    {status === "loading" ? "Subscribing" : "Subscribe"}
                    <ArrowRight className="group-hover:translate-x-0.5 transition-transform duration-300" style={{ width: "10px", height: "10px" }} />
                  </button>
                </div>

                {status === "error" && (
                  <p style={{ fontFamily: INTER, fontSize: "0.75rem", color: "rgba(248,113,113,0.65)", marginTop: "0.75rem" }}>
                    Something went wrong. Try again.
                  </p>
                )}
              </form>
            )}
          </motion.div>

        </div>
      </div>
    </section>
  );
}
