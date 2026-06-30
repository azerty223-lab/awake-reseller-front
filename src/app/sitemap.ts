import type { MetadataRoute } from "next";
import { prisma } from "@/backend/lib/prisma";

const BASE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://awtickets.nl";

// Must be dynamic — the DB is unreachable during the Railway build step.
// The sitemap is generated on first request and cached by Next.js.
export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const tickets = await prisma.ticket.findMany({
    where:  { isVisible: true },
    select: { slug: true, updatedAt: true },
    orderBy: { updatedAt: "desc" },
  });

  const staticPages: MetadataRoute.Sitemap = [
    {
      url:             BASE,
      lastModified:    new Date(),
      changeFrequency: "daily",
      priority:        1.0,
    },
    {
      url:             `${BASE}/tickets`,
      lastModified:    new Date(),
      changeFrequency: "daily",
      priority:        0.9,
    },
    {
      url:             `${BASE}/about`,
      lastModified:    new Date(),
      changeFrequency: "monthly",
      priority:        0.5,
    },
    {
      url:             `${BASE}/contact`,
      lastModified:    new Date(),
      changeFrequency: "monthly",
      priority:        0.4,
    },
    {
      url:             `${BASE}/privacy`,
      lastModified:    new Date(),
      changeFrequency: "yearly",
      priority:        0.2,
    },
  ];

  const ticketPages: MetadataRoute.Sitemap = tickets.map((t) => ({
    url:             `${BASE}/tickets/${t.slug}`,
    lastModified:    t.updatedAt,
    changeFrequency: "daily",
    priority:        0.8,
  }));

  return [...staticPages, ...ticketPages];
}
