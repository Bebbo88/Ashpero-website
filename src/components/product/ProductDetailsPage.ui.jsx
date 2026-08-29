"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useLanguage } from "@/hooks/useLanguage";
import ProductGallery from "./ProductGallery";
import ProductInfo from "./ProductInfo";
import ProductFullWidthDetails from "./ProductFullWidthDetails";
import ProductReviews from "./ProductReviews";
import BeforeAfterSection from "./BeforeAfterSection";
import CustomerVideoReviews from "./CustomerVideoReviews";
import RelatedProducts from "./RelatedProducts";
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
  const { t } = useLanguage();
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);

  if (isLoading) {
    return <Loader fullScreen />;
  }

  if (isError || !product) {
    return (
      <section className="w-full bg-bg-primary min-h-screen py-8 md:py-14 pb-28 md:pb-14">
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
    <section className="w-full bg-bg-primary min-h-screen py-8 md:py-14 pb-28 md:pb-14">
      <div className="container mx-auto px-6 lg:px-10">
        {/* Breadcrumbs - Above Product Gallery */}
        <nav className="flex items-center gap-2 text-xs text-text-secondary mb-6">
          <Link href="/" className="hover:text-brand-orange transition-colors">
            {t("ProductDetails.home")}
          </Link>
          <span>/</span>
          <Link
            href="/all-products"
            className="hover:text-brand-orange transition-colors"
          >
            {t("ProductDetails.allProducts")}
          </Link>
          <span>/</span>
          <span className="text-text-primary font-medium">{product.title}</span>
        </nav>

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

        {/* You May Also Like / Related Products Section */}
        <RelatedProducts currentProduct={product} />

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
