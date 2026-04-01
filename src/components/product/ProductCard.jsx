"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart, ShoppingCart } from "lucide-react";

export default function ProductCard({ product }) {
  const [isWishlisted, setIsWishlisted] = useState(product.isWishlisted || false);

  return (
    <Link
      href={`/product/${product.id}`}
      className="flex flex-col group cursor-pointer"
    >
      {/* Image Card */}
      <div className="relative w-full aspect-[4/5] rounded-2xl overflow-hidden mb-4 bg-[#f4f4f5] dark:bg-white/5">
        {/* Wishlist Button */}
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setIsWishlisted(!isWishlisted);
          }}
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
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
            className="w-full py-2.5 rounded-xl bg-white dark:bg-black text-black dark:text-white text-xs font-bold tracking-wide flex items-center justify-center gap-2 shadow-[0_8px_30px_rgba(0,0,0,0.12)] hover:bg-brand-orange hover:text-white transition-colors duration-200 cursor-pointer"
          >
            <ShoppingCart className="w-3.5 h-3.5" />
            Add to Cart
          </button>
        </div>
      </div>

      {/* Product Info */}
      <div className="flex flex-col gap-0.5 px-1">
        <span className="text-[10px] font-bold tracking-[0.15em] text-gray-400 dark:text-gray-500 uppercase">
          {product.category}
        </span>
        <h3 className="font-serif text-sm md:text-base font-semibold text-text-primary leading-snug line-clamp-1 group-hover:text-brand-orange transition-colors duration-300">
          {product.title}
        </h3>
        <span className="text-brand-orange font-bold text-sm mt-0.5">
          {product.price}
        </span>
      </div>
    </Link>
  );
}
