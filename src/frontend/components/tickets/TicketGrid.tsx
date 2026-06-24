"use client";

import { useState, useMemo } from "react";
import { Search, X, ArrowUpDown, ChevronDown } from "lucide-react";
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
  visible: { transition: { staggerChildren: 0.04 } },
};

const itemVariants = {
  hidden:  { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.28, ease: "easeOut" as const } },
};

interface TicketGridProps {
  tickets: Ticket[];
}

export function TicketGrid({ tickets }: TicketGridProps) {
  const [category, setCategory] = useState("ALL");
  const [sort, setSort]         = useState("price-asc");
  const [query, setQuery]       = useState("");

  // All visible tickets — used for tab counts
  const visible = useMemo(
    () => tickets.filter((t) => t.isVisible),
    [tickets]
  );

  // Tab counts: how many tickets exist per category
  const tabCounts = useMemo(() => {
    const counts: Record<string, number> = { ALL: visible.length };
    visible.forEach((t) => {
      counts[t.category] = (counts[t.category] ?? 0) + 1;
    });
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

  const hasFilters       = category !== "ALL" || query.trim() !== "";
  const activeTabLabel   = TABS.find((t) => t.value === category)?.label ?? "All";
  const activeSortLabel  = SORT_OPTIONS.find((o) => o.value === sort)?.label ?? "";

  const clearFilters = () => { setCategory("ALL"); setQuery(""); };

  return (
    <div>
      {/* ── Toolbar ──────────────────────────────────────────────── */}
      <div className="sticky top-16 z-20 -mx-4 sm:-mx-6 lg:-mx-8 bg-[#050507]/95 backdrop-blur-sm border-b border-white/[0.06] mb-8">

        {/* Row 1: Category tabs — underline active indicator */}
        <div className="flex items-stretch overflow-x-auto hide-scrollbar px-4 sm:px-6 lg:px-8">
          {TABS.map((tab) => {
            const count   = tabCounts[tab.value] ?? 0;
            const isActive = category === tab.value;
            // Hide tabs with no tickets (except "All")
            if (tab.value !== "ALL" && count === 0) return null;

            return (
              <button
                key={tab.value}
                onClick={() => setCategory(tab.value)}
                className={[
                  "flex-shrink-0 flex items-center gap-1.5 px-3 py-3 text-sm font-medium",
                  "whitespace-nowrap border-b-2 -mb-px transition-colors duration-150 select-none",
                  isActive
                    ? "border-white/75 text-white"
                    : "border-transparent text-zinc-500 hover:text-zinc-300",
                ].join(" ")}
              >
                {tab.label}
                {count > 0 && tab.value !== "ALL" && (
                  <span className={`text-[10px] tabular-nums font-normal leading-none transition-colors ${isActive ? "text-zinc-400" : "text-zinc-700"}`}>
                    {count}
                  </span>
                )}
              </button>
            );
          })}
          {/* Fill remaining space with the border line */}
          <div className="flex-1 border-b-2 border-transparent -mb-px" />
        </div>

        {/* Row 2: Search · Sort · Meta */}
        <div className="flex items-center gap-3 px-4 sm:px-6 lg:px-8 py-2.5">

          {/* Search input — compact */}
          <div className="relative flex-1 max-w-[280px]">
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

          {/* Divider */}
          <div className="w-px h-4 bg-white/[0.08] shrink-0" />

          {/* Sort — minimal, borderless */}
          <div className="relative flex items-center gap-1 group cursor-pointer shrink-0">
            <ArrowUpDown className="w-3 h-3 text-zinc-600 group-hover:text-zinc-400 transition-colors shrink-0 pointer-events-none" />
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="appearance-none bg-transparent text-xs text-zinc-500 group-hover:text-zinc-300 pr-3.5 py-1 focus:outline-none cursor-pointer transition-colors"
              style={{ colorScheme: "dark" }}
            >
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value} className="bg-zinc-900 text-zinc-200">
                  {opt.label}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 text-zinc-700 pointer-events-none" />
          </div>

          {/* Spacer */}
          <div className="flex-1" />

          {/* Result count */}
          <p className="text-xs text-zinc-600 tabular-nums shrink-0">
            {filtered.length === 0
              ? "No results"
              : `${filtered.length} ticket${filtered.length !== 1 ? "s" : ""}`}
          </p>

          {/* Clear — only when filters active */}
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

      {/* ── Grid / Empty state ───────────────────────────────────── */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4 text-center">
          {/* Icon */}
          <div className="w-14 h-14 rounded-xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-center">
            <Search className="w-5 h-5 text-zinc-700" />
          </div>

          {/* Copy */}
          <div className="max-w-[260px]">
            <p className="text-sm font-medium text-zinc-300 mb-1">
              {query ? "No tickets match" : `No ${activeTabLabel !== "All" ? activeTabLabel + " " : ""}tickets`}
            </p>
            <p className="text-xs text-zinc-600 leading-relaxed">
              {query
                ? `"${query}" returned no results${category !== "ALL" ? ` in ${activeTabLabel}` : ""}.`
                : "Try a different category or check back later."}
            </p>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 mt-1">
            {hasFilters && (
              <button
                onClick={clearFilters}
                className="px-3.5 py-1.5 rounded-lg text-xs font-medium bg-white/[0.07] text-zinc-200 hover:bg-white/[0.1] transition-colors border border-white/[0.07]"
              >
                Clear filters
              </button>
            )}
            <Link
              href="/"
              className="px-3.5 py-1.5 rounded-lg text-xs font-medium text-zinc-500 hover:text-zinc-300 transition-colors"
            >
              Back to home
            </Link>
          </div>
        </div>
      ) : (
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
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
                exit={{ opacity: 0, scale: 0.97, transition: { duration: 0.15 } }}
              >
                <TicketCard ticket={ticket} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}

      {/* Sort label for screen readers / context */}
      <p className="sr-only" aria-live="polite">
        Sorted by {activeSortLabel}. Showing {filtered.length} tickets.
      </p>
    </div>
  );
}
