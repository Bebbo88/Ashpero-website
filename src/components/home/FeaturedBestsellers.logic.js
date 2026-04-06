import { useMemo } from "react";
import { useLanguage } from "@/hooks/useLanguage";
import { useBestSellersQuery } from "@/features/home/queries";
import { mapBestSellerProducts } from "@/features/home/mappers";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { toggleWishlistItem } from "@/store/slices/wishlistSlice";
import { addToCart } from "@/store/slices/cartSlice";

export function useFeaturedBestsellersLogic() {
  const { t, locale } = useLanguage();
  const dispatch = useAppDispatch();
  const wishlistItems = useAppSelector((state) => state.wishlist.items || []);
  const bestSellersQuery = useBestSellersQuery(12);

  const products = useMemo(
    () => mapBestSellerProducts(bestSellersQuery.data || [], locale),
    [bestSellersQuery.data, locale],
  );

  const wishlistIds = useMemo(
    () => wishlistItems.map((item) => String(item.productId || "")),
    [wishlistItems],
  );

  const toggleWishlistByProduct = (product) => {
    dispatch(
      toggleWishlistItem({
        id: product.id,
        title: product.title,
        image: product.image,
        category: product.category,
        price: product.price,
        priceValue: product.priceNum,
      }),
    );
  };

  const addProductToCart = (product) => {
    dispatch(
      addToCart({
        id: product.id,
        title: product.title,
        image: product.image,
        category: product.category,
        price: product.price,
        priceValue: product.priceNum,
        quantity: 1,
      }),
    );
  };

  return {
    t,
    isArabic: locale === "ar",
    products,
    wishlist: wishlistIds,
    toggleWishlist: toggleWishlistByProduct,
    addToCart: addProductToCart,
    isLoading: bestSellersQuery.isLoading,
    isError: bestSellersQuery.isError,
    errorMessage: bestSellersQuery.error?.message || "",
  };
}
