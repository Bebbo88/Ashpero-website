"use client";

import React, { useEffect, useMemo, useState } from "react";
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
import { useLanguage } from "../../hooks/useLanguage";

const FacebookIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
  </svg>
);

const InstagramIcon = (props) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
  </svg>
);

const XIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path fill="currentColor" d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z" />
  </svg>
);

const TikTokIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M12.53.02C13.84 0 15.14.01 16.44 0c.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.06-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.03 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.28-2.26.74-4.63 2.58-5.91 1.02-.73 2.26-1.09 3.48-1.14.01 1.38-.02 2.76 0 4.13-.19.05-.37.1-.55.16-1.13.34-2.1 1.19-2.45 2.3-.43.99-.21 2.19.49 3.03.71.97 1.88 1.47 3.07 1.4 1.16-.01 2.22-.64 2.82-1.61.35-.55.51-1.2.51-1.84.02-4.14-.01-8.28.01-12.42z" />
  </svg>
);

export default function ProductInfo({ product }) {
  const { t } = useLanguage();
  const sizeOptions = useMemo(
    () =>
      Array.isArray(product.sizes)
        ? product.sizes.map((size) => String(size).trim()).filter(Boolean)
        : [],
    [product.sizes],
  );
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState(sizeOptions[0] || "");
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [openAccordion, setOpenAccordion] = useState("ingredients");

  useEffect(() => {
    setSelectedSize(sizeOptions[0] || "");
  }, [sizeOptions]);

  const decrementQty = () => setQuantity((q) => Math.max(1, q - 1));
  const incrementQty = () => setQuantity((q) => Math.min(10, q + 1));

  const toggleAccordion = (key) =>
    setOpenAccordion((prev) => (prev === key ? null : key));

  const accordions = [
    {
      key: "ingredients",
      title: t("ProductDetails.ingredients"),
      content: product.ingredients,
    },
    {
      key: "howToUse",
      title: t("ProductDetails.howToUse"),
      content: product.howToUse,
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-text-secondary">
        <a href="/" className="hover:text-brand-orange transition-colors">
          {t("ProductDetails.home")}
        </a>
        <span>/</span>
        <a
          href="/all-products"
          className="hover:text-brand-orange transition-colors"
        >
          {t("ProductDetails.allProducts")}
        </a>
        <span>/</span>
        <span className="text-text-primary font-medium">{product.title}</span>
      </nav>

      {/* Category */}
      <span className="text-[11px] font-bold tracking-[0.2em] uppercase text-brand-mint">
        {product.category}
      </span>

      {/* Title */}
      <h1 className="font-serif text-3xl md:text-4xl font-semibold text-text-primary leading-tight -mt-3">
        {product.title}
      </h1>

      {/* Price */}
      <div className="flex items-center gap-4 -mt-2">
        <span className="text-2xl font-bold text-brand-orange">
          {product.price}
        </span>
        {product.originalPrice && (
          <span className="text-lg text-text-secondary line-through">
            {product.originalPrice}
          </span>
        )}
      </div>

      {/* Description */}
      <p className="text-sm text-text-secondary leading-relaxed">
        {product.description}
      </p>

      {/* Benefit Badges */}
      <div className="flex items-center gap-3 mt-2">
        {["VEGAN", "CLEAN", "PURE", "ETHIC"].map((benefit, idx) => (
          <div
            key={benefit}
            className={`w-12 h-12 rounded-full flex items-center justify-center text-[8px] font-bold tracking-tighter text-white shadow-sm
              ${idx === 0 ? "bg-[#1F3325]" : idx === 1 ? "bg-[#5EBC86]" : idx === 2 ? "bg-[#69b578]" : "bg-[#7EE8B0]"}`}
          >
            {benefit}
          </div>
        ))}
      </div>

      {/* Size Selection */}
      {sizeOptions.length > 0 ? (
        <div className="flex flex-col gap-3 mt-2">
          <span className="text-xs font-bold tracking-wider uppercase text-text-secondary">
            Select Size
          </span>
          <div className="flex flex-wrap gap-2">
            {sizeOptions.map((size) => (
              <button
                key={size}
                onClick={() => setSelectedSize(size)}
                className={`px-4 py-2 rounded-lg border text-xs font-semibold transition-all cursor-pointer
                  ${
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

      {/* Quantity + Add to Cart */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 mt-2">
        {/* Quantity Selector */}
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

        {/* Add to Cart Button */}
        <button className="flex-1 flex items-center justify-center gap-3 px-8 py-3.5 rounded-xl bg-brand-dark dark:bg-brand-mint text-white font-bold text-sm tracking-wide hover:opacity-90 transition-opacity cursor-pointer shadow-lg shadow-brand-dark/20 dark:shadow-brand-mint/20">
          <ShoppingCart className="w-4 h-4" />
          {t("ProductDetails.addToCart")}
        </button>

        {/* Wishlist Button */}
        <button
          onClick={() => setIsWishlisted(!isWishlisted)}
          className={`w-12 h-12 shrink-0 rounded-xl border flex items-center justify-center transition-all duration-300 cursor-pointer ${
            isWishlisted
              ? "bg-red-500 border-red-500 text-white"
              : "border-border-color text-text-secondary hover:border-red-400 hover:text-red-400"
          }`}
        >
          <Heart className={`w-5 h-5 ${isWishlisted ? "fill-white" : ""}`} />
        </button>
      </div>

      {/* Perks */}
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

      {/* Accordions */}
      <div className="flex flex-col divide-y divide-border-color border-t border-border-color mt-2">
        {accordions.map((acc) => (
          <div key={acc.key}>
            <button
              onClick={() => toggleAccordion(acc.key)}
              className="w-full flex items-center justify-between py-4 cursor-pointer group"
            >
              <span className="text-sm font-bold text-text-primary group-hover:text-brand-orange transition-colors">
                {acc.title}
              </span>
              {openAccordion === acc.key ? (
                <ChevronUp className="w-4 h-4 text-text-secondary" />
              ) : (
                <ChevronDown className="w-4 h-4 text-text-secondary" />
              )}
            </button>
            {openAccordion === acc.key && (
              <div className="pb-4 -mt-1">
                <p className="text-sm text-text-secondary leading-relaxed">
                  {acc.content}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Share */}
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
