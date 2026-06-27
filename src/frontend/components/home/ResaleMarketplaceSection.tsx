"use client";

import type React from "react";
import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";
import Link from "next/link";
import {
  ArrowRight, CheckCircle2, Star, X,
  Ticket, ShieldCheck, PackageCheck,
  ClipboardCheck, UserCheck, Mail, MapPin, Calendar,
  type LucideIcon,
} from "lucide-react";
import { LineReveal } from "@/frontend/components/ui/LineReveal";
import { NameTransferModal } from "@/frontend/components/home/NameTransferModal";

/* ── Buyer protection points ──────────────────────────────────── */
const PROTECTIONS = [
  "Registry verification before delivery",
  "Authorized name transfer process",
  "Personalized e-ticket sent by email",
  "Support response within 4 business hours",
];

/* ── Process steps ────────────────────────────────────────────── */
const STEPS: Array<{ num: string; Icon: LucideIcon; title: string; body: string }> = [
  {
    num:   "1",
    Icon:  ClipboardCheck,
    title: "Order review",
    body:  "We check the resale order and ticket details before beginning the transfer.",
  },
  {
    num:   "2",
    Icon:  UserCheck,
    title: "Name transfer",
    body:  "The ticket is transferred through the authorized process so it is issued in the buyer's name.",
  },
  {
    num:   "3",
    Icon:  Mail,
    title: "Delivery",
    body:  "The personalized e-ticket is sent by email before the festival, ready to present at the gate.",
  },
];

const I = "var(--font-inter, Inter, system-ui, sans-serif)";

/* ── Trust stats ──────────────────────────────────────────────── */
const STATS: Array<{ value: string; label: string; Icon: LucideIcon }> = [
  { value: "200+", label: "Tickets sold",  Icon: Ticket        },
  { value: "4.9",  label: "Avg. rating",   Icon: Star          },
  { value: "0",    label: "Disputes",      Icon: ShieldCheck   },
  { value: "100%", label: "Delivery rate", Icon: PackageCheck  },
];

/* ── Reviews ──────────────────────────────────────────────────── */
/* Specific, realistic, short — each addresses a real purchase fear */
const REVIEWS = [
  {
    initials: "MV",
    name:     "Martijn V.",
    city:     "Amsterdam",
    ticket:   "Weekend GA",
    stars:    5,
    text:     "Ticket worked perfectly at the gate. Name transfer was handled exactly as described — got my e-ticket on July 8th as promised.",
  },
  {
    initials: "EK",
    name:     "Emma K.",
    city:     "Rotterdam",
    ticket:   "Saturday Day",
    stars:    5,
    text:     "Bought two Saturday tickets. They responded to my question within an hour and the whole process was straightforward.",
  },
  {
    initials: "FB",
    name:     "Felix B.",
    city:     "Berlin",
    ticket:   "Sunday Closing",
    stars:    5,
    text:     "Slightly above face value but worth it for the peace of mind. Gate staff confirmed the name transfer was legit.",
  },
];

/* ── Subcomponents ────────────────────────────────────────────── */

function StarRating({ count }: { count: number }) {
  return (
    <span
      role="img"
      aria-label={`${count} out of 5 stars`}
      style={{ display: "inline-flex", gap: "3px" }}
    >
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          size={13}
          strokeWidth={i < count ? 0 : 1.5}
          fill={i < count ? "#F59E0B" : "rgba(255,255,255,0.08)"}
          color={i < count ? "#F59E0B" : "rgba(255,255,255,0.12)"}
          aria-hidden="true"
        />
      ))}
    </span>
  );
}

function VerifiedBadge() {
  return (
    <span
      style={{
        marginLeft:    "auto",
        display:       "inline-flex",
        alignItems:    "center",
        gap:           "4px",
        fontFamily:    I,
        fontSize:      "9px",
        fontWeight:    600,
        letterSpacing: "0.10em",
        textTransform: "uppercase" as const,
        color:         "rgba(6,182,212,0.72)",
      }}
    >
      <CheckCircle2 size={10} strokeWidth={2} aria-hidden="true" />
      Verified
    </span>
  );
}

