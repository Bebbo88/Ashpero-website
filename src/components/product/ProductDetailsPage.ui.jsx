"use client";

import React from "react";
import ProductGallery from "./ProductGallery";
import ProductInfo from "./ProductInfo";
import ProductReviews from "./ProductReviews";
import EmptyState from "@/components/ui/EmptyState";
import Loader from "../loader/loader";

export function ProductDetailsPageUI({
  productId,
  product,
  isLoading,
  isError,
  errorMessage,
}) {
  if (isLoading) {
    return (
      <section className="w-full bg-bg-primary min-h-screen py-8 md:py-40">
        <div className="container mx-auto px-6 lg:px-10">
          <Loader />
        </div>
      </section>
    );
  }

  if (isError || !product) {
    return (
      <section className="w-full bg-bg-primary min-h-screen py-8 md:py-14">
        <div className="container mx-auto px-6 lg:px-10">
          <EmptyState
            title="Product not found"
            description={
              errorMessage || "We could not load this product right now."
            }
          />
        </div>
      </section>
    );
  }

  return (
    <section className="w-full bg-bg-primary min-h-screen py-8 md:py-14">
      <div className="container mx-auto px-6 lg:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
          <ProductGallery images={product.images} productName={product.title} />
          <ProductInfo product={product} />
        </div>

        <ProductReviews productId={product.id || productId} />
      </div>
    </section>
  );
}
