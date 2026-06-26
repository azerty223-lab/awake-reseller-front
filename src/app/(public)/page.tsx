import { CinematicHero }            from "@/frontend/components/home/CinematicHero";
import { SocialProofTicker }        from "@/frontend/components/home/SocialProofTicker";
import { FeaturedTickets }          from "@/frontend/components/home/FeaturedTickets";
import { ResaleMarketplaceSection } from "@/frontend/components/home/ResaleMarketplaceSection";
import { TicketDeliverySection }    from "@/frontend/components/home/TicketDeliverySection";
import { FestivalAccessSection }    from "@/frontend/components/home/FestivalAccessSection";
import { LineupSection }            from "@/frontend/components/home/LineupSection";
import { AccommodationSection }     from "@/frontend/components/home/AccommodationSection";
import { FAQSection }               from "@/frontend/components/home/FAQSection";
import { FinalCTASection }          from "@/frontend/components/home/FinalCTASection";

/**
 * Enhanced section divider — replaces the flat h-px rule.
 * A 1px bar with a warm-white fade and a subtle cyan centre glow
 * creates section rhythm without breaking the dark aesthetic.
 */
function Divider() {
  return (
    <div aria-hidden="true" style={{ height: "1px", position: "relative" }}>
      {/* Warm-white gradient line */}
      <div style={{
        position:   "absolute",
        inset:      0,
        background: "linear-gradient(to right, transparent, rgba(237,233,225,0.10) 30%, rgba(237,233,225,0.10) 70%, transparent)",
      }} />
      {/* Cyan centre ghost — brand colour reinforcement at micro scale */}
      <div style={{
        position:   "absolute",
        inset:      0,
        background: "linear-gradient(to right, transparent, transparent 35%, rgba(6,182,212,0.09) 50%, transparent 65%, transparent)",
      }} />
    </div>
  );
}

/**
 * Alternating warm-tint wrapper.
 * rgba(237,233,225,0.014) is imperceptible on its own but, when applied
 * to every other section, creates a barely-visible depth rhythm that
 * subconsciously signals distinct content zones — the same technique
 * editorial publications use with paper weight alternation.
 */
function AltBg({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ background: "rgba(237,233,225,0.014)" }}>
      {children}
    </div>
  );
}

export default function HomePage() {
  return (
    <>
      {/* 1 — Cinematic hero: value prop, urgency, trust, solid CTA */}
      <CinematicHero />

      {/* 2 — Social proof ticker: live purchase activity builds trust immediately */}
      <SocialProofTicker />

      {/* 3 — Featured tickets: first conversion opportunity */}
      <Divider />
      <AltBg>
        <FeaturedTickets />
      </AltBg>

      {/* 4 — Trust & verification: justify the purchase right after the first CTA */}
      <Divider />
      <ResaleMarketplaceSection />

      {/* 5 — Delivery process: reduce anxiety about how/when tickets arrive */}
      <Divider />
      <AltBg>
        <TicketDeliverySection />
      </AltBg>

      {/* 6 — Ticket tiers: inform and upsell (weekend vs day passes) */}
      <Divider />
      <FestivalAccessSection />

      {/* 7 — Lineup: emotional sell — anchor target for hero 'View Lineup' CTA */}
      <div id="lineup">
        <Divider />
        <AltBg>
          <LineupSection />
        </AltBg>
      </div>

      {/* 8 — Accommodation: compact secondary upsell */}
      <Divider />
      <AccommodationSection />

      {/* 9 — FAQ: buying objections + entry rules */}
      <Divider />
      <AltBg>
        <FAQSection />
      </AltBg>

      {/* 10 — Final CTA: last push before footer, email capture */}
      <Divider />
      <FinalCTASection />
    </>
  );
}
