"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingCart } from "lucide-react";
import { useCartDrawer } from "@/contexts/CartDrawerContext";
import { useAppSelector } from "@/store/hooks";
import { WhatsAppIcon, DoctorBotIcon } from "@/svgs/FloatingActions.svgs";
import AIChatBox from "./AIChatBox";

export default function FloatingActions() {
  const { openCart } = useCartDrawer();
  const cartItems = useAppSelector((state) => state.cart.items || []);
  const [isChatOpen, setIsChatOpen] = useState(false);

  const cartCount = cartItems.reduce(
    (count, item) => count + Number(item.quantity || 0),
    0,
  );

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.5 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.8 },
    show: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { type: "spring", stiffness: 300, damping: 20 },
    },
  };

  return (
    <motion.div
      id="floating-actions-container"
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="fixed bottom-4 inset-x-4 sm:bottom-6 sm:inset-x-6 md:bottom-10 md:inset-x-10 z-[150] flex items-end justify-between pointer-events-none"
    >
      <div className="flex flex-col gap-2 sm:gap-4 items-center pointer-events-auto">
        {/* WhatsApp Floating Button */}
        <motion.div variants={itemVariants}>
          <a
            href="https://wa.me/201108851834"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 bg-social-whatsapp text-white rounded-full shadow-whatsapp hover:bg-social-whatsapp-hover transition-all hover:scale-110 active:scale-95"
            aria-label="Contact us on WhatsApp"
          >
            <WhatsAppIcon className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7" />
          </a>
        </motion.div>

        {/* AI Agent (Doctor Bot) */}
        <motion.div variants={itemVariants} className="relative">
          <button
            onClick={() => setIsChatOpen(!isChatOpen)}
            className="relative flex items-center cursor-pointer justify-center w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-gradient-to-br from-brand-mint to-brand-dark text-white rounded-full shadow-brand-primary border-2 border-white/20 hover:shadow-brand-primary-strong transition-all hover:scale-110 active:scale-95 group overflow-hidden"
            aria-label="Consult AI Skincare Doctor"
          >
            <motion.div
              animate={{ y: [-2, 2, -2] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="w-full h-full rounded-full overflow-hidden relative"
            >
              <img
                src="/assets/bot.jpeg"
                alt="Consult AI Skincare Doctor"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </motion.div>
            <span className="absolute bottom-0.5 end-0.5 sm:bottom-1 sm:end-1 w-2.5 h-2.5 sm:w-3 sm:h-3 md:w-3.5 md:h-3.5 bg-green-400 border-2 border-brand-dark rounded-full"></span>
          </button>

          <AnimatePresence>
            {isChatOpen && (
              <AIChatBox
                onClose={() => setIsChatOpen(false)}
                alignment="start"
              />
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      <div className="flex flex-col gap-2 sm:gap-4 items-center pointer-events-auto">
        {/* Cart Button */}
        <motion.div variants={itemVariants} className="relative group">
          <div className="absolute inset-0 bg-brand-orange/30 rounded-full animate-ping opacity-50"></div>
          <button
            onClick={openCart}
            aria-label="Open Cart"
            className="relative flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 bg-bg-secondary border border-border-color rounded-full shadow-lg hover:bg-brand-orange hover:text-white hover:border-brand-orange text-text-primary transition-all hover:scale-110 active:scale-95 group cursor-pointer"
          >
            <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
            <span
              suppressHydrationWarning
              className="absolute -top-1 -end-1 w-4 h-4 sm:w-5 sm:h-5 bg-brand-orange text-white text-[9px] sm:text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-bg-primary shadow-sm group-hover:border-brand-orange transition-colors"
            >
              {cartCount}
            </span>
          </button>
        </motion.div>
      </div>
    </motion.div>
  );
}
