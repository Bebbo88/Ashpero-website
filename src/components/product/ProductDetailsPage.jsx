"use client";

import React from "react";
import { useProductDetailsPageLogic } from "./ProductDetailsPage.logic";
import { ProductDetailsPageUI } from "./ProductDetailsPage.ui";

export default function ProductDetailsPage({ productId }) {
  const logic = useProductDetailsPageLogic(productId);
  return <ProductDetailsPageUI {...logic} />;
}
