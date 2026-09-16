"use client";

import React, { useEffect } from "react";
import { useProductDetailsPageLogic } from "./ProductDetailsPage.logic";
import { ProductDetailsPageUI } from "./ProductDetailsPage.ui";

export default function ProductDetailsPage({ productId }) {
  const logic = useProductDetailsPageLogic(productId);

  // Arriving here from a product card leaves the page scrolled partway down:
  // Next scrolls to the top of the route segment (below the banner and navbar)
  // rather than the document, and the browser's scroll anchoring then shifts it
  // further as the gallery and related products fill in. Landing at the very
  // top is what the page needs, and doing it per productId also covers moving
  // between related products, which stays on this same route.
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [productId]);

  useEffect(() => {
    if (typeof window !== 'undefined' && window.fbq) {
      window.fbq('track', 'ViewContent');
    }
  }, []);
  return <ProductDetailsPageUI {...logic} />;
}
