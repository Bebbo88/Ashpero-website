"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingCart } from "lucide-react"; // Using native Lucide for Cart, custom SVGs for others
import { useCartDrawer } from "@/contexts/CartDrawerContext";
import { useAppSelector } from "@/store/hooks";
import { WhatsAppIcon, DoctorBotIcon } from "@/svgs/FloatingActions.svgs";
import AIChatBox from "./AIChatBox";

export default function FloatingActions() {
  const { openCart } = useCartDrawer();
  const cartItems = useAppSelector((state) => state.cart.items || []);
  const [bottomOffset, setBottomOffset] = useState(0);
  const [isChatOpen, setIsChatOpen] = useState(false);

  const cartCount = cartItems.reduce(
    (count, item) => count + Number(item.quantity || 0),
    0,
  );

  useEffect(() => {
    let ticking = false;

    const updatePosition = () => {
      const footer = document.querySelector("footer");
      const navbar =
        document.querySelector("nav") || document.querySelector("header");
      const floatingElement = document.getElementById(
        "floating-actions-container",
      );

      if (footer && floatingElement) {
        const footerRect = footer.getBoundingClientRect();
        const windowHeight = window.innerHeight;

        let newOffset = 0;

        if (footerRect.top < windowHeight) {
          // Push buttons up safely
          newOffset = windowHeight - footerRect.top;
        }

        // Cap the offset to prevent overlapping the navbar
        if (navbar) {
          const navbarBottom = navbar.getBoundingClientRect().bottom;
          const elementHeight = floatingElement.offsetHeight;

          // Container normally sits around 40px (on desktop) from the bottom.
          // The maximum allowable offset is: Viewport - NavbarBottom - ElementHeight - DistanceFromBottom
          const maxOffset = Math.max(
            0,
            windowHeight - navbarBottom - elementHeight - 40 - 20,
          ); // 20px extra padding

          if (newOffset > maxOffset) {
            newOffset = maxOffset;
          }
        }

        setBottomOffset(newOffset);
      }
      ticking = false;
    };

    const handleScroll = () => {
      // Throttle function using requestAnimationFrame to prevent layout thrashing and maintain 60fps
      if (!ticking) {
        window.requestAnimationFrame(updatePosition);
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll);
    updatePosition(); // initial check

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, []);

  // Staggering animation variants for the buttons when they enter
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
      style={{ transform: `translateY(-${bottomOffset}px)` }}
      className="fixed bottom-6 inset-x-6 md:bottom-10 md:inset-x-10 z-[150] flex items-end justify-between pointer-events-none"
    >
      <div className="flex flex-col gap-4 items-center pointer-events-auto">
        {/* 2. WhatsApp Floating Button (Usually green) */}
        <motion.div variants={itemVariants}>
          <a
            href="https://wa.me/01094317717" // Placeholder number
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center w-14 h-14 bg-social-whatsapp text-white rounded-full shadow-whatsapp hover:bg-social-whatsapp-hover transition-all hover:scale-110 active:scale-95"
            aria-label="Contact us on WhatsApp"
          >
            <WhatsAppIcon className="w-7 h-7" />
          </a>
        </motion.div>

        {/* 3. AI Agent (Doctor Bot) */}
        <motion.div variants={itemVariants} className="relative">
          <button
            onClick={() => setIsChatOpen(!isChatOpen)}
            className="relative flex items-center cursor-pointer justify-center w-16 h-16 bg-gradient-to-br from-brand-mint to-brand-dark text-white rounded-full shadow-brand-primary border-2 border-white/20 hover:shadow-brand-primary-strong transition-all hover:scale-110 active:scale-95 group"
            aria-label="Consult AI Skincare Doctor"
          >
            {/* Cool floating/bobbing animation specifically for the bot to make it feel alive */}
            <motion.div
              animate={{ y: [-2, 2, -2] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            >
              <DoctorBotIcon className="w-8 h-8 group-hover:drop-shadow-md transition-all" />
            </motion.div>
            {/* Active status indicator dot */}
            <span className="absolute bottom-1 end-1 w-3.5 h-3.5 bg-green-400 border-2 border-brand-dark rounded-full"></span>
          </button>

          <AnimatePresence>
            {isChatOpen && <AIChatBox onClose={() => setIsChatOpen(false)} alignment="start" />}
          </AnimatePresence>
        </motion.div>
      </div>

      <div className="flex flex-col gap-4 items-center pointer-events-auto">
        {/* 1. The Cart Button (Moved from Navbar) */}
        <motion.div variants={itemVariants} className="relative group">
          {/* Continuous soft pulse ring specifically for the cart (optional engagement) */}
          <div className="absolute inset-0 bg-brand-orange/30 rounded-full animate-ping opacity-50"></div>
          <button
            onClick={openCart}
            className="relative flex items-center justify-center w-14 h-14 bg-bg-secondary border border-border-color rounded-full shadow-lg hover:bg-brand-orange hover:text-white hover:border-brand-orange text-text-primary transition-all hover:scale-110 active:scale-95 group cursor-pointer"
          >
            <ShoppingCart className="w-6 h-6" />
            {/* Cart Badge */}
            <span className="absolute -top-1 -end-1 w-5 h-5 bg-brand-orange text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-bg-primary shadow-sm group-hover:border-brand-orange transition-colors">
              {cartCount}
            </span>
          </button>
        </motion.div>
      </div>
    </motion.div>
  );
}
