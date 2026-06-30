import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/frontend/components/ui/Toaster";
import { LenisProvider } from "@/frontend/providers/LenisProvider";
import { AuthProvider } from "@/frontend/providers/AuthProvider";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://awtickets.nl";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),

  /* ── Title ──────────────────────────────────────────────────── */
  title: {
    default: "Awakenings 2026 Tickets — Verified Resale | AW Tickets",
    template: "%s | AW Tickets",
  },

  /* ── Description — keyword-rich, scarcity-signal, 155 chars max ── */
  description:
    "Buy verified resale tickets for Awakenings Festival 2026 — July 10–12, Beekse Bergen. Name transfer included. E-ticket July 8. Only 8 left. Stripe secured.",

  /* ── Keywords — long-tail + brand + intent ───────────────────── */
  keywords: [
    "Awakenings Festival 2026 tickets",
    "Awakenings 2026 kaartjes kopen",
    "Awakenings resale tickets",
    "festival ticket resale Netherlands",
    "Awakenings Hilvarenbeek tickets",
    "techno festival tickets 2026",
    "verified resale tickets",
    "Awakenings weekend pass resale",
    "Awakenings dagticket",
    "Beekse Bergen festival tickets",
  ],

  /* ── Canonical / robots ─────────────────────────────────────── */
  alternates: {
    canonical: SITE_URL,
  },
  robots: {
    index:  true,
    follow: true,
    googleBot: {
      index:               true,
      follow:              true,
      "max-image-preview": "large",
      "max-snippet":       -1,
    },
  },

  /* ── Open Graph — controls WhatsApp, Facebook, LinkedIn previews ── */
  openGraph: {
    type:        "website",
    url:         SITE_URL,
    locale:      "en_NL",
    siteName:    "AW Tickets",
    title:       "Awakenings Festival 2026 — Verified Resale Tickets",
    description: "Only 8 tickets left. Verified resale with official name transfer. E-ticket July 8. Stripe secured checkout. Protected under Dutch consumer law.",
    images: [
      {
        /* Add /public/og-image.jpg (1200×630, festival hero image) */
        url:    `${SITE_URL}/festival-hero.png`,
        width:  1200,
        height: 630,
        alt:    "Awakenings Festival 2026 — AW Tickets · Verified Resale",
      },
    ],
  },

  /* ── Twitter / X card — summary_large_image for premium preview ── */
  twitter: {
    card:        "summary_large_image",
    title:       "Awakenings 2026 Tickets — Only 8 Left | AW Tickets",
    description: "Verified resale for Awakenings Festival 2026. Name transfer included. E-ticket July 8. Stripe secured.",
    images:      [`${SITE_URL}/festival-hero.png`],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${playfair.variable} ${inter.variable} h-full`}
      style={{ colorScheme: "dark" }}
    >
      <body className="min-h-full bg-[#0a0a0a] text-white antialiased font-[var(--font-inter)]">

        {/* Skip-to-content — keyboard / screen-reader accessibility.
            sr-only until focused; focus:not-sr-only makes it visible.
            Must be the first focusable element in the DOM.            */}
        <a
          href="#main-content"
          className="
            sr-only focus:not-sr-only
            focus:fixed focus:top-4 focus:left-4 focus:z-[200]
            focus:bg-[#06B6D4] focus:text-[#040404]
            focus:px-4 focus:py-2 focus:text-sm focus:font-semibold
            focus:shadow-[0_0_0_2px_rgba(6,182,212,0.5)]
          "
        >
          Skip to main content
        </a>

        <AuthProvider>
          <LenisProvider>
            {children}
          </LenisProvider>
        </AuthProvider>
        <Toaster />
      </body>
    </html>
  );
}
