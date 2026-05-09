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

    isLoading: productQuery.isLoading || offersQuery.isLoading,

    isError: productQuery.isError || offersQuery.isError,

    errorMessage:
      productQuery.error?.message || offersQuery.error?.message || "",
  };
}
