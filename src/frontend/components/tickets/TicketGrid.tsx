"use client";

import { useState, useMemo } from "react";
import { Search, SlidersHorizontal, X } from "lucide-react";
import Link from "next/link";
import { TicketCard } from "./TicketCard";
import { TicketCategory, type Ticket } from "@/frontend/types/tickets";
import { motion, AnimatePresence } from "framer-motion";

const CATEGORIES = [
  { value: "ALL", label: "All Tickets" },
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
    transition: {
      staggerChildren: 0.07,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: "easeOut" as const } },
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

    // Category filter
    if (category !== "ALL") {
      result = result.filter((t) => t.category === category);
    }

    // Search filter
    if (query.trim()) {
      const q = query.toLowerCase();
      result = result.filter(
        (t) =>
          t.name.toLowerCase().includes(q) ||
          t.description.toLowerCase().includes(q) ||
          (t.dayLabel && t.dayLabel.toLowerCase().includes(q))
      );
    }

    // Sort
    switch (sort) {
      case "price-asc":
        result = [...result].sort((a, b) => a.resalePrice - b.resalePrice);
        break;
      case "price-desc":
        result = [...result].sort((a, b) => b.resalePrice - a.resalePrice);
        break;
      case "newest":
        result = [...result].sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
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
      {/* Filter / Search bar */}
      <div className="sticky top-16 z-10 bg-[#050507]/95 backdrop-blur-md border-b border-white/[0.05] -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 pb-4 pt-4 mb-6">
        {/* Search + Sort row */}
        <div className="flex flex-col sm:flex-row gap-3 mb-3">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 pointer-events-none" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search tickets..."
              className="w-full pl-10 pr-10 bg-white/[0.04] border border-white/[0.07] rounded-xl text-white placeholder-zinc-600 text-sm px-4 py-2.5 focus:outline-none focus:border-[#C9A84C]/40 transition-colors"
            />
            {query && (
              <button
                onClick={() => setQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-zinc-500 shrink-0" />
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="bg-white/[0.04] border border-white/[0.07] rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-[#C9A84C]/40 transition-colors cursor-pointer min-w-[180px]"
            >
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value} className="bg-[#0D0D0F]">
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Category tabs — horizontal scroll on mobile */}
        <div className="overflow-x-auto hide-scrollbar -mx-1 px-1">
          <div className="flex gap-2 min-w-max">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.value}
                onClick={() => setCategory(cat.value)}
                className={`px-4 py-2 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
                  category === cat.value
                    ? "bg-[#C9A84C] text-black"
                    : "bg-white/[0.04] text-zinc-400 border border-white/[0.07] hover:text-white"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Results count + clear */}
        <div className="flex items-center justify-between mt-2">
          <p className="text-zinc-600 text-xs">
            {filtered.length === 0
              ? "No tickets found"
              : `${filtered.length} ticket${filtered.length !== 1 ? "s" : ""} available`}
          </p>
          {hasFilters && (
            <button
              onClick={() => { setCategory("ALL"); setQuery(""); }}
              className="text-[#C9A84C] text-xs hover:underline transition-colors"
            >
              Clear filters
            </button>
          )}
        </div>
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 gap-5 text-center">
          <div className="w-20 h-20 rounded-2xl bg-white/[0.04] backdrop-blur-md border border-white/[0.07] flex items-center justify-center text-3xl">
            🎫
          </div>
          <div>
            <p className="text-white font-semibold mb-2">No tickets found</p>
            <p className="text-zinc-500 text-sm mb-4">
              Try adjusting your filters or clear them to see all available tickets.
            </p>
            <div className="flex items-center justify-center gap-3">
              <button
                onClick={() => { setCategory("ALL"); setQuery(""); }}
                className="px-5 py-2 rounded-xl text-sm font-medium bg-[#C9A84C] text-black hover:shadow-[0_0_30px_rgba(201,168,76,0.4)] transition-all duration-300"
              >
                Clear filters
              </button>
              <Link
                href="/"
                className="px-5 py-2 rounded-xl text-sm font-medium border border-white/20 text-white hover:bg-white/[0.07] hover:border-white/40 transition-all duration-300"
              >
                Back to home
              </Link>
            </div>
          </div>
        </div>
      ) : (
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
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
                exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
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
