"use client";

import React, { useMemo } from "react";
import Link from "@/components/ui/AppLink";
import { Heart, ArrowRight } from "lucide-react";
import ProductCard from "@/components/product/ProductCard";
import ProductCardSkeleton from "@/components/product/ProductCardSkeleton";
import EmptyState from "@/components/ui/EmptyState";
import { useLanguage } from "@/hooks/useLanguage";
import { useAppSelector } from "@/store/hooks";
import { useProductsQuery } from "@/features/product/queries";
import { useOffersQuery } from "@/features/offer/queries";
import { mapAllProducts } from "@/features/product/mappers";

export default function Wishlist() {
  const { t, locale } = useLanguage();
  const wishlistItems = useAppSelector((state) => state.wishlist.items || []);

  // The wishlist only ever stores a lightweight snapshot (title/image/price
  // for quick rendering) — it never captured variants/stock, so ProductCard
  // can't add-to-cart from that alone. Fetching real product data (same
  // source and mapper every other product grid uses) is what makes "Add to
  // Cart" actually work here instead of silently no-op'ing.
  const productsQuery = useProductsQuery({});
  const offersQuery = useOffersQuery();

  const wishlistedProducts = useMemo(() => {
    if (!Array.isArray(productsQuery.data) || wishlistItems.length === 0) {
      return [];
    }

    const wishlistIds = new Set(wishlistItems.map((item) => String(item.productId)));
    const mapped = mapAllProducts(productsQuery.data, locale, offersQuery.data || []);
    const byId = new Map(mapped.map((product) => [String(product.id), product]));

    return wishlistItems
      .map((item) => byId.get(String(item.productId)))
      .filter(Boolean);
  }, [productsQuery.data, offersQuery.data, wishlistItems, locale]);

  const isLoading = wishlistItems.length > 0 && productsQuery.isLoading;

  return (
    <div className="min-h-screen bg-bg-primary pt-12 md:pt-16 pb-24 px-6 md:px-10 lg:px-20 transition-colors duration-300">
      <div className="max-w-7xl mx-auto">
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

        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 mt-8 gap-x-4 gap-y-10">
            {wishlistItems.map((item) => (
              <ProductCardSkeleton key={item.productId} />
            ))}
          </div>
        ) : wishlistedProducts.length > 0 ? (
          <>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 mt-8 gap-x-4 gap-y-10">
              {wishlistedProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            <div className="mt-20 flex justify-center">
              <Link
                href="/all-products"
                className="px-8 py-4 border border-brand-mint text-brand-mint font-montserrat font-bold text-xs tracking-[0.2em] uppercase hover:bg-brand-mint hover:text-white transition-all duration-300 rounded-full shadow-sm text-center"
              >
                {t("Wishlist.discoverMoreEssentials")}
              </Link>
            </div>
          </>
        ) : (
          <EmptyState
            icon={Heart}
            title={t("Wishlist.emptyTitle")}
            description={t("Wishlist.emptyDesc")}
            actionButton={
              <Link
                href="/all-products"
                className="inline-flex items-center gap-2 px-8 py-3.5 bg-brand-mint text-white font-montserrat font-bold text-xs tracking-[0.2em] uppercase hover:bg-brand-orange transition-all duration-300 rounded-full shadow-sm"
              >
                {t("Wishlist.browseCatalog")}
                <ArrowRight className="w-4 h-4" />
              </Link>
            }
          />
        )}
      </div>
    </div>
  );
}
