"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { X, Minus, Plus, Trash2 } from "lucide-react";
import { useCartDrawer } from "@/contexts/CartDrawerContext";
import { useLanguage } from "@/hooks/useLanguage";

export default function CartDrawer() {
  const { isCartOpen, closeCart } = useCartDrawer();
  const { t, locale } = useLanguage();
  const isRtl = locale === "ar";

  // Mocked stateful cart items
  const [cartItems, setCartItems] = React.useState([
    {
      id: 1,
      name: "Vitamin C Brightening Serum",
      price: 112.00,
      image: "/assets/photo1.jpeg",
      quantity: 1,
    },
    {
      id: 2,
      name: "Revival Night Repair Cream",
      price: 145.00,
      image: "/assets/photo2.jpeg",
      quantity: 1,
    },
  ]);

  const handleIncrement = (id) => {
    setCartItems(items => items.map(item => 
      item.id === id ? { ...item, quantity: item.quantity + 1 } : item
    ));
  };

  const handleDecrement = (id) => {
    setCartItems(items => items.map(item => 
      item.id === id && item.quantity > 1 ? { ...item, quantity: item.quantity - 1 } : item
    ));
  };

  const handleRemove = (id) => {
    setCartItems(items => items.filter(item => item.id !== id));
  };

  const subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);


  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
            className="fixed inset-0 z-[200] bg-black/40 backdrop-blur-sm"
          />

          {/* Drawer Panel */}
          <motion.div
            initial={{ x: isRtl ? "-100%" : "100%" }}
            animate={{ x: 0 }}
            exit={{ x: isRtl ? "-100%" : "100%" }}
            transition={{ type: "tween", ease: "easeInOut", duration: 0.4 }}
            className={`fixed top-0 z-[210] w-full max-w-md h-full bg-bg-primary shadow-2xl flex flex-col ${isRtl ? "left-0" : "right-0"}`}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-border-color">
              <h2 className="font-playfair text-2xl text-text-primary tracking-wide">
                {t("CartDrawer.title")} <span className="text-sm font-montserrat text-text-secondary ml-1">({cartItems.length})</span>
              </h2>
              <button
                onClick={closeCart}
                className="p-2 -mr-2 text-text-secondary hover:text-text-primary transition-colors cursor-pointer"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Cart Items List */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {cartItems.map((item) => (
                <div key={item.id} className="flex gap-4">
                  <div className="w-20 h-24 bg-gray-100 dark:bg-gray-800 relative rounded overflow-hidden flex-shrink-0">
                    <Image src={item.image} alt={item.name} fill className="object-cover" />
                  </div>
                  
                  <div className="flex flex-col flex-1 justify-between">
                    <div>
                      <div className="flex justify-between items-start">
                        <h3 className="font-playfair text-text-primary text-base leading-tight pr-4">
                          {item.name}
                        </h3>
                        <button onClick={() => handleRemove(item.id)} className="text-gray-400 hover:text-red-500 transition-colors cursor-pointer">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <p className="font-montserrat font-bold text-text-primary mt-2">
                        ${item.price.toFixed(2)}
                      </p>
                    </div>

                    <div className="flex items-center gap-4 mt-3">
                      <div className="flex items-center border border-border-color rounded-full">
                        <button onClick={() => handleDecrement(item.id)} disabled={item.quantity <= 1} className="p-1 px-3 text-text-secondary hover:text-text-primary transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed">
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="font-montserrat text-sm font-semibold text-text-primary w-4 text-center select-none">
                          {item.quantity}
                        </span>
                        <button onClick={() => handleIncrement(item.id)} className="p-1 px-3 text-text-secondary hover:text-text-primary transition-colors cursor-pointer">
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-border-color bg-bg-secondary/50">
              <div className="flex justify-between items-center mb-4">
                <span className="font-montserrat text-text-secondary uppercase text-sm tracking-wider">{t("CartDrawer.subtotal")}</span>
                <span className="font-playfair text-xl text-text-primary">${subtotal.toFixed(2)}</span>
              </div>
              <p className="text-xs text-text-secondary mb-6 italic">
                {t("CartDrawer.shippingTaxes")}
              </p>
              
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
