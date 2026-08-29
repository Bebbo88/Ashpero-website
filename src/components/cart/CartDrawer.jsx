"use client";

import React from "react";
import Image from "@/components/ui/AppImage";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { X, Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { useCartDrawer } from "@/contexts/CartDrawerContext";
import { useLanguage } from "@/hooks/useLanguage";
import EmptyState from "@/components/ui/EmptyState";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  removeFromCart,
  updateCartItemQuantity,
} from "@/store/slices/cartSlice";

export default function CartDrawer() {
  const { isCartOpen, closeCart } = useCartDrawer();
  const { t, locale } = useLanguage();
  const isRtl = locale === "ar";
  const dispatch = useAppDispatch();
  const cartItems = useAppSelector((state) => state.cart.items || []);

  const handleIncrement = (item) => {
    if (item.stock && item.quantity >= item.stock) {
      return;
    }
    dispatch(
      updateCartItemQuantity({
        productId: item.productId,
        size: item.size || "",
        quantity: Number(item.quantity || 1) + 1,
      }),
    );
    if (typeof window !== "undefined" && window.fbq) {
      window.fbq("track", "AddToCart", {
        value: Number(item.priceValue || 0),
        currency: "EGP",
      });
    }
  };

  const handleDecrement = (item) => {
    const currentQuantity = Number(item.quantity || 1);
    if (currentQuantity <= 1) {
      return;
    }

    dispatch(
      updateCartItemQuantity({
        productId: item.productId,
        size: item.size || "",
        quantity: currentQuantity - 1,
      }),
    );
    if (typeof window !== "undefined" && window.fbq) {
      window.fbq("trackCustom", "RemoveFromCart", {
        value: Number(item.priceValue || 0),
        currency: "EGP",
      });
    }
  };

  const handleRemove = (item) => {
    dispatch(
      removeFromCart({ productId: item.productId, size: item.size || "" }),
    );
    if (typeof window !== "undefined" && window.fbq) {
      window.fbq("trackCustom", "RemoveFromCart", {
        value: Number(item.priceValue || 0) * Number(item.quantity || 1),
        currency: "EGP",
      });
    }
  };

  const subtotal = cartItems.reduce(
    (acc, item) =>
      acc + Number(item.priceValue || 0) * Number(item.quantity || 1),
    0,
  );

  const subtotalLabel = new Intl.NumberFormat(
    locale === "ar" ? "ar-EG" : "en-US",
    {
      style: "currency",
      currency: "EGP",
      maximumFractionDigits: 0,
    },
  ).format(subtotal);

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
            className="fixed inset-0 z-[200] bg-black/40 backdrop-blur-sm"
          />

          <motion.div
            initial={{ x: isRtl ? "-100%" : "100%" }}
            animate={{ x: 0 }}
            exit={{ x: isRtl ? "-100%" : "100%" }}
            transition={{ type: "tween", ease: "easeInOut", duration: 0.4 }}
            className={`fixed top-0 z-[210] w-full max-w-md h-full bg-bg-primary shadow-2xl flex flex-col ${
              isRtl ? "left-0" : "right-0"
            }`}
          >
            <div className="flex items-center justify-between p-6 border-b border-border-color">
              <h2 className="font-playfair text-2xl text-text-primary tracking-wide">
                {t("CartDrawer.title")}{" "}
                <span className="text-sm font-montserrat text-text-secondary ml-1">
                  ({cartItems.length})
                </span>
              </h2>
              <button
                onClick={closeCart}
                className="p-2 -mr-2 text-text-secondary hover:text-text-primary transition-colors cursor-pointer"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div
              className={`flex-1 overflow-y-auto p-6 ${cartItems.length === 0 ? "flex h-full" : "space-y-6"}`}
            >
              {cartItems.length === 0 ? (
                <EmptyState
                  icon={ShoppingBag}
                  title={t("CartDrawer.emptyTitle") || "Your Cart is Empty"}
                  description={
                    t("CartDrawer.emptyDesc") ||
                    "You haven't added any items to your cart yet."
                  }
                />
              ) : (
                cartItems.map((item) => (
                  <div
                    key={`${item.productId}-${item.size || "default"}`}
                    className="flex gap-4"
                  >
                    <div className="w-20 h-24 bg-gray-100 dark:bg-gray-800 relative rounded overflow-hidden flex-shrink-0">
                      <Image
                        src={item.image}
                        alt={item.title}
                        fill
                        sizes="80px"
                        className="object-cover"
                      />
                    </div>

                    <div className="flex flex-col flex-1 justify-between">
                      <div>
                        <div className="flex justify-between items-start">
                          <h3 className="font-playfair text-text-primary text-base leading-tight pr-4">
                            {item.title}
                          </h3>
                          <button
                            onClick={() => handleRemove(item)}
                            className="text-gray-400 hover:text-red-500 transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        <p className="font-montserrat font-bold text-text-primary mt-2">
                          {item.priceLabel || item.price || ""}
                        </p>
                        {item.size ? (
                          <p className="text-xs text-text-secondary mt-1">
                            {item.size}
                          </p>
                        ) : null}
                      </div>

                      <div className="flex items-center gap-4 mt-3">
                        <div className="flex items-center border border-border-color rounded-full">
                          <button
                            onClick={() => handleDecrement(item)}
                            disabled={item.quantity <= 1}
                            className="p-1 px-3 text-text-secondary hover:text-text-primary transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="font-montserrat text-sm font-semibold text-text-primary w-4 text-center select-none">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => handleIncrement(item)}
                            className="p-1 px-3 text-text-secondary hover:text-text-primary transition-colors cursor-pointer"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="p-6 border-t border-border-color bg-bg-secondary/50">
              {cartItems.length > 0 && (
                <div className="mb-4 p-2.5 rounded-xl bg-gradient-to-r from-brand-orange/10 via-amber-500/10 to-brand-mint/10 border border-brand-orange/30 flex items-center gap-2.5 shadow-sm">
                  <div className="relative w-8 h-8 rounded-lg bg-white dark:bg-neutral-800 p-0.5 shrink-0 border border-amber-500/30 overflow-hidden">
                    <Image
                      src="/assets/guasha.jpg"
                      alt="Free Gua Sha"
                      width={32}
                      height={32}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] font-extrabold text-brand-orange uppercase tracking-wider">
                      🎁 {t("ProductDetails.freeGiftBadge")}
                    </span>
                    <span className="text-xs font-bold text-text-primary">
                      {t("ProductDetails.freeGuaSha")}
                    </span>
                  </div>
                </div>
              )}

              <div className="flex justify-between items-center mb-4">
                <span className="font-montserrat text-text-secondary uppercase text-sm tracking-wider">
                  {t("CartDrawer.subtotal")}
                </span>
                <span className="font-playfair text-xl text-text-primary">
                  {subtotalLabel}
                </span>
              </div>
              <p className="text-xs text-text-secondary mb-4 italic">
                {t("CartDrawer.shippingTaxes")}
              </p>

              <Link
                href="/returns"
                onClick={closeCart}
                className="block text-center text-xs text-brand-orange hover:underline font-medium mb-3 transition-colors"
              >
                {t("CartDrawer.returnPolicyNotice")}
              </Link>

              <Link
                href="/checkout"
                onClick={closeCart}
                className="w-full block text-center py-4 bg-brand-mint text-white font-montserrat font-bold text-sm tracking-widest hover:bg-brand-orange transition-colors duration-300 rounded-full shadow-sm"
              >
                {t("CartDrawer.checkout")}
              </Link>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
