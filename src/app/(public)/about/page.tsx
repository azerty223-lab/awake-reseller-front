import type { Metadata } from "next";
import { Shield, FileText, RefreshCw, ArrowLeftRight } from "lucide-react";

export const metadata: Metadata = {
  title: "About & Legal",
  description: "Learn about AW Tickets, our resale policies, refund terms, and how ticket transfers work for Awakenings Festival.",
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] py-12 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center gap-2 mb-3">
            <Shield className="w-4 h-4 text-[#c9a84c]" />
            <span className="text-[#c9a84c] text-xs uppercase tracking-widest font-semibold">Legal</span>
          </div>
          <h1 className="font-[var(--font-playfair)] text-4xl font-bold text-white mb-3">
            About & Legal
          </h1>
          <p className="text-zinc-500">
            Everything you need to know about our resale service, policies, and ticket transfer process.
          </p>
        </div>

        <div className="space-y-8">
          {/* About section */}
          <section className="bg-[#111111] border border-[#2a2a2a] rounded-2xl p-8">
            <h2 className="text-white font-bold text-xl mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5 text-[#c9a84c]" />
              About AW Tickets
            </h2>
            <div className="space-y-3 text-zinc-400 text-sm leading-relaxed">
              <p>
                AW Tickets is an independent ticket resale service operated by a private individual.
                We are not affiliated with Stichting Awakenings, ID&T Group, or any official festival organizer.
              </p>
              <p>
                All tickets listed on this platform are legally purchased from the official Awakenings
                box office and are resold at market prices. We comply with Dutch consumer law
                regarding ticket resale.
              </p>
              <p>
                Our mission is to provide a trustworthy, transparent, and secure resale experience
                for Awakenings Festival tickets — including proper handling of the official name
                transfer process required by the festival organizer.
              </p>
            </div>
          </section>

          {/* Terms section */}
          <section id="terms" className="bg-[#111111] border border-[#2a2a2a] rounded-2xl p-8">
            <h2 className="text-white font-bold text-xl mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5 text-[#c9a84c]" />
              Terms of Service
            </h2>
            <div className="space-y-4 text-zinc-400 text-sm leading-relaxed">
              <div>
                <h3 className="text-white font-medium mb-1">1. Acceptance of Terms</h3>
                <p>By purchasing tickets through AW Tickets, you agree to these terms. All sales are final once the transfer process has been initiated.</p>
              </div>
              <div>
                <h3 className="text-white font-medium mb-1">2. Ticket Authenticity</h3>
                <p>All tickets are guaranteed to be authentic, originally purchased from the official Awakenings ticket vendor. We provide proof of original purchase upon request.</p>
              </div>
              <div>
                <h3 className="text-white font-medium mb-1">3. Pricing</h3>
                <p>Resale prices are set by the seller and may exceed the original face value. All prices are inclusive of our service fee. Prices are listed in EUR.</p>
              </div>
              <div>
                <h3 className="text-white font-medium mb-1">4. Payment</h3>
                <p>All payments are processed securely through Stripe. We do not store your payment card details. Payment is due at the time of purchase.</p>
              </div>
              <div>
                <h3 className="text-white font-medium mb-1">5. Ticket Transfer</h3>
                <p>Awakenings tickets are personalized. We manage the official name change process through the festival's authorized transfer system. Transfer completion is subject to the festival organizer's processing times (typically 3–5 business days).</p>
              </div>
            </div>
          </section>

          {/* Refund policy */}
          <section id="refunds" className="bg-[#111111] border border-[#2a2a2a] rounded-2xl p-8">
            <h2 className="text-white font-bold text-xl mb-4 flex items-center gap-2">
              <RefreshCw className="w-5 h-5 text-[#c9a84c]" />
              Refund Policy
            </h2>
            <div className="space-y-4 text-zinc-400 text-sm leading-relaxed">
              <div>
                <h3 className="text-white font-medium mb-1">Event Cancellation</h3>
                <p>If Awakenings Festival 2026 is officially cancelled by the organizer, you will receive a full refund of your purchase price within 14 business days of the cancellation announcement.</p>
              </div>
              <div>
                <h3 className="text-white font-medium mb-1">Event Postponement</h3>
                <p>If the festival is postponed, your tickets will remain valid for the new date. If you cannot attend the new date, contact us within 7 days of the postponement announcement to request a refund.</p>
              </div>
              <div>
                <h3 className="text-white font-medium mb-1">Transfer Issues</h3>
                <p>In the unlikely event that we cannot complete the name transfer for your ticket, you will receive a full refund. We will notify you immediately if this occurs.</p>
              </div>
              <div>
                <h3 className="text-white font-medium mb-1">No Refunds for Change of Mind</h3>
                <p>As tickets are personalized event tickets with a time-limited nature, we cannot offer refunds for change of mind once the transfer process has begun. Please purchase carefully.</p>
              </div>
            </div>
          </section>

          {/* Transfer policy */}
          <section id="transfer" className="bg-[#111111] border border-[#2a2a2a] rounded-2xl p-8">
            <h2 className="text-white font-bold text-xl mb-4 flex items-center gap-2">
              <ArrowLeftRight className="w-5 h-5 text-[#c9a84c]" />
              Transfer Policy
            </h2>
            <div className="space-y-4 text-zinc-400 text-sm leading-relaxed">
              <p>
                Awakenings Festival personalizes all tickets to a specific attendee's name.
                This is an anti-scalping measure by the organizer. We are fully compliant
                with this policy and manage the transfer process transparently.
              </p>
              <div>
                <h3 className="text-white font-medium mb-2">How it works:</h3>
                <ol className="space-y-2 list-decimal list-inside">
                  <li>You complete your purchase and provide your full name and email.</li>
                  <li>We initiate the official name change request through Awakenings' authorized transfer portal.</li>
                  <li>The festival organizer processes the transfer (typically 3–5 business days).</li>
                  <li>You receive your personalized e-ticket via email.</li>
                  <li>Present your e-ticket at the festival entrance with matching ID.</li>
                </ol>
              </div>
              <p className="text-amber-400/80 text-xs">
                Note: Name transfer windows may close closer to the festival date.
                We recommend purchasing early to ensure ample transfer processing time.
              </p>
            </div>
          </section>

          {/* Privacy */}
          <section id="privacy" className="bg-[#111111] border border-[#2a2a2a] rounded-2xl p-8">
            <h2 className="text-white font-bold text-xl mb-4">Privacy Policy</h2>
            <div className="space-y-3 text-zinc-400 text-sm leading-relaxed">
              <p>We collect only the information necessary to process your order and complete the ticket transfer: your name, email, and phone (optional).</p>
              <p>Your payment information is handled entirely by Stripe and is never stored on our servers.</p>
              <p>We do not sell or share your personal data with third parties, except as required to process the ticket transfer with the festival organizer.</p>
              <p>By purchasing, you consent to us sharing your name and email with Awakenings Festival's official transfer system for the purpose of completing your ticket transfer.</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
