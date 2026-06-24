import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/frontend/components/ui/Toaster";
import { LenisProvider } from "@/frontend/providers/LenisProvider";

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

export const metadata: Metadata = {
  title: {
    default: "Awakenings Tickets — Resale",
    template: "%s | Awakenings Tickets",
  },
  description:
    "Buy verified resale tickets for Awakenings Festival 2026 — July 10–12 at Hilvarenbeek. Weekend, day, camping, VIP, and premium passes available.",
  keywords: [
    "Awakenings Festival",
    "Awakenings 2026",
    "techno festival tickets",
    "festival ticket resale",
    "Hilvarenbeek techno",
    "Hilvarenbeek",
  ],
  openGraph: {
    type: "website",
    locale: "en_NL",
    siteName: "Awakenings Tickets",
    title: "Awakenings Festival 2026 — Verified Ticket Resale",
    description:
      "Secure your spot at Awakenings Festival 2026. July 10–12 at Hilvarenbeek.",
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
        <LenisProvider>
          {children}
        </LenisProvider>
        <Toaster />
      </body>
    </html>
  );
}
