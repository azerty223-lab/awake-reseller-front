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
          src="https://images.unsplash.com/photo-1522601157550-4282ae97472d?q=90&w=1920&auto=format&fit=crop"
          alt="Awakenings"
          fill
          style={{
            objectFit: "cover",
            objectPosition: "center 50%",
            opacity: 0.30,
            filter: "brightness(0.80) saturate(0.85)",
          }}
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#050507] via-[#050507]/50 to-transparent" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
          <div className="text-[10px] uppercase tracking-[0.2em] text-[#00A0B6] font-bold mb-3">
            Private Verified Resale
          </div>
          <h1 className="font-[var(--font-playfair)] text-5xl sm:text-6xl font-black text-white mb-4">
            Ticket Marketplace
          </h1>
          {/* Seller legitimacy statement — most important trust signal on this page */}
          <p className="text-zinc-400 text-sm max-w-md leading-relaxed mb-5">
            All tickets purchased directly from the official Awakenings website.
            Private resale — name transfers handled through the official Awakenings process.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-2">
            {[
              { icon: "✓", text: "From Awakenings.nl" },
              { icon: "✓", text: "Official transfer" },
              { icon: "✓", text: "July 10–12 · Hilvarenbeek" },
              { icon: "✓", text: "Stripe checkout" },
            ].map(({ icon, text }) => (
              <span
                key={text}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-semibold"
                style={{ background: "rgba(0,160,182,0.08)", border: "1px solid rgba(0,160,182,0.20)", color: "rgba(0,160,182,0.85)" }}
              >
                <span style={{ color: "#00A0B6" }}>{icon}</span>
                {text}
              </span>
            ))}
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
