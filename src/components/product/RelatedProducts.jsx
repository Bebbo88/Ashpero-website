"use client";

import React, { useMemo } from "react";
import { useLanguage } from "@/hooks/useLanguage";
import { useProductsQuery } from "@/features/product/queries";
import { useOffersQuery } from "@/features/offer/queries";
import { mapAllProducts } from "@/features/product/mappers";
import ProductCard from "./ProductCard";
import ProductCardSkeleton from "./ProductCardSkeleton";
import { Sparkles } from "lucide-react";

export default function RelatedProducts({ currentProduct }) {
  const { t, locale } = useLanguage();
  const isArabic = locale === "ar";

  const { data: rawProducts, isLoading: isProductsLoading } = useProductsQuery({ limit: 12 });
  const { data: rawOffers } = useOffersQuery();

  const relatedProducts = useMemo(() => {
    if (!Array.isArray(rawProducts) || rawProducts.length === 0) {
      // Fallback Mock Products when store has 0 products
      return [
        {
          id: "fallback-rel-1",
          title: isArabic ? "سيروم النضارة الفائق" : "Radiance Booster Serum",
          category: isArabic ? "العناية بالبشرة" : "Skincare",
          image: "/assets/photo1.jpeg",
          images: ["/assets/photo1.jpeg"],
          price: isArabic ? "450 ج.م" : "450 EGP",
          priceNum: 450,
          priceValue: 450,
          oldPrice: isArabic ? "550 ج.م" : "550 EGP",
          oldPriceValue: 550,
          hasOffer: true,
          discountType: "fixed",
          discountValue: 100,
          variants: [{ size: "50ml", price: 450, stock: 10 }],
        },
        {
          id: "fallback-rel-2",
          title: isArabic ? "كريم الترطيب المكثف 24 ساعة" : "24h Intense Moisture Cream",
          category: isArabic ? "ترطيب" : "Hydration",
          image: "/assets/photo2.jpeg",
          images: ["/assets/photo2.jpeg"],
          price: isArabic ? "380 ج.م" : "380 EGP",
          priceNum: 380,
          priceValue: 380,
          hasOffer: false,
          variants: [{ size: "50ml", price: 380, stock: 15 }],
        },
        {
          id: "fallback-rel-3",
          title: isArabic ? "زيت الإشراقة الذهبية" : "Golden Glow Elixir Oil",
          category: isArabic ? "تغذية" : "Nourishing",
          image: "/assets/photo3.jpeg",
          images: ["/assets/photo3.jpeg"],
          price: isArabic ? "520 ج.م" : "520 EGP",
          priceNum: 520,
          priceValue: 520,
          oldPrice: isArabic ? "600 ج.م" : "600 EGP",
          oldPriceValue: 600,
          hasOffer: true,
          discountType: "percentage",
          discountValue: 15,
          variants: [{ size: "30ml", price: 520, stock: 8 }],
        },
        {
          id: "fallback-rel-4",
          title: isArabic ? "غسول الرغوة المنقي" : "Purifying Gentle Cleanser",
          category: isArabic ? "تنظيف" : "Cleansing",
          image: "/assets/photo4.jpeg",
          images: ["/assets/photo4.jpeg"],
          price: isArabic ? "290 ج.م" : "290 EGP",
          priceNum: 290,
          priceValue: 290,
          hasOffer: false,
          variants: [{ size: "150ml", price: 290, stock: 20 }],
        },
      ];
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

    return combined.length > 0 ? combined : mapped.slice(0, 4);
  }, [rawProducts, rawOffers, locale, currentProduct, isArabic]);

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
