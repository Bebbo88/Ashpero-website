"use client";

import React, { useMemo } from "react";
import Image from "@/components/ui/AppImage";
import Link from "@/components/ui/AppLink";
import { useLanguage } from "@/hooks/useLanguage";
import { useProductsQuery } from "@/features/product/queries";
import { useOffersQuery } from "@/features/offer/queries";
import { mapAllProducts } from "@/features/product/mappers";
import { useAppSelector } from "@/store/hooks";
import { useCartDrawer } from "@/contexts/CartDrawerContext";
import { buildProductPath } from "@/utils/productUrl";

const MAX_SUGGESTIONS = 6;

// A trimmed-down version of the product card: the drawer has to leave most of
// its height to the cart itself, so this keeps the image, the offer badge, the
// title and the price and drops everything else.
function MiniProductCard({ product, onNavigate }) {
  return (
    <Link
      href={buildProductPath(product.id, product.title)}
      onClick={onNavigate}
      className="group flex w-24 shrink-0 flex-col gap-1.5"
    >
      <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-surface-muted dark:bg-white/5">
        <Image
          src={product.image}
          alt={product.title}
          fill
          sizes="96px"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {product.hasOffer && product.discountType === "percentage" && (
          <span className="absolute top-1 start-1 rounded-full bg-red-500 px-1.5 py-0.5 text-[9px] font-bold text-white shadow-sm">
            {product.discountValue}%
          </span>
        )}
      </div>

      <h4 className="line-clamp-1 font-serif text-[11px] font-semibold leading-tight text-text-primary">
        {product.title}
      </h4>

      <div className="flex flex-wrap items-baseline gap-x-1.5 gap-y-0.5">
        <span className="text-[11px] font-bold text-brand-accent">{product.price}</span>
        {product.hasOffer && product.oldPrice && (
          <span className="text-[9px] text-text-secondary line-through">{product.oldPrice}</span>
        )}
      </div>
    </Link>
  );
}

export default function CartRelatedProducts() {
  const { t, locale } = useLanguage();
  const { closeCart } = useCartDrawer();
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
      .slice(0, MAX_SUGGESTIONS);
  }, [rawProducts, rawOffers, locale, cartItems]);

  if (suggestions.length === 0) {
    return null;
  }

  // Rendered twice so the marquee loops back onto an identical frame; the
  // second pass is hidden from assistive tech and keyboard order.
  const track = [
    ...suggestions.map((product) => ({ product, isClone: false })),
    ...suggestions.map((product) => ({ product, isClone: true })),
  ];

  return (
    <div className="shrink-0 border-t border-border-color px-6 py-3">
      <h3 className="mb-2 font-montserrat text-[11px] font-bold uppercase tracking-wider text-text-secondary">
        {t("RelatedProducts.title")}
      </h3>

      <div className="overflow-hidden">
        <div className="cart-marquee flex w-max gap-3">
          {track.map(({ product, isClone }, index) => (
            <div key={`${product.id}-${index}`} aria-hidden={isClone || undefined}>
              <MiniProductCard product={product} onNavigate={closeCart} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
