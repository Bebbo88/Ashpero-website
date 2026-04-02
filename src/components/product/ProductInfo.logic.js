import { useMemo, useState } from "react";
import { useLanguage } from "@/hooks/useLanguage";

export function useProductInfoLogic(product) {
  const { t } = useLanguage();

  const sizeOptions = useMemo(
    () =>
      Array.isArray(product.sizes)
        ? product.sizes.map((size) => String(size).trim()).filter(Boolean)
        : [],
    [product.sizes],
  );

  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState("");
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [openAccordion, setOpenAccordion] = useState("ingredients");

  const decrementQty = () => setQuantity((prev) => Math.max(1, prev - 1));
  const incrementQty = () => setQuantity((prev) => Math.min(10, prev + 1));

  const toggleAccordion = (key) => {
    setOpenAccordion((prev) => (prev === key ? null : key));
  };

  const resolvedSelectedSize =
    selectedSize && sizeOptions.includes(selectedSize)
      ? selectedSize
      : (sizeOptions[0] || "");

  const accordions = useMemo(
    () => [
      {
        key: "ingredients",
        title: t("ProductDetails.ingredients"),
        content: product.ingredients,
      },
      {
        key: "howToUse",
        title: t("ProductDetails.howToUse"),
        content: product.howToUse,
      },
    ],
    [product.howToUse, product.ingredients, t],
  );

  return {
    t,
    sizeOptions,
    quantity,
    selectedSize: resolvedSelectedSize,
    isWishlisted,
    openAccordion,
    accordions,
    setSelectedSize,
    setIsWishlisted,
    decrementQty,
    incrementQty,
    toggleAccordion,
  };
}
