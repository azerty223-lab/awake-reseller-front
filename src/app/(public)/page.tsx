import { CinematicHero }             from "@/frontend/components/home/CinematicHero";
import { FeaturedTickets }           from "@/frontend/components/home/FeaturedTickets";
import { FestivalAccessSection }     from "@/frontend/components/home/FestivalAccessSection";
import { AccommodationSection }      from "@/frontend/components/home/AccommodationSection";
import { LineupSection }             from "@/frontend/components/home/LineupSection";
import { TicketDeliverySection }     from "@/frontend/components/home/TicketDeliverySection";
import { FestivalRulesSection }      from "@/frontend/components/home/FestivalRulesSection";
import { ResaleMarketplaceSection }  from "@/frontend/components/home/ResaleMarketplaceSection";
import { NewsletterSection }         from "@/frontend/components/home/NewsletterSection";
import { FAQSection }                from "@/frontend/components/home/FAQSection";

export default function HomePage() {
  return (
    <>
      {/* Hero — untouched */}
      <CinematicHero />

      {/* Commercial core — ticket listings */}
      <FeaturedTickets />

      {/* Editorial information architecture */}
      <FestivalAccessSection />
      <AccommodationSection />
      <LineupSection />
      <TicketDeliverySection />
      <FestivalRulesSection />
      <ResaleMarketplaceSection />

      {/* Utility */}
      <NewsletterSection />
      <FAQSection />
    </>
  );
}
