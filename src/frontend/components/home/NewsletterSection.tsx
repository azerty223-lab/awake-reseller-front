"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { LineReveal } from "@/frontend/components/ui/LineReveal";

const INTER = "var(--font-inter, Inter, system-ui, sans-serif)";

/** Minimal radar / signal illustration — editorial, on-brand for a broadcast/inbox theme */
function SignalIllustration() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.92 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
      style={{ marginBottom: "2rem" }}
      aria-hidden="true"
    >
      <svg
        width="72"
        height="72"
        viewBox="0 0 72 72"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Outer ring */}
        <circle cx="36" cy="36" r="34" stroke="rgba(184,146,58,0.14)" strokeWidth="0.5" />

        {/* Middle ring */}
        <motion.circle
          cx="36" cy="36" r="22"
          stroke="rgba(184,146,58,0.28)"
          strokeWidth="0.5"
          initial={{ pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.6, delay: 0.2, ease: "easeOut" }}
        />

        {/* Inner ring */}
        <circle cx="36" cy="36" r="10" stroke="rgba(237,233,225,0.18)" strokeWidth="0.5" />

        {/* Cross-hair lines */}
        <line x1="2"  y1="36" x2="70" y2="36" stroke="rgba(237,233,225,0.06)" strokeWidth="0.5" />
        <line x1="36" y1="2"  x2="36" y2="70" stroke="rgba(237,233,225,0.06)" strokeWidth="0.5" />

        {/* Compass tick marks */}
        <line x1="36" y1="2"  x2="36" y2="8"  stroke="rgba(184,146,58,0.55)" strokeWidth="1" />
        <line x1="36" y1="64" x2="36" y2="70" stroke="rgba(184,146,58,0.55)" strokeWidth="1" />
        <line x1="2"  y1="36" x2="8"  y2="36" stroke="rgba(184,146,58,0.55)" strokeWidth="1" />
        <line x1="64" y1="36" x2="70" y2="36" stroke="rgba(184,146,58,0.55)" strokeWidth="1" />

        {/* Diagonal ticks */}
        <line x1="11" y1="11" x2="15" y2="15" stroke="rgba(237,233,225,0.12)" strokeWidth="0.5" />
        <line x1="57" y1="57" x2="61" y2="61" stroke="rgba(237,233,225,0.12)" strokeWidth="0.5" />
        <line x1="57" y1="11" x2="61" y2="15" stroke="rgba(237,233,225,0.12)" strokeWidth="0.5" />
        <line x1="11" y1="57" x2="15" y2="61" stroke="rgba(237,233,225,0.12)" strokeWidth="0.5" />

        {/* Center dot — gold */}
        <circle cx="36" cy="36" r="2.5" fill="rgba(184,146,58,0.75)" />
        <circle cx="36" cy="36" r="1"   fill="rgba(237,233,225,0.90)" />

        {/* Signal arc — top-right quadrant, pulsing */}
        <motion.path
          d="M 46 26 A 14 14 0 0 1 46 46"
          stroke="rgba(184,146,58,0.45)"
          strokeWidth="1"
          fill="none"
          strokeLinecap="round"
          initial={{ pathLength: 0, opacity: 0 }}
          whileInView={{ pathLength: 1, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
        />
        <motion.path
          d="M 52 20 A 22 22 0 0 1 52 52"
          stroke="rgba(184,146,58,0.22)"
          strokeWidth="0.75"
          fill="none"
          strokeLinecap="round"
          initial={{ pathLength: 0, opacity: 0 }}
          whileInView={{ pathLength: 1, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.1, delay: 0.85, ease: [0.16, 1, 0.3, 1] }}
        />
      </svg>
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
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/[0.07] to-transparent" />

      <div className="max-w-5xl mx-auto px-6 sm:px-12 lg:px-20">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-28 items-center">

          {/* Left: copy */}
          <div>
            {/* Illustration */}
            <SignalIllustration />

            {/* Eyebrow */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.9 }}
              style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "0.75rem" }}
            >
              <span style={{ width: "16px", height: "1px", background: "rgba(184,146,58,0.45)", flexShrink: 0 }} />
              <span style={{ fontFamily: INTER, fontSize: "0.9375rem", fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: "rgba(237,233,225,0.82)" }}>
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
                    <ArrowRight
                      className="group-hover:translate-x-0.5 transition-transform duration-300"
                      style={{ width: "10px", height: "10px" }}
                    />
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
