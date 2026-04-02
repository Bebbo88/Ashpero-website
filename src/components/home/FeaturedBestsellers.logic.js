import { useState } from "react";
import { useLanguage } from "@/hooks/useLanguage";
import { BESTSELLER_PRODUCTS } from "./FeaturedBestsellers.data";

export function useFeaturedBestsellersLogic() {
  const { t, locale } = useLanguage();
  const [wishlist, setWishlist] = useState([]);

  const toggleWishlist = (id) => {
    setWishlist((prev) => (prev.includes(id) ? prev.filter((itemId) => itemId !== id) : [...prev, id]));
  };

  return {
    t,
    isArabic: locale === "ar",
    products: BESTSELLER_PRODUCTS,
    wishlist,
    toggleWishlist,
  };
}
