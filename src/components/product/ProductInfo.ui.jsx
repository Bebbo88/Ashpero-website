"use client";

import React from "react";
import Link from "next/link";
import Image from "@/components/ui/AppImage";
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
  Sparkles,
  Zap,
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
  variants,
  quantity,
  selectedSize,
  displayPrice,
  oldPrice,
  hasOffer,
  discountValue,
  isWishlisted,
  openAccordion,
  accordions,
  setSelectedSize,
  resolvedVariant,
  shareLinks,
  shareToast,
  handleShareClick,
  handleAddToCart,
  handleBuyNow,
  handleToggleWishlist,
  decrementQty,
  incrementQty,
  toggleAccordion,
}) {
  const isArabic = t("ProductDetails.home") === "الرئيسية";
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

      <span className="text-[11px] font-bold tracking-[0.2em] uppercase text-brand-mint">
        {product.category}
      </span>

      <h1 className="font-serif text-3xl md:text-4xl font-semibold text-text-primary leading-tight -mt-3">
        {product.title}
      </h1>

      <div className="flex flex-wrap items-center gap-3 -mt-2">
        <span className="text-2xl font-bold text-brand-orange">
          {displayPrice}
        </span>

        {hasOffer && oldPrice ? (
          <>
            <span className="text-lg text-text-secondary line-through">
              {oldPrice}
            </span>

            <span className="rounded-full bg-red-100 px-2 py-1 text-[11px] font-bold text-red-600">
              {discountValue}
              {product.discountType === "percentage" ? "% OFF" : " EGP OFF"}
            </span>
          </>
        ) : null}

        <p className="text-sm text-text-secondary">
          Stock: {resolvedVariant?.stock || 0}
        </p>
      </div>

      {typeof product?.description === "string" && (product.description.includes("<") || product.description.includes("&")) ? (
        <div
          className="text-sm text-text-secondary leading-relaxed [&_b]:font-bold [&_strong]:font-bold"
          dangerouslySetInnerHTML={{ __html: product.description }}
        />
      ) : (
        <p className="text-sm text-text-secondary leading-relaxed whitespace-pre-line">
          {product?.description}
        </p>
      )}

      <div className="flex items-center gap-3 mt-2">
        {BENEFITS.map((benefit, idx) => (
          <div
            key={benefit}
            className={`w-12 h-12 rounded-full flex items-center justify-center text-[8px] font-bold tracking-tighter text-white shadow-sm ${idx === 0
              ? "bg-benefit-1"
              : idx === 1
                ? "bg-benefit-2"
                : idx === 2
                  ? "bg-benefit-3"
                  : "bg-benefit-4"
              }`}
          >
            {benefit}
          </div>
        ))}
      </div>

      {variants.length > 0 ? (
        <div className="flex flex-col gap-3 mt-2">
          <span className="text-xs font-bold tracking-wider uppercase text-text-secondary">
            {t("ProductDetails.selectSize")}
          </span>
          <div className="flex flex-wrap gap-2">
            {variants.map((variant) => (
              <button
                key={variant.size}
                onClick={() => setSelectedSize(variant.size)}
                className={`px-4 py-2 rounded-lg border text-xs font-semibold transition-all cursor-pointer ${selectedSize === variant.size
                  ? "border-brand-orange bg-brand-orange text-white"
                  : "border-border-color text-text-primary hover:border-brand-orange hover:text-brand-orange"
                  }`}
              >
                {variant.size}
              </button>
            ))}
          </div>
        </div>
      ) : null}

      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mt-2">
        <div className="flex items-center border border-border-color w-full sm:w-[150px] rounded-xl overflow-hidden justify-between">
          <button
            onClick={decrementQty}
            aria-label="Decrease quantity"
            className="px-3 py-3 hover:bg-gray-100 dark:hover:bg-white/5 transition-colors cursor-pointer"
          >
            <Minus className="w-4 h-4 text-text-primary" />
          </button>
          <span className="px-4 py-3 text-sm font-bold text-text-primary border-x border-border-color min-w-[50px] text-center">
            {quantity}
          </span>
          <button
            onClick={incrementQty}
            aria-label="Increase quantity"
            className="px-3 py-3 hover:bg-gray-100 dark:hover:bg-white/5 transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4 text-text-primary" />
          </button>
        </div>

        <button
          onClick={handleAddToCart}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-3.5 rounded-xl bg-brand-mint dark:bg-brand-dark text-white font-bold text-xs sm:text-sm tracking-wide hover:opacity-90 transition-opacity cursor-pointer shadow-md"
        >
          <ShoppingCart className="w-4 h-4" />
          {t("ProductDetails.addToCart")}
        </button>

        {/* Direct Buy Now Button with 5s Heavy Shake Animation */}
        <button
          type="button"
          onClick={handleBuyNow}
          className="heavy-shake-btn flex-1 flex items-center justify-center gap-2 px-4 py-3.5 rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 text-white font-black text-xs sm:text-sm tracking-wider uppercase shadow-lg shadow-orange-500/25 hover:scale-105 active:scale-95 cursor-pointer group relative overflow-hidden"
        >
          <Zap className="w-4 h-4 text-yellow-200 fill-yellow-200 animate-bounce" />
          <span>{isArabic ? "شراء مباشر " : "Buy Now "}</span>
        </button>

        <button
          onClick={handleToggleWishlist}
          aria-label="Toggle Wishlist"
          className={`w-12 h-12 shrink-0 rounded-xl border flex items-center justify-center transition-all duration-300 cursor-pointer ${isWishlisted
            ? "bg-red-500 border-red-500 text-white"
            : "border-border-color text-text-secondary hover:border-red-400 hover:text-red-400"
            }`}
        >
          <Heart className={`w-5 h-5 ${isWishlisted ? "fill-white" : ""}`} />
        </button>
      </div>

      {/* Exclusive Perks & Free Gift Showcase */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
        {/* Free Shipping Perk Card */}
        <div className="group relative overflow-hidden rounded-2xl border border-brand-mint/30 bg-gradient-to-br from-brand-mint/10 via-emerald-500/5 to-transparent p-3.5 transition-all duration-300 hover:border-brand-mint hover:shadow-lg hover:shadow-brand-mint/10">
          <div className="flex items-center gap-3">
            <div className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-brand-mint/30 bg-white/80 dark:bg-black/30 text-brand-mint shadow-inner transition-transform duration-300 group-hover:scale-105">
              <Truck className="h-6 w-6 stroke-[2.2]" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="inline-block rounded-full bg-brand-mint/20 px-2 py-0.5 text-[9px] font-extrabold tracking-wider text-brand-mint uppercase">
                  {t("ProductDetails.freeShippingSub") || "ON ALL ORDERS"}
                </span>
              </div>
              <span className="mt-0.5 text-xs font-extrabold text-text-primary">
                {t("ProductDetails.freeShipping")}
              </span>
            </div>
          </div>
        </div>

        {/* Free Gua Sha Gift Card */}
        <div className="group relative overflow-hidden rounded-2xl border border-brand-orange/40 bg-gradient-to-br from-brand-orange/10 via-amber-500/5 to-transparent p-3.5 transition-all duration-300 hover:border-brand-orange hover:shadow-lg hover:shadow-brand-orange/10">
          {/* Shimmering Gift Badge */}
          <div className="absolute top-2 right-2 rtl:right-auto rtl:left-2 z-10 flex items-center gap-1 rounded-full bg-gradient-to-r from-brand-orange to-amber-500 px-2 py-0.5 text-[9px] font-black text-white shadow-md tracking-wider uppercase">
            <Sparkles className="h-2.5 w-2.5" />
            {t("ProductDetails.freeGiftBadge")}
          </div>

          <div className="flex items-center gap-3">
            <div className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-brand-orange/30 bg-white dark:bg-neutral-900 p-1 shadow-inner transition-transform duration-300 group-hover:scale-110">
              <Image
                src="/assets/guasha.jpg"
                alt="Free Gift Gua Sha"
                width={40}
                height={40}
                className="h-full w-full object-contain filter drop-shadow-sm"
              />
            </div>
            <div className="flex flex-col pr-10 rtl:pr-0 rtl:pl-10 sm:pr-0 sm:rtl:pl-0">
              <span className="text-[9px] font-extrabold tracking-wider text-brand-orange uppercase">
                {t("ProductDetails.freeGuaShaSub") || "FACIAL TOOL WITH ORDER"}
              </span>
              <span className="mt-0.5 text-xs font-extrabold text-text-primary leading-tight">
                {t("ProductDetails.freeGuaSha")}
              </span>
            </div>
          </div>
        </div>
      </div>

      {shareToast?.visible ? (
        <div className="fixed bottom-5 left-1/2 z-[60] -translate-x-1/2 rounded-full border border-border-color bg-white/90 px-4 py-2 text-xs font-semibold text-text-primary shadow-lg backdrop-blur-md">
          {shareToast.message}
        </div>
      ) : null}
    </div>
  );
}
