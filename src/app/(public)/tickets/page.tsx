import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
import { TicketGrid } from "@/components/tickets/TicketGrid";
import { Ticket as TicketIcon, Calendar, MapPin } from "lucide-react";

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
    <div className="min-h-screen bg-[#0a0a0a]">
      {/* Header */}
      <div className="bg-[#080808] border-b border-[#1a1a1a] py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-2 mb-3">
            <TicketIcon className="w-4 h-4 text-[#c9a84c]" />
            <span className="text-[#c9a84c] text-xs uppercase tracking-widest font-semibold">
              Available Now
            </span>
          </div>
          <h1 className="font-[var(--font-playfair)] text-4xl sm:text-5xl font-bold text-white mb-3">
            Ticket Marketplace
          </h1>
          <p className="text-zinc-500 text-sm max-w-xl">
            Verified resale tickets for Awakenings Festival 2026 — July 10–12 at Hilvarenbeek.
            All tickets include name transfer service.
          </p>
          <div className="flex items-center gap-6 mt-5 text-zinc-500 text-xs">
            <span className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-[#c9a84c]" />
              July 10–12, 2026
            </span>
            <span className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-[#c9a84c]" />
              Hilvarenbeek
            </span>
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
