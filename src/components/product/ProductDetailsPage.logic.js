import { useMemo } from "react";
import { useLanguage } from "@/hooks/useLanguage";
import { mapProductDetails } from "@/features/product/mappers";
import { useProductDetailsQuery } from "@/features/product/queries";

export function useProductDetailsPageLogic(productId) {
  const { locale } = useLanguage();
  const productQuery = useProductDetailsQuery(productId);

  const product = useMemo(() => {
    return mapProductDetails(productQuery.data, locale);
  }, [productQuery.data, locale]);

  return {
    productId,
    product,
    isLoading: productQuery.isLoading,
    isError: productQuery.isError,
    errorMessage: productQuery.error?.message || "",
  };
}
