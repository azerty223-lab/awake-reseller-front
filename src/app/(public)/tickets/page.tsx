import type { Metadata } from "next";
import { prisma } from "@/backend/lib/prisma";

export const dynamic = "force-dynamic";
import Image from "next/image";
import { TicketGrid } from "@/frontend/components/tickets/TicketGrid";

export const metadata: Metadata = {
  title: "All Available Tickets — Verified Resale",
  description:
    "Buy verified resale tickets for Awakenings Festival 2026 — July 10–12, Beekse Bergen. Weekend, Saturday and Sunday day passes, camping. Name transfer included. Only 8 left.",
  openGraph: {
    title:       "Awakenings 2026 Tickets — All Available | AW Tickets",
    description: "Verified resale tickets with official name transfer. E-ticket July 8. Stripe secured. Only 8 left.",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630 }],
  },
  twitter: {
    card:        "summary_large_image",
    title:       "Awakenings 2026 — Browse All Tickets | AW Tickets",
    description: "Verified resale. Name transfer included. Only 8 tickets left.",
  },
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
          <p className="text-[10px] uppercase tracking-[0.28em] font-semibold mb-3"
             style={{ color: "rgba(6,182,212,0.75)", fontFamily: "var(--font-inter)" }}>
             Verified Resale · Awakenings 2026
          </p>
          <h1 className="font-[var(--font-inter)] font-black text-white mb-4 uppercase"
              style={{ fontSize: "clamp(2rem, 5vw, 3.75rem)", letterSpacing: "0.04em", lineHeight: 0.92 }}>
            All Available Tickets
          </h1>
          <p className="text-sm max-w-md leading-relaxed mb-6"
             style={{ color: "rgba(161,161,170,0.72)", fontFamily: "var(--font-inter)" }}>
            Every ticket sourced directly from the official Awakenings box office.
            Name transfer handled through the authorised Awakenings process —
            your ticket, your name, gate-ready by July 8.
          </p>
          <div
            role="list"
            aria-label="Purchase guarantees"
            className="flex flex-wrap items-center justify-center gap-2"
          >
            {[
              { text: "Sourced from Awakenings.nl" },
            ].map(({ text }) => (
              <span
                key={text}
                role="listitem"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-semibold"
                style={{
                  background:    "rgba(6,182,212,0.06)",
                  border:        "1px solid rgba(6,182,212,0.18)",
                  color:         "rgba(237,233,225,0.72)",
                  fontFamily:    "var(--font-inter)",
                  letterSpacing: "0.04em",
                }}
              >
                <span style={{
                  width: "4px", height: "4px", borderRadius: "50%",
                  background: "rgba(6,182,212,0.85)", flexShrink: 0,
                  display: "inline-block",
                }} />
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
