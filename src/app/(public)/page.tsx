import { CinematicHero }            from "@/frontend/components/home/CinematicHero";
import { FeaturedTickets }          from "@/frontend/components/home/FeaturedTickets";
import { FestivalAccessSection }    from "@/frontend/components/home/FestivalAccessSection";
import { AccommodationSection }     from "@/frontend/components/home/AccommodationSection";
import { LineupSection }            from "@/frontend/components/home/LineupSection";
import { TicketDeliverySection }    from "@/frontend/components/home/TicketDeliverySection";
import { FestivalRulesSection }     from "@/frontend/components/home/FestivalRulesSection";
import { ResaleMarketplaceSection } from "@/frontend/components/home/ResaleMarketplaceSection";
import { NewsletterSection }        from "@/frontend/components/home/NewsletterSection";
import { FAQSection }               from "@/frontend/components/home/FAQSection";

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
      <CinematicHero />
      <Divider />
      <FeaturedTickets />
      <Divider />
      <FestivalAccessSection />
      <Divider />
      <AccommodationSection />
      <Divider />
      <LineupSection />
      <Divider />
      <TicketDeliverySection />
      <Divider />
      <FestivalRulesSection />
      <Divider />
      <ResaleMarketplaceSection />
      <Divider />
      <NewsletterSection />
      <Divider />
      <FAQSection />
    </>
  );
}
