"use client";

import React, { useMemo } from "react";
import { useLanguage } from "@/hooks/useLanguage";
import { useProductsQuery } from "@/features/product/queries";
import { useOffersQuery } from "@/features/offer/queries";
import { mapAllProducts } from "@/features/product/mappers";
import { useAppSelector } from "@/store/hooks";
import { resolveCategoryLabel } from "@/utils/categoryLabel";
import ProductCard from "@/components/product/ProductCard";

const MAX_SUGGESTIONS = 6;

export default function CartRelatedProducts() {
  const { t, locale } = useLanguage();
  const cartItems = useAppSelector((state) => state.cart.items || []);

  const { data: rawProducts } = useProductsQuery({ limit: 12 });
  const { data: rawOffers } = useOffersQuery();

  const suggestions = useMemo(() => {
    if (!Array.isArray(rawProducts) || rawProducts.length === 0) {
      return [];
    }

    const inCart = new Set(cartItems.map((item) => String(item.productId)));

    return mapAllProducts(rawProducts, locale, rawOffers || [])
      .filter((product) => !inCart.has(String(product.id)))
      .slice(0, MAX_SUGGESTIONS)
      .map((product) => ({
        ...product,
        category: resolveCategoryLabel(product.categoryRaw, t),
      }));
  }, [rawProducts, rawOffers, locale, cartItems, t]);

  if (suggestions.length === 0) {
    return null;
  }

  // The list is rendered twice so the marquee can loop back to an identical
  // frame; the copy is hidden from screen readers and keyboard order.
  const track = [
    ...suggestions.map((product) => ({ product, isClone: false })),
    ...suggestions.map((product) => ({ product, isClone: true })),
  ];

  return (
    <div className="border-t border-border-color px-6 py-5">
      <h3 className="font-playfair text-base text-text-primary mb-3">
        {t("RelatedProducts.title")}
      </h3>

      <div className="overflow-hidden">
        <div className="cart-marquee flex w-max gap-4">
          {track.map(({ product, isClone }, index) => (
            <div
              key={`${product.id}-${index}`}
              className="w-28 shrink-0"
              aria-hidden={isClone || undefined}
              inert={isClone ? "" : undefined}
            >
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
