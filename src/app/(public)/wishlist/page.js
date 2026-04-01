"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Heart, ArrowRight } from "lucide-react";
import ProductCard from "@/components/product/ProductCard";
import { useLanguage } from "@/hooks/useLanguage";

export default function Wishlist() {
  const { t } = useLanguage();
  // Map wishlist items to the structure expected by ProductCard
  const [wishlistItems, setWishlistItems] = useState([
    {
      id: 1,
      title: "Luminous Serum",
      category: "RADIANT VITALITY",
      price: "$112.00",
      image: "/assets/photo1.jpeg",
      isWishlisted: true,
    },
    {
      id: 2,
      title: "Botanical Elixir",
      category: "DEEP HYDRATION",
      price: "$145.00",
      image: "/assets/photo2.jpeg",
      isWishlisted: true,
    }
  ]);

  return (
    <div className="min-h-screen bg-bg-primary pt-12 pb-24 px-6 md:px-10 lg:px-20 transition-colors duration-300">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Section */}
        <div className="mb-12">
          <div className="flex items-center gap-2 mb-4">
            <Heart className="w-5 h-5 text-brand-mint fill-brand-mint" />
            <span className="text-brand-mint text-xs md:text-sm font-bold tracking-widest uppercase">
              {t("Wishlist.personalSelection")}
            </span>
          </div>
          
          <h1 className="font-playfair text-4xl md:text-5xl lg:text-6xl text-text-primary font-bold mb-4">
            {t("Wishlist.title")}
          </h1>
          
          <p className="font-montserrat text-text-secondary max-w-lg text-sm md:text-base leading-relaxed">
            {t("Wishlist.description")}
          </p>
        </div>

        {/* Grid Section - Using smaller cards based on All Products page component */}
        {/* Increased columns to make the cards noticeably smaller */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 mt-8 gap-x-4 gap-y-10">
          
          {/* Reusable Product Cards */}
          {wishlistItems.map((item) => (
            <ProductCard key={item.id} product={item} />
          ))}

        </div>

        {/* Bottom Action Button */}
        <div className="mt-20 flex justify-center">
          <Link 
            href="/all-products"
            className="px-8 py-4 border border-brand-mint text-brand-mint font-montserrat font-bold text-xs tracking-[0.2em] uppercase hover:bg-brand-mint hover:text-white transition-all duration-300 rounded-full shadow-sm text-center"
          >
            {t("Wishlist.discoverMoreEssentials")}
          </Link>
        </div>

      </div>
    </div>
  );
}
