import Link from "next/link";
import { Ticket, Globe, Share2, ExternalLink, MapPin, Calendar } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-[#050507] mt-auto relative">
      {/* Top decorative gradient line */}
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{
          background:
            "linear-gradient(to right, transparent, rgba(201,168,76,0.3), transparent)",
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-0">
        {/* 3-column grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-14">
          {/* Col 1 — Brand */}
          <div>
            <Link href="/" className="inline-flex items-center gap-3 mb-5 group">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#C9A84C] to-[#E4BA65] flex items-center justify-center shadow-[0_0_20px_rgba(201,168,76,0.25)] group-hover:shadow-[0_0_30px_rgba(201,168,76,0.4)] transition-all duration-300">
                <Ticket className="w-4 h-4 text-black" />
              </div>
              <span className="bg-gradient-to-r from-[#C9A84C] to-[#E4BA65] bg-clip-text text-transparent font-black text-xl tracking-[0.18em]">
                AW TICKETS
              </span>
            </Link>

            <p className="text-zinc-500 text-sm leading-relaxed max-w-[260px]">
              Verified resale tickets for Awakenings Festival 2026. Secure payments,
              guaranteed name transfer, and 24/7 support.
            </p>

            <div className="flex items-center gap-2 mt-7">
              <a
                href="#"
                className="w-9 h-9 rounded-lg border border-white/[0.07] flex items-center justify-center text-zinc-500 hover:text-[#C9A84C] hover:border-[#C9A84C]/40 hover:bg-[#C9A84C]/5 transition-all duration-300"
                aria-label="Website"
              >
                <Globe className="w-4 h-4" />
              </a>
              <a
                href="#"
                className="w-9 h-9 rounded-lg border border-white/[0.07] flex items-center justify-center text-zinc-500 hover:text-[#C9A84C] hover:border-[#C9A84C]/40 hover:bg-[#C9A84C]/5 transition-all duration-300"
                aria-label="Share"
              >
                <Share2 className="w-4 h-4" />
              </a>
              <a
                href="#"
                className="w-9 h-9 rounded-lg border border-white/[0.07] flex items-center justify-center text-zinc-500 hover:text-[#C9A84C] hover:border-[#C9A84C]/40 hover:bg-[#C9A84C]/5 transition-all duration-300"
                aria-label="External link"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Col 2 — Quick Links */}
          <div>
            <p className="text-[10px] uppercase tracking-[0.2em] font-semibold text-zinc-500 mb-5">
              Quick Links
            </p>
            <ul className="space-y-3">
              {[
                { href: "/", label: "Home" },
                { href: "/tickets", label: "Tickets" },
                { href: "/about", label: "About" },
                { href: "/contact", label: "Contact" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-zinc-400 hover:text-[#C9A84C] text-sm transition-colors duration-200 inline-flex items-center gap-1.5 group"
                  >
                    <span className="w-0 group-hover:w-3 h-px bg-gradient-to-r from-[#C9A84C] to-[#E4BA65] transition-all duration-300 overflow-hidden" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3 — Event Info */}
          <div>
            <p className="text-[10px] uppercase tracking-[0.2em] font-semibold text-zinc-500 mb-5">
              Event Info
            </p>

            <p className="bg-gradient-to-r from-[#C9A84C] to-[#E4BA65] bg-clip-text text-transparent font-bold text-base mb-4 leading-snug">
              Awakenings Festival 2026
            </p>

            <ul className="space-y-3">
              <li className="flex items-start gap-2.5 text-zinc-400 text-sm">
                <Calendar className="w-4 h-4 text-[#C9A84C] mt-0.5 shrink-0" />
                <span>28 June – 5 July 2026</span>
              </li>
              <li className="flex items-start gap-2.5 text-zinc-400 text-sm">
                <MapPin className="w-4 h-4 text-[#C9A84C] mt-0.5 shrink-0" />
                <span>Spaarnwoude, Amsterdam, NL</span>
              </li>
            </ul>

            <a
              href="https://www.awakenings.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 mt-6 text-xs text-zinc-500 hover:text-[#C9A84C] border border-white/[0.07] hover:border-[#C9A84C]/40 rounded-lg px-3 py-2 transition-all duration-300 hover:bg-[#C9A84C]/5"
            >
              <Globe className="w-3 h-3" />
              Official Festival Site
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>

        {/* Legal disclaimer */}
        <div className="bg-white/[0.02] border border-white/[0.05] rounded-xl p-4 mb-8">
          <p className="text-zinc-600 text-xs leading-relaxed">
            <strong className="text-zinc-500">Legal Disclaimer:</strong> AW Tickets is an
            independent ticket resale service. We are not affiliated with Stichting Awakenings,
            ID&amp;T, or any official festival organizer. All tickets are legally owned and sold
            at market resale prices. Ticket transfers are processed in compliance with Awakenings
            Festival&apos;s official name change and transfer policy. We do not guarantee
            availability of specific tickets from the official organizer.
          </p>
        </div>

        {/* Bottom bar */}
        <div
          className="py-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
          style={{
            borderTop: "1px solid",
            borderImage:
              "linear-gradient(to right, transparent, rgba(201,168,76,0.15), transparent) 1",
          }}
        >
          <p className="text-zinc-600 text-xs">
            &copy; 2026 AW Tickets. All rights reserved.
          </p>
          <p className="text-[10px] uppercase tracking-[0.18em] font-semibold text-[#C9A84C]/60">
            Official Resale Partner
          </p>
        </div>
      </div>
    </footer>
  );
}
