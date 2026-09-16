import { useMemo } from "react";
import { useLanguage } from "@/hooks/useLanguage";
import { mapProductDetails } from "@/features/product/mappers";
import { useProductDetailsQuery } from "@/features/product/queries";
import { useOffersQuery } from "@/features/offer/queries";

export function useProductDetailsPageLogic(productId) {
  const { locale } = useLanguage();

  const productQuery = useProductDetailsQuery(productId);

  const offersQuery = useOffersQuery();

  const product = useMemo(() => {
    return mapProductDetails(productQuery.data, locale, offersQuery.data);
  }, [productQuery.data, locale, offersQuery.data]);

  return {
    productId,
    product,

    // Offers are a secondary enhancement (discount badge/price) — mapProductDetails
    // already degrades gracefully when offers data isn't ready yet (defaults to
    // no discount), so the core product page must not be blocked behind a
    // full-screen loader/error just because that secondary fetch is slow or fails.
    isLoading: productQuery.isLoading,

    isError: productQuery.isError,

    errorMessage: productQuery.error?.message || "",
  };
}
