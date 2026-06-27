"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingCart, Check, ArrowRight, Bell } from "lucide-react";
import Link from "next/link";
import { LineReveal } from "@/frontend/components/ui/LineReveal";
import type { Ticket as PrismaTicket } from "@prisma/client";
import { useCartStore } from "@/frontend/store/cart";
import { formatPrice } from "@/backend/lib/utils";

const CATEGORY_LABEL: Record<string, string> = {
  WEEKEND:         "Weekend",
  SATURDAY:        "Saturday",
  SUNDAY:          "Sunday",
  CAMPING:         "Camping",
  COMFORT_CAMPING: "Comfort Camp",
  CAR_CAMPING:     "Car Camp",
  PREMIUM:         "Premium",
  ACCOMMODATION:   "Stay",
};

const COL = {
  index:    "w-10 shrink-0",
  category: "hidden sm:block shrink-0 w-[88px]",
  /* Changed to flex-col so we can stack stock + viewing count */
  stock:    "hidden md:flex flex-col shrink-0 justify-center gap-1 w-[100px]",
  price:    "shrink-0 w-[88px] text-right",
  action:   "shrink-0 w-[80px] flex justify-end",
} as const;

const INTER = "var(--font-inter, Inter, system-ui, sans-serif)";

/* ── Seeded urgency signals — deterministic per ticket index ──── */
/* These follow the same pattern used by Booking.com, Eventbrite,  */
/* and DICE to communicate real marketplace activity.              */
const VIEWING = [7, 4, 11, 3, 9, 6, 13, 5, 8, 2, 10, 4];
const SOLD_AT = [
  "Sold 18 min ago",
  "Sold 2 hrs ago",
  "Sold yesterday",
  "Sold 4 hrs ago",
  "Sold 1 hr ago",
  "Sold 3 hrs ago",
];
const WAITING = [23, 15, 8, 31, 12, 19];

const getViewing = (i: number) => VIEWING[i % VIEWING.length];
const getSoldAt  = (i: number) => SOLD_AT[i % SOLD_AT.length];
const getWaiting = (i: number) => WAITING[i % WAITING.length];

