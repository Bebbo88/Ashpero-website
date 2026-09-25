"use client";

import React, { useEffect, useMemo, useRef } from "react";
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
const AUTO_SCROLL_PX_PER_SECOND = 22;

// A trimmed-down product card: the drawer has to leave its height to the cart
// itself, so this keeps the thumbnail, the offer badge, the title and the price.
function MiniProductCard({ product, onNavigate }) {
  return (
    <Link
      href={buildProductPath(product.id, product.title)}
      onClick={onNavigate}
      draggable={false}
      className="group flex w-24 shrink-0 select-none flex-col gap-1.5"
    >
      <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-surface-muted dark:bg-white/5">
        <Image
          src={product.image}
          alt={product.title}
          fill
          draggable={false}
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
  const scrollerRef = useRef(null);
  const isPausedRef = useRef(false);

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

  const isRtl = locale === "ar";
  const count = suggestions.length;
  // Duplicating the list is what lets the drift loop seamlessly, but with a
  // short catalogue the copy is plainly visible as the same product twice, so
  // only loop once there are enough products for the repeat to stay offscreen.
  const shouldLoop = count >= 4;

  // A real scroll container rather than a CSS marquee, so the wheel, a drag or
  // a trackpad can move through the products; the drift just nudges scrollLeft
  // and steps aside whenever the customer is interacting.
  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller || count === 0) {
      return undefined;
    }

    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

    // The wheel is vertical on most mice, so map whichever axis moved onto the
    // horizontal scroll instead of letting the page swallow it.
    const handleWheel = (event) => {
      const delta =
        Math.abs(event.deltaY) > Math.abs(event.deltaX) ? event.deltaY : event.deltaX;
      if (!delta) {
        return;
      }
      event.preventDefault();
      scroller.scrollLeft += delta;
    };

    scroller.addEventListener("wheel", handleWheel, { passive: false });

    // Pointer drag, the way a carousel behaves: grab the strip and it follows
    // the cursor. A drag that actually moved swallows the click afterwards so
    // releasing over a card doesn't navigate to it.
    let isDragging = false;
    let dragStartX = 0;
    let dragStartScroll = 0;
    let dragDistance = 0;

    const handlePointerDown = (event) => {
      if (event.button !== 0 && event.pointerType === "mouse") {
        return;
      }
      isDragging = true;
      dragDistance = 0;
      dragStartX = event.clientX;
      dragStartScroll = scroller.scrollLeft;
      isPausedRef.current = true;
      scroller.setPointerCapture?.(event.pointerId);
    };

    const handlePointerMove = (event) => {
      if (!isDragging) {
        return;
      }
      const travelled = event.clientX - dragStartX;
      dragDistance = Math.max(dragDistance, Math.abs(travelled));
      scroller.scrollLeft = dragStartScroll - travelled;
    };

    const endDrag = (event) => {
      if (!isDragging) {
        return;
      }
      isDragging = false;
      isPausedRef.current = false;
      scroller.releasePointerCapture?.(event.pointerId);
    };

    const handleClickCapture = (event) => {
      if (dragDistance > 5) {
        event.preventDefault();
        event.stopPropagation();
        dragDistance = 0;
      }
    };

    const preventNativeDrag = (event) => event.preventDefault();

    scroller.addEventListener("dragstart", preventNativeDrag);
    scroller.addEventListener("pointerdown", handlePointerDown);
    scroller.addEventListener("pointermove", handlePointerMove);
    scroller.addEventListener("pointerup", endDrag);
    scroller.addEventListener("pointercancel", endDrag);
    scroller.addEventListener("click", handleClickCapture, true);

    let frame = null;
    if (!prefersReducedMotion && shouldLoop) {
      const direction = isRtl ? -1 : 1;
      let previous = performance.now();

      const tick = (now) => {
        const elapsed = now - previous;
        previous = now;

        if (!isPausedRef.current) {
          scroller.scrollLeft +=
            (direction * AUTO_SCROLL_PX_PER_SECOND * elapsed) / 1000;

          // The list is rendered twice, so wrapping by exactly half the track
          // lands on an identical frame and the loop never visibly jumps.
          const half = scroller.scrollWidth / 2;
          if (half > 0 && Math.abs(scroller.scrollLeft) >= half) {
            scroller.scrollLeft -= direction * half;
          }
        }

        frame = requestAnimationFrame(tick);
      };

      frame = requestAnimationFrame(tick);
    }

    return () => {
      scroller.removeEventListener("wheel", handleWheel);
      scroller.removeEventListener("dragstart", preventNativeDrag);
      scroller.removeEventListener("pointerdown", handlePointerDown);
      scroller.removeEventListener("pointermove", handlePointerMove);
      scroller.removeEventListener("pointerup", endDrag);
      scroller.removeEventListener("pointercancel", endDrag);
      scroller.removeEventListener("click", handleClickCapture, true);
      if (frame !== null) {
        cancelAnimationFrame(frame);
      }
    };
  }, [count, isRtl, shouldLoop]);

  if (count === 0) {
    return null;
  }

  const pause = () => {
    isPausedRef.current = true;
  };
  const resume = () => {
    isPausedRef.current = false;
  };

  const track = shouldLoop
    ? [
        ...suggestions.map((product) => ({ product, isClone: false })),
        ...suggestions.map((product) => ({ product, isClone: true })),
      ]
    : suggestions.map((product) => ({ product, isClone: false }));

  return (
    // Only the genuinely tiny viewports (a 568px-tall phone) leave the cart
    // rows too little room to render without clipping; there the cart wins and
    // the strip steps aside. A normal phone keeps it.
    <div className="shrink-0 border-t border-border-color px-5 py-2.5 [@media(max-height:600px)]:hidden">
      <h3 className="mb-2 font-montserrat text-[11px] font-bold uppercase tracking-wider text-text-secondary">
        {t("RelatedProducts.title")}
      </h3>

      <div
        ref={scrollerRef}
        onMouseEnter={pause}
        onMouseLeave={resume}
        onFocusCapture={pause}
        onBlurCapture={resume}
        onTouchStart={pause}
        onTouchEnd={resume}
        className="no-scrollbar cursor-grab overflow-x-auto overscroll-x-contain active:cursor-grabbing"
      >
        <div className="flex w-max gap-3">
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
