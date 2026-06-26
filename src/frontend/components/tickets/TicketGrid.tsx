"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import { Search, X, ArrowUpDown, ChevronDown, ShieldCheck, Clock, Lock, Check } from "lucide-react";
import Link from "next/link";
import { TicketCard } from "./TicketCard";
import { TicketCategory, type Ticket } from "@/frontend/types/tickets";
import { motion, AnimatePresence } from "framer-motion";

/* ── Filter + sort config ──────────────────────────────────────── */
const TABS = [
  { value: "ALL",                          label: "All"      },
  { value: TicketCategory.WEEKEND,         label: "Weekend"  },
  { value: TicketCategory.SATURDAY,        label: "Saturday" },
  { value: TicketCategory.SUNDAY,          label: "Sunday"   },
  { value: TicketCategory.CAMPING,         label: "Camping"  },
  { value: TicketCategory.COMFORT_CAMPING, label: "Comfort"  },
  { value: TicketCategory.CAR_CAMPING,     label: "Car Camp" },
  { value: TicketCategory.PREMIUM,         label: "Premium"  },
  { value: TicketCategory.ACCOMMODATION,   label: "Stay"     },
] as const;

const SORT_OPTIONS = [
  { value: "price-asc",    label: "Price: low → high"  },
  { value: "price-desc",   label: "Price: high → low"  },
  { value: "newest",       label: "Newest first"        },
  { value: "availability", label: "Most available"      },
];

const TRUST_CHIPS = [
  { Icon: ShieldCheck, text: "Sourced from Awakenings.nl" },
  { Icon: Check,       text: "Official name transfer"     },
  { Icon: Clock,       text: "E-ticket July 8, 2026"      },
  { Icon: Lock,        text: "Stripe secured"             },
] as const;

/* ── Animation variants ────────────────────────────────────────── */
const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.04 } },
};

const itemVariants = {
  hidden:  { opacity: 0, y: 14 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.28, ease: "easeOut" as const } },
};

