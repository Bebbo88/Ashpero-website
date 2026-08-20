import HeroSection from "@/components/home/HeroSection";
import FeaturedBestsellers from "@/components/home/FeaturedBestsellers";
import OfferBanner from "@/components/home/OfferBanner";
import UseItFeelIt from "@/components/home/UseItFeelIt";
import HeritageCTA from "../../components/home/HeritageCTA";
import HomePopup from "@/components/home/HomePopup";
import HomeDropperLoader from "@/components/home/HomeDropperLoader";
import ScrollAnimationWrapper from "@/components/ui/ScrollAnimationWrapper";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { fetchBestSellers, fetchSiteContent } from "@/services/homeService";
import { homeQueryKeys } from "@/features/home/queryKeys";
export const metadata = {
  title: "Ashperoo | Luxury Skincare Made in Egypt",
  description:
    "Discover the power of nature and science combined. Ashpero brings you premium, natural skincare products designed for radiant, healthy skin.",
};

// ISR: Statically generated and fast, but revalidated hourly as featured products/promos might change
export const revalidate = 3600;

export default async function Home() {
  const queryClient = new QueryClient();

  // Prefetch data on the server during build/revalidation
  await Promise.all([
    queryClient.prefetchQuery({
      queryKey: homeQueryKeys.content(),
      queryFn: fetchSiteContent,
    }),
    queryClient.prefetchQuery({
      queryKey: homeQueryKeys.bestSellers(12),
      queryFn: () => fetchBestSellers(12),
    }),
  ]);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <HomeDropperLoader />
      <HomePopup />
      <div className="overflow-x-hidden w-full">
        <ScrollAnimationWrapper mode="load" animation="fade-up">
          <HeroSection />
        </ScrollAnimationWrapper>
        <ScrollAnimationWrapper animation="fade-up">
          <FeaturedBestsellers />
        </ScrollAnimationWrapper>
        <ScrollAnimationWrapper animation="scale-up">
          <OfferBanner />
        </ScrollAnimationWrapper>
        <UseItFeelIt />
        <ScrollAnimationWrapper animation="slide-from-left">
          <HeritageCTA />
        </ScrollAnimationWrapper>
      </div>
    </HydrationBoundary>
  );
}
