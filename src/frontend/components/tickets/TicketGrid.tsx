"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import { Search, X, ArrowUpDown, ChevronDown, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { TicketCard } from "./TicketCard";
import { TicketCategory, type Ticket } from "@/frontend/types/tickets";
import { motion, AnimatePresence } from "framer-motion";

const TABS = [
  { value: "ALL",                          label: "All" },
  { value: TicketCategory.WEEKEND,         label: "Weekend" },
  { value: TicketCategory.SATURDAY,        label: "Saturday" },
  { value: TicketCategory.SUNDAY,          label: "Sunday" },
  { value: TicketCategory.CAMPING,         label: "Camping" },
  { value: TicketCategory.COMFORT_CAMPING, label: "Comfort Camp" },
  { value: TicketCategory.CAR_CAMPING,     label: "Car Camp" },
  { value: TicketCategory.PREMIUM,         label: "Premium" },
  { value: TicketCategory.ACCOMMODATION,   label: "Stay" },
] as const;

const SORT_OPTIONS = [
  { value: "price-asc",    label: "Price: Low to High" },
  { value: "price-desc",   label: "Price: High to Low" },
  { value: "newest",       label: "Newest First" },
  { value: "availability", label: "Most Available" },
];

const containerVariants = {
  hidden: {},
  // 0.02 stagger: filter re-renders feel immediate; 0.04+ reads as "still loading"
  visible: { transition: { staggerChildren: 0.02 } },
};

const itemVariants = {
  hidden:  { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.25, ease: "easeOut" as const } },
};

interface TicketGridProps {
  tickets: Ticket[];
}

