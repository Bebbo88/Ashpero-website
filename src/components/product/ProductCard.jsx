"use client";

import React from "react";
import Image from "@/components/ui/AppImage";
import Link from "next/link";
import { Heart, ShoppingCart, Images } from "lucide-react";
import PopupGalleryModal, { PopupGalleryTrigger } from "./PopupGalleryModal";
import { buildProductPath } from "@/utils/productUrl";
import { useLanguage } from "@/hooks/useLanguage";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { addToCart } from "@/store/slices/cartSlice";
import { toggleWishlistItem } from "@/store/slices/wishlistSlice";

export default function ProductCard({ product, priority = false }) {
  const { t } = useLanguage();
  const { locale } = useLanguage()
  const dispatch = useAppDispatch();
  const [isGalleryOpen, setIsGalleryOpen] = React.useState(false);
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
        priceValue: product.priceNum,
      }),
    );

    if (!isWishlisted && typeof window !== "undefined" && window.fbq) {
      window.fbq("track", "AddToWishlist", {
        value: Number(product.priceNum || 0),
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

    if (!firstVariant || product.inStock === false) {
      return;
    }
    dispatch(
      addToCart({
        id: product.id,
        title: product.title,
        image: product.image,
        category: product.category,
        price: `EGP ${firstVariant.price}`,

        priceValue: firstVariant.price,

        size: firstVariant.size,

        stock: firstVariant.stock,
        quantity: 1,
      }),
    );
    const itemPrice = Number(
      firstVariant?.price ?? product?.priceValue ?? product?.priceNum ?? (typeof product?.price === "number" ? product.price : parseFloat(product?.price))
    );

    if (typeof window !== 'undefined' && window.fbq) {
      window.fbq('track', 'AddToCart', {
        value: itemPrice,
        currency: 'EGP'
      });
    }
  };


  return (
    <Link
      href={buildProductPath(product.id, product.title)}
      className="flex flex-col group cursor-pointer"
    >
      {/* Image Card */}
      <div className="relative w-full aspect-[4/5] rounded-2xl overflow-hidden mb-4 bg-surface-muted dark:bg-white/5">
        {/* Top Left Indicators: Badge, Offer & Popup Gallery */}
        <div className="absolute top-2 left-2 sm:top-3 sm:left-3 z-30 flex flex-col sm:flex-row gap-1.5 sm:gap-2 items-start flex-wrap">
          {/* {(product.badgeText || product.badge) && (
            <div className="px-2 py-0.5 rounded-md bg-amber-500 text-white text-[10px] font-bold tracking-wider shadow-sm flex items-center gap-1">
              ★ {product.badgeText || product.badge}
            </div>
          )}
          {product.inStock === false && (
            <div className="px-2 py-0.5 rounded-md bg-red-600 text-white text-[10px] font-bold tracking-wider shadow-sm">
              {t("ProductDetails.outOfStock") || "غير متاح"}
            </div>
          )} */}
          {product.hasOffer && (
            <div className="rounded-full bg-red-500 px-2.5 py-1.5 text-[10px] font-bold text-white shadow-md">
              {product.discountType === "percentage"
                ? `${product.discountValue}% ${locale === "ar" ? "خصم" : "OFF"}`
                : `${locale === "ar" ? "وفر" : "Save"} ${product.discountValue} ${locale === "ar" ? "ج.م" : "LE"}`}
            </div>
          )}
          {Array.isArray(product.popupGallery) && product.popupGallery.length > 0 && (
            <PopupGalleryTrigger
              popupGallery={product.popupGallery}
              onOpen={() => setIsGalleryOpen(true)}
            />
          )}
        </div>

        {/* Wishlist Button */}
        <button
          aria-label="Toggle Wishlist"
          onClick={handleToggleWishlist}
          className="absolute top-3 right-3 z-20 w-8 h-8 rounded-full flex items-center justify-center transition-transform duration-300 cursor-pointer shadow-sm bg-white/90 dark:bg-black/40 backdrop-blur-sm hover:scale-110 hover:bg-white dark:hover:bg-black/60"
        >
          <Heart
            className={`w-4 h-4 transition-colors duration-300 ${isWishlisted
              ? "fill-red-500 text-red-500"
              : "text-gray-400 dark:text-gray-300 hover:text-red-400 dark:hover:text-red-400"
              }`}
          />
        </button>

        {/* Product Photo */}
        <div className="absolute inset-0 transition-transform duration-700 ease-out group-hover:scale-105">
          <Image
            src={product.image}
            alt={product.title}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            priority={priority}
          />
        </div>



        {/* Hover Overlay with Add to Cart */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 z-10" />
        <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-full group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-400 ease-out z-20">
          <button
            type="button"
            onClick={handleAddToCart}
            disabled={product.inStock === false}
            className={`w-full py-2.5 rounded-xl text-xs font-bold tracking-wide flex items-center justify-center gap-2 shadow-soft transition-all duration-200 ${product.inStock === false
                ? "bg-slate-300 dark:bg-neutral-800 text-slate-500 cursor-not-allowed opacity-80"
                : "bg-white dark:bg-black text-black dark:text-white hover:bg-brand-mint hover:text-white cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
              }`}
          >
            <ShoppingCart className="w-3.5 h-3.5" />
            {product.inStock === false
              ? t("ProductDetails.outOfStock") || "غير متاح"
              : t("ProductDetails.addToCart")}
          </button>
        </div>
      </div>

      {/* Product Info */}
      <div className="flex flex-col gap-0.5 px-1 pb-2">
        {product.category && (
          <span className="text-[10px] font-bold tracking-[0.15em] text-gray-500 dark:text-gray-400 uppercase">
            {product.category}
          </span>
        )}
        <h3 className="font-serif text-sm md:text-base font-semibold text-text-primary leading-snug line-clamp-1 hover:text-brand-accent transition-colors duration-300">
          {product.title}
        </h3>
        <div className="flex items-center gap-2 mt-0.5">
          <span className="text-brand-accent font-bold text-sm">
            {product.price}
          </span>
          {product.oldPrice && (
            <span className="text-gray-500 dark:text-gray-400 text-xs sm:text-sm line-through">
              {product.oldPrice}
            </span>
          )}
        </div>
        {product.description && (
          <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-1 mt-1">
            {typeof product.description === "string"
              ? product.description.replace(/<[^>]*>?/gm, "").trim()
              : product.description}
          </p>
        )}
      </div>

      <PopupGalleryModal
        popupGallery={product.popupGallery}
        isOpen={isGalleryOpen}
        onClose={() => setIsGalleryOpen(false)}
      />
    </Link>
  );
}
