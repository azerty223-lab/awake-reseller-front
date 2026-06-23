import { HeroSection } from "@/components/home/HeroSection";
import { FeaturedTickets } from "@/components/home/FeaturedTickets";
import { FestivalInfo } from "@/components/home/FestivalInfo";
import { TrustSection } from "@/components/home/TrustSection";
import { NewsletterSection } from "@/components/home/NewsletterSection";
import { FAQSection } from "@/components/home/FAQSection";

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