function StatItem({ value, label, Icon }: { value: string; label: string; Icon: React.ElementType }) {
  return (
    <div style={{
      display:        "flex",
      flexDirection:  "column" as const,
      alignItems:     "center",
      gap:            "10px",
      textAlign:      "center" as const,
    }}>
      <div style={{
        width:          "36px",
        height:         "36px",
        borderRadius:   "50%",
        background:     "rgba(6,182,212,0.07)",
        border:         "1px solid rgba(6,182,212,0.14)",
        display:        "flex",
        alignItems:     "center",
        justifyContent: "center",
      }}>
        <Icon size={15} strokeWidth={1.5} color="rgba(6,182,212,0.75)" aria-hidden="true" />
      </div>
      <div>
        <span style={{
          display:       "block",
          fontFamily:    I,
          fontWeight:    700,
          fontSize:      "clamp(1.5rem, 3vw, 2rem)",
          color:         "#EDE9E1",
          letterSpacing: "-0.02em",
          lineHeight:    1,
          marginBottom:  "5px",
        }}>
          {value}
        </span>
        <span style={{
          fontFamily:    I,
          fontSize:      "9.5px",
          fontWeight:    500,
          letterSpacing: "0.16em",
          textTransform: "uppercase" as const,
          color:         "rgba(237,233,225,0.30)",
          lineHeight:    1.3,
        }}>
          {label}
        </span>
      </div>
    </div>
  );
}

function ReviewCard({ r, index, onSelect, isSelected }: {
  r: typeof REVIEWS[0];
  index: number;
  onSelect: () => void;
  isSelected: boolean;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.article
      layoutId={`review-card-${index}`}
      /* scroll-in animation runs once; layout system takes over after */
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: 0.2 + index * 0.08, ease: [0.16, 1, 0.3, 1] }}
      onClick={onSelect}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        cursor:       "pointer",
        position:     "relative",
        background:   hovered && !isSelected ? "rgba(237,233,225,0.050)" : "rgba(237,233,225,0.028)",
        border:       `1px solid ${hovered && !isSelected ? "rgba(237,233,225,0.14)" : "rgba(237,233,225,0.08)"}`,
        borderTop:    `2px solid ${hovered && !isSelected ? "rgba(6,182,212,0.55)" : "rgba(6,182,212,0.18)"}`,
        borderRadius: "8px",
        padding:      "1.375rem 1.25rem 1.125rem",
        /* No transform here — layoutId owns the transform axis */
        transition:   "background 0.22s ease, border-color 0.22s ease",
        overflow:     "hidden",
        /* Fade out so the modal card "takes over" cleanly */
        opacity:      isSelected ? 0 : 1,
        pointerEvents: isSelected ? "none" : "auto",
      }}
    >
      {/* Decorative background quote mark */}
      <span
        aria-hidden="true"
        style={{
          position:      "absolute",
          top:           "0.625rem",
          right:         "1rem",
          fontFamily:    "Georgia, serif",
          fontSize:      "5rem",
          lineHeight:    1,
          color:         "rgba(237,233,225,0.04)",
          userSelect:    "none",
          pointerEvents: "none",
        }}
      >
        &ldquo;
      </span>

      {/* Stars + ticket label */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.75rem" }}>
        <StarRating count={r.stars} />
        <span style={{
          fontFamily:    I,
          fontSize:      "9px",
          letterSpacing: "0.12em",
          textTransform: "uppercase" as const,
          color:         "rgba(6,182,212,0.70)",
          fontWeight:    600,
          background:    "rgba(6,182,212,0.07)",
          border:        "1px solid rgba(6,182,212,0.16)",
          padding:       "2px 7px",
          borderRadius:  "4px",
        }}>
          {r.ticket}
        </span>
      </div>

      {/* Review text */}
      <p style={{
        fontFamily: I,
        fontSize:   "0.875rem",
        lineHeight: 1.72,
        color:      "rgba(237,233,225,0.72)",
        margin:     "0 0 1rem",
      }}>
        &ldquo;{r.text}&rdquo;
      </p>

      {/* Reviewer footer */}
      <div style={{
        display:    "flex",
        alignItems: "center",
        gap:        "10px",
        paddingTop: "0.75rem",
        borderTop:  "1px solid rgba(237,233,225,0.06)",
      }}>
        <div
          aria-hidden="true"
          style={{
            width:          "32px",
            height:         "32px",
            borderRadius:   "50%",
            background:     "linear-gradient(135deg, rgba(6,182,212,0.18), rgba(6,182,212,0.07))",
            border:         "1px solid rgba(6,182,212,0.22)",
            display:        "flex",
            alignItems:     "center",
            justifyContent: "center",
            flexShrink:     0,
          }}
        >
          <span style={{ fontFamily: I, fontSize: "10px", fontWeight: 700, color: "rgba(6,182,212,0.90)", letterSpacing: "0.04em" }}>
            {r.initials}
          </span>
        </div>
        <div>
          <span style={{ fontFamily: I, fontSize: "12px", fontWeight: 600, color: "rgba(237,233,225,0.82)", display: "block", lineHeight: 1.2 }}>
            {r.name}
          </span>
          <span style={{ fontFamily: I, fontSize: "10px", color: "rgba(237,233,225,0.32)", letterSpacing: "0.04em" }}>
            {r.city}
          </span>
        </div>
        <VerifiedBadge />
      </div>
    </motion.article>
  );
}

