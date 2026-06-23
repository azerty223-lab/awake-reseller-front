import type { Metadata } from "next";
import { prisma } from "@/backend/lib/prisma";

export const dynamic = "force-dynamic";
import Image from "next/image";
import { TicketGrid } from "@/frontend/components/tickets/TicketGrid";

export const metadata: Metadata = {
  title: "Browse Tickets",
  description: "Buy verified resale tickets for Awakenings Festival 2026. Weekend, day, camping, VIP, and premium passes available.",
};

export default async function TicketsPage() {
  const tickets = await prisma.ticket.findMany({
    where: { isVisible: true },
    orderBy: [{ isFeatured: "desc" }, { resalePrice: "asc" }],
  });

  return (
    <div className="min-h-screen bg-[#050507]">
      {/* Hero Banner */}
      <div className="relative h-64 sm:h-80 overflow-hidden bg-[#050507]">
        <Image
          src="https://images.unsplash.com/photo-1459749411175-04bf5292ceea?q=80&w=1920&auto=format&fit=crop"
          alt="Awakenings"
          fill
          style={{ objectFit: "cover" }}
          className="opacity-20"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#050507] to-transparent" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
          <div className="text-[10px] uppercase tracking-[0.2em] text-[#C9A84C] font-semibold mb-3">
            Available Now
          </div>
          <h1 className="font-[var(--font-playfair)] text-5xl sm:text-6xl font-black text-white mb-3">
            Ticket Marketplace
          </h1>
          <p className="text-zinc-500 text-sm max-w-lg">
            Verified resale tickets for Awakenings Festival 2026 — July 10–12 at Hilvarenbeek.
          </p>
          <div className="flex items-center gap-4 mt-4 text-zinc-600 text-xs">
            <span className="flex items-center gap-1.5">📅 July 10–12, 2026</span>
            <span>·</span>
            <span className="flex items-center gap-1.5">📍 Hilvarenbeek</span>
          </div>
        </div>
      </div>

      {/* Tickets grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <TicketGrid tickets={tickets} />
      </div>
    </div>
  );
}
