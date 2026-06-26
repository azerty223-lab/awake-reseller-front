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

/** Thin editorial divider between sections */
function Divider() {
  return (
    <div
      aria-hidden="true"
      className="h-px bg-gradient-to-r from-transparent via-white/[0.18] to-transparent"
    />
  );
}

export default function HomePage() {
  return (
    <>
      {/* 1 — Cinematic hero: value prop, urgency, trust, solid CTA */}
      <CinematicHero />

      {/* 2 — Social proof ticker: live purchase activity builds trust immediately */}
      <SocialProofTicker />

      {/* 3 — Featured tickets: first conversion opportunity, low friction */}
      <Divider />
      <FeaturedTickets />

      {/* 4 — Trust & verification: justify the purchase right after the first CTA */}
      <Divider />
      <ResaleMarketplaceSection />

      {/* 5 — Delivery process: reduce anxiety about how/when tickets arrive */}
      <Divider />
      <TicketDeliverySection />

      {/* 6 — Ticket tiers: inform and upsell (weekend vs day passes) */}
      <Divider />
      <FestivalAccessSection />

      {/* 7 — Lineup: emotional sell, primary reason to attend — anchor for hero CTA */}
      <div id="lineup">
        <Divider />
        <LineupSection />
      </div>

      {/* 8 — Accommodation: secondary upsell, not a conversion blocker */}
      <Divider />
      <AccommodationSection />

      {/* 9 — FAQ: answers buying objections + entry rules (replaces FestivalRulesSection) */}
      <Divider />
      <FAQSection />

      {/* 10 — Final CTA: last push before footer, email capture for waitlist */}
      <Divider />
      <FinalCTASection />
    </>
  );
}
