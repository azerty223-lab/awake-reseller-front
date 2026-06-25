"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { LineReveal } from "@/frontend/components/ui/LineReveal";

const INTER = "var(--font-inter, Inter, system-ui, sans-serif)";

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
    <section className="relative py-24 sm:py-36 overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/[0.07] to-transparent" />

      <div className="max-w-5xl mx-auto px-6 sm:px-12 lg:px-20">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-28 items-center">

          {/* ── Left: atmospheric copy ───────────────────────── */}
          <div>
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.9 }}
              style={{ display: "flex", alignItems: "center", gap: "14px", marginBottom: "clamp(1.5rem, 3vw, 2.5rem)" }}
            >
              <span style={{ width: "16px", height: "1px", background: "rgba(184,146,58,0.45)", flexShrink: 0 }} />
              <span style={{
                fontFamily:    INTER,
                fontSize:      "11px",
                fontWeight:    400,
                letterSpacing: "0.28em",
                textTransform: "uppercase",
                color:         "rgba(237,233,225,0.50)",
              }}>
                Stay informed
              </span>
            </motion.div>

            <h2
              className="font-[var(--font-playfair)] font-black text-white leading-[0.90] mb-8"
              style={{ fontSize: "clamp(2.5rem, 5.5vw, 4.25rem)", letterSpacing: "-0.03em" }}
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
              style={{
                fontFamily: INTER,
                fontSize:   "clamp(0.875rem, 1.5vw, 1rem)",
                lineHeight: 1.85,
                color:      "rgba(161,161,170,1)",
              }}
            >
              New ticket listings, price changes, and sale alerts — straight
              to your inbox. Join 2,400+ people already subscribed.
            </motion.p>
          </div>

          {/* ── Right: form ──────────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1.0, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          >
            {status === "success" ? (
              <div style={{ paddingTop: "1.5rem", paddingBottom: "1.5rem" }}>
                <p style={{
                  fontFamily:    INTER,
                  fontSize:      "0.875rem",
                  color:         "rgba(237,233,225,0.55)",
                  letterSpacing: "0.02em",
                }}>
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
                      width:           "100%",
                      background:      "transparent",
                      border:          "none",
                      borderBottom:    "1px solid rgba(237,233,225,0.15)",
                      padding:         "1rem 0",
                      fontFamily:      INTER,
                      fontSize:        "0.9375rem",
                      fontWeight:      300,
                      letterSpacing:   "0.02em",
                      color:           "rgba(237,233,225,0.80)",
                      outline:         "none",
                      transition:      "border-color 0.4s ease",
                    }}
                    onFocus={e  => ((e.target as HTMLInputElement).style.borderBottomColor = "rgba(184,146,58,0.55)")}
                    onBlur={e   => ((e.target as HTMLInputElement).style.borderBottomColor = "rgba(237,233,225,0.15)")}
                  />
                </div>

                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <span style={{
                    fontFamily:    INTER,
                    fontSize:      "11px",
                    letterSpacing: "0.18em",
                    textTransform: "uppercase",
                    color:         "rgba(237,233,225,0.40)",
                  }}>
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
                      color:         status === "loading"
                        ? "rgba(237,233,225,0.40)"
                        : "rgba(237,233,225,0.80)",
                      transition:    "color 0.4s ease",
                    }}
                    onMouseEnter={e => { if (status !== "loading") (e.currentTarget as HTMLButtonElement).style.color = "rgba(184,146,58,0.80)"; }}
                    onMouseLeave={e => { if (status !== "loading") (e.currentTarget as HTMLButtonElement).style.color = "rgba(237,233,225,0.60)"; }}
                  >
                    {status === "loading" ? "Subscribing" : "Subscribe"}
                    <ArrowRight
                      className="group-hover:translate-x-0.5 transition-transform duration-300"
                      style={{ width: "10px", height: "10px" }}
                    />
                  </button>
                </div>

                {status === "error" && (
                  <p style={{
                    fontFamily:  INTER,
                    fontSize:    "0.75rem",
                    color:       "rgba(248,113,113,0.65)",
                    marginTop:   "0.75rem",
                  }}>
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
