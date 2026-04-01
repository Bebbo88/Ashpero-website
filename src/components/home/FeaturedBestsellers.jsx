"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import { Heart, ShoppingCart, ChevronLeft, ChevronRight } from "lucide-react";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import { useLanguage } from "../../hooks/useLanguage";

const products = [
  {
    id: 1,
    image: "/assets/photo1.jpeg",
    categoryKey: "antiAging",
    titleKey: "retinol",
    price: "$84.00",
  },
  {
    id: 2,
    image: "/assets/photo2.jpeg",
    categoryKey: "hydration",
    titleKey: "hyaluronic",
    price: "$62.00",
  },
  {
    id: 3,
    image: "/assets/photo3.jpeg",
    categoryKey: "glow",
    titleKey: "goldOil",
    price: "$120.00",
  },
  {
    id: 4,
    image: "/assets/photo4.jpeg",
    categoryKey: "cleansing",
    titleKey: "cleanser",
    price: "$45.00",
  },
  {
    id: 5,
    image: "/assets/photo1.jpeg",
    categoryKey: "antiAging",
    titleKey: "retinol",
    price: "$84.00",
  },
  {
    id: 6,
    image: "/assets/photo3.jpeg",
    categoryKey: "glow",
    titleKey: "goldOil",
    price: "$120.00",
  },
];

export default function FeaturedBestsellers() {
  const { t, locale } = useLanguage();
  const [wishlist, setWishlist] = useState([]);

  const toggleWishlist = (id) => {
    setWishlist((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    );
  };

  return (
    <section className="w-full py-20 md:py-28 bg-bg-primary overflow-hidden">
      <div className="container mx-auto px-6 lg:px-10">
        {/* Section Header */}
        <div className="flex flex-col items-center justify-center mb-14 text-center">
          <h2 className="font-playfair text-3xl md:text-4xl lg:text-5xl text-text-primary font-medium tracking-wide">
            {t("Bestsellers.title")}
          </h2>
          <div className="w-16 h-[3px] bg-brand-orange rounded-full mt-5"></div>
        </div>

        {/* Swiper Carousel */}
        <div className="relative group/carousel">
          <Swiper
            modules={[Navigation, Pagination]}
            spaceBetween={24}
            slidesPerView={1}
            grabCursor={true}
            navigation={{
              nextEl: ".bs-next",
              prevEl: ".bs-prev",
            }}
            pagination={{ clickable: true, el: ".bs-pagination" }}
            dir={locale === "ar" ? "rtl" : "ltr"}
            breakpoints={{
              480: { slidesPerView: 2, spaceBetween: 20 },
              768: { slidesPerView: 3, spaceBetween: 24 },
              1280: { slidesPerView: 4, spaceBetween: 28 },
            }}
            className="w-full bestsellers-swiper"
          >
            {products.map((product, index) => (
              <SwiperSlide key={`${product.id}-${index}`}>
                <div className="flex flex-col group cursor-pointer">
                  {/* Image Card */}
                  <Link
                    href={`/product/${product.id}`}
                    className="relative w-full aspect-[4/5] rounded-2xl overflow-hidden mb-5 bg-[#f4f4f5] dark:bg-white/5"
                  >
                    {/* Wishlist Button */}
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        toggleWishlist(product.id);
                      }}
                      className={`absolute top-4 right-4 z-20 w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 cursor-pointer shadow-sm
                        ${
                          wishlist.includes(product.id)
                            ? "bg-red-500 text-white scale-110"
                            : "bg-white/80 dark:bg-black/40 backdrop-blur-sm text-gray-600 dark:text-gray-300 hover:bg-white dark:hover:bg-black/60 hover:scale-110"
                        }`}
                    >
                      <Heart
                        className={`w-4 h-4 transition-all duration-300 ${
                          wishlist.includes(product.id) ? "fill-white" : ""
                        }`}
                      />
                    </button>

                    {/* Product Photo - Full Bleed Cover */}
                    <div className="absolute inset-0 transition-transform duration-700 ease-out group-hover:scale-105">
                      <Image
                        src={product.image}
                        alt={t(`Bestsellers.products.${product.titleKey}`)}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 25vw"
                      />
                    </div>

                    {/* Hover Overlay with Add to Cart */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 z-10" />
                    <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-400 ease-out z-20">
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          // Add to cart logic
                        }}
                        className="w-full py-3 rounded-xl bg-white dark:bg-black text-black dark:text-white text-sm font-bold tracking-wide flex items-center justify-center gap-2 shadow-[0_8px_30px_rgba(0,0,0,0.12)] hover:bg-brand-orange hover:text-white transition-colors duration-200 cursor-pointer"
                      >
                        <ShoppingCart className="w-4 h-4" />
                        {t("Bestsellers.addToCart")}
                      </button>
                    </div>
                  </Link>

                  {/* Product Info */}
                  <div className="flex flex-col gap-1 px-1">
                    <span className="text-[11px] font-bold tracking-[0.15em] text-gray-400 dark:text-gray-500 uppercase">
                      {t(`Bestsellers.categories.${product.categoryKey}`)}
                    </span>
                    <Link href={`/product/${product.id}`}>
                      <h3 className="font-playfair text-lg md:text-xl font-semibold text-text-primary leading-snug line-clamp-1 group-hover:text-brand-orange transition-colors duration-300">
                        {t(`Bestsellers.products.${product.titleKey}`)}
                      </h3>
                    </Link>
                    <span className="text-brand-orange font-bold text-base mt-1">
                      {product.price}
                    </span>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Custom Navigation Arrows */}
          <button className="bs-prev absolute top-[35%] -translate-y-1/2 left-0 md:-left-6 z-30 w-11 h-11 md:w-12 md:h-12 rounded-full bg-white dark:bg-gray-900 shadow-[0_2px_12px_rgba(0,0,0,0.15)] flex items-center justify-center text-gray-700 dark:text-gray-200 opacity-0 group-hover/carousel:opacity-100 transition-all duration-300 hover:bg-brand-orange hover:text-white hover:scale-110 hover:shadow-[0_6px_25px_rgba(249,115,22,0.35)] cursor-pointer border border-gray-200 dark:border-gray-700">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button className="bs-next absolute top-[35%] -translate-y-1/2 right-0 md:-right-6 z-30 w-11 h-11 md:w-12 md:h-12 rounded-full bg-white dark:bg-gray-900 shadow-[0_2px_12px_rgba(0,0,0,0.15)] flex items-center justify-center text-gray-700 dark:text-gray-200 opacity-0 group-hover/carousel:opacity-100 transition-all duration-300 hover:bg-brand-orange hover:text-white hover:scale-110 hover:shadow-[0_6px_25px_rgba(249,115,22,0.35)] cursor-pointer border border-gray-200 dark:border-gray-700">
            <ChevronRight className="w-5 h-5" />
          </button>

          {/* Custom Pagination */}
          <div className="bs-pagination flex items-center justify-center gap-2 mt-10"></div>
        </div>
      </div>

      {/* Custom Styles */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
          .bs-pagination .swiper-pagination-bullet {
            width: 8px;
            height: 8px;
            border-radius: 50%;
            background: var(--color-text-primary);
            opacity: 0.15;
            transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
            cursor: pointer;
          }
          .bs-pagination .swiper-pagination-bullet-active {
            opacity: 1;
            background: var(--color-brand-orange);
            width: 28px;
            border-radius: 6px;
          }
        `,
        }}
      />
    </section>
  );
}
