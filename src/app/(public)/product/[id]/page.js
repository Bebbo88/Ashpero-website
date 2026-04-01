import ProductDetailsPage from "@/components/product/ProductDetailsPage";

// ISR: Static pages for fast loading, revalidated relatively often (every 60s) for price/stock accuracy
export const revalidate = 60;

export async function generateMetadata({ params }) {
  const { id } = await params;
  
  // Later this can fetch actual product name, price, and image from API
  // e.g. const product = await fetchProduct(id);
  
  return {
    title: `Product ${id} | Ashpero Skincare`,
    description: `Shop premium Ashpero product #${id}. Read reviews, instructions, and ingredients.`,
  };
}

export default async function ProductDetails({ params }) {
  const { id } = await params;

  return <ProductDetailsPage productId={id} />;
}
