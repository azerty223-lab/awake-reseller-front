"use client";

import { useState, useMemo } from "react";
import { Search, X, ChevronDown } from "lucide-react";
import Link from "next/link";
import { TicketCard } from "./TicketCard";
import { TicketCategory, type Ticket } from "@/frontend/types/tickets";
import { motion, AnimatePresence } from "framer-motion";

const CATEGORIES = [
  { value: "ALL", label: "All" },
  { value: TicketCategory.WEEKEND, label: "Weekend" },
  { value: TicketCategory.SATURDAY, label: "Saturday" },
  { value: TicketCategory.SUNDAY, label: "Sunday" },
  { value: TicketCategory.CAMPING, label: "Camping" },
  { value: TicketCategory.COMFORT_CAMPING, label: "Comfort Camp" },
  { value: TicketCategory.CAR_CAMPING, label: "Car Camp" },
  { value: TicketCategory.PREMIUM, label: "Premium" },
  { value: TicketCategory.ACCOMMODATION, label: "Accommodation" },
] as const;

const SORT_OPTIONS = [
  { value: "price-asc", label: "Price: Low → High" },
  { value: "price-desc", label: "Price: High → Low" },
  { value: "newest", label: "Newest First" },
  { value: "availability", label: "Most Available" },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.06 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: "easeOut" as const } },
};

interface TicketGridProps {
  tickets: Ticket[];
}

export function TicketGrid({ tickets }: TicketGridProps) {
  const [category, setCategory] = useState("ALL");
  const [sort, setSort] = useState("price-asc");
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    let result = tickets.filter((t) => t.isVisible);

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
  }, [tickets, category, sort, query]);

  const hasFilters = category !== "ALL" || query.trim() !== "";

  return (
    <div>
      {/* Sticky filter bar */}
      <div className="sticky top-16 z-20 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 pt-4 pb-3 bg-[#050507]/92 backdrop-blur-md border-b border-white/[0.05] mb-8">

        {/* Search + sort row */}
        <div className="flex flex-col sm:flex-row gap-2.5 mb-3">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-500 pointer-events-none" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search tickets…"
              className="w-full pl-10 pr-9 py-2.5 bg-white/[0.04] border border-white/[0.08] rounded-xl text-white placeholder-zinc-600 text-sm focus:outline-none focus:border-white/[0.2] transition-colors"
            />
            {query && (
              <button
                onClick={() => setQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Sort */}
          <div className="relative shrink-0">
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="appearance-none bg-white/[0.04] border border-white/[0.08] rounded-xl pl-3.5 pr-8 py-2.5 text-zinc-300 text-sm focus:outline-none focus:border-white/[0.2] transition-colors cursor-pointer min-w-[168px]"
              style={{ colorScheme: "dark" }}
            >
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value} className="bg-zinc-900">
                  {opt.label}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-500 pointer-events-none" />
          </div>
        </div>

        {/* Category pills */}
        <div className="overflow-x-auto hide-scrollbar -mx-1 px-1">
          <div className="flex gap-1.5 min-w-max">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.value}
                onClick={() => setCategory(cat.value)}
                className={[
                  "px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all duration-200",
                  category === cat.value
                    ? "bg-[#C9A84C] text-black font-semibold shadow-[0_2px_10px_rgba(201,168,76,0.2)]"
                    : "bg-white/[0.04] text-zinc-400 border border-white/[0.07] hover:text-zinc-200 hover:border-white/[0.13]",
                ].join(" ")}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Results count + clear */}
        <div className="flex items-center justify-between mt-2.5">
          <p className="text-zinc-600 text-xs tabular-nums">
            {filtered.length === 0
              ? "No tickets found"
              : `${filtered.length} ticket${filtered.length !== 1 ? "s" : ""} available`}
          </p>
          {hasFilters && (
            <button
              onClick={() => { setCategory("ALL"); setQuery(""); }}
              className="text-xs text-zinc-500 hover:text-[#C9A84C] transition-colors flex items-center gap-1"
            >
              <X className="w-3 h-3" />
              Clear filters
            </button>
          )}
        </div>
      </div>

      {/* Empty state */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 gap-5 text-center">
          <div className="w-16 h-16 rounded-2xl bg-white/[0.04] border border-white/[0.07] flex items-center justify-center text-2xl">
            🎫
          </div>
          <div>
            <p className="text-white font-semibold mb-1.5">No tickets found</p>
            <p className="text-zinc-500 text-sm mb-5 max-w-xs">
              Try adjusting your search or clear filters to see all available tickets.
            </p>
            <div className="flex items-center justify-center gap-3">
              <button
                onClick={() => { setCategory("ALL"); setQuery(""); }}
                className="px-4 py-2 rounded-lg text-sm font-medium bg-[#C9A84C] text-black hover:opacity-90 transition-all"
              >
                Clear filters
              </button>
              <Link
                href="/"
                className="px-4 py-2 rounded-lg text-sm font-medium border border-white/[0.1] text-zinc-300 hover:bg-white/[0.05] hover:border-white/[0.2] transition-all"
              >
                Back to home
              </Link>
            </div>
          </div>
        </div>
      ) : (
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5"
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
                variants={cardVariants}
                exit={{ opacity: 0, scale: 0.96, transition: { duration: 0.18 } }}
              >
                <TicketCard ticket={ticket} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  );
}
