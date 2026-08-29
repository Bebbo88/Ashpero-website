import React, { useRef, useState, useEffect } from "react";
import Image from "@/components/ui/AppImage";
import { useLanguage } from "@/hooks/useLanguage";
import {
  Minus,
  Plus,
  Heart,
  ShoppingCart,
  Sparkles,
  Zap,
} from "lucide-react";

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
  isProductAvailable,
  setSelectedSize,
  resolvedVariant,
  shareToast,
  handleAddToCart,
  handleBuyNow,
  handleToggleWishlist,
  decrementQty,
  incrementQty,
}) {
  const { locale } = useLanguage();
  const [isStickyVisible, setIsStickyVisible] = useState(false);
  const mainButtonRef = useRef(null);

  const badgeText =
    (locale === "ar"
      ? product?.badgeText_ar || product?.badgeText
      : product?.badgeText_en || product?.badgeText || product?.badgeText_ar) ||
    "";

  useEffect(() => {
    const target = mainButtonRef.current;
    if (!target || typeof window === "undefined" || !("IntersectionObserver" in window)) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsStickyVisible(!entry.isIntersecting);
      },
      {
        root: null,
        threshold: 0.1,
      }
    );

    observer.observe(target);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="flex flex-col gap-6">
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

        {/* Localized Stock Status */}
        {(() => {
          const isAvailable =
            product?.inStock !== false &&
            (resolvedVariant
              ? Number(resolvedVariant.stock) > 0 || resolvedVariant.stock === undefined
              : true);

          return isAvailable ? (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold border border-emerald-500/20 shadow-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              {t("ProductDetails.inStock") || "متاح في المخزن"}
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-500/10 text-red-600 dark:text-red-400 text-xs font-bold border border-red-500/20 shadow-xs">
              <span className="w-2 h-2 rounded-full bg-red-500" />
              {t("ProductDetails.outOfStock") || "غير متاح"}
            </span>
          );
        })()}
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

      {variants.length > 0 ? (
        <div className="flex flex-col gap-3 mt-1">
          <span className="text-xs font-bold tracking-wider uppercase text-text-secondary">
            {t("ProductDetails.selectSize")}
          </span>
          <div className="flex flex-wrap gap-2">
            {variants.map((variant) => (
              <button
                key={variant.size}
                type="button"
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

      <div className="flex flex-col gap-2 mt-1">
        <span className="text-xs font-bold tracking-wider uppercase text-text-secondary">
          {t("ProductDetails.selectQuantity")}
        </span>

        <div ref={mainButtonRef} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="flex items-center border border-border-color w-full sm:w-[150px] rounded-xl overflow-hidden justify-between">
            <button
              type="button"
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
              type="button"
              onClick={incrementQty}
              aria-label="Increase quantity"
              className="px-3 py-3 hover:bg-gray-100 dark:hover:bg-white/5 transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4 text-text-primary" />
            </button>
          </div>

          <button
            type="button"
            onClick={handleAddToCart}
            disabled={isProductAvailable === false}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-3.5 rounded-xl text-white font-bold text-xs sm:text-sm tracking-wide shadow-md transition-all ${
              isProductAvailable === false
                ? "bg-slate-400 opacity-60 cursor-not-allowed"
                : "bg-brand-mint dark:bg-brand-dark hover:opacity-90 cursor-pointer"
            }`}
          >
            <ShoppingCart className="w-4 h-4" />
            <span>
              {isProductAvailable === false
                ? t("ProductDetails.outOfStock") || "غير متاح"
                : t("ProductDetails.addToCart")}
            </span>
          </button>

          {/* Direct Buy Now Button with 5s Heavy Shake Animation */}
          {isProductAvailable !== false ? (
            <button
              type="button"
              onClick={handleBuyNow}
              className="heavy-shake-btn flex-1 flex items-center justify-center gap-2 px-4 py-3.5 rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 text-white font-black text-xs sm:text-sm tracking-wider uppercase shadow-lg shadow-orange-500/25 hover:scale-105 active:scale-95 cursor-pointer group relative overflow-hidden"
            >
              <Zap className="w-4 h-4 text-yellow-200 fill-yellow-200 animate-bounce" />
              <span>{t("ProductDetails.buyNow")}</span>
            </button>
          ) : null}

          <button
            type="button"
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
      </div>

      {/* Exclusive Perks & Free Gift Showcase */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
        {/* Dynamic Custom Product Badge Card */}
        {badgeText ? (
          <div className="group relative overflow-hidden rounded-2xl border border-teal-500/30 bg-gradient-to-br from-teal-500/10 via-emerald-500/5 to-transparent p-3.5 transition-all duration-300 hover:border-teal-500 hover:shadow-lg hover:shadow-teal-500/10">
            <div className="flex items-center gap-3">
              <div className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-teal-500/30 bg-white dark:bg-neutral-900 p-1 shadow-inner transition-transform duration-300 group-hover:scale-110 overflow-hidden">
                <Image
                  src="/assets/medic.jpeg"
                  alt="Egyptian Drug Authority Certified"
                  width={44}
                  height={44}
                  className="h-full w-full object-contain filter drop-shadow-sm rounded-lg"
                />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="inline-block rounded-full bg-teal-500/20 px-2 py-0.5 text-[9px] font-extrabold tracking-wider text-teal-700 dark:text-teal-300 uppercase">
                    {t("ProductDetails.officialBadge") || "ASHPEROO OFFICIAL"}
                  </span>
                </div>
                <span className="mt-0.5 text-xs font-extrabold text-text-primary leading-tight">
                  {badgeText}
                </span>
              </div>
            </div>
          </div>
        ) : null}

        {/* Free Gua Sha Gift Card */}
        <div className={`group relative overflow-hidden rounded-2xl border border-brand-orange/40 bg-gradient-to-br from-brand-orange/10 via-amber-500/5 to-transparent p-3.5 transition-all duration-300 hover:border-brand-orange hover:shadow-lg hover:shadow-brand-orange/10 ${
          !badgeText ? "sm:col-span-2" : ""
        }`}>
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

      {/* Mobile-Only Sticky Bottom Add to Cart Bar */}
      <div
        className={`fixed bottom-0 left-0 right-0 z-40 md:hidden bg-bg-primary/95 backdrop-blur-md border-t border-border-color shadow-2xl px-4 pt-3 pb-[calc(env(safe-area-inset-bottom)+0.75rem)] transition-all duration-300 ease-in-out transform ${
          isStickyVisible
            ? "translate-y-0 opacity-100 pointer-events-auto"
            : "translate-y-full opacity-0 pointer-events-none"
        }`}
      >
        <div className="flex items-center justify-between gap-3">
          {/* Price & Quantity Controls */}
          <div className="flex items-center gap-2.5">
            <div className="flex items-center border border-border-color rounded-lg overflow-hidden bg-bg-secondary">
              <button
                type="button"
                onClick={decrementQty}
                aria-label="Decrease quantity"
                className="px-2 py-1.5 hover:bg-gray-100 dark:hover:bg-white/5 transition-colors cursor-pointer"
              >
                <Minus className="w-3 h-3 text-text-primary" />
              </button>
              <span className="px-2 text-xs font-bold text-text-primary min-w-[24px] text-center">
                {quantity}
              </span>
              <button
                type="button"
                onClick={incrementQty}
                aria-label="Increase quantity"
                className="px-2 py-1.5 hover:bg-gray-100 dark:hover:bg-white/5 transition-colors cursor-pointer"
              >
                <Plus className="w-3 h-3 text-text-primary" />
              </button>
            </div>

            <div className="flex flex-col">
              <span className="text-[9px] text-text-secondary uppercase font-semibold">
                {t("ProductDetails.total")}
              </span>
              <span className="text-xs font-bold text-brand-orange">
                {displayPrice}
              </span>
            </div>
          </div>

          {/* Add to Cart CTA Button */}
          <button
            type="button"
            onClick={handleAddToCart}
            disabled={isProductAvailable === false}
            className={`flex-1 flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl font-bold text-xs tracking-wider shadow-md transition-all ${
              isProductAvailable === false
                ? "bg-slate-400 opacity-60 cursor-not-allowed text-white"
                : "bg-brand-mint text-white active:scale-95 cursor-pointer"
            }`}
          >
            <ShoppingCart className="w-3.5 h-3.5" />
            <span>
              {isProductAvailable === false
                ? t("ProductDetails.outOfStock") || "غير متاح"
                : t("ProductDetails.addToCart")}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}

