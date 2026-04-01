import ProductDetailsPage from "@/components/product/ProductDetailsPage";

// ISR: Static pages for fast loading, revalidated relatively often (every 60s) for price/stock accuracy
export const revalidate = 60;

export default async function ProductDetails({ params }) {
  const { id } = await params;

  return <ProductDetailsPage productId={id} />;
}
