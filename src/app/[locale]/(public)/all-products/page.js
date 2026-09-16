import AllProductsPage from "@/components/product/AllProductsPage";
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

export async function generateMetadata({ params }) {
  const { locale } = await params;
  return buildPageMetadata({
    path: "/all-products",
    title: "All Products | Ashperoo Skincare",
    description:
      "Explore our full collection of serums, moisturizers, cleansers, and oils. Find the perfect routine for your unique skin.",
    image: "/assets/all_productss.jpg",
    locale,
  });
}

// ISR: Revalidate every hour since products may change
export const revalidate = 3600;

export default async function AllProducts() {
  const queryClient = new QueryClient();
  const productParams = { isActive: true, isBundle: false };

  try {
    await Promise.all([
      queryClient.prefetchQuery({
        queryKey: productQueryKeys.list(JSON.stringify(productParams)),
        queryFn: () => fetchProducts(productParams),
      }),
      queryClient.prefetchQuery({
        queryKey: offerQueryKeys.list(),
        queryFn: fetchOffers,
      }),
      queryClient.prefetchQuery({
        queryKey: homeQueryKeys.content(),
        queryFn: fetchSiteContent,
      }),
    ]);
  } catch (error) {
    console.error("Error prefetching all-products data:", error);
  }

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <AllProductsPage />
    </HydrationBoundary>
  );
}
