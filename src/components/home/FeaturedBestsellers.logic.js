import { useMemo } from "react";
import { useLanguage } from "@/hooks/useLanguage";
import { useBestSellersQuery } from "@/features/home/queries";
import { useOffersQuery } from "@/features/offer/queries";
import { mapBestSellerProducts } from "@/features/home/mappers";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { toggleWishlistItem } from "@/store/slices/wishlistSlice";
import { addToCart } from "@/store/slices/cartSlice";

export function useFeaturedBestsellersLogic() {
  const { t, locale } = useLanguage();

  const dispatch = useAppDispatch();

  const wishlistItems = useAppSelector((state) => state.wishlist.items || []);

  const bestSellersQuery = useBestSellersQuery(12);

  const offersQuery = useOffersQuery();

  const products = useMemo(
    () =>
      mapBestSellerProducts(
        bestSellersQuery.data || [],
        locale,
        offersQuery.data || [],
      ),

    [bestSellersQuery.data, locale, offersQuery.data],
  );

  const wishlistIds = useMemo(
    () => wishlistItems.map((item) => String(item.productId || "")),

    [wishlistItems],
  );

  const toggleWishlistByProduct = (product) => {
    const isWishlisted = wishlistIds.includes(String(product.id || ""));
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
    if (!isWishlisted && typeof window !== "undefined" && window.fbq) {
      window.fbq("track", "AddToWishlist", {
        value: Number(product.priceNum || 0),
        currency: "EGP",
      });
    }
  };

  const addProductToCart = (product) => {
    const firstVariant =
      Array.isArray(product.variants) && product.variants.length > 0
        ? product.variants[0]
        : null;

    if (!firstVariant) {
      return;
    }

    dispatch(
      addToCart({
        id: product.id,
        title: product.title,
        image: product.image,
        category: product.category,

        price: firstVariant.priceLabel,

        priceValue: firstVariant.price,

        quantity: 1,

        size: firstVariant.size,

        stock: firstVariant.stock,
      }),
    );

    if (typeof window !== "undefined" && window.fbq) {
      window.fbq("track", "AddToCart", {
        value: Number(firstVariant.price || 0),
        currency: "EGP",
      });
    }
  };

  return {
    t,

    isArabic: locale === "ar",

    products,

    wishlist: wishlistIds,

    toggleWishlist: toggleWishlistByProduct,

    addToCart: addProductToCart,

    isLoading: bestSellersQuery.isLoading || offersQuery.isLoading,

    isError: bestSellersQuery.isError || offersQuery.isError,

    errorMessage:
      bestSellersQuery.error?.message || offersQuery.error?.message || "",
  };
}
