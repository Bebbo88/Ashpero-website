"use client";

import React from "react";
import { useProductReviewsLogic } from "./ProductReviews.logic";
import { ProductReviewsUI } from "./ProductReviews.ui";

export default function ProductReviews({ productId }) {
  const logic = useProductReviewsLogic(productId);
  return <ProductReviewsUI {...logic} />;
}
