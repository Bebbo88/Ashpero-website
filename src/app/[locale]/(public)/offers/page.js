import OffersPage from "@/components/offers/OffersPage";
import { buildPageMetadata } from "@/utils/pageMetadata";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { fetchProducts } from "@/services/productService";
import { fetchOffers } from "@/services/offerService";
import { fetchSiteContent } from "@/services/homeService";
import { productQueryKeys } from "@/features/product/queryKeys";
import { offerQueryKeys } from "@/features/offer/queryKeys";
import { homeQueryKeys } from "@/features/home/queryKeys";

// ISR: Offers generated statically but refreshed daily
export const revalidate = 86400;

export async function generateMetadata({ params }) {
  const { locale } = await params;
  return buildPageMetadata({
    path: "/offers",
    title: "Sale | Ashperoo",
    description:
      "Discover luxury skincare formulas at special pricing in our Winter Radiance Sale.",
    image: "/assets/special-offer-banner.jpg",
    locale,
  });
}

export default async function Offers() {
  const queryClient = new QueryClient();
  const bundleParams = { isActive: true, isBundle: true };

  try {
    await Promise.all([
      queryClient.prefetchQuery({
        queryKey: offerQueryKeys.list(),
        queryFn: fetchOffers,
      }),
      queryClient.prefetchQuery({
        queryKey: productQueryKeys.list(JSON.stringify(bundleParams)),
        queryFn: () => fetchProducts(bundleParams),
      }),
      queryClient.prefetchQuery({
        queryKey: homeQueryKeys.content(),
        queryFn: fetchSiteContent,
      }),
    ]);
  } catch (error) {
    console.error("Error prefetching offers data:", error);
  }

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <OffersPage />
    </HydrationBoundary>
  );
}
