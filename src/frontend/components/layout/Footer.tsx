import type React from "react";
import Image from "next/image";
import Link from "next/link";
import { Ticket, Globe, Share2, ExternalLink, MapPin, Calendar } from "lucide-react";

const I = "var(--font-inter, Inter, system-ui, sans-serif)";

/* ── Trust badge row ────────────────────────────────────────────── */
const TRUST_BADGES = [
  {
    img:   "/refund-badge.png",
    label: "Full refund if cancelled",
    sub:   "Event cancellation",
  },
  {
    img:   "/law-badge.png",
    label: "Dutch consumer law",
    sub:   "Art. 7:5 BW",
  },
] as const as { img?: string; Icon?: React.ElementType; label: string; sub: string }[];

export function Footer() {
  return (
    <footer className="bg-[#020203]/80 backdrop-blur-sm mt-auto relative">
      {/* Top decorative gradient line */}
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{
          background: "linear-gradient(to right, transparent, rgba(6,182,212,0.3), transparent)",
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-0">

        {/* ── 3-column grid ──────────────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-10">

          {/* Col 1 — Brand */}
          <div>
            <Link href="/" className="inline-flex items-center gap-3 mb-5 group">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#06B6D4] to-[#22D3EE] flex items-center justify-center shadow-[0_0_20px_rgba(6,182,212,0.25)] group-hover:shadow-[0_0_30px_rgba(6,182,212,0.4)] transition-all duration-300">
                <Ticket className="w-4 h-4 text-black" />
              </div>
              <span className="bg-gradient-to-r from-[#06B6D4] to-[#22D3EE] bg-clip-text text-transparent font-black text-xl tracking-[0.18em]">
                AW TICKETS
              </span>
            </Link>

            <p className="text-zinc-500 text-sm leading-relaxed max-w-[260px] mb-5">
              Verified resale tickets for Awakenings Festival 2026.
              Secure payments, guaranteed name transfer, and support within 4 hours.
            </p>

            {/* Social icons */}
            <div className="flex items-center gap-2">
              <a href="#" className="w-9 h-9 rounded-lg border border-white/[0.07] flex items-center justify-center text-zinc-500 hover:text-[#06B6D4] hover:border-[#06B6D4]/40 hover:bg-[#06B6D4]/5 transition-all duration-300" aria-label="Website">
                <Globe className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 rounded-lg border border-white/[0.07] flex items-center justify-center text-zinc-500 hover:text-[#06B6D4] hover:border-[#06B6D4]/40 hover:bg-[#06B6D4]/5 transition-all duration-300" aria-label="Share">
                <Share2 className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 rounded-lg border border-white/[0.07] flex items-center justify-center text-zinc-500 hover:text-[#06B6D4] hover:border-[#06B6D4]/40 hover:bg-[#06B6D4]/5 transition-all duration-300" aria-label="External link">
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
                { href: "/",              label: "Home"             },
                { href: "/tickets",       label: "Tickets"          },
                { href: "/about",         label: "About"            },
                { href: "/about#terms",   label: "Terms of Service" },
                { href: "/about#refunds", label: "Refund Policy"    },
                { href: "/about#privacy", label: "Privacy Policy"   },
                { href: "/contact",       label: "Contact"          },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-zinc-400 hover:text-[#06B6D4] text-sm transition-colors duration-200 inline-flex items-center gap-1.5 group"
                  >
                    <span className="w-0 group-hover:w-3 h-px bg-gradient-to-r from-[#06B6D4] to-[#22D3EE] transition-all duration-300 overflow-hidden" />
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
            <p className="bg-gradient-to-r from-[#06B6D4] to-[#22D3EE] bg-clip-text text-transparent font-bold text-base mb-4 leading-snug">
              Awakenings Festival 2026
            </p>
            <ul className="space-y-3 mb-5">
              <li className="flex items-start gap-2.5 text-zinc-400 text-sm">
                <Calendar className="w-4 h-4 text-[#06B6D4] mt-0.5 shrink-0" />
                <span>July 10–12, 2026</span>
              </li>
              <li className="flex items-start gap-2.5 text-zinc-400 text-sm">
                <MapPin className="w-4 h-4 text-[#06B6D4] mt-0.5 shrink-0" />
                <span>Hilvarenbeek, Netherlands</span>
              </li>
            </ul>
            <a
              href="https://www.awakenings.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs text-zinc-500 hover:text-[#06B6D4] border border-white/[0.07] hover:border-[#06B6D4]/40 rounded-lg px-3 py-2 transition-all duration-300 hover:bg-[#06B6D4]/5"
            >
              <Globe className="w-3 h-3" />
              Official Festival Site
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>

        {/* ── TRUST BADGE STRIP ──────────────────────────── */}
        <div
          className="mb-8 py-5"
          style={{ borderTop: "1px solid rgba(237,233,225,0.06)", borderBottom: "1px solid rgba(237,233,225,0.06)" }}
        >
          <div style={{
            display:        "flex",
            alignItems:     "center",
            flexWrap:       "wrap",
            gap:            "0.75rem",
          }}>
            {/* SSL badge */}
            <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", flexShrink: 0 }}>
              <Image
                src="/ssl-badge.png"
                alt="Secure SSL Encryption"
                width={22}
                height={22}
                style={{ display: "block", flexShrink: 0 }}
              />
              <div>
                <span style={{
                  display:       "block",
                  fontFamily:    I,
                  fontSize:      "11px",
                  fontWeight:    600,
                  color:         "rgba(237,233,225,0.65)",
                  letterSpacing: "0.03em",
                  lineHeight:    1.1,
                }}>
                  Secure SSL Encryption
                </span>
                <span style={{
                  fontFamily:    I,
                  fontSize:      "9px",
                  color:         "rgba(237,233,225,0.28)",
                  letterSpacing: "0.06em",
                  lineHeight:    1,
                }}>
                  TLS 1.3
                </span>
              </div>
            </div>

            {/* Separator */}
            <div style={{ width: "1px", height: "24px", background: "rgba(237,233,225,0.08)" }} className="hidden sm:block" />

            {/* Trust badges */}
            {TRUST_BADGES.map(({ Icon, img, label, sub }) => (
              <div
                key={label}
                style={{
                  display:     "inline-flex",
                  alignItems:  "center",
                  gap:         "7px",
                }}
              >
                {img ? (
                  <Image src={img} alt={label} width={22} height={22} style={{ flexShrink: 0 }} />
                ) : Icon ? (
                  <Icon
                    style={{ width: "13px", height: "13px", color: "rgba(6,182,212,0.60)", flexShrink: 0 }}
                    strokeWidth={1.75}
                  />
                ) : null}
                <div>
                  <span style={{
                    display:       "block",
                    fontFamily:    I,
                    fontSize:      "11px",
                    fontWeight:    600,
                    color:         "rgba(237,233,225,0.65)",
                    letterSpacing: "0.03em",
                    lineHeight:    1.1,
                  }}>
                    {label}
                  </span>
                  <span style={{
                    fontFamily:    I,
                    fontSize:      "9px",
                    color:         "rgba(237,233,225,0.28)",
                    letterSpacing: "0.06em",
                    lineHeight:    1,
                  }}>
                    {sub}
                  </span>
                </div>
              </div>
            ))}

            {/* Guarantee summary — right-aligned on desktop */}
            <div style={{ marginLeft: "auto" }} className="hidden md:block">
              <p style={{
                fontFamily:    I,
                fontSize:      "11px",
                color:         "rgba(237,233,225,0.38)",
                letterSpacing: "0.03em",
                textAlign:     "right",
              }}>
                If the event is officially cancelled by the organiser,
                {" "}<span style={{ color: "rgba(237,233,225,0.65)", fontWeight: 600 }}>you receive a full refund</span>.
              </p>
            </div>
          </div>
        </div>

        {/* ── Legal disclaimer ───────────────────────────── */}
        <div className="bg-white/[0.02] border border-white/[0.05] rounded-xl p-4 mb-8">
          <p className="text-zinc-600 text-xs leading-relaxed">
            <strong className="text-zinc-500">Legal Notice:</strong>{" "}
            AW Tickets is an independent ticket resale service, not affiliated with Stichting Awakenings, ID&amp;T,
            or any official festival organiser. All tickets are legally purchased from the official Awakenings box
            office and resold under the Dutch Ticket Resale Act and consumer law (Art. 7:5 BW).
            Ticket transfers are processed through the official Awakenings name-change system.
            AW Tickets is not responsible for event changes or cancellations outside our control; in such cases,
            refund eligibility follows Awakenings&apos; official policy.
          </p>
        </div>

        {/* ── Bottom bar ─────────────────────────────────── */}
        <div
          className="py-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
          style={{
            borderTop:   "1px solid",
            borderImage: "linear-gradient(to right, transparent, rgba(6,182,212,0.15), transparent) 1",
          }}
        >
          <p className="text-zinc-600 text-xs">
            &copy; 2026 AW Tickets. All rights reserved.
          </p>
          <div className="flex items-center gap-4 flex-wrap">
            {[
              { href: "/about#terms",   label: "Terms" },
              { href: "/about#privacy", label: "Privacy" },
              { href: "/about#refunds", label: "Refunds" },
            ].map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className="text-[10px] text-zinc-600 hover:text-zinc-300 transition-colors"
              >
                {label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
