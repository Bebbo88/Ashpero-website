"use client";

import React, { useMemo } from "react";
import { useLanguage } from "@/hooks/useLanguage";
import { useProductsQuery } from "@/features/product/queries";
import { useOffersQuery } from "@/features/offer/queries";
import { mapAllProducts } from "@/features/product/mappers";
import ProductCard from "./ProductCard";
import ProductCardSkeleton from "./ProductCardSkeleton";
import { Sparkles } from "lucide-react";
import { resolveCategoryLabel } from "@/utils/categoryLabel";

export default function RelatedProducts({ currentProduct }) {
  const { t, locale } = useLanguage();
  const isArabic = locale === "ar";

  const { data: rawProducts, isLoading: isProductsLoading } = useProductsQuery({ limit: 12 });
  const { data: rawOffers } = useOffersQuery();

  const relatedProducts = useMemo(() => {
    if (!Array.isArray(rawProducts) || rawProducts.length === 0) {
      return [];
    }

    const mapped = mapAllProducts(rawProducts, locale, rawOffers || []);
    const currentId = String(currentProduct?.id || "");
    const currentCat = String(currentProduct?.categoryRaw || currentProduct?.category || "").trim().toLowerCase();

    // 1. Filter out current product
    const otherProducts = mapped.filter((p) => String(p.id) !== currentId);

    // 2. Separate matching category vs other categories
    const sameCategory = otherProducts.filter((p) => {
      const pCat = String(p.categoryRaw || p.category || "").trim().toLowerCase();
      return Boolean(currentCat && pCat && (pCat === currentCat || currentCat.includes(pCat) || pCat.includes(currentCat)));
    });

    const differentCategory = otherProducts.filter((p) => !sameCategory.some((item) => String(item.id) === String(p.id)));

    // 3. Prioritize same category, fill up with different category as fallback to reach 4 items
    const combined = [...sameCategory, ...differentCategory].slice(0, 4);
    const finalList = combined.length > 0 ? combined : mapped.slice(0, 4);

    return finalList.map((product) => ({
      ...product,
      category: resolveCategoryLabel(product.categoryRaw, t),
    }));
  }, [rawProducts, rawOffers, locale, currentProduct, isArabic, t]);

  if (!isProductsLoading && relatedProducts.length === 0) {
    return null;
  }

  return (
    <section className="w-full mt-16 md:mt-24 pt-12 border-t border-border-color/60">
      <div className="flex flex-col mb-8 md:mb-10">
        <div className="flex items-center gap-2 mb-2">
          <span className="p-1.5 rounded-lg bg-brand-mint/10 text-brand-mint">
            <Sparkles className="w-4 h-4" />
          </span>
          <span className="text-xs font-bold uppercase tracking-widest text-brand-mint">
            {isArabic ? "موصى بها لك" : "Recommended"}
          </span>
        </div>
        <h2 className="font-playfair text-2xl md:text-3xl lg:text-4xl font-bold text-text-primary">
          {t("RelatedProducts.title")}
        </h2>
        <p className="text-text-secondary text-xs md:text-sm mt-1.5 max-w-xl">
          {t("RelatedProducts.subtitle")}
        </p>
      </div>

      {isProductsLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {[1, 2, 3, 4].map((n) => (
            <ProductCardSkeleton key={n} />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {relatedProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </section>
  );
}
