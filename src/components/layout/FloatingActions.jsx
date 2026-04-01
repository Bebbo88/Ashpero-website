"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingCart, Heart } from "lucide-react"; // Using native Lucide for Cart, custom SVGs for others
import { useLanguage } from "@/hooks/useLanguage";
import { useCartDrawer } from "@/contexts/CartDrawerContext";

const WhatsAppIcon = ({ className }) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
  >
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 00-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.095 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);

const DoctorBotIcon = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <rect width="16" height="14" x="4" y="6" rx="3" ry="3" />
    <path d="M2 12h2" />
    <path d="M20 12h2" />
    {/* Medical Cross prominently on its face */}
    <path d="M12 9v8" />
    <path d="M8 13h8" />
    {/* Antenna */}
    <path d="M12 2v4" />
    <circle cx="12" cy="1" r="1" />
  </svg>
);

export default function FloatingActions() {
  const { t } = useLanguage();
  const { openCart } = useCartDrawer();

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
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="fixed bottom-6 end-6 md:bottom-10 md:end-10 z-[150] flex flex-col gap-4 items-center"
    >
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
            2
          </span>
        </button>
      </motion.div>

      {/* 2. WhatsApp Floating Button (Usually green) */}
      <motion.div variants={itemVariants}>
        <a
          href="https://wa.me/201001234567" // Placeholder number
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center w-14 h-14 bg-[#25D366] text-white rounded-full shadow-[0_8px_20px_rgba(37,211,102,0.3)] hover:bg-[#1EBE5A] transition-all hover:scale-110 active:scale-95"
          aria-label="Contact us on WhatsApp"
        >
          <WhatsAppIcon className="w-7 h-7" />
        </a>
      </motion.div>

      {/* 3. AI Agent (Doctor Bot) */}
      <motion.div variants={itemVariants}>
        <button
          onClick={() =>
            alert(
              "AI Skincare Doctor initiating...\n(This will open the AI Chat window)",
            )
          }
          className="relative flex items-center cursor-pointer justify-center w-16 h-16 bg-gradient-to-br from-brand-mint to-brand-dark text-white rounded-full shadow-[0_8px_30px_rgba(105,181,120,0.5)] border-2 border-white/20 hover:shadow-[0_8px_30px_rgba(105,181,120,0.8)] transition-all hover:scale-110 active:scale-95 group"
          aria-label="Consult AI Skincare Doctor"
        >
          {/* Cool floating/bobbing animation specifically for the bot to make it feel alive */}
          <motion.div
            animate={{ y: [-2, 2, -2] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          >
            <DoctorBotIcon className="w-8 h-8 group-hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.5)] transition-all" />
          </motion.div>
          {/* Active status indicator dot */}
          <span className="absolute bottom-1 end-1 w-3.5 h-3.5 bg-green-400 border-2 border-brand-dark rounded-full"></span>
        </button>
      </motion.div>
    </motion.div>
  );
}
