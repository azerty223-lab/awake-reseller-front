/**
 * SchemaMarkup — server component.
 * Outputs two JSON-LD scripts into the <head>:
 *   1. Event schema  — enables Google event rich results, event carousels,
 *      and "Buy tickets" panels in search. Also enriches paid ad Quality Scores.
 *   2. FAQPage schema — enables FAQ accordion rich snippets in Google SERPs.
 *      Each answer that matches a known user question can appear inline,
 *      driving CTR without an additional paid click.
 */

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://awtickets.nl";

const eventSchema = {
  "@context":             "https://schema.org",
  "@type":                "Event",
  "name":                 "Awakenings Festival 2026",
  "startDate":            "2026-07-10T15:00:00+02:00",
  "endDate":              "2026-07-12T23:00:00+02:00",
  "eventStatus":          "https://schema.org/EventScheduled",
  "eventAttendanceMode":  "https://schema.org/OfflineEventAttendanceMode",
  "location": {
    "@type":   "Place",
    "name":    "Beekse Bergen",
    "address": {
      "@type":           "PostalAddress",
      "streetAddress":   "Beekse Bergen",
      "addressLocality": "Hilvarenbeek",
      "addressRegion":   "Noord-Brabant",
      "postalCode":      "5081 NJ",
      "addressCountry":  "NL",
    },
  },
  "organizer": {
    "@type": "Organization",
    "name":  "Stichting Awakenings",
    "url":   "https://www.awakenings.com",
  },
  "performer": {
    "@type": "MusicGroup",
    "name":  "Various Artists",
  },
  "offers": {
    "@type":          "AggregateOffer",
    "url":            `${BASE_URL}/tickets`,
    "priceCurrency":  "EUR",
    "lowPrice":       "89",
    "highPrice":      "299",
    "offerCount":     "8",
    "availability":   "https://schema.org/LimitedAvailability",
    "validFrom":      "2025-01-01",
    "seller": {
      "@type":       "Organization",
      "name":        "AW Tickets",
      "description": "Verified resale tickets for Awakenings Festival 2026 with official name transfer included.",
    },
  },
  "image":       `${BASE_URL}/festival-hero.png`,
  "description": "Awakenings Festival 2026 — three days of electronic music across 6 stages at Beekse Bergen, Hilvarenbeek. Verified resale tickets with official name transfer. E-ticket delivered July 8.",
  "genre":            "Electronic Music / Techno",
  "typicalAgeRange":  "18+",
  "isAccessibleForFree": false,
};

const faqSchema = {
  "@context":   "https://schema.org",
  "@type":      "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name":  "Is buying resale tickets for Awakenings 2026 legal?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text":  "Yes. Resale of festival tickets is permitted in the Netherlands under consumer law (Art. 7:5 BW). We sell tickets legally owned by a private individual, purchased directly from the official Awakenings box office.",
      },
    },
    {
      "@type": "Question",
      "name":  "How does the Awakenings ticket name transfer work?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text":  "After your purchase, we handle the name change through the official Awakenings resale portal. We verify the ticket, submit the name change request, and Awakenings re-issues the ticket in your name. Your personalised e-ticket is dispatched on July 8th, 2026.",
      },
    },
    {
      "@type": "Question",
      "name":  "When will I receive my Awakenings e-ticket?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text":  "E-tickets are dispatched on July 8th, 2026 — two days before the festival opens — following the official Awakenings dispatch schedule. You immediately receive a purchase confirmation after payment.",
      },
    },
    {
      "@type": "Question",
      "name":  "What is the refund policy for Awakenings resale tickets?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text":  "Sales are final once the name transfer has been initiated. If the festival is officially cancelled by the organiser, you receive a full refund. We handle each edge case individually — contact us for support.",
      },
    },
    {
      "@type": "Question",
      "name":  "Do I need ID to enter Awakenings Festival 2026?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text":  "Yes. Your government-issued ID must match the name on your ticket exactly. Mismatches may result in denied entry. Ensure the ticket is transferred to the correct name before the festival.",
      },
    },
    {
      "@type": "Question",
      "name":  "Is the ticket payment secure?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text":  "Yes. All payments are processed by Stripe with 3D Secure authentication and TLS 1.3 encryption. Cryptocurrency payments are also accepted. The platform is protected under Dutch consumer law (Art. 7:5 BW).",
      },
    },
  ],
};

const organizationSchema = {
  "@context": "https://schema.org",
  "@type":    "Organization",
  "@id":      `${BASE_URL}/#organization`,
  "name":     "AW Tickets",
  "url":      BASE_URL,
  "logo": {
    "@type": "ImageObject",
    "url":   `${BASE_URL}/brand/awtickets-logo-horizontal.svg`,
  },
  "description": "Verified resale tickets for Awakenings Festival 2026 with official name transfer included.",
  "contactPoint": {
    "@type":       "ContactPoint",
    "contactType": "customer support",
    "email":       "awtickets@outlook.com",
    "areaServed":  "NL",
    "availableLanguage": ["English", "Dutch"],
  },
  "sameAs": [],
};

const webSiteSchema = {
  "@context": "https://schema.org",
  "@type":    "WebSite",
  "@id":      `${BASE_URL}/#website`,
  "url":      BASE_URL,
  "name":     "AW Tickets",
  "description": "Verified resale tickets for Awakenings Festival 2026",
  "publisher": {
    "@id": `${BASE_URL}/#organization`,
  },
  "potentialAction": {
    "@type":       "SearchAction",
    "target": {
      "@type": "EntryPoint",
      "urlTemplate": `${BASE_URL}/tickets?q={search_term_string}`,
    },
    "query-input": "required name=search_term_string",
  },
};

export function SchemaMarkup() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(eventSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webSiteSchema) }}
      />
    </>
  );
}
