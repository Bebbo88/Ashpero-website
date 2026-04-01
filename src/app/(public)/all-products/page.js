import AllProductsPage from "@/components/product/AllProductsPage";

export const metadata = {
  title: 'All Products | Ashpero Skincare',
  description: 'Explore our full collection of serums, moisturizers, cleansers, and oils. Find the perfect routine for your unique skin.',
};

// ISR: Revalidate every hour since products may change
export const revalidate = 3600;

export default function AllProducts() {
  return <AllProductsPage />;
}
