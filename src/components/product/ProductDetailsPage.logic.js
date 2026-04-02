import { useMemo } from "react";
import { useLanguage } from "@/hooks/useLanguage";
import { PRODUCTS_DB } from "./ProductDetailsPage.data";

export function useProductDetailsPageLogic(productId) {
  const { t } = useLanguage();

  const product = useMemo(() => {
    const rawProduct = PRODUCTS_DB[productId] || PRODUCTS_DB[1];

    return {
      id: rawProduct.id,
      images: rawProduct.images,
      category: t(`ProductDetails.categories.${rawProduct.categoryKey}`),
      title: t(`ProductDetails.products.${rawProduct.titleKey}`),
      price: rawProduct.price,
      description: t(`ProductDetails.descriptions.${rawProduct.descriptionKey}`),
      sizes: rawProduct.sizes || [],
      ingredients: t(`ProductDetails.ingredientsData.${rawProduct.ingredientsKey}`),
      howToUse: t(`ProductDetails.howToUseData.${rawProduct.howToUseKey}`),
    };
  }, [productId, t]);

  return { product };
}
