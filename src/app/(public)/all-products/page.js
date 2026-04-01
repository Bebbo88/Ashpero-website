import AllProductsPage from "@/components/product/AllProductsPage";

// ISR: Revalidate every hour since products may change
export const revalidate = 3600;

export default function AllProducts() {
  return <AllProductsPage />;
}
