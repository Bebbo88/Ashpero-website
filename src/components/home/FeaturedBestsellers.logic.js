import { useMemo, useState } from "react";
import { useLanguage } from "@/hooks/useLanguage";
import { useBestSellersQuery } from "@/features/home/queries";
import { mapBestSellerProducts } from "@/features/home/mappers";

export function useFeaturedBestsellersLogic() {
  const { t, locale } = useLanguage();
  const [wishlistIds, setWishlistIds] = useState([]);
  const bestSellersQuery = useBestSellersQuery(12);

  const products = useMemo(
    () => mapBestSellerProducts(bestSellersQuery.data || [], locale),
    [bestSellersQuery.data, locale],
  );

  const toggleWishlistById = (id) => {
    const targetId = String(id);
    setWishlistIds((prev) =>
      prev.includes(targetId)
        ? prev.filter((itemId) => itemId !== targetId)
        : [...prev, targetId],
    );
  };

  return {
    t,
    isArabic: locale === "ar",
    products,
    wishlist: wishlistIds,
    toggleWishlist: toggleWishlistById,
    isLoading: bestSellersQuery.isLoading,
    isError: bestSellersQuery.isError,
    errorMessage: bestSellersQuery.error?.message || "",
  };
}
