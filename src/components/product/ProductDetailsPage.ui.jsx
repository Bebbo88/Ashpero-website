"use client";

import React, { useState } from "react";
import ProductGallery from "./ProductGallery";
import ProductInfo from "./ProductInfo";
import ProductFullWidthDetails from "./ProductFullWidthDetails";
import ProductReviews from "./ProductReviews";
import BeforeAfterSection from "./BeforeAfterSection";
import CustomerVideoReviews from "./CustomerVideoReviews";
import PopupGalleryModal, { PopupGalleryTrigger } from "./PopupGalleryModal";
import EmptyState from "@/components/ui/EmptyState";
import Loader from "../loader/loader";

export function ProductDetailsPageUI({
  productId,
  product,
  isLoading,
  isError,
  errorMessage,
}) {
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);

  if (isLoading) {
    return <Loader fullScreen />;
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
        {/* Gallery & Product Info */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 relative items-start">
          <div className="relative flex flex-col">
            <div className="self-end mb-2">
              <PopupGalleryTrigger
                popupGallery={product.popupGallery}
                onOpen={() => setIsGalleryOpen(true)}
              />
            </div>
            <ProductGallery images={product.images} productName={product.title} />
          </div>
          <ProductInfo product={product} />
        </div>

        {/* Full-Width Always Visible Ingredients, How to Use, and Share Section */}
        <ProductFullWidthDetails product={product} />

        {/* Before / After Comparison Section */}
        <BeforeAfterSection beforeAfterImages={product.beforeAfterImages} />

        {/* Customer Video Reviews Section */}
        <CustomerVideoReviews customerReviewVideos={product.customerReviewVideos} />

        {/* Written Product Reviews */}
        <ProductReviews productId={product.id || productId} />

        {/* Popup Gallery Modal */}
        <PopupGalleryModal
          popupGallery={product.popupGallery}
          isOpen={isGalleryOpen}
          onClose={() => setIsGalleryOpen(false)}
        />
      </div>
    </section>
  );
}
