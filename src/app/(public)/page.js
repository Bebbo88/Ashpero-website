import HeroSection from "@/components/home/HeroSection";
import FeaturedBestsellers from "@/components/home/FeaturedBestsellers";
import OfferBanner from "@/components/home/OfferBanner";
import UseItFeelIt from "@/components/home/UseItFeelIt";
import HeritageCTA from "@/components/home/HeritageCTA";

// ISR: Statically generated and fast, but revalidated hourly as featured products/promos might change
export const revalidate = 3600;

export default function Home() {
  return (
    <>
      <HeroSection />
      <FeaturedBestsellers />
      <OfferBanner />
      <UseItFeelIt />
      <HeritageCTA />
    </>
  );
}
