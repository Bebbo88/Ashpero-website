"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useLanguage } from "@/hooks/useLanguage";

export default function NotFound() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-bg-primary flex flex-col items-center justify-center relative overflow-hidden">
      {/* Background abstract glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand-creme/20 dark:bg-brand-mint/5 rounded-full blur-3xl opacity-50 pointer-events-none" />

      <div className="relative z-10 flex flex-col items-center justify-center text-center px-6">
        {/* Floating 404 */}
        <div className="flex items-center justify-center gap-2 md:gap-4 text-brand-dark dark:text-brand-creme font-serif text-[120px] md:text-[180px] leading-none mb-4 tracking-tighter select-none">
          <motion.span
            animate={{ y: [0, -15, 0] }}
            transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
          >
            {t("NotFound.digit4")}
          </motion.span>
          <motion.span
            animate={{ y: [0, 15, 0], scale: [1, 1.05, 1] }}
            transition={{ repeat: Infinity, duration: 5, ease: "easeInOut", delay: 0.2 }}
            className="text-brand-mint/90 text-[100px] md:text-[160px]"
          >
            {t("NotFound.digit0")}
          </motion.span>
          <motion.span
            animate={{ y: [0, -20, 0] }}
            transition={{ repeat: Infinity, duration: 4.5, ease: "easeInOut", delay: 0.4 }}
          >
            {t("NotFound.digit4")}
          </motion.span>
        </div>

        {/* Text Content */}
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-2xl md:text-3xl font-bold font-serif text-text-primary mb-3"
        >
          {t("NotFound.title")}
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-text-secondary text-sm md:text-base max-w-sm mx-auto mb-10"
        >
          {t("NotFound.description")}
        </motion.p>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <Link
            href="/"
            className="inline-flex items-center justify-center px-8 py-3.5 rounded-full bg-brand-dark dark:bg-brand-mint text-white tracking-wide font-semibold text-sm hover:scale-105 active:scale-95 transition-all shadow-soft cursor-pointer"
          >
            {t("NotFound.returnHome")}
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
