import { HeroSection } from "@/frontend/components/home/HeroSection";
import { FeaturedTickets } from "@/frontend/components/home/FeaturedTickets";
import { FestivalInfo } from "@/frontend/components/home/FestivalInfo";
import { TrustSection } from "@/frontend/components/home/TrustSection";
import { NewsletterSection } from "@/frontend/components/home/NewsletterSection";
import { FAQSection } from "@/frontend/components/home/FAQSection";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <FeaturedTickets />
      <FestivalInfo />
      <TrustSection />
      <NewsletterSection />
      <FAQSection />
    </>
  );
}
