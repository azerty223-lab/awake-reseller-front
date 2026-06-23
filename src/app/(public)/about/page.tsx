import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Shield, FileText, RefreshCw, ArrowLeftRight, Lock, CheckCircle, Mail } from "lucide-react";

export const metadata: Metadata = {
  title: "About & Legal",
  description: "Learn about AW Tickets, our resale policies, refund terms, and how ticket transfers work for Awakenings Festival.",
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#050507]">

      {/* ── Hero ── */}
      <section className="relative overflow-hidden min-h-[60vh] flex items-center">
        {/* Background image */}
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=1920&auto=format&fit=crop"
            alt="Awakenings Festival crowd"
            fill
            style={{ objectFit: "cover" }}
            className="opacity-[0.10] select-none"
            priority
          />
        </div>

        {/* Gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#050507]/60 via-transparent to-[#050507]" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#050507]/80 via-transparent to-[#050507]/80" />

        {/* Gold radial glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] rounded-full bg-[#C9A84C]/[0.04] blur-3xl pointer-events-none" />

        <div className="relative z-10 w-full max-w-5xl mx-auto px-6 py-24 sm:py-32">
          {/* Label */}
          <div className="flex items-center gap-2.5 mb-6">
            <Shield className="w-3.5 h-3.5 text-[#C9A84C]" />
            <span className="text-[10px] uppercase tracking-[0.2em] font-semibold text-zinc-500">
              Independent Resale · Est. 2024
            </span>
          </div>

          {/* Heading */}
          <h1 className="font-[var(--font-playfair)] font-black text-5xl sm:text-6xl lg:text-7xl text-white leading-[1.05] mb-6">
            Awakenings{" "}
            <span className="bg-gradient-to-r from-[#C9A84C] to-[#E4BA65] bg-clip-text text-transparent">
              Tickets
            </span>
          </h1>

          <p className="text-zinc-400 text-base sm:text-lg max-w-xl leading-relaxed">
            A trusted, transparent resale service for Awakenings Festival. We handle
            the official name-transfer process so you can attend with confidence.
          </p>
        </div>
      </section>

      {/* ── Mission / Values Cards ── */}
      <section className="relative py-20 sm:py-28 px-6">
        <div className="max-w-5xl mx-auto">
          {/* Section label */}
          <div className="mb-12 sm:mb-16">
            <span className="text-[10px] uppercase tracking-[0.2em] font-semibold text-zinc-500">
              Who We Are
            </span>
            <h2 className="font-[var(--font-playfair)] text-3xl sm:text-4xl font-black text-white mt-3">
              Built on trust
            </h2>
          </div>

          {/* Glass cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {/* Card 1 */}
            <div className="bg-white/[0.04] backdrop-blur-md border border-white/[0.07] rounded-2xl p-7 hover:bg-white/[0.07] hover:border-white/[0.12] hover:-translate-y-1 hover:shadow-[0_20px_60px_rgba(0,0,0,0.6)] transition-all duration-300">
              <div className="w-10 h-10 rounded-xl bg-[#C9A84C]/10 border border-[#C9A84C]/20 flex items-center justify-center mb-5">
                <Shield className="w-5 h-5 text-[#C9A84C]" />
              </div>
              <h3 className="text-white font-semibold text-base mb-3">Independent &amp; Transparent</h3>
              <p className="text-zinc-500 text-sm leading-relaxed">
                AW Tickets is operated by a private individual — not affiliated with Stichting
                Awakenings, ID&amp;T Group, or any official festival organizer. No hidden fees,
                no surprises.
              </p>
            </div>

            {/* Card 2 */}
            <div className="bg-white/[0.04] backdrop-blur-md border border-white/[0.07] rounded-2xl p-7 hover:bg-white/[0.07] hover:border-white/[0.12] hover:-translate-y-1 hover:shadow-[0_20px_60px_rgba(0,0,0,0.6)] transition-all duration-300">
              <div className="w-10 h-10 rounded-xl bg-[#C9A84C]/10 border border-[#C9A84C]/20 flex items-center justify-center mb-5">
                <CheckCircle className="w-5 h-5 text-[#C9A84C]" />
              </div>
              <h3 className="text-white font-semibold text-base mb-3">Verified &amp; Authentic</h3>
              <p className="text-zinc-500 text-sm leading-relaxed">
                Every ticket is legally purchased from the official Awakenings box office.
                We comply with Dutch consumer law and provide proof of original purchase
                upon request.
              </p>
            </div>

            {/* Card 3 */}
            <div className="bg-white/[0.04] backdrop-blur-md border border-white/[0.07] rounded-2xl p-7 hover:bg-white/[0.07] hover:border-white/[0.12] hover:-translate-y-1 hover:shadow-[0_20px_60px_rgba(0,0,0,0.6)] transition-all duration-300 sm:col-span-2 lg:col-span-1">
              <div className="w-10 h-10 rounded-xl bg-[#C9A84C]/10 border border-[#C9A84C]/20 flex items-center justify-center mb-5">
                <ArrowLeftRight className="w-5 h-5 text-[#C9A84C]" />
              </div>
              <h3 className="text-white font-semibold text-base mb-3">Official Transfer Process</h3>
              <p className="text-zinc-500 text-sm leading-relaxed">
                We manage the official Awakenings name-transfer process end-to-end, so your
                ticket is personalized to you and valid at the gate. Our mission is a secure,
                frictionless experience.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="max-w-5xl mx-auto px-6">
        <div className="h-px bg-white/[0.06]" />
      </div>

      {/* ── Legal Content ── */}
      <section className="py-20 sm:py-28 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="mb-12 sm:mb-16">
            <span className="text-[10px] uppercase tracking-[0.2em] font-semibold text-zinc-500">
              Policies
            </span>
            <h2 className="font-[var(--font-playfair)] text-3xl sm:text-4xl font-black text-white mt-3">
              Terms &amp; policies
            </h2>
          </div>

          <div className="space-y-6">

            {/* Terms of Service */}
            <div id="terms" className="bg-white/[0.04] border border-white/[0.07] rounded-2xl p-7 sm:p-9">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 rounded-lg bg-[#C9A84C]/10 border border-[#C9A84C]/20 flex items-center justify-center shrink-0">
                  <FileText className="w-4 h-4 text-[#C9A84C]" />
                </div>
                <h2 className="text-white font-semibold text-lg">Terms of Service</h2>
              </div>
              <div className="space-y-5 text-zinc-400 text-sm leading-relaxed">
                <div>
                  <h3 className="text-white/80 font-medium mb-1.5">1. Acceptance of Terms</h3>
                  <p>By purchasing tickets through AW Tickets, you agree to these terms. All sales are final once the transfer process has been initiated.</p>
                </div>
                <div className="h-px bg-white/[0.05]" />
                <div>
                  <h3 className="text-white/80 font-medium mb-1.5">2. Ticket Authenticity</h3>
                  <p>All tickets are guaranteed to be authentic, originally purchased from the official Awakenings ticket vendor. We provide proof of original purchase upon request.</p>
                </div>
                <div className="h-px bg-white/[0.05]" />
                <div>
                  <h3 className="text-white/80 font-medium mb-1.5">3. Pricing</h3>
                  <p>Resale prices are set by the seller and may exceed the original face value. All prices are inclusive of our service fee. Prices are listed in EUR.</p>
                </div>
                <div className="h-px bg-white/[0.05]" />
                <div>
                  <h3 className="text-white/80 font-medium mb-1.5">4. Payment</h3>
                  <p>All payments are processed securely through Stripe. We do not store your payment card details. Payment is due at the time of purchase.</p>
                </div>
                <div className="h-px bg-white/[0.05]" />
                <div>
                  <h3 className="text-white/80 font-medium mb-1.5">5. Ticket Transfer</h3>
                  <p>Awakenings tickets are personalized. We manage the official name change process through the festival&apos;s authorized transfer system. Transfer completion is subject to the festival organizer&apos;s processing times (typically 3–5 business days).</p>
                </div>
              </div>
            </div>

            {/* Refund Policy */}
            <div id="refunds" className="bg-white/[0.04] border border-white/[0.07] rounded-2xl p-7 sm:p-9">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 rounded-lg bg-[#C9A84C]/10 border border-[#C9A84C]/20 flex items-center justify-center shrink-0">
                  <RefreshCw className="w-4 h-4 text-[#C9A84C]" />
                </div>
                <h2 className="text-white font-semibold text-lg">Refund Policy</h2>
              </div>
              <div className="space-y-5 text-zinc-400 text-sm leading-relaxed">
                <div>
                  <h3 className="text-white/80 font-medium mb-1.5">Event Cancellation</h3>
                  <p>If Awakenings Festival 2026 is officially cancelled by the organizer, you will receive a full refund of your purchase price within 14 business days of the cancellation announcement.</p>
                </div>
                <div className="h-px bg-white/[0.05]" />
                <div>
                  <h3 className="text-white/80 font-medium mb-1.5">Event Postponement</h3>
                  <p>If the festival is postponed, your tickets will remain valid for the new date. If you cannot attend the new date, contact us within 7 days of the postponement announcement to request a refund.</p>
                </div>
                <div className="h-px bg-white/[0.05]" />
                <div>
                  <h3 className="text-white/80 font-medium mb-1.5">Transfer Issues</h3>
                  <p>In the unlikely event that we cannot complete the name transfer for your ticket, you will receive a full refund. We will notify you immediately if this occurs.</p>
                </div>
                <div className="h-px bg-white/[0.05]" />
                <div>
                  <h3 className="text-white/80 font-medium mb-1.5">No Refunds for Change of Mind</h3>
                  <p>As tickets are personalized event tickets with a time-limited nature, we cannot offer refunds for change of mind once the transfer process has begun. Please purchase carefully.</p>
                </div>
              </div>
            </div>

            {/* Transfer Policy */}
            <div id="transfer" className="bg-white/[0.04] border border-white/[0.07] rounded-2xl p-7 sm:p-9">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 rounded-lg bg-[#C9A84C]/10 border border-[#C9A84C]/20 flex items-center justify-center shrink-0">
                  <ArrowLeftRight className="w-4 h-4 text-[#C9A84C]" />
                </div>
                <h2 className="text-white font-semibold text-lg">Transfer Policy</h2>
              </div>
              <div className="space-y-5 text-zinc-400 text-sm leading-relaxed">
                <p>
                  Awakenings Festival personalizes all tickets to a specific attendee&apos;s name.
                  This is an anti-scalping measure by the organizer. We are fully compliant
                  with this policy and manage the transfer process transparently.
                </p>

                <div>
                  <h3 className="text-white/80 font-medium mb-3">How it works</h3>
                  <ol className="space-y-3">
                    {[
                      "You complete your purchase and provide your full name and email.",
                      "We initiate the official name change request through Awakenings’ authorized transfer portal.",
                      "The festival organizer processes the transfer (typically 3–5 business days).",
                      "You receive your personalized e-ticket via email.",
                      "Present your e-ticket at the festival entrance with matching ID.",
                    ].map((step, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <span className="shrink-0 w-5 h-5 rounded-full bg-[#C9A84C]/10 border border-[#C9A84C]/30 flex items-center justify-center text-[#C9A84C] text-[10px] font-bold mt-0.5">
                          {i + 1}
                        </span>
                        <span>{step}</span>
                      </li>
                    ))}
                  </ol>
                </div>

                <div className="flex items-start gap-3 bg-amber-400/[0.06] border border-amber-400/20 rounded-xl px-4 py-3">
                  <span className="text-amber-400 text-xs mt-0.5">!</span>
                  <p className="text-amber-400/80 text-xs leading-relaxed">
                    Note: Name transfer windows may close closer to the festival date.
                    We recommend purchasing early to ensure ample transfer processing time.
                  </p>
                </div>
              </div>
            </div>

            {/* Privacy Policy */}
            <div id="privacy" className="bg-white/[0.04] border border-white/[0.07] rounded-2xl p-7 sm:p-9">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 rounded-lg bg-[#C9A84C]/10 border border-[#C9A84C]/20 flex items-center justify-center shrink-0">
                  <Lock className="w-4 h-4 text-[#C9A84C]" />
                </div>
                <h2 className="text-white font-semibold text-lg">Privacy Policy</h2>
              </div>
              <div className="space-y-3 text-zinc-400 text-sm leading-relaxed">
                <p>We collect only the information necessary to process your order and complete the ticket transfer: your name, email, and phone (optional).</p>
                <p>Your payment information is handled entirely by Stripe and is never stored on our servers.</p>
                <p>We do not sell or share your personal data with third parties, except as required to process the ticket transfer with the festival organizer.</p>
                <p>By purchasing, you consent to us sharing your name and email with Awakenings Festival&apos;s official transfer system for the purpose of completing your ticket transfer.</p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="max-w-5xl mx-auto px-6">
        <div className="h-px bg-white/[0.06]" />
      </div>

      {/* ── Contact CTA ── */}
      <section className="py-20 sm:py-28 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="relative overflow-hidden bg-white/[0.04] border border-white/[0.07] rounded-2xl p-10 sm:p-14 text-center">
            {/* Subtle gold glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-80 h-40 bg-[#C9A84C]/[0.07] blur-3xl pointer-events-none rounded-full" />

            <div className="relative z-10">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-[#C9A84C]/10 border border-[#C9A84C]/20 mb-6">
                <Mail className="w-5 h-5 text-[#C9A84C]" />
              </div>

              <h2 className="font-[var(--font-playfair)] text-3xl sm:text-4xl font-black text-white mb-4">
                Questions?
              </h2>
              <p className="text-zinc-400 text-sm sm:text-base max-w-sm mx-auto mb-8 leading-relaxed">
                We&apos;re here to help. Reach out with any questions about your order,
                the transfer process, or anything else.
              </p>

              <Link
                href="/contact"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-[#C9A84C] to-[#E4BA65] text-black font-bold rounded-xl px-7 py-3.5 text-sm hover:shadow-[0_0_30px_rgba(201,168,76,0.4)] transition-all duration-300"
              >
                Get in touch
              </Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