export function TicketGrid({ tickets }: TicketGridProps) {
  const [category, setCategory] = useState("ALL");
  const [sort, setSort]         = useState("price-asc");
  const [query, setQuery]       = useState("");
  const [sortOpen, setSortOpen] = useState(false);
  const sortRef                 = useRef<HTMLDivElement>(null);

  // Close sort dropdown when clicking outside
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
    () => tickets.filter((t) => t.isVisible),
    [tickets]
  );

  const tabCounts = useMemo(() => {
    const counts: Record<string, number> = { ALL: visible.length };
    visible.forEach((t) => { counts[t.category] = (counts[t.category] ?? 0) + 1; });
    return counts;
  }, [visible]);

  const filtered = useMemo(() => {
    let result = visible;

    if (category !== "ALL") {
      result = result.filter((t) => t.category === category);
    }

    if (query.trim()) {
      const q = query.toLowerCase();
      result = result.filter(
        (t) =>
          t.name.toLowerCase().includes(q) ||
          t.description.toLowerCase().includes(q) ||
          (t.dayLabel && t.dayLabel.toLowerCase().includes(q))
      );
    }

    switch (sort) {
      case "price-asc":
        result = [...result].sort((a, b) => a.resalePrice - b.resalePrice);
        break;
      case "price-desc":
        result = [...result].sort((a, b) => b.resalePrice - a.resalePrice);
        break;
      case "newest":
        result = [...result].sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        break;
      case "availability":
        result = [...result].sort(
          (a, b) => (b.quantity - b.sold) - (a.quantity - a.sold)
        );
        break;
    }

    return result;
  }, [visible, category, sort, query]);

  const hasFilters      = category !== "ALL" || query.trim() !== "";
  const activeTabLabel  = TABS.find((t) => t.value === category)?.label ?? "All";
  const activeSortLabel = SORT_OPTIONS.find((o) => o.value === sort)?.label ?? "";

  const clearFilters = () => { setCategory("ALL"); setQuery(""); };

  return (
    <div>
      {/* ── Toolbar ──────────────────────────────────────────────── */}
      <div className="sticky top-16 z-20 -mx-4 sm:-mx-6 lg:-mx-8 bg-[#050507]/95 backdrop-blur-sm border-b border-white/[0.06] mb-8">

        {/* Row 1: Category tabs with underline active indicator
            Active indicator is full-white border-b-2: must be the highest-contrast
            element in this row — it signals selection state, not decoration */}
        <div className="flex items-stretch overflow-x-auto hide-scrollbar px-4 sm:px-6 lg:px-8">
          {TABS.map((tab) => {
            const count    = tabCounts[tab.value] ?? 0;
            const isActive = category === tab.value;
            if (tab.value !== "ALL" && count === 0) return null;

            return (
              <button
                key={tab.value}
                onClick={() => setCategory(tab.value)}
                className={[
                  "flex-shrink-0 flex items-center gap-2 px-3 py-3 text-sm font-medium",
                  "whitespace-nowrap border-b-2 -mb-px transition-colors duration-150 select-none",
                  // border-white (100%) — selector must exceed label brightness
                  isActive
                    ? "border-white text-white"
                    : "border-transparent text-zinc-500 hover:text-zinc-300",
                ].join(" ")}
              >
                {tab.label}
                {/* Count as contained pill — not raw inline text floating beside label */}
                {count > 0 && tab.value !== "ALL" && (
                  <span className={[
                    "px-1.5 py-0.5 rounded-full text-[10px] font-medium tabular-nums leading-none",
                    "transition-colors duration-150",
                    isActive
                      ? "bg-white/[0.12] text-zinc-300"
                      : "bg-white/[0.06] text-zinc-600",
                  ].join(" ")}>
                    {count}
                  </span>
                )}
              </button>
            );
          })}
          <div className="flex-1 border-b-2 border-transparent -mb-px" />
        </div>

        {/* Row 2: Search / Sort / Count — controls left, meta right */}
        <div className="flex items-center gap-3 px-4 sm:px-6 lg:px-8 py-2.5">

          {/* Search — wider max-width fills dead space on large viewports */}
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-600 pointer-events-none" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search…"
              className="w-full pl-8 pr-7 py-1.5 bg-white/[0.04] border border-white/[0.07] rounded-lg text-zinc-200 placeholder-zinc-700 text-sm focus:outline-none focus:border-white/[0.16] transition-colors"
            />
            {query && (
              <button
                onClick={() => setQuery("")}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-zinc-600 hover:text-zinc-300 transition-colors"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>

          <div className="w-px h-4 bg-white/[0.07] shrink-0" />

          {/* Sort — custom dropdown, no native OS chrome */}
          <div className="relative shrink-0" ref={sortRef}>
            <button
              onClick={() => setSortOpen(v => !v)}
              className="flex items-center gap-1.5 text-xs text-zinc-500 hover:text-zinc-200 transition-colors py-1 select-none"
            >
              <ArrowUpDown className="w-3 h-3 shrink-0" />
              <span>{activeSortLabel}</span>
              <ChevronDown className={`w-3 h-3 shrink-0 transition-transform duration-150 ${sortOpen ? "rotate-180" : ""}`} />
            </button>
            {sortOpen && (
              <div className="absolute right-0 top-full mt-1.5 z-30 min-w-[176px] rounded-xl border border-white/[0.10] py-1 shadow-2xl"
                style={{ background: "#0C0D10" }}>
                {SORT_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => { setSort(opt.value); setSortOpen(false); }}
                    className={[
                      "w-full text-left px-3.5 py-2 text-xs transition-colors duration-100",
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

          <div className="flex-1" />

          <p className="text-xs text-zinc-600 tabular-nums shrink-0">
            {filtered.length === 0 ? "No results" : `${filtered.length} ticket${filtered.length !== 1 ? "s" : ""}`}
          </p>

          {hasFilters && (
            <button
              onClick={clearFilters}
              className="text-xs text-zinc-600 hover:text-zinc-300 transition-colors shrink-0 flex items-center gap-1"
            >
              <X className="w-3 h-3" />
              Clear
            </button>
          )}
        </div>
      </div>

      {/* ── Trust strip ──────────────────────────────────────────── */}
      <div className="flex flex-wrap items-center gap-x-5 gap-y-1.5 mb-7 px-0.5">
        <span className="flex items-center gap-1.5 text-[11px] text-zinc-500">
          <ShieldCheck className="w-3.5 h-3.5 text-[#00A0B6] shrink-0" strokeWidth={1.75} />
          Tickets purchased directly from Awakenings.nl
        </span>
        <span className="hidden sm:block w-px h-3 bg-white/[0.07]" />
        <span className="text-[11px] text-zinc-500">Official name transfer included</span>
        <span className="hidden sm:block w-px h-3 bg-white/[0.07]" />
        <span className="text-[11px] text-zinc-500">Delivered July 8, 2026</span>
        <span className="hidden sm:block w-px h-3 bg-white/[0.07]" />
        <span className="text-[11px] text-zinc-500">Secure checkout via Stripe</span>
      </div>

      {/* ── Grid / Empty state ───────────────────────────────────── */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4 text-center">
          <div className="w-12 h-12 rounded-xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-center">
            <Search className="w-4 h-4 text-zinc-700" />
          </div>
          <div className="max-w-[240px]">
            <p className="text-sm font-medium text-zinc-300 mb-1">
              {query
                ? "No matching tickets"
                : `No ${activeTabLabel !== "All" ? activeTabLabel + " " : ""}tickets`}
            </p>
            <p className="text-xs text-zinc-600 leading-relaxed">
              {query
                ? `"${query}" returned no results${category !== "ALL" ? ` in ${activeTabLabel}` : ""}.`
                : "Try a different category or check back later."}
            </p>
          </div>
          {hasFilters && (
            <div className="flex items-center gap-2">
              <button
                onClick={clearFilters}
                className="px-3.5 py-1.5 rounded-lg text-xs font-medium bg-white/[0.06] text-zinc-200 hover:bg-white/[0.09] transition-colors border border-white/[0.07]"
              >
                Clear filters
              </button>
              <Link
                href="/"
                className="px-3.5 py-1.5 rounded-lg text-xs font-medium text-zinc-600 hover:text-zinc-300 transition-colors"
              >
                Back to home
              </Link>
            </div>
          )}
        </div>
      ) : (
        // gap-5 (20px): inter-card gap must exceed intra-card padding (16px)
        // to establish "separate objects" reading vs "continuous surface"
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          key={`${category}-${sort}-${query}`}
        >
          <AnimatePresence mode="popLayout">
            {filtered.map((ticket) => (
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

      <p className="sr-only" aria-live="polite">
        Sorted by {activeSortLabel}. Showing {filtered.length} tickets.
      </p>
    </div>
  );
}
