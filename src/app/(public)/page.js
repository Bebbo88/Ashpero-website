import HeroSection from "@/components/home/HeroSection";
import FeaturedBestsellers from "@/components/home/FeaturedBestsellers";
import OfferBanner from "@/components/home/OfferBanner";
import UseItFeelIt from "@/components/home/UseItFeelIt";
import HeritageCTA from "@/components/home/HeritageCTA";

export const metadata = {
  title: 'Ashpero | Luxury Skincare Made in Egypt',
  description: 'Discover the power of nature and science combined. Ashpero brings you premium, natural skincare products designed for radiant, healthy skin.',
};

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