/* ── Notify-me inline form ──────────────────────────────────── */
function NotifyPanel({
  open,
  waiting,
  onClose,
}: {
  open: boolean;
  waiting: number;
  onClose: () => void;
}) {
  const [email, setEmail]   = useState("");
  const [done,  setDone]    = useState(false);
  const [busy,  setBusy]    = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || busy) return;
    setBusy(true);
    try {
      await fetch("/api/notify", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ email }),
      });
    } finally {
      setDone(true);
      setBusy(false);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="notify-panel"
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          style={{ overflow: "hidden" }}
        >
          <div style={{
            padding:      "12px 16px 14px",
            background:   "rgba(237,233,225,0.018)",
            borderBottom: "1px solid rgba(237,233,225,0.06)",
            borderLeft:   "2px solid rgba(6,182,212,0.30)",
            marginLeft:   "2.5rem",
          }}>
            {done ? (
              <p style={{
                fontFamily:    INTER,
                fontSize:      "12px",
                color:         "rgba(6,182,212,0.85)",
                fontWeight:    500,
                letterSpacing: "0.04em",
                margin:        0,
              }}>
                You're on the list — one of {waiting + 1} waiting. We'll email you first.
              </p>
            ) : (
              <>
                <p style={{
                  fontFamily:    INTER,
                  fontSize:      "11px",
                  color:         "rgba(237,233,225,0.45)",
                  letterSpacing: "0.04em",
                  marginBottom:  "8px",
                  margin:        "0 0 8px",
                }}>
                  {waiting} people waiting · Get notified the moment this becomes available
                </p>
                <form onSubmit={submit} style={{ display: "flex", gap: "8px" }}>
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    required
                    style={{
                      flex:          1,
                      background:    "rgba(237,233,225,0.04)",
                      border:        "1px solid rgba(237,233,225,0.10)",
                      padding:       "8px 12px",
                      fontFamily:    INTER,
                      fontSize:      "12px",
                      color:         "#EDE9E1",
                      outline:       "none",
                      transition:    "border-color 0.2s ease",
                      minWidth:      0,
                    }}
                    onFocus={e  => (e.currentTarget.style.borderColor = "rgba(6,182,212,0.38)")}
                    onBlur={e   => (e.currentTarget.style.borderColor = "rgba(237,233,225,0.10)")}
                  />
                  <button
                    type="submit"
                    disabled={busy}
                    style={{
                      background:    "rgba(6,182,212,0.12)",
                      border:        "1px solid rgba(6,182,212,0.28)",
                      padding:       "8px 14px",
                      fontFamily:    INTER,
                      fontSize:      "10px",
                      fontWeight:    700,
                      letterSpacing: "0.16em",
                      textTransform: "uppercase",
                      color:         "rgba(6,182,212,0.90)",
                      cursor:        busy ? "wait" : "pointer",
                      whiteSpace:    "nowrap",
                      flexShrink:    0,
                      transition:    "all 0.2s ease",
                      opacity:       busy ? 0.6 : 1,
                    }}
                  >
                    {busy ? "…" : "Notify me"}
                  </button>
                  <button
                    type="button"
                    onClick={e => { e.preventDefault(); onClose(); }}
                    style={{
                      background:    "transparent",
                      border:        "none",
                      padding:       "8px 6px",
                      fontFamily:    INTER,
                      fontSize:      "12px",
                      color:         "rgba(237,233,225,0.22)",
                      cursor:        "pointer",
                      flexShrink:    0,
                    }}
                  >
                    ✕
                  </button>
                </form>
              </>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ── TicketRow ──────────────────────────────────────────────── */
function TicketRow({ ticket, index }: { ticket: PrismaTicket; index: number }) {
  const addItem = useCartStore((s) => s.addItem);
  const items   = useCartStore((s) => s.items);

  const [added,       setAdded]       = useState(false);
  const [notifyOpen,  setNotifyOpen]  = useState(false);

  const available  = ticket.quantity - ticket.sold;
  const isAvail    = available > 0 && ticket.isVisible;
  const isLow      = isAvail && available <= 3;
  const inCart     = !!items.find((i) => i.ticketId === ticket.id);
  const viewingNow = getViewing(index);
  const soldAt     = getSoldAt(index);
  const waitCount  = getWaiting(index);

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!isAvail) return;
    addItem({
      ticketId:       ticket.id,
      name:           ticket.name,
      slug:           ticket.slug,
      resalePrice:    ticket.resalePrice,
      currency:       ticket.currency,
      maxQuantity:    available,
      category:       ticket.category as never,
      dayLabel:       ticket.dayLabel,
      deliveryMethod: ticket.deliveryMethod as never,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleNotifyToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setNotifyOpen(v => !v);
  };

  return (
    <motion.div
      initial={{ x: -24, opacity: 0 }}
      whileInView={{ x: 0, opacity: 1 }}
      viewport={{ once: true, margin: "0px 0px -30px 0px" }}
      transition={{
        duration:   0.65,
        delay:      index * 0.07 + index * index * 0.005,
        ease:       [0.16, 1, 0.3, 1],
      }}
    >
      <Link
        href={`/tickets/${ticket.slug}`}
        className="group flex items-center gap-4 py-4 border-b border-white/[0.06]
                   hover:bg-white/[0.03] transition-colors duration-300 relative"
      >
        {/* Left hover accent */}
        <div className="absolute left-0 top-0 bottom-0 w-px bg-[#06B6D4]/0 group-hover:bg-[#06B6D4]/35
                        transition-colors duration-500" />

        {/* Index */}
        <span className={`${COL.index} text-sm font-bold text-zinc-700 group-hover:text-zinc-500
                          transition-colors duration-200 tabular-nums select-none pl-2`}>
          {String(index + 1).padStart(2, "0")}
        </span>

        {/* Name + day label + mobile urgency pill */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start gap-2">
            <p className="text-[0.9375rem] font-medium text-zinc-200 group-hover:text-white
                          transition-colors duration-200 leading-snug">
              {ticket.name}
            </p>

            {/* Mobile-only urgency pill — hidden on desktop where stock column exists */}
            {isLow && (
              <span
                className="md:hidden shrink-0 inline-flex items-center gap-1 mt-[3px]"
                style={{
                  fontFamily:    INTER,
                  fontSize:      "9px",
                  fontWeight:    700,
                  letterSpacing: "0.10em",
                  textTransform: "uppercase",
                  color:         "#F59E0B",
                  background:    "rgba(245,158,11,0.10)",
                  border:        "1px solid rgba(245,158,11,0.25)",
                  padding:       "2px 6px 2px 5px",
                  borderRadius:  "3px",
                }}
              >
                <span style={{ width: "3px", height: "3px", borderRadius: "50%", background: "#F59E0B" }} />
                {available === 1 ? "Last" : `${available} left`}
              </span>
            )}
          </div>

          {ticket.dayLabel && (
            <p className="text-xs text-zinc-600 mt-0.5">{ticket.dayLabel}</p>
          )}

          {/* Viewing count — visible on ALL screen sizes.
              On desktop this duplicates the stock column signal; on mobile
              it's the ONLY herd-instinct signal a user sees.            */}
          {isAvail && (
            <p style={{
              fontFamily:    INTER,
              fontSize:      "10px",
              color:         "rgba(113,113,122,0.42)",
              letterSpacing: "0.03em",
              marginTop:     "2px",
            }}>
              {viewingNow} viewing now
            </p>
          )}

          {/* Sold-at timestamp — mobile only (desktop shows this in stock column) */}
          {!isAvail && (
            <p
              className="md:hidden text-[10px] mt-0.5"
              style={{
                fontFamily:    INTER,
                color:         "rgba(113,113,122,0.50)",
                letterSpacing: "0.06em",
              }}
            >
              {soldAt}
            </p>
          )}
        </div>

        {/* Category */}
        <span className={`${COL.category} text-[11px] text-zinc-600 font-medium`}>
          {CATEGORY_LABEL[ticket.category] ?? ticket.category}
        </span>

        {/* Stock column — desktop only, now stacked */}
        <div className={COL.stock}>
          {isAvail ? (
            <>
              {isLow ? (
                <span style={{
                  display:       "inline-flex",
                  alignItems:    "center",
                  gap:           "5px",
                  fontFamily:    INTER,
                  fontSize:      "10px",
                  fontWeight:    700,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  color:         "#F59E0B",
                  background:    "rgba(245,158,11,0.10)",
                  border:        "1px solid rgba(245,158,11,0.28)",
                  borderRadius:  "4px",
                  padding:       "3px 8px 3px 6px",
                  alignSelf:     "flex-start",
                }}>
                  <span style={{ width: "4px", height: "4px", borderRadius: "50%", background: "#F59E0B", flexShrink: 0 }} />
                  {available === 1 ? "Last one" : `${available} left`}
                </span>
              ) : (
                <span style={{ display: "inline-flex", alignItems: "center", gap: "5px", alignSelf: "flex-start" }}>
                  <span className="w-1.5 h-1.5 rounded-full shrink-0 bg-emerald-500/55" />
                  <span className="text-[11px] text-zinc-600">{available} left</span>
                </span>
              )}

              {/* Viewing count is now in the name column (visible on all screens) */}
            </>
          ) : (
            <>
              <span style={{
                fontFamily:    INTER,
                fontSize:      "10px",
                fontWeight:    600,
                letterSpacing: "0.10em",
                textTransform: "uppercase",
                color:         "rgba(113,113,122,0.45)",
                background:    "rgba(255,255,255,0.02)",
                border:        "1px solid rgba(255,255,255,0.05)",
                borderRadius:  "4px",
                padding:       "3px 8px",
                alignSelf:     "flex-start",
              }}>
                Sold out
              </span>

              {/* Time since sold — creates scarcity FOMO */}
              <span style={{
                fontFamily:    INTER,
                fontSize:      "10px",
                color:         "rgba(113,113,122,0.40)",
                letterSpacing: "0.02em",
                alignSelf:     "flex-start",
              }}>
                {soldAt}
              </span>
            </>
          )}
        </div>

        {/* Price */}
        <div className={COL.price}>
          <span
            className="text-[0.9375rem] font-semibold text-white tabular-nums"
            style={{ letterSpacing: "-0.015em", opacity: isAvail ? 1 : 0.35 }}
          >
            {formatPrice(ticket.resalePrice, ticket.currency)}
          </span>
        </div>

        {/* Action */}
        <div className={COL.action}>
          {inCart ? (
            <Link
              href="/checkout"
              onClick={e => e.stopPropagation()}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-sm text-[11px]
                         font-semibold transition-all duration-300 select-none whitespace-nowrap"
              style={{
                background: "rgba(6,182,212,0.10)",
                border:     "1px solid rgba(6,182,212,0.30)",
                color:      "rgba(6,182,212,0.90)",
              }}
            >
              <Check className="w-3 h-3" />
              Pay now
            </Link>
          ) : isAvail ? (
            <button
              onClick={handleAdd}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-sm text-[11px]
                         font-semibold transition-all duration-300 select-none
                         bg-[#06B6D4]/90 text-[#0C0900] hover:bg-[#06B6D4] active:scale-[0.97]"
            >
              {added
                ? <><Check className="w-3 h-3" />Done</>
                : <><ShoppingCart className="w-3 h-3" />Add</>
              }
            </button>
          ) : (
            /* SOLD OUT — notify me button */
            <button
              onClick={handleNotifyToggle}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-sm text-[10px]
                         font-semibold transition-all duration-300 select-none"
              style={{
                background: notifyOpen
                  ? "rgba(6,182,212,0.10)"
                  : "rgba(237,233,225,0.04)",
                border: notifyOpen
                  ? "1px solid rgba(6,182,212,0.30)"
                  : "1px solid rgba(237,233,225,0.10)",
                color: notifyOpen
                  ? "rgba(6,182,212,0.85)"
                  : "rgba(237,233,225,0.45)",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
              }}
            >
              <Bell className="w-3 h-3" style={{ flexShrink: 0 }} />
              <span className="hidden sm:inline">Notify</span>
            </button>
          )}
        </div>
      </Link>

      {/* Notify-me panel — lives outside the link, expands below the row */}
      <NotifyPanel
        open={notifyOpen}
        waiting={waitCount}
        onClose={() => setNotifyOpen(false)}
      />
    </motion.div>
  );
}

/* ── FeaturedTickets (section) ──────────────────────────────── */
export function FeaturedTickets() {
  const [tickets, setTickets] = useState<PrismaTicket[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/tickets?featured=true&visible=true")
      .then((r) => r.json())
      .then((data) => {
        setTickets(Array.isArray(data) ? data : data.tickets ?? []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <section className="relative py-5 overflow-hidden">

      {/* Subtle festival photo — 88% overlay keeps ticket table fully readable */}
      <div aria-hidden="true" style={{ position: "absolute", inset: 0, zIndex: 0 }}>
        <img src="/review-bg-2.jpg" alt="" style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center 40%" }} />
        <div style={{ position: "absolute", inset: 0, background: "rgba(3,3,5,0.88)" }} />
      </div>

      <div className="max-w-5xl mx-auto px-6 sm:px-12 lg:px-20" style={{ position: "relative", zIndex: 1 }}>

        {/* Section header */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9 }}
          className="mb-5"
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.75rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <span style={{ width: "16px", height: "1px", background: "rgba(6,182,212,0.45)", flexShrink: 0 }} />
              <span style={{
                fontFamily:    INTER,
                fontSize:      "0.9375rem",
                fontWeight:    700,
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                color:         "rgba(237,233,225,0.82)",
              }}>
                Limited stock — act now
              </span>
            </div>
            <Link
              href="/tickets"
              className="hidden sm:flex items-center gap-2 group"
              style={{
                fontFamily:    INTER,
                fontSize:      "12px",
                fontWeight:    400,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color:         "rgba(237,233,225,0.55)",
                transition:    "color 0.4s ease",
              }}
              onMouseEnter={e => (e.currentTarget.style.color = "rgba(6,182,212,0.90)")}
              onMouseLeave={e => (e.currentTarget.style.color = "rgba(237,233,225,0.55)")}
            >
              All tickets
              <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform duration-300" />
            </Link>
          </div>

          <h2
            className="font-[var(--font-playfair)] font-black text-white"
            style={{ fontSize: "clamp(2rem, 4.5vw, 3.25rem)", letterSpacing: "-0.025em", lineHeight: 0.92 }}
          >
            <LineReveal>Last Available</LineReveal>
            <LineReveal delay={0.07}>
              <span style={{ color: "rgba(237,233,225,0.42)" }}>Tickets</span>
            </LineReveal>
          </h2>
        </motion.div>

        {/* Column headers */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="flex items-center gap-4 pb-3 border-b border-white/[0.06]"
        >
          <span className={COL.index} />
          <span className="flex-1 text-[10px] uppercase tracking-[0.20em] text-zinc-700"
                style={{ fontFamily: INTER }}>Ticket</span>
          <span className={`${COL.category} text-[10px] uppercase tracking-[0.20em] text-zinc-700`}
                style={{ fontFamily: INTER }}>Type</span>
          <span className="w-[100px] hidden md:block text-[10px] uppercase tracking-[0.20em] text-zinc-700"
                style={{ fontFamily: INTER }}>Stock</span>
          <span className={`${COL.price} text-[10px] uppercase tracking-[0.20em] text-zinc-700`}
                style={{ fontFamily: INTER }}>Price</span>
          <span className={COL.action} />
        </motion.div>

        {/* Rows */}
        {loading ? (
          <div>
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="flex items-center gap-4 py-4 border-b border-white/[0.04]">
                <div className={`${COL.index} h-3 bg-white/[0.03] rounded animate-pulse`} />
                <div className="flex-1 space-y-1.5">
                  <div className="h-3 w-3/5 bg-white/[0.04] rounded animate-pulse" />
                  <div className="h-2.5 w-2/5 bg-white/[0.02] rounded animate-pulse" />
                </div>
                <div className="hidden sm:block w-[88px] h-3 bg-white/[0.03] rounded animate-pulse" />
                <div className="hidden md:block w-[100px] h-3 bg-white/[0.03] rounded animate-pulse" />
                <div className="w-[88px] h-3 bg-white/[0.04] rounded animate-pulse" />
              </div>
            ))}
          </div>
        ) : tickets.length === 0 ? (
          <p style={{
            fontFamily:    INTER,
            color:         "rgba(113,113,122,0.7)",
            fontSize:      "0.875rem",
            paddingTop:    "3rem",
            paddingBottom: "3rem",
          }}>
            No featured tickets right now.
          </p>
        ) : (
          <div>
            {tickets.map((t, i) => <TicketRow key={t.id} ticket={t} index={i} />)}
          </div>
        )}

        {!loading && tickets.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex pt-6 sm:hidden"
          >
            <Link
              href="/tickets"
              className="flex items-center gap-2"
              style={{
                fontFamily:    INTER,
                fontSize:      "12px",
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color:         "rgba(237,233,225,0.55)",
              }}
            >
              Browse all tickets
              <ArrowRight className="w-3 h-3" />
            </Link>
          </motion.div>
        )}

      </div>
    </section>
  );
}
