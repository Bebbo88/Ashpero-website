"use client";

import React from "react";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import { Heart, ShoppingCart, ChevronLeft, ChevronRight } from "lucide-react";
import EmptyState from "@/components/ui/EmptyState";
import { buildProductPath } from "@/utils/productUrl";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import styles from "@/animations/FeaturedBestsellers.animations.module.css";
import Image from "@/components/ui/AppImage";

export function FeaturedBestsellersUI({
  t,
  isArabic,
  products,
  wishlist,
  toggleWishlist,
  addToCart,
  isLoading,
  isError,
  errorMessage,
}) {
  return (
    <section
      className={`${styles.root} w-full py-20 md:py-28 bg-bg-primary overflow-hidden`}
    >
      <div className="container mx-auto px-6 lg:px-10">
        <div className="flex flex-col items-center justify-center mb-14 text-center">
          <h2 className="font-playfair text-3xl md:text-4xl lg:text-5xl text-text-primary font-medium tracking-wide">
            {t("Bestsellers.title")}
          </h2>
          <div className="w-16 h-[3px] bg-brand-orange rounded-full mt-5" />
        </div>

        <div className="relative group/carousel">
          {isError ? (
            <div className="rounded-2xl border border-red-200 bg-red-50/80 p-8 text-center">
              <p className="text-sm font-semibold text-red-700">
                Failed to load best sellers.
              </p>
              <p className="mt-2 text-xs text-red-600">
                {errorMessage ||
                  "Check API URL, backend status, and CORS origins."}
              </p>
            </div>
          ) : null}

          {!isLoading && !isError && products.length === 0 ? (
            <div className="py-10">
              <EmptyState />
            </div>
          ) : null}

          <Swiper
            modules={[Navigation, Pagination]}
            spaceBetween={24}
            slidesPerView={1}
            grabCursor
            navigation={{ nextEl: ".bs-next", prevEl: ".bs-prev" }}
            pagination={{ clickable: true, el: ".bs-pagination" }}
            dir={isArabic ? "rtl" : "ltr"}
            breakpoints={{
              480: { slidesPerView: 2, spaceBetween: 20 },
              768: { slidesPerView: 3, spaceBetween: 24 },
              1280: { slidesPerView: 4, spaceBetween: 28 },
            }}
            className={`w-full bestsellers-swiper ${products.length === 0 || isError ? "hidden" : ""}`}
          >
            {products.map((product, index) => {
              const isWishlisted = wishlist.includes(product.id);
              return (
                <SwiperSlide key={`${product.id}-${index}`}>
                  <div className="flex flex-col group cursor-pointer">
                    <Link
                      href={buildProductPath(product.id, product.title)}
                      className="relative w-full aspect-[4/5] rounded-2xl overflow-hidden mb-5 bg-surface-muted dark:bg-white/5"
                    >
                      <button
                        onClick={(event) => {
                          event.preventDefault();
                          event.stopPropagation();
                          toggleWishlist(product);
                        }}
                        className={`absolute top-4 right-4 z-20 w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 cursor-pointer shadow-sm ${isWishlisted ? "bg-red-500 text-white scale-110" : "bg-white/80 dark:bg-black/40 backdrop-blur-sm text-gray-600 dark:text-gray-300 hover:bg-white dark:hover:bg-black/60 hover:scale-110"}`}
                      >
                        <Heart
                          className={`w-4 h-4 transition-all duration-300 ${isWishlisted ? "fill-white" : ""}`}
                        />
                      </button>

                      <div className="absolute inset-0 transition-transform duration-700 ease-out group-hover:scale-105">
                        <Image
                          src={product.image}
                          alt={product.title}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 25vw"
                        />
                      </div>

                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 z-10" />
                      <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-400 ease-out z-20">
                        <button
                          onClick={(event) => {
                            event.preventDefault();
                            event.stopPropagation();
                            addToCart(product);
                          }}
                          className="w-full py-3 rounded-xl bg-white dark:bg-black text-black dark:text-white text-sm font-bold tracking-wide flex items-center justify-center gap-2 shadow-soft hover:bg-brand-orange hover:text-white transition-colors duration-200 cursor-pointer"
                        >
                          <ShoppingCart className="w-4 h-4" />
                          {t("Bestsellers.addToCart")}
                        </button>
                      </div>
                    </Link>

                    <div className="flex flex-col gap-1 px-1">
                      <span className="text-[11px] font-bold tracking-[0.15em] text-gray-400 dark:text-gray-500 uppercase">
                        {product.category}
                      </span>
                      <Link href={buildProductPath(product.id, product.title)}>
                        <h3 className="font-playfair text-lg md:text-xl font-semibold text-text-primary leading-snug line-clamp-1 group-hover:text-brand-orange transition-colors duration-300">
                          {product.title}
                        </h3>
                      </Link>
                      <span className="text-brand-orange font-bold text-base mt-1">
                        {product.price}
                      </span>
                    </div>
                  </div>
                </SwiperSlide>
              );
            })}
          </Swiper>

          <button className="bs-prev absolute top-[35%] -translate-y-1/2 left-0 md:-left-6 z-30 w-11 h-11 md:w-12 md:h-12 rounded-full bg-white dark:bg-gray-900 shadow-soft-sm flex items-center justify-center text-gray-700 dark:text-gray-200 opacity-0 group-hover/carousel:opacity-100 transition-all duration-300 hover:bg-brand-orange hover:text-white hover:scale-110 hover:shadow-orange cursor-pointer border border-gray-200 dark:border-gray-700">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button className="bs-next absolute top-[35%] -translate-y-1/2 right-0 md:-right-6 z-30 w-11 h-11 md:w-12 md:h-12 rounded-full bg-white dark:bg-gray-900 shadow-soft-sm flex items-center justify-center text-gray-700 dark:text-gray-200 opacity-0 group-hover/carousel:opacity-100 transition-all duration-300 hover:bg-brand-orange hover:text-white hover:scale-110 hover:shadow-orange cursor-pointer border border-gray-200 dark:border-gray-700">
            <ChevronRight className="w-5 h-5" />
          </button>

          <div className="bs-pagination flex items-center justify-center gap-2 mt-10" />
        </div>
        {isLoading ? (
          <p className="mt-5 text-center text-xs text-text-secondary">
            Syncing best sellers...
          </p>
        ) : null}
      </div>
    </section>
  );
}
