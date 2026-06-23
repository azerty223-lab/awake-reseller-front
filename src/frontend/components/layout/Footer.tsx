import Link from "next/link";
import { Ticket, Globe, Share2, ExternalLink } from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#080808] border-t border-[#1a1a1a] mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-[#c9a84c] flex items-center justify-center">
                <Ticket className="w-4 h-4 text-black" />
              </div>
              <span className="text-[#c9a84c] font-bold text-xl tracking-widest">
                AW<span className="text-white">TICKETS</span>
              </span>
            </Link>
            <p className="text-zinc-500 text-sm leading-relaxed max-w-xs">
              Verified ticket resale for Awakenings Festival 2026. Secure payments,
              guaranteed name transfer, and 24/7 support.
            </p>
            <div className="flex items-center gap-3 mt-6">
              <a
                href="#"
                className="w-9 h-9 rounded-lg border border-[#2a2a2a] flex items-center justify-center text-zinc-500 hover:text-[#c9a84c] hover:border-[#c9a84c]/50 transition-all"
                aria-label="Website"
              >
                <Globe className="w-4 h-4" />
              </a>
              <a
                href="#"
                className="w-9 h-9 rounded-lg border border-[#2a2a2a] flex items-center justify-center text-zinc-500 hover:text-[#c9a84c] hover:border-[#c9a84c]/50 transition-all"
                aria-label="Share"
              >
                <Share2 className="w-4 h-4" />
              </a>
              <a
                href="#"
                className="w-9 h-9 rounded-lg border border-[#2a2a2a] flex items-center justify-center text-zinc-500 hover:text-[#c9a84c] hover:border-[#c9a84c]/50 transition-all"
                aria-label="External link"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h3 className="text-white font-semibold text-sm tracking-wider uppercase mb-4">
              Quick Links
            </h3>
            <ul className="space-y-3">
              {[
                { href: "/tickets", label: "Browse Tickets" },
                { href: "/about", label: "About & Legal" },
                { href: "/contact", label: "Contact Us" },
                { href: "/#faq", label: "FAQ" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-zinc-500 hover:text-[#c9a84c] text-sm transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Policies */}
          <div>
            <h3 className="text-white font-semibold text-sm tracking-wider uppercase mb-4">
              Policies
            </h3>
            <ul className="space-y-3">
              {[
                { href: "/about#terms", label: "Terms of Service" },
                { href: "/about#refunds", label: "Refund Policy" },
                { href: "/about#privacy", label: "Privacy Policy" },
                { href: "/about#transfer", label: "Transfer Policy" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-zinc-500 hover:text-[#c9a84c] text-sm transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="border-t border-[#1a1a1a] pt-8">
          <div className="bg-[#111111] rounded-xl p-4 mb-6">
            <p className="text-zinc-600 text-xs leading-relaxed">
              <strong className="text-zinc-500">Legal Disclaimer:</strong> AW Tickets is an independent ticket resale service.
              We are not affiliated with Stichting Awakenings, ID&T, or any official festival organizer.
              All tickets are legally owned and sold at market resale prices. Ticket transfers are processed
              in compliance with Awakenings Festival's official name change and transfer policy.
              We do not guarantee availability of specific tickets from the official organizer.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <p className="text-zinc-600 text-xs">
              © {currentYear} AW Tickets. All rights reserved.
            </p>
            <p className="text-zinc-600 text-xs">
              Secured Payments
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
