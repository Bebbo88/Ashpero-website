"use client";

import React from "react";
import Image from "@/components/ui/AppImage";
import Link from "next/link";
import { Heart, ShoppingCart } from "lucide-react";
import { buildProductPath } from "@/utils/productUrl";
import { useLanguage } from "@/hooks/useLanguage";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { addToCart } from "@/store/slices/cartSlice";
import { toggleWishlistItem } from "@/store/slices/wishlistSlice";

export default function ProductCard({ product }) {
  const { t } = useLanguage();
  const dispatch = useAppDispatch();
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
  };

  const handleAddToCart = (event) => {
    event.preventDefault();
    event.stopPropagation();

    dispatch(
      addToCart({
        id: product.id,
        title: product.title,
        image: product.image,
        category: product.category,
        price: product.price,
        priceValue: product.priceNum,
        quantity: 1,
      }),
    );
  };

  return (
    <Link
      href={buildProductPath(product.id, product.title)}
      className="flex flex-col group cursor-pointer"
    >
      {/* Image Card */}
      <div className="relative w-full aspect-[4/5] rounded-2xl overflow-hidden mb-4 bg-surface-muted dark:bg-white/5">
        {/* Badge */}
        {product.badge && (
          <div className="absolute top-3 left-3 z-30 px-2 py-0.5 bg-white text-[10px] font-bold uppercase tracking-wider text-black shadow-sm">
            {product.badge}
          </div>
        )}

        {/* Wishlist Button */}
        <button
          onClick={handleToggleWishlist}
          className="absolute top-3 right-3 z-20 w-8 h-8 rounded-full flex items-center justify-center transition-transform duration-300 cursor-pointer shadow-sm bg-white/90 dark:bg-black/40 backdrop-blur-sm hover:scale-110 hover:bg-white dark:hover:bg-black/60"
        >
          <Heart
            className={`w-4 h-4 transition-colors duration-300 ${
              isWishlisted 
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
          />
        </div>

        {/* Hover Overlay with Add to Cart */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 z-10" />
        <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-full group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-400 ease-out z-20">
          <button
            onClick={handleAddToCart}
            className="w-full py-2.5 rounded-xl bg-white dark:bg-black text-black dark:text-white text-xs font-bold tracking-wide flex items-center justify-center gap-2 shadow-soft hover:bg-brand-accent hover:text-black transition-colors duration-200 cursor-pointer"
          >
            <ShoppingCart className="w-3.5 h-3.5" />
            {t("ProductDetails.addToCart")}
          </button>
        </div>
      </div>

      {/* Product Info */}
      <div className="flex flex-col gap-0.5 px-1 pb-2">
        {product.category && (
        <span className="text-[10px] font-bold tracking-[0.15em] text-gray-400 dark:text-gray-500 uppercase">
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
            <span className="text-gray-400 dark:text-gray-500 text-xs sm:text-sm line-through">
              {product.oldPrice}
            </span>
          )}
        </div>
        {product.description && (
          <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-1 mt-1">
            {product.description}
          </p>
        )}
      </div>
    </Link>
  );
}

