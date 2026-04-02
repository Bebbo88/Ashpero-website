"use client";

import { useProductInfoLogic } from "./ProductInfo.logic";
import { ProductInfoUI } from "./ProductInfo.ui";

export default function ProductInfo({ product }) {
  const logic = useProductInfoLogic(product);
  return <ProductInfoUI product={product} {...logic} />;
}
