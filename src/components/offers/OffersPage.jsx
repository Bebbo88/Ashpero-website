"use client";

import React, { useMemo } from "react";
import Image from "next/image";
import ProductCard from "@/components/product/ProductCard";
import { useLanguage } from "@/hooks/useLanguage";

export default function OffersPage() {
  const { t } = useLanguage();
  // Mock data for the products on sale
  const products = useMemo(() => [
    {
      id: "sale-1",
      title: t("Offers.products.prod1.title"),
      price: "$60.00",
      oldPrice: "$75.00",
      description: t("Offers.products.prod1.desc"),
      badge: t("Offers.products.prod1.badge"),
      image: "/assets/photo1.jpeg",
      isWishlisted: false,
    },
    {
      id: "sale-2",
      title: t("Offers.products.prod2.title"),
      price: "$52.50",
      oldPrice: "$75.00",
      description: t("Offers.products.prod2.desc"),
      badge: t("Offers.products.prod2.badge"),
      image: "/assets/photo2.jpeg",
      isWishlisted: false,
    },
    {
      id: "sale-3",
      title: t("Offers.products.prod3.title"),
      price: "$45.00",
      oldPrice: "$55.00",
      description: t("Offers.products.prod3.desc"),
      badge: t("Offers.products.prod3.badge"),
      image: "/assets/photo3.jpeg",
      isWishlisted: false,
    },
    {
      id: "sale-4",
      title: t("Offers.products.prod4.title"),
      price: "$89.00",
      oldPrice: "$110.00",
      description: t("Offers.products.prod4.desc"),
      badge: t("Offers.products.prod4.badge"),
      image: "/assets/photo4.jpeg",
      isWishlisted: false,
    },
  ], [t]);

  return (
    <div className="container mx-auto px-4 md:px-6 lg:px-8 py-8 md:py-12 max-w-7xl">
      {/* Banner Section */}
      <section className="relative w-full overflow-hidden flex items-center min-h-[320px] md:min-h-[400px]">
        {/* Background Image & Gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#7B6E59] to-[#25221B]" />
        <div className="absolute inset-0 z-0 mix-blend-overlay opacity-60">
          <Image
            src="/assets/background.jpg"
            alt="Sale Banner Background"
            fill
            className="object-cover object-right"
            priority
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-[#7B6E59] via-[#7B6E59]/80 to-transparent z-0" />

        {/* Banner Content */}
        <div className="relative z-10 px-6 md:px-12 max-w-2xl w-full">
          <p className="text-[#8EF1BC] uppercase tracking-[0.15em] text-[10px] md:text-xs font-bold mb-3">
            {t("Offers.exclusive")}
          </p>
          <h1 className="text-3xl md:text-5xl lg:text-[54px] font-serif text-white mb-4 leading-[1.1]">
            {t("Offers.titleLine1")}
            <br />
            {t("Offers.titleLine2")}
          </h1>
          <p className="text-sm md:text-base text-gray-200 mb-8 max-w-md font-light leading-relaxed">
            {t("Offers.description")}
          </p>
          <button className="bg-[#8EF1BC] text-brand-dark px-6 py-3.5 text-xs font-bold tracking-wider hover:bg-white transition-colors duration-300">
            {t("Offers.shopBtn")}
          </button>
        </div>
      </section>

      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mt-16 mb-8 border-b border-gray-100 dark:border-gray-800 pb-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-serif text-text-primary mb-1">
            {t("Offers.sectionTitle")}
          </h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm font-light">
            {t("Offers.sectionDesc")}
          </p>
        </div>
        <button className="text-[#8EF1BC] font-medium text-sm flex items-center gap-1 mt-4 md:mt-0 hover:text-brand-orange transition-colors duration-200 uppercase tracking-wider">
          {t("Offers.filterBtn")}
        </button>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-10 md:gap-x-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {/* Footer / Load More Action */}
      <div className="flex flex-col items-center justify-center mt-20 mb-12 gap-5">
        <button className="border cursor-pointer border-[#8EF1BC] text-[#8EF1BC] bg-transparent px-10 py-3.5 text-xs font-bold tracking-widest hover:bg-[#8EF1BC] hover:text-brand-dark transition-all duration-300">
          {t("Offers.viewAll")}
        </button>
        <p className="text-gray-400 dark:text-gray-500 text-xs tracking-wide">
          {t("Offers.showingText")}
        </p>
      </div>
    </div>
  );
}
