import { CinematicHero }  from "@/frontend/components/home/CinematicHero";
import { FeaturedTickets } from "@/frontend/components/home/FeaturedTickets";
import { HowItWorks }      from "@/frontend/components/home/HowItWorks";
import { FestivalInfo }    from "@/frontend/components/home/FestivalInfo";
import { LineupSection }   from "@/frontend/components/home/LineupSection";
import { TrustSection }    from "@/frontend/components/home/TrustSection";
import { NewsletterSection } from "@/frontend/components/home/NewsletterSection";
import { FAQSection }      from "@/frontend/components/home/FAQSection";

export default function HomePage() {
  return (
    <>
      <CinematicHero />
      <FeaturedTickets />
      <HowItWorks />
      <FestivalInfo />
      <LineupSection />
      <TrustSection />
      <NewsletterSection />
      <FAQSection />
    </>
  );
}
