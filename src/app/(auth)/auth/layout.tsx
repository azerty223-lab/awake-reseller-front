import { redirect } from "next/navigation";
import { auth } from "@/backend/lib/auth";
import { ShieldCheck, Star, Ticket } from "lucide-react";
import Link from "next/link";

export default async function AuthLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (session) redirect("/tickets");

  return (
    <div className="flex min-h-screen">

      {/* ── Left panel — festival visual ───────────────────────────── */}
      <div className="hidden lg:flex lg:w-[52%] relative flex-col overflow-hidden">

        {/* Background image */}
        <div
          className="absolute inset-0 bg-cover bg-center scale-105"
          style={{ backgroundImage: "url('/bg-festival.jpg')" }}
        />

        {/* Layered overlays for depth */}
        <div className="absolute inset-0 bg-black/55" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-black/30" />
        <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/40" />

        {/* Content */}
        <div className="relative z-10 flex flex-col h-full p-10 xl:p-14">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group w-fit">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/brand/awtickets-mark.svg"
              alt="AW Tickets"
              style={{ height: "38px", width: "auto" }}
            />
            <div className="leading-none">
              <span className="block font-black text-white/90 tracking-[0.18em]" style={{ fontSize: "13px" }}>
                AW TICKETS
              </span>
              <span className="block font-semibold text-[#06B6D4]" style={{ fontSize: "9px", letterSpacing: "0.22em", textTransform: "uppercase", marginTop: "3px" }}>
                Verified Resale
              </span>
            </div>
          </Link>

          {/* Main copy — pushed to bottom third */}
          <div className="mt-auto">
            <p
              className="font-black text-white leading-[1.1] mb-5"
              style={{ fontSize: "clamp(2rem, 3.2vw, 2.75rem)", letterSpacing: "-0.02em" }}
            >
              Verified<br />
              Resale for<br />
              <span className="text-[#06B6D4]">Awakenings Festival 2026</span>
            </p>

            <p className="text-zinc-400 text-sm leading-relaxed mb-8 max-w-xs">
              Official name transfer included. E-ticket delivered by July 8.
              Seller payout held until your ticket is confirmed.
            </p>

            {/* Trust stats */}
            <div className="flex flex-wrap gap-3 mb-10">
              {[
                { icon: Ticket,      value: "200+",  label: "Tickets sold"  },
                { icon: Star,        value: "4.9",   label: "Avg. rating"   },
                { icon: ShieldCheck, value: "100%",  label: "Delivery rate" },
              ].map(({ icon: Icon, value, label }) => (
                <div
                  key={label}
                  className="flex items-center gap-2 px-3.5 py-2 rounded-full"
                  style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.12)" }}
                >
                  <Icon className="w-3.5 h-3.5 text-[#06B6D4]" />
                  <span className="text-white text-xs font-bold">{value}</span>
                  <span className="text-zinc-400 text-xs">{label}</span>
                </div>
              ))}
            </div>

            {/* Event info */}
            <div
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl"
              style={{ background: "rgba(6,182,212,0.08)", border: "1px solid rgba(6,182,212,0.20)" }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#06B6D4] animate-pulse shrink-0" />
              <span className="text-[#06B6D4] text-xs font-semibold tracking-wide">
                Awakenings Festival · July 10–12, 2026 · Hilvarenbeek
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Right panel — auth form ─────────────────────────────────── */}
      <div className="flex-1 bg-[#080809] flex flex-col items-center justify-center px-6 py-12 overflow-y-auto min-h-screen">
        {/* Mobile logo — only visible when left panel is hidden */}
        <div className="flex lg:hidden items-center gap-2 mb-8">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/brand/awtickets-mark.svg" alt="AW Tickets" style={{ height: "28px", width: "auto" }} />
          <span className="font-black text-white/90 tracking-[0.18em] text-xs">AW TICKETS</span>
        </div>

        {/* Form slot */}
        <div className="w-full max-w-[380px]">
          {children}
        </div>

        <p className="text-zinc-700 text-xs mt-10">
          AW Tickets © 2026 · <a href="/privacy" className="hover:text-zinc-500 transition-colors">Privacy Policy</a>
        </p>
      </div>

    </div>
  );
}
