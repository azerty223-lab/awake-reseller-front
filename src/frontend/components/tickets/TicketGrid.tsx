"use client";

import { useState, useMemo } from "react";
import { Search, SlidersHorizontal, X } from "lucide-react";
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
      {/* Controls */}
      <div className="flex flex-col gap-4 mb-8">
        {/* Search + Sort row */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search tickets..."
              className="w-full pl-10 pr-4 py-3 bg-[#111111] border border-[#2a2a2a] rounded-xl text-white placeholder-zinc-600 text-sm focus:outline-none focus:border-[#c9a84c]/60 transition-colors"
            />
            {query && (
              <button
                onClick={() => setQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white"
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
              className="bg-[#111111] border border-[#2a2a2a] rounded-xl px-3 py-3 text-white text-sm focus:outline-none focus:border-[#c9a84c]/60 transition-colors cursor-pointer min-w-[180px]"
            >
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
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
                className={`px-4 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                  category === cat.value
                    ? "bg-[#c9a84c] text-black"
                    : "bg-[#111111] border border-[#2a2a2a] text-zinc-400 hover:text-white hover:border-[#3a3a3a]"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Results count */}
        <div className="flex items-center justify-between">
          <p className="text-zinc-500 text-sm">
            {filtered.length === 0
              ? "No tickets found"
              : `${filtered.length} ticket${filtered.length !== 1 ? "s" : ""} available`}
          </p>
          {hasFilters && (
            <button
              onClick={() => { setCategory("ALL"); setQuery(""); }}
              className="text-[#c9a84c] text-xs hover:underline"
            >
              Clear filters
            </button>
          )}
        </div>
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4 text-center">
          <div className="w-16 h-16 rounded-full bg-[#161616] border border-[#2a2a2a] flex items-center justify-center text-2xl">
            🎫
          </div>
          <div>
            <p className="text-white font-semibold mb-1">No tickets found</p>
            <p className="text-zinc-500 text-sm">
              Try adjusting your filters or{" "}
              <button
                onClick={() => { setCategory("ALL"); setQuery(""); }}
                className="text-[#c9a84c] hover:underline"
              >
                clear all
              </button>
            </p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          <AnimatePresence mode="popLayout">
            {filtered.map((ticket, index) => (
              <motion.div
                key={ticket.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3, delay: Math.min(index * 0.05, 0.3) }}
              >
                <TicketCard ticket={ticket} />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
