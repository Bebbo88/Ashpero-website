"use client";

import React from "react";
import Link from "next/link";
import {
  Minus,
  Plus,
  Heart,
  ShoppingCart,
  ChevronDown,
  ChevronUp,
  Share2,
  Truck,
  ShieldCheck,
} from "lucide-react";
import {
  FacebookIcon,
  InstagramIcon,
  XIcon,
  TikTokIcon,
} from "@/svgs/ProductInfo.svgs";

const BENEFITS = ["VEGAN", "CLEAN", "PURE", "ETHIC"];

export function ProductInfoUI({
  product,
  t,
  sizeOptions,
  quantity,
  selectedSize,
  isWishlisted,
  openAccordion,
  accordions,
  setSelectedSize,
  setIsWishlisted,
  decrementQty,
  incrementQty,
  toggleAccordion,
}) {
  return (
    <div className="flex flex-col gap-6">
      <nav className="flex items-center gap-2 text-xs text-text-secondary">
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

      <span className="text-[11px] font-bold tracking-[0.2em] uppercase text-brand-mint">{product.category}</span>

      <h1 className="font-serif text-3xl md:text-4xl font-semibold text-text-primary leading-tight -mt-3">
        {product.title}
      </h1>

      <div className="flex items-center gap-4 -mt-2">
        <span className="text-2xl font-bold text-brand-orange">{product.price}</span>
        {product.originalPrice ? (
          <span className="text-lg text-text-secondary line-through">{product.originalPrice}</span>
        ) : null}
      </div>

      <p className="text-sm text-text-secondary leading-relaxed">{product.description}</p>

      <div className="flex items-center gap-3 mt-2">
        {BENEFITS.map((benefit, idx) => (
          <div
            key={benefit}
            className={`w-12 h-12 rounded-full flex items-center justify-center text-[8px] font-bold tracking-tighter text-white shadow-sm ${
              idx === 0
                ? "bg-[#1F3325]"
                : idx === 1
                  ? "bg-[#5EBC86]"
                  : idx === 2
                    ? "bg-[#69b578]"
                    : "bg-[#7EE8B0]"
            }`}
          >
            {benefit}
          </div>
        ))}
      </div>

      {sizeOptions.length > 0 ? (
        <div className="flex flex-col gap-3 mt-2">
          <span className="text-xs font-bold tracking-wider uppercase text-text-secondary">Select Size</span>
          <div className="flex flex-wrap gap-2">
            {sizeOptions.map((size) => (
              <button
                key={size}
                onClick={() => setSelectedSize(size)}
                className={`px-4 py-2 rounded-lg border text-xs font-semibold transition-all cursor-pointer ${
                  selectedSize === size
                    ? "border-brand-orange bg-brand-orange text-white"
                    : "border-border-color text-text-primary hover:border-brand-orange hover:text-brand-orange"
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>
      ) : null}

      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 mt-2">
        <div className="flex items-center border border-border-color rounded-xl overflow-hidden">
          <button
            onClick={decrementQty}
            className="px-4 py-3 hover:bg-gray-100 dark:hover:bg-white/5 transition-colors cursor-pointer"
          >
            <Minus className="w-4 h-4 text-text-primary" />
          </button>
          <span className="px-6 py-3 text-sm font-bold text-text-primary border-x border-border-color min-w-[60px] text-center">
            {quantity}
          </span>
          <button
            onClick={incrementQty}
            className="px-4 py-3 hover:bg-gray-100 dark:hover:bg-white/5 transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4 text-text-primary" />
          </button>
        </div>

        <button className="flex-1 flex items-center justify-center gap-3 px-8 py-3.5 rounded-xl bg-brand-dark dark:bg-brand-mint text-white font-bold text-sm tracking-wide hover:opacity-90 transition-opacity cursor-pointer shadow-lg shadow-brand-dark/20 dark:shadow-brand-mint/20">
          <ShoppingCart className="w-4 h-4" />
          {t("ProductDetails.addToCart")}
        </button>

        <button
          onClick={() => setIsWishlisted((prev) => !prev)}
          className={`w-12 h-12 shrink-0 rounded-xl border flex items-center justify-center transition-all duration-300 cursor-pointer ${
            isWishlisted
              ? "bg-red-500 border-red-500 text-white"
              : "border-border-color text-text-secondary hover:border-red-400 hover:text-red-400"
          }`}
        >
          <Heart className={`w-5 h-5 ${isWishlisted ? "fill-white" : ""}`} />
        </button>
      </div>

      <div className="grid grid-cols-2 gap-3 mt-2">
        <div className="flex flex-col items-center gap-2 p-3 rounded-xl bg-brand-creme/50 dark:bg-white/5">
          <Truck className="w-5 h-5 text-brand-mint" />
          <span className="text-[10px] font-bold tracking-wider uppercase text-text-secondary text-center">
            {t("ProductDetails.freeShipping")}
          </span>
        </div>
        <div className="flex flex-col items-center gap-2 p-3 rounded-xl bg-brand-creme/50 dark:bg-white/5">
          <ShieldCheck className="w-5 h-5 text-brand-mint" />
          <span className="text-[10px] font-bold tracking-wider uppercase text-text-secondary text-center">
            {t("ProductDetails.authentic")}
          </span>
        </div>
      </div>

      <div className="flex flex-col divide-y divide-border-color border-t border-border-color mt-2">
        {accordions.map((accordionItem) => (
          <div key={accordionItem.key}>
            <button
              onClick={() => toggleAccordion(accordionItem.key)}
              className="w-full flex items-center justify-between py-4 cursor-pointer group"
            >
              <span className="text-sm font-bold text-text-primary group-hover:text-brand-orange transition-colors">
                {accordionItem.title}
              </span>
              {openAccordion === accordionItem.key ? (
                <ChevronUp className="w-4 h-4 text-text-secondary" />
              ) : (
                <ChevronDown className="w-4 h-4 text-text-secondary" />
              )}
            </button>
            {openAccordion === accordionItem.key ? (
              <div className="pb-4 -mt-1">
                <p className="text-sm text-text-secondary leading-relaxed">{accordionItem.content}</p>
              </div>
            ) : null}
          </div>
        ))}
      </div>

      <div className="flex items-center gap-4 mt-1">
        <Share2 className="w-4 h-4 text-text-secondary" />
        <span className="text-xs font-bold tracking-wider uppercase text-text-secondary">
          {t("ProductDetails.share")}
        </span>
        <div className="flex items-center gap-3">
          <a
            href="#"
            className="group w-8 h-8 rounded-full border border-border-color flex items-center justify-center text-text-secondary hover:border-[#1877F2] transition-colors"
          >
            <FacebookIcon className="w-4 h-4 transition-colors group-hover:text-[#1877F2]" />
          </a>
          <a
            href="#"
            className="group w-8 h-8 rounded-full border border-border-color flex items-center justify-center text-text-secondary hover:border-[#1DA1F2] transition-colors"
          >
            <XIcon className="w-4 h-4 transition-colors group-hover:text-[#1DA1F2]" />
          </a>
          <a
            href="#"
            className="group w-8 h-8 rounded-full border border-border-color flex items-center justify-center text-text-secondary hover:border-[#E4405F] transition-colors"
          >
            <InstagramIcon className="w-4 h-4 transition-colors group-hover:text-[#E4405F]" />
          </a>
          <a
            href="#"
            className="group w-8 h-8 rounded-full border border-border-color flex items-center justify-center text-text-secondary hover:border-brand-mint transition-colors"
          >
            <TikTokIcon className="w-4 h-4 transition-colors group-hover:text-brand-mint" />
          </a>
        </div>
      </div>
    </div>
  );
}
