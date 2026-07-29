"use client";

import React, { useState } from "react";
import Image from "@/components/ui/AppImage";
import Link from "next/link";
import { Heart, ShoppingCart, Check } from "lucide-react";
import { buildProductPath } from "@/utils/productUrl";
import { useLanguage } from "@/hooks/useLanguage";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { addToCart } from "@/store/slices/cartSlice";
import { toggleWishlistItem } from "@/store/slices/wishlistSlice";

export default function BundleCard({ product, priority = false }) {
  const { t, locale } = useLanguage();
  const dispatch = useAppDispatch();
  const isArabic = locale === "ar";

  const wishlistItems = useAppSelector((state) => state.wishlist.items || []);
  const isWishlisted = wishlistItems.some(
    (item) => item.productId === String(product.id || ""),
  );

  const handleToggleWishlist = (event) => {
    event.preventDefault();
    event.stopPropagation();

    dispatch(
      toggleWishlistItem({
        id: product.id,
        title: product.title,
        image: product.image,
        category: product.category,
        price: product.price,
        priceValue: product.priceValue,
      }),
    );

    if (!isWishlisted && typeof window !== "undefined" && window.fbq) {
      window.fbq("track", "AddToWishlist", {
        value: Number(product.priceValue || 0),
        currency: "EGP",
      });
    }
  };

  const handleAddToCart = (event) => {
    event.preventDefault();
    event.stopPropagation();

    const firstVariant =
      Array.isArray(product.variants) && product.variants.length > 0
        ? product.variants[0]
        : null;

    dispatch(
      addToCart({
        id: product.id,
        title: product.title,
        image: product.image,
        category: product.category,
        price: product.price || `EGP ${product.priceValue}`,
        priceValue: product.priceValue,
        size: firstVariant ? firstVariant.size : "",
        stock: firstVariant ? firstVariant.stock : 99,
        quantity: 1,
      }),
    );

    if (typeof window !== "undefined" && window.fbq) {
      window.fbq("track", "AddToCart", {
        value: product.priceValue,
        currency: "EGP",
      });
    }
  };

  // Compile 4 images for the collage display
  const collageImages = [];
  if (Array.isArray(product.images) && product.images.length > 0) {
    collageImages.push(...product.images.slice(0, 4));
  }
  // If not enough images, fallback to the main image
  while (collageImages.length < 4) {
    collageImages.push(product.image || "/assets/photo1.jpeg");
  }

  // Calculate discount badge text if offer is active
  let discountBadgeText = "";
  if (product.hasOffer && product.discountValue) {
    if (product.discountType === "percentage") {
      discountBadgeText = isArabic
        ? `خصم ${product.discountValue}%`
        : `${product.discountValue}% OFF`;
    } else {
      discountBadgeText = isArabic
        ? `خصم ${product.discountValue} ج.م`
        : `${product.discountValue} EGP OFF`;
    }
  }

  return (
    <div className="relative group rounded-3xl border border-brand-mint/20 dark:border-brand-mint/10 bg-gradient-to-b from-white via-brand-creme/5 to-brand-mint/5 dark:from-white/5 dark:via-transparent dark:to-brand-mint/5 shadow-lg hover:shadow-xl hover:border-brand-mint/40 transition-all duration-500 overflow-hidden flex flex-col h-full p-5 gap-4">
      {/* Top Accent Gradient Border */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 via-brand-mint to-brand-orange z-10" />

      {/* Image collage area (Top) */}
      <div className="relative w-full aspect-[4/3] sm:aspect-[1.5] rounded-2xl overflow-hidden bg-surface-muted dark:bg-white/5 shrink-0">
        {/* Main Bundle Badge */}
        <div className="absolute top-3 left-3 z-30 px-3 py-1 bg-gradient-to-r from-amber-500 to-orange-600 text-white text-[10px] font-black uppercase tracking-wider rounded-lg shadow-md">
          {isArabic ? "باقة خاصة ⚡" : "SPECIAL BUNDLE ⚡"}
        </div>

        {/* Matched Offer Discount Badge */}
        {discountBadgeText && (
          <div className="absolute top-3 right-12 z-30 px-2.5 py-1 bg-brand-orange text-white text-[10px] font-black rounded-lg shadow-md">
            {discountBadgeText}
          </div>
        )}

        {/* Wishlist Button */}
        <button
          aria-label="Toggle Wishlist"
          onClick={handleToggleWishlist}
          className="absolute top-3 right-3 z-20 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 shadow-sm bg-white/95 dark:bg-black/50 backdrop-blur-sm hover:scale-110 hover:bg-white"
        >
          <Heart
            className={`w-4 h-4 transition-colors duration-300 ${
              isWishlisted
                ? "fill-red-500 text-red-500"
                : "text-gray-400 dark:text-gray-300 hover:text-red-400"
            }`}
          />
        </button>

        {/* 2x2 Image Collage Grid */}
        <Link href={buildProductPath(product.id, product.title)} className="absolute inset-0 grid grid-cols-2 grid-rows-2 gap-1.5 p-1.5">
          {collageImages.map((imgUrl, idx) => (
            <div
              key={idx}
              className="relative w-full h-full overflow-hidden bg-slate-50 dark:bg-black/20 rounded-xl transition-all duration-500 group-hover:scale-[1.01]"
            >
              <Image
                src={imgUrl}
                alt={`${product.title} bundle view ${idx + 1}`}
                fill
                className="object-cover"
                sizes="(max-width: 640px) 50vw, 250px"
                priority={priority && idx === 0}
              />
            </div>
          ))}
        </Link>
      </div>

      {/* Details block (Bottom) */}
      <div className="flex flex-col flex-1 justify-between text-start">
        <div>
          {/* Category */}
          {product.category && (
            <span className="text-[10px] font-bold tracking-[0.15em] text-brand-mint dark:text-brand-accent uppercase block mb-1">
              {product.category}
            </span>
          )}

          {/* Title */}
          <Link href={buildProductPath(product.id, product.title)} className="block">
            <h3 className="font-serif text-lg md:text-xl font-bold text-text-primary leading-snug line-clamp-1 hover:text-brand-accent transition-colors duration-300 mb-1">
              {product.title}
            </h3>
          </Link>

          {/* Pricing */}
          <div className="flex items-center gap-2.5 mb-3">
            <span className="text-xl font-black text-brand-orange dark:text-brand-mint">
              {product.price}
            </span>
            {product.hasOffer && product.oldPrice && (
              <span className="text-gray-400 dark:text-gray-500 text-sm line-through font-medium">
                {product.oldPrice}
              </span>
            )}
          </div>

          {/* Description */}
          {product.description && (
            <p className="text-xs text-text-secondary line-clamp-2 mb-4 leading-relaxed">
              {product.description}
            </p>
          )}

          {/* Bundle Contents List (bundleIncludes) */}
          {Array.isArray(product.bundleIncludes) && product.bundleIncludes.length > 0 && (
            <div className="border-t border-brand-mint/10 pt-3 mb-4">
              <h4 className="text-[11px] font-bold uppercase tracking-wider text-text-primary mb-2">
                {isArabic ? "محتويات العرض:" : "Bundle Includes:"}
              </h4>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {product.bundleIncludes.slice(0, 4).map((item, idx) => (
                  <li key={idx} className="flex items-center gap-2 text-xs text-text-secondary">
                    <span className="flex h-4 w-4 items-center justify-center rounded-full bg-brand-mint/10 text-brand-mint shrink-0">
                      <Check className="h-3 w-3 stroke-[3]" />
                    </span>
                    <span className="line-clamp-1">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* CTA Actions */}
        <div className="flex gap-2 border-t border-brand-mint/10 pt-4 mt-auto">
          <button
            type="button"
            onClick={handleAddToCart}
            className="flex-1 flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-brand-mint text-white font-bold text-xs sm:text-sm tracking-wide hover:bg-brand-orange transition-all duration-300 shadow-md shadow-brand-mint/10 cursor-pointer hover:scale-[1.01] active:scale-[0.99]"
          >
            <ShoppingCart className="w-4 h-4" />
            <span>{isArabic ? "أضف العرض للسلة" : "Add Bundle to Cart"}</span>
          </button>

          <Link
            href={buildProductPath(product.id, product.title)}
            className="px-4 py-3 rounded-xl border border-border-color text-text-primary hover:border-brand-mint hover:text-brand-mint text-center font-bold text-xs sm:text-sm transition-all duration-300"
          >
            {isArabic ? "تفاصيل" : "Details"}
          </Link>
        </div>
      </div>
    </div>
  );
}