export function TicketGrid({ tickets }: { tickets: Ticket[] }) {
  const [category, setCategory] = useState("ALL");
  const [sort, setSort]         = useState("price-asc");
  const [query, setQuery]       = useState("");
  const [sortOpen, setSortOpen] = useState(false);
  const sortRef                 = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (sortRef.current && !sortRef.current.contains(e.target as Node)) {
        setSortOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const visible = useMemo(
    () => tickets.filter(t => t.isVisible),
    [tickets]
  );

  const tabCounts = useMemo(() => {
    const counts: Record<string, number> = { ALL: visible.length };
    visible.forEach(t => { counts[t.category] = (counts[t.category] ?? 0) + 1; });
    return counts;
  }, [visible]);

  const filtered = useMemo(() => {
    let result = visible;

    if (category !== "ALL") {
      result = result.filter(t => t.category === category);
    }

    if (query.trim()) {
      const q = query.toLowerCase();
      result = result.filter(t =>
        t.name.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q) ||
        (t.dayLabel && t.dayLabel.toLowerCase().includes(q))
      );
    }

    switch (sort) {
      case "price-asc":    return [...result].sort((a, b) => a.resalePrice - b.resalePrice);
      case "price-desc":   return [...result].sort((a, b) => b.resalePrice - a.resalePrice);
      case "newest":       return [...result].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      case "availability": return [...result].sort((a, b) => (b.quantity - b.sold) - (a.quantity - a.sold));
    }

    return result;
  }, [visible, category, sort, query]);

  const hasFilters      = category !== "ALL" || query.trim() !== "";
  const activeTabLabel  = TABS.find(t => t.value === category)?.label ?? "All";
  const activeSortLabel = SORT_OPTIONS.find(o => o.value === sort)?.label ?? "";

  const clearFilters = () => { setCategory("ALL"); setQuery(""); };

  return (
    <div>
      {/* ── Sticky toolbar ────────────────────────────────────────── */}
      <div className="sticky top-16 z-20 -mx-4 sm:-mx-6 lg:-mx-8 mb-8">

        {/* ── Category filter pills ─────────────────────────────── */}
        <div
          className="flex items-center gap-1.5 overflow-x-auto hide-scrollbar px-4 sm:px-6 lg:px-8 py-3"
          style={{
            background:   "#050507",
            borderBottom: "1px solid rgba(255,255,255,0.06)",
          }}
        >
          {TABS.map(tab => {
            const count    = tabCounts[tab.value] ?? 0;
            const isActive = category === tab.value;
            if (tab.value !== "ALL" && count === 0) return null;

            return (
              <button
                key={tab.value}
                onClick={() => setCategory(tab.value)}
                className={[
                  "flex-shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full",
                  "text-xs font-medium whitespace-nowrap",
                  "transition-all duration-150 select-none cursor-pointer",
                  isActive
                    ? "bg-white/[0.14] text-white border border-white/[0.18]"
                    : "text-zinc-500 hover:text-zinc-200 hover:bg-white/[0.06] border border-transparent",
                ].join(" ")}
              >
                {tab.label}
                {tab.value !== "ALL" && count > 0 && (
                  <span
                    className={[
                      "text-[10px] font-semibold tabular-nums px-1.5 py-0.5 rounded-full leading-none",
                      isActive ? "bg-white/[0.14] text-zinc-300" : "bg-white/[0.06] text-zinc-600",
                    ].join(" ")}
                  >
                    {count}
                  </span>
                )}
              </button>
            );
          })}

          {/* Push-right: sort control */}
          <div className="flex-1 min-w-[1rem]" />
          <div className="relative shrink-0" ref={sortRef}>
            <button
              onClick={() => setSortOpen(v => !v)}
              className="flex items-center gap-1.5 text-xs text-zinc-500 hover:text-zinc-200 transition-colors py-1.5 px-2 rounded-lg hover:bg-white/[0.05] select-none cursor-pointer"
              aria-haspopup="listbox"
              aria-expanded={sortOpen}
              aria-label={`Sort: ${activeSortLabel}`}
            >
              <ArrowUpDown className="w-3 h-3 shrink-0" aria-hidden="true" />
              <span className="hidden sm:inline">{activeSortLabel}</span>
              <ChevronDown className={`w-3 h-3 shrink-0 transition-transform duration-150 ${sortOpen ? "rotate-180" : ""}`} aria-hidden="true" />
            </button>

            {sortOpen && (
              <div
                role="listbox"
                aria-label="Sort options"
                className="absolute right-0 top-full mt-1.5 z-30 min-w-[176px] rounded-xl border border-white/[0.10] py-1 shadow-2xl"
                style={{ background: "#0C0D10" }}
              >
                {SORT_OPTIONS.map(opt => (
                  <button
                    key={opt.value}
                    role="option"
                    aria-selected={sort === opt.value}
                    onClick={() => { setSort(opt.value); setSortOpen(false); }}
                    className={[
                      "w-full text-left px-3.5 py-2 text-xs transition-colors duration-100 cursor-pointer",
                      sort === opt.value
                        ? "text-[#06B6D4] bg-[#06B6D4]/[0.06]"
                        : "text-zinc-400 hover:text-white hover:bg-white/[0.04]",
                    ].join(" ")}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ── Search + count row ────────────────────────────────── */}
        <div
          className="flex items-center gap-3 px-4 sm:px-6 lg:px-8 py-2.5"
          style={{ background: "#050507", borderTop: "1px solid rgba(255,255,255,0.04)" }}
        >
          <div className="relative flex-1 max-w-xs">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-600 pointer-events-none" aria-hidden="true" />
            <input
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search tickets…"
              aria-label="Search tickets"
              className="w-full pl-8 pr-7 py-1.5 bg-white/[0.04] border border-white/[0.07] rounded-lg text-zinc-200 placeholder-zinc-700 text-sm focus:outline-none focus:border-white/[0.16] transition-colors"
            />
            {query && (
              <button
                onClick={() => setQuery("")}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-zinc-600 hover:text-zinc-300 transition-colors cursor-pointer"
                aria-label="Clear search"
              >
                <X className="w-3 h-3" aria-hidden="true" />
              </button>
            )}
          </div>

          <p className="text-xs text-zinc-600 tabular-nums shrink-0 ml-auto" aria-live="polite">
            {filtered.length === 0 ? "No results" : `${filtered.length} ticket${filtered.length !== 1 ? "s" : ""}`}
          </p>

          {hasFilters && (
            <button
              onClick={clearFilters}
              className="text-xs text-zinc-600 hover:text-zinc-300 transition-colors shrink-0 flex items-center gap-1 cursor-pointer"
            >
              <X className="w-3 h-3" aria-hidden="true" />
              Clear
            </button>
          )}
        </div>
      </div>

      {/* ── Trust chips ───────────────────────────────────────────── */}
      <div className="flex flex-wrap items-center gap-2 mb-8">
        {TRUST_CHIPS.map(({ Icon, text }) => (
          <span
            key={text}
            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[11px] font-medium whitespace-nowrap"
            style={{
              background: "rgba(6,182,212,0.05)",
              border:     "1px solid rgba(6,182,212,0.12)",
              color:      "rgba(161,161,170,0.68)",
            }}
          >
            <Icon
              className="w-3 h-3 shrink-0"
              style={{ color: "rgba(6,182,212,0.65)" }}
              strokeWidth={1.75}
              aria-hidden="true"
            />
            {text}
          </span>
        ))}
      </div>

      {/* ── Grid / empty state ────────────────────────────────────── */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 gap-5 text-center">
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center"
            style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}
          >
            <Search className="w-5 h-5 text-zinc-700" aria-hidden="true" />
          </div>
          <div className="max-w-[260px]">
            <p className="text-sm font-semibold text-zinc-300 mb-1.5">
              {query ? "No matching tickets" : `No ${activeTabLabel !== "All" ? activeTabLabel + " " : ""}tickets`}
            </p>
            <p className="text-xs text-zinc-600 leading-relaxed">
              {query
                ? `"${query}" returned no results${category !== "ALL" ? ` in ${activeTabLabel}` : ""}.`
                : "Try a different category or check back soon."}
            </p>
          </div>
          {hasFilters && (
            <div className="flex items-center gap-2">
              <button
                onClick={clearFilters}
                className="px-4 py-2 rounded-xl text-xs font-semibold cursor-pointer transition-all duration-150"
                style={{
                  background: "rgba(6,182,212,0.10)",
                  border:     "1px solid rgba(6,182,212,0.22)",
                  color:      "rgba(6,182,212,0.90)",
                }}
              >
                Clear filters
              </button>
              <Link
                href="/"
                className="px-4 py-2 rounded-xl text-xs font-medium text-zinc-600 hover:text-zinc-300 transition-colors"
                style={{ border: "1px solid rgba(255,255,255,0.07)" }}
              >
                Go home
              </Link>
            </div>
          )}
        </div>
      ) : (
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          key={`${category}-${sort}-${query}`}
        >
          <AnimatePresence mode="popLayout">
            {filtered.map(ticket => (
              <motion.div
                key={ticket.id}
                layout
                variants={itemVariants}
                exit={{ opacity: 0, scale: 0.97, transition: { duration: 0.12 } }}
              >
                <TicketCard ticket={ticket} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}

      {/* Screen-reader live region for filter changes */}
      <p className="sr-only" aria-live="polite">
        Sorted by {activeSortLabel}. Showing {filtered.length} tickets.
      </p>
    </div>
  );
}
