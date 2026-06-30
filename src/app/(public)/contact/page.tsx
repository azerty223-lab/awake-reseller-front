import type { Metadata } from "next";
import { ContactForm } from "@/frontend/components/contact/ContactForm";

const BASE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://awtickets.nl";

export const metadata: Metadata = {
  title: "Contact AW Tickets — Awakenings 2026 Support",
  description: "Get in touch with AW Tickets — questions about your Awakenings Festival 2026 order, name transfer, or ticket delivery. We respond within 4 hours.",
  alternates: { canonical: `${BASE}/contact` },
  openGraph: {
    type:        "website",
    url:         `${BASE}/contact`,
    title:       "Contact AW Tickets — Awakenings 2026 Support",
    description: "Questions about your order or name transfer? We respond within 4 hours during CET business hours.",
    images: [{ url: `${BASE}/festival-hero.png`, width: 1200, height: 630, alt: "Awakenings Festival 2026" }],
  },
  twitter: {
    card:        "summary_large_image",
    title:       "Contact AW Tickets",
    description: "Questions about Awakenings 2026 tickets? We respond within 4 hours.",
  },
};

export default function ContactPage() {
  return <ContactForm />;
}