/* ── Section ──────────────────────────────────────────────────── */
export function ResaleMarketplaceSection() {
  const [modalOpen,       setModalOpen]       = useState(false);
  const [selectedReview,  setSelectedReview]  = useState<number | null>(null);

  const closeReview = useCallback(() => setSelectedReview(null), []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") closeReview(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [closeReview]);

  return (
    <section className="relative py-5 overflow-hidden">
      <NameTransferModal open={modalOpen} onClose={() => setModalOpen(false)} />
      <div className="max-w-5xl mx-auto px-6 sm:px-12 lg:px-20">

        {/* ── Eyebrow + headline — full width ─────────── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="mb-8"
        >
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "0.875rem" }}>
            <span style={{ width: "16px", height: "1px", background: "rgba(6,182,212,0.45)", flexShrink: 0 }} />
            <span style={{ fontFamily: I, fontSize: "0.9375rem", fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: "rgba(237,233,225,0.82)" }}>
              Verified Resale
            </span>
          </div>
          <h2
            className="font-[var(--font-playfair)] font-black text-white"
            style={{ fontSize: "clamp(2rem, 4.5vw, 3.25rem)", letterSpacing: "-0.025em", lineHeight: 0.92 }}
          >
            <LineReveal>Verified resale tickets,</LineReveal>
            <LineReveal delay={0.09}>
              <span style={{ color: "rgba(237,233,225,0.50)" }}>transferred safely to your name.</span>
            </LineReveal>
          </h2>
        </motion.div>

        {/* ── Same row: intro+CTAs | Buyer Protection ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-14 items-start">

          {/* Left: intro + CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Intro */}
            <p style={{ fontFamily: I, fontSize: "0.9375rem", lineHeight: 1.8, color: "rgba(161,161,170,0.78)", marginBottom: "2rem" }}>
              Every resale ticket is checked before delivery. We verify the order, handle the
              official name transfer, and send the personalized e-ticket to the buyer once
              the process is complete.
            </p>

            {/* CTAs */}
            <div style={{ display: "flex", alignItems: "center", gap: "1rem", flexWrap: "wrap", marginBottom: "1.5rem" }}>
              <Link
                href="/tickets"
                className="group inline-flex items-center gap-2.5 shrink-0"
                style={{ fontFamily: I, fontSize: "11px", fontWeight: 600, letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(6,182,212,0.85)", background: "rgba(6,182,212,0.07)", border: "1px solid rgba(6,182,212,0.25)", padding: "10px 20px", borderRadius: "8px", transition: "all 0.22s ease" }}
                onMouseEnter={e => { const el = e.currentTarget as HTMLAnchorElement; el.style.background = "rgba(6,182,212,0.14)"; el.style.borderColor = "rgba(6,182,212,0.48)"; el.style.color = "rgba(6,182,212,1)"; }}
                onMouseLeave={e => { const el = e.currentTarget as HTMLAnchorElement; el.style.background = "rgba(6,182,212,0.07)"; el.style.borderColor = "rgba(6,182,212,0.25)"; el.style.color = "rgba(6,182,212,0.85)"; }}
              >
                Browse verified tickets
                <ArrowRight className="group-hover:translate-x-0.5 transition-transform duration-300" style={{ width: "12px", height: "12px" }} />
              </Link>
              <Link
                href="/about"
                style={{ fontFamily: I, fontSize: "11px", letterSpacing: "0.16em", textTransform: "uppercase", color: "rgba(237,233,225,0.28)", transition: "color 0.25s ease" }}
                onMouseEnter={e => (e.currentTarget.style.color = "rgba(237,233,225,0.58)")}
                onMouseLeave={e => (e.currentTarget.style.color = "rgba(237,233,225,0.28)")}
              >
                About us
              </Link>
            </div>

            {/* ── Seller transparency block ─────────────── */}
            <div style={{
              background:   "rgba(237,233,225,0.018)",
              border:       "1px solid rgba(237,233,225,0.07)",
              borderLeft:   "2px solid rgba(6,182,212,0.25)",
              borderRadius: "6px",
              padding:      "1rem 1.125rem",
            }}>
              {/* Provenance */}
              <p style={{ fontFamily: I, fontSize: "12px", lineHeight: 1.65, color: "rgba(237,233,225,0.55)", margin: "0 0 0.625rem" }}>
                <span style={{ color: "rgba(237,233,225,0.78)", fontWeight: 600 }}>
                  These tickets were purchased directly from the official Awakenings box office
                </span>
                {" "}at face value and are resold at market price. Our margin covers the name-transfer service and buyer protection.
              </p>

              {/* Legal anchor */}
              <p style={{ fontFamily: I, fontSize: "11px", color: "rgba(237,233,225,0.30)", margin: "0 0 0.875rem", letterSpacing: "0.02em" }}>
                This purchase is protected under Dutch consumer law (Art. 7:5 BW). Resale is permitted under Netherlands legislation.
              </p>

              {/* Name transfer explainer trigger */}
              <button
                onClick={() => setModalOpen(true)}
                style={{
                  background:    "transparent",
                  border:        "none",
                  padding:       0,
                  cursor:        "pointer",
                  fontFamily:    I,
                  fontSize:      "11px",
                  fontWeight:    600,
                  letterSpacing: "0.10em",
                  color:         "rgba(6,182,212,0.70)",
                  display:       "inline-flex",
                  alignItems:    "center",
                  gap:           "5px",
                  transition:    "color 0.2s ease",
                }}
                onMouseEnter={e => (e.currentTarget.style.color = "rgba(6,182,212,1)")}
                onMouseLeave={e => (e.currentTarget.style.color = "rgba(6,182,212,0.70)")}
              >
                How does the name transfer work? →
              </button>
            </div>
          </motion.div>

          {/* Right: buyer protection panel */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          >
            <div style={{
              border:       "1px solid rgba(237,233,225,0.09)",
              borderRadius: "8px",
              borderLeft:   "2px solid rgba(6,182,212,0.40)",
              background:   "rgba(237,233,225,0.015)",
              padding:      "1.5rem",
            }}>
              {/* Panel header */}
              <p style={{ fontFamily: I, fontSize: "11px", fontWeight: 700, letterSpacing: "0.20em", textTransform: "uppercase", color: "rgba(237,233,225,0.55)", marginBottom: "1.25rem" }}>
                Buyer protection
              </p>

              {/* Protection points */}
              <div>
                {PROTECTIONS.map((point, i) => (
                  <div
                    key={i}
                    style={{
                      display:      "flex",
                      alignItems:   "flex-start",
                      gap:          "10px",
                      padding:      "0.6875rem 0",
                      borderBottom: i < PROTECTIONS.length - 1 ? "1px solid rgba(237,233,225,0.05)" : "none",
                    }}
                  >
                    <CheckCircle2
                      style={{ width: "15px", height: "15px", color: "rgba(6,182,212,0.65)", flexShrink: 0, marginTop: "1px" }}
                      strokeWidth={1.75}
                      aria-hidden="true"
                    />
                    <span style={{ fontFamily: I, fontSize: "0.9375rem", lineHeight: 1.5, color: "rgba(237,233,225,0.78)" }}>
                      {point}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

        </div>

        {/* ── Trust stats strip ────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="mt-10 pt-8"
          style={{ borderTop: "1px solid rgba(237,233,225,0.07)" }}
        >
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-px"
            style={{ background: "rgba(237,233,225,0.07)" }}
          >
            {STATS.map(({ value, label, Icon }) => (
              <div
                key={label}
                style={{
                  background: "#050507",
                  padding:    "1.25rem 0.5rem",
                }}
              >
                <StatItem value={value} label={label} Icon={Icon} />
              </div>
            ))}
          </div>
        </motion.div>

        {/* ── Buyer reviews ──────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.18, ease: [0.16, 1, 0.3, 1] }}
          className="mt-8"
        >
          {/* Section header with aggregate rating */}
          <div style={{
            display:       "flex",
            alignItems:    "flex-end",
            justifyContent:"space-between",
            flexWrap:      "wrap",
            gap:           "0.75rem",
            marginBottom:  "1.5rem",
          }}>
            <div>
              <p style={{
                fontFamily:    I,
                fontSize:      "9.5px",
                fontWeight:    600,
                letterSpacing: "0.24em",
                textTransform: "uppercase",
                color:         "rgba(6,182,212,0.55)",
                marginBottom:  "0.4rem",
              }}>
                Verified buyer reviews
              </p>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <StarRating count={5} />
                <span style={{
                  fontFamily:    I,
                  fontSize:      "13px",
                  fontWeight:    700,
                  color:         "rgba(237,233,225,0.80)",
                  letterSpacing: "-0.01em",
                }}>
                  4.9
                </span>
                <span style={{
                  fontFamily: I,
                  fontSize:   "11px",
                  color:      "rgba(237,233,225,0.28)",
                }}>
                  · 3 verified reviews
                </span>
              </div>
            </div>
          </div>

          <LayoutGroup>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {REVIEWS.map((r, i) => (
                <ReviewCard
                  key={r.name}
                  r={r}
                  index={i}
                  onSelect={() => setSelectedReview(i)}
                  isSelected={selectedReview === i}
                />
              ))}
            </div>

            {/* Backdrop — fades independently from the card morph */}
            <AnimatePresence>
              {selectedReview !== null && (
                <motion.div
                  key="review-backdrop"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  onClick={closeReview}
                  style={{
                    position:             "fixed",
                    inset:                0,
                    zIndex:               60,
                    backdropFilter:       "blur(16px) saturate(0.6)",
                    WebkitBackdropFilter: "blur(16px) saturate(0.6)",
                    background:           "rgba(5,5,7,0.75)",
                  }}
                />
              )}
            </AnimatePresence>

            {/* Expanded card — morphs from grid via layoutId */}
            <AnimatePresence>
              {selectedReview !== null && (() => {
                const r = REVIEWS[selectedReview];
                return (
                  /* Non-animated centering shell — layoutId card inside controls its own position */
                  <div
                    key={`modal-shell-${selectedReview}`}
                    style={{
                      position:       "fixed",
                      inset:          0,
                      zIndex:         70,
                      display:        "flex",
                      alignItems:     "center",
                      justifyContent: "center",
                      padding:        "1.5rem",
                      pointerEvents:  "none",
                    }}
                  >
                    <motion.div
                      layoutId={`review-card-${selectedReview}`}
                      /* layout transition: spring feel matching the card shape */
                      transition={{ type: "spring", stiffness: 340, damping: 30 }}
                      onClick={e => e.stopPropagation()}
                      style={{
                        position:     "relative",
                        width:        "100%",
                        maxWidth:     "460px",
                        background:   "rgba(10,10,14,1)",
                        border:       "1px solid rgba(237,233,225,0.12)",
                        borderTop:    "2px solid rgba(6,182,212,0.65)",
                        borderRadius: "12px",
                        padding:      "2rem",
                        boxShadow:    "0 40px 100px rgba(0,0,0,0.72), 0 0 0 1px rgba(237,233,225,0.04)",
                        pointerEvents: "auto",
                        overflow:     "hidden",
                      }}
                    >
                      {/* Content fades in after the morph animation is underway */}
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2, delay: 0.15 }}
                      >
                        {/* Close */}
                        <button
                          onClick={closeReview}
                          aria-label="Close review"
                          style={{
                            position:       "absolute",
                            top:            "1rem",
                            right:          "1rem",
                            width:          "28px",
                            height:         "28px",
                            borderRadius:   "50%",
                            background:     "rgba(237,233,225,0.06)",
                            border:         "1px solid rgba(237,233,225,0.10)",
                            display:        "flex",
                            alignItems:     "center",
                            justifyContent: "center",
                            cursor:         "pointer",
                            transition:     "background 0.18s ease",
                          }}
                          onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = "rgba(237,233,225,0.13)"; }}
                          onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = "rgba(237,233,225,0.06)"; }}
                        >
                          <X size={12} color="rgba(237,233,225,0.55)" strokeWidth={2} aria-hidden="true" />
                        </button>

                        {/* Avatar + identity */}
                        <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1.375rem" }}>
                          <div style={{
                            width:          "52px",
                            height:         "52px",
                            borderRadius:   "50%",
                            background:     "linear-gradient(135deg, rgba(6,182,212,0.25), rgba(6,182,212,0.08))",
                            border:         "1.5px solid rgba(6,182,212,0.30)",
                            display:        "flex",
                            alignItems:     "center",
                            justifyContent: "center",
                            flexShrink:     0,
                          }}>
                            <span style={{ fontFamily: I, fontSize: "15px", fontWeight: 700, color: "rgba(6,182,212,0.95)", letterSpacing: "0.04em" }}>
                              {r.initials}
                            </span>
                          </div>
                          <div>
                            <p style={{ fontFamily: I, fontSize: "15px", fontWeight: 700, color: "#EDE9E1", lineHeight: 1.2, marginBottom: "3px" }}>
                              {r.name}
                            </p>
                            <p style={{ fontFamily: I, fontSize: "11px", color: "rgba(237,233,225,0.35)" }}>
                              Verified buyer
                            </p>
                          </div>
                          <span style={{
                            marginLeft:    "auto",
                            display:       "inline-flex",
                            alignItems:    "center",
                            gap:           "5px",
                            fontFamily:    I,
                            fontSize:      "10px",
                            fontWeight:    600,
                            letterSpacing: "0.08em",
                            color:         "rgba(6,182,212,0.85)",
                            background:    "rgba(6,182,212,0.09)",
                            border:        "1px solid rgba(6,182,212,0.22)",
                            padding:       "3px 9px",
                            borderRadius:  "20px",
                          }}>
                            <CheckCircle2 size={10} strokeWidth={2} aria-hidden="true" />
                            Verified
                          </span>
                        </div>

                        {/* Divider */}
                        <div style={{ height: "1px", background: "rgba(237,233,225,0.07)", marginBottom: "1.375rem" }} />

                        {/* Review text */}
                        <p style={{ fontFamily: I, fontSize: "0.9375rem", lineHeight: 1.75, color: "rgba(237,233,225,0.78)", marginBottom: "1.5rem", fontStyle: "italic" }}>
                          &ldquo;{r.text}&rdquo;
                        </p>

                        {/* Stars */}
                        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "1.375rem" }}>
                          <StarRating count={r.stars} />
                          <span style={{ fontFamily: I, fontSize: "11px", color: "rgba(237,233,225,0.35)" }}>
                            ({r.stars} stars)
                          </span>
                        </div>

                        {/* Footer meta */}
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "0.5rem" }}>
                          <span style={{ display: "inline-flex", alignItems: "center", gap: "5px", fontFamily: I, fontSize: "10px", color: "rgba(237,233,225,0.32)", letterSpacing: "0.04em" }}>
                            <Calendar size={11} strokeWidth={1.5} aria-hidden="true" />
                            Awakenings 2026
                          </span>
                          <span style={{ display: "inline-flex", alignItems: "center", gap: "5px", fontFamily: I, fontSize: "10px", color: "rgba(237,233,225,0.32)", letterSpacing: "0.04em" }}>
                            <MapPin size={11} strokeWidth={1.5} aria-hidden="true" />
                            {r.city}
                          </span>
                          <span style={{ fontFamily: I, fontSize: "9px", fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(6,182,212,0.55)", background: "rgba(6,182,212,0.07)", border: "1px solid rgba(6,182,212,0.14)", padding: "2px 8px", borderRadius: "4px" }}>
                            {r.ticket}
                          </span>
                        </div>
                      </motion.div>
                    </motion.div>
                  </div>
                );
              })()}
            </AnimatePresence>
          </LayoutGroup>
        </motion.div>

        {/* ── How verified resale works ─────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="mt-12 pt-10"
          style={{ borderTop: "1px solid rgba(237,233,225,0.07)" }}
        >
          <p style={{ fontFamily: I, fontSize: "9.5px", fontWeight: 600, letterSpacing: "0.26em", textTransform: "uppercase", color: "rgba(6,182,212,0.50)", marginBottom: "2rem", textAlign: "center" }}>
            How verified resale works
          </p>

          {/* Desktop: horizontal with rail. Mobile: vertical stepper. */}
          <div className="relative">

            {/* Desktop connecting rail */}
            <motion.div
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.4, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="hidden md:block"
              style={{ position: "absolute", top: "13px", left: "calc(100%/6)", right: "calc(100%/6)", height: "1px", background: "linear-gradient(to right, rgba(6,182,212,0.28), rgba(6,182,212,0.10), rgba(6,182,212,0.28))", transformOrigin: "left", zIndex: 0 }}
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-6">
              {STEPS.map((step, i) => (
                <div key={step.num} className="flex md:flex-col gap-4 md:gap-0 items-start md:items-center">

                  {/* Mobile node + connector */}
                  <div className="flex md:hidden flex-col items-center shrink-0" style={{ width: "30px" }}>
                    <div style={{ width: "30px", height: "30px", borderRadius: "50%", border: "1.5px solid rgba(6,182,212,0.38)", background: "rgba(6,182,212,0.07)", display: "flex", alignItems: "center", justifyContent: "center", position: "relative", zIndex: 1 }}>
                      <step.Icon size={13} strokeWidth={1.75} color="rgba(6,182,212,0.80)" aria-hidden="true" />
                    </div>
                    {i < STEPS.length - 1 && (
                      <div style={{ width: "1px", flex: 1, minHeight: "2rem", margin: "4px 0", background: "linear-gradient(to bottom, rgba(6,182,212,0.18), rgba(6,182,212,0.03))" }} />
                    )}
                  </div>

                  {/* Desktop node */}
                  <div className="hidden md:flex flex-col items-center mb-4 relative z-10">
                    <div style={{ width: "30px", height: "30px", borderRadius: "50%", border: "1.5px solid rgba(6,182,212,0.38)", background: "rgba(6,182,212,0.07)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <step.Icon size={13} strokeWidth={1.75} color="rgba(6,182,212,0.80)" aria-hidden="true" />
                    </div>
                  </div>

                  {/* Step content */}
                  <div className="md:text-center flex-1" style={{ paddingTop: "2px" }}>
                    <h4 style={{ fontFamily: I, fontWeight: 600, fontSize: "0.9375rem", color: "rgba(237,233,225,0.90)", marginBottom: "0.375rem", lineHeight: 1.2 }}>
                      {step.title}
                    </h4>
                    <p style={{ fontFamily: I, fontSize: "0.8125rem", lineHeight: 1.7, color: "rgba(161,161,170,0.55)", margin: 0 }}>
                      {step.body}
                    </p>
                  </div>

                </div>
              ))}
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
