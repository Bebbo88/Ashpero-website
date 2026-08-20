import ProductDetailsPage from "@/components/product/ProductDetailsPage";
import { extractProductIdFromParam } from "@/utils/productUrl";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { fetchProductById } from "@/services/productService";
import { fetchOffers } from "@/services/offerService";
import { productQueryKeys } from "@/features/product/queryKeys";
import { offerQueryKeys } from "@/features/offer/queryKeys";

// ISR: Revalidate every 60s for price/stock accuracy
export const revalidate = 60;

export async function generateMetadata({ params }) {
  const { id } = await params;
  const resolvedId = extractProductIdFromParam(id);

  try {
    const product = await fetchProductById(resolvedId);
    if (product) {
      const title =
        product.name_en || product.name_ar || product.name || "Product";
      const desc =
        product.description_en ||
        product.description_ar ||
        product.description ||
        "Shop premium Ashpero product.";
      return {
        title: `${title} | Ashperoo Skincare`,
        description: desc.slice(0, 160),
      };
    }
  } catch (_) {}

  return {
    title: `Product | Ashperoo Skincare`,
    description: `Shop premium Ashpero skincare. Read reviews, instructions, and ingredients.`,
  };
}

export default async function ProductDetails({ params }) {
  const { id } = await params;
  const resolvedId = extractProductIdFromParam(id);

  const queryClient = new QueryClient();

  try {
    await Promise.all([
      queryClient.prefetchQuery({
        queryKey: productQueryKeys.details(resolvedId),
        queryFn: () => fetchProductById(resolvedId),
      }),
      queryClient.prefetchQuery({
        queryKey: offerQueryKeys.list(),
        queryFn: fetchOffers,
      }),
    ]);
  } catch (err) {
    console.error("Prefetch error for product:", err);
  }

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ProductDetailsPage productId={resolvedId} />
    </HydrationBoundary>
  );
}
