import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { cache } from "react";
import { prisma } from "@/backend/lib/prisma";
import { TicketDetailPage } from "@/frontend/components/tickets/TicketDetailPage";

export const dynamic = "force-dynamic";

const BASE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://awtickets.nl";

// Deduplicate the DB lookup between generateMetadata and the page render
const getTicket = cache(async (slug: string) => {
  return prisma.ticket.findUnique({
    where: { slug },
    // Select all fields — the TicketDetailPage component needs the full shape.
    // Internal fields (stripeProductId etc.) are stripped at the API layer instead.
  });
});

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const ticket = await getTicket(slug);
  if (!ticket) return { title: "Ticket Not Found", robots: { index: false } };

  const canonicalUrl = `${BASE}/tickets/${slug}`;
  const ogImage      = ticket.imageUrl ?? `${BASE}/festival-hero.png`;
  const available    = ticket.quantity - ticket.sold;
  const availStr     = available > 0 ? `${available} left` : "Sold out";
  const priceStr     = `€${ticket.resalePrice.toFixed(2)}`;
  const desc         = `${ticket.name} for Awakenings Festival 2026 — ${priceStr} · ${availStr}. Verified resale with official name transfer. E-ticket July 8.`;

  return {
    title:       `${ticket.name} — Awakenings Festival 2026`,
    description: desc.slice(0, 160),
    alternates:  { canonical: canonicalUrl },
    openGraph: {
      type:        "website",
      url:         canonicalUrl,
      title:       `${ticket.name} — Awakenings 2026 | AW Tickets`,
      description: desc.slice(0, 200),
      images: [
        { url: ogImage, width: 1200, height: 630, alt: `${ticket.name} — Awakenings Festival 2026` },
      ],
    },
    twitter: {
      card:        "summary_large_image",
      title:       `${ticket.name} — Awakenings 2026`,
      description: `${priceStr} · Verified resale · Name transfer included · ${availStr}`,
    },
  };
}

export default async function TicketPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const ticket = await getTicket(slug);
  if (!ticket || !ticket.isVisible) notFound();

  const canonicalUrl = `${BASE}/tickets/${slug}`;
  const available    = ticket.quantity - ticket.sold;

  const offerSchema = {
    "@context":   "https://schema.org",
    "@type":      "Offer",
    "name":       ticket.name,
    "description": ticket.description.slice(0, 200),
    "price":      String(ticket.resalePrice.toFixed(2)),
    "priceCurrency": ticket.currency,
    "availability": available > 0
      ? "https://schema.org/LimitedAvailability"
      : "https://schema.org/SoldOut",
    "url":        canonicalUrl,
    "validThrough": "2026-07-09",
    "seller": {
      "@type": "Organization",
      "name":  "AW Tickets",
      "url":   BASE,
    },
    "itemOffered": {
      "@type":     "Event",
      "name":      "Awakenings Festival 2026",
      "startDate": "2026-07-10T15:00:00+02:00",
      "endDate":   "2026-07-12T23:00:00+02:00",
      "location": {
        "@type": "Place",
        "name":  "Beekse Bergen, Hilvarenbeek, Netherlands",
      },
    },
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type":    "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home",    "item": BASE },
      { "@type": "ListItem", "position": 2, "name": "Tickets", "item": `${BASE}/tickets` },
      { "@type": "ListItem", "position": 3, "name": ticket.name, "item": canonicalUrl },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(offerSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <TicketDetailPage ticket={ticket} />
    </>
  );
}
