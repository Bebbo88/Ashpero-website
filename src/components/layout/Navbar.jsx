"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart, ShoppingBag, Sun, Moon, Globe } from "lucide-react";
import TopBanner from "./TopBanner";
import { useLanguage } from "../../hooks/useLanguage";
import { useMode } from "../../hooks/useMode";

export default function Navbar() {
  const { locale, setLanguage, t } = useLanguage();
  const { isDark, toggleDark } = useMode();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleLang = () => {
    setLanguage(locale === "en" ? "ar" : "en");
  };

  return (
    <>
      <TopBanner />

      <nav className="px-10 w-full sticky top-0 z-50 bg-nav-glass backdrop-blur-md border-b border-border-color transition-colors duration-300">
        <div className="container mx-auto px-6">
          {/* Top Row: Logo and Slogan on Left, Icons on Right */}
          <div className="flex items-center justify-between h-20 gap-8">
            {/* Mobile Logo Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden flex items-center relative h-8 w-24 bg-transparent cursor-pointer"
            >
              <Image
                src="/assets/logo mob.svg"
                alt="Ashpero Mobile Logo"
                fill
                className="object-contain object-left"
              />
            </button>

            {/* Left: Desktop Logo + Chic Tagline */}
            <div className="hidden md:flex items-center justify-start gap-4 lg:gap-6">
              <Link
                href="/"
                className="flex items-center relative h-14 w-40 bg-transparent cursor-pointer hover:opacity-80 transition-opacity"
              >
                <Image
                  src={isDark ? "/assets/logo white.svg" : "/assets/logo.svg"}
                  alt="Ashpero Logo"
                  fill
                  className="object-contain object-left"
                />
              </Link>
              <div className="w-[1px] h-8 bg-text-primary border-r border-text-primary opacity-20 mx-1 lg:mx-3"></div>
              <span className="font-playfair italic text-text-primary tracking-[0.2em] text-xs lg:text-sm pt-1 uppercase opacity-80 whitespace-nowrap">
                {t("Navbar.luxurySkincare")}
              </span>
              <div className="w-[1px] h-8 bg-text-primary border-r border-text-primary opacity-20 mx-1 lg:mx-3"></div>
              <span className="font-playfair italic text-text-primary tracking-[0.2em] text-xs lg:text-sm pt-1 uppercase opacity-80 whitespace-nowrap">
                {t("Navbar.naturalIngredients")}
              </span>
              <div className="w-[1px] h-8 bg-text-primary border-r border-text-primary opacity-20 mx-1 lg:mx-3"></div>
              <span className="font-playfair italic text-text-primary tracking-[0.2em] text-xs lg:text-sm pt-1 uppercase opacity-80 whitespace-nowrap">
                {t("Navbar.madeInEgypt")}
              </span>
            </div>

            {/* Icons & Actions */}
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-4 text-text-primary">
                <button
                  onClick={toggleDark}
                  className="cursor-pointer p-2 hover:bg-black/5 dark:hover:bg-white/10 rounded-full transition-colors"
                >
                  {isDark ? (
                    <Sun className="w-5 h-5" />
                  ) : (
                    <Moon className="w-5 h-5" />
                  )}
                </button>
                <button
                  onClick={toggleLang}
                  className="cursor-pointer p-2 hover:bg-black/5 dark:hover:bg-white/10 rounded-full transition-colors flex items-center font-bold text-sm"
                >
                  <Globe className="w-5 h-5 mr-1" /> {locale.toUpperCase()}
                </button>

                <div className="w-px h-6 bg-gray-300 dark:bg-gray-700 mx-1 hidden sm:block"></div>

                <button className="cursor-pointer p-2 hover:bg-black/5 dark:hover:bg-white/10 rounded-full transition-colors relative">
                  <Heart className="w-5 h-5" />
                </button>
                <button className="cursor-pointer p-2 hover:bg-black/5 dark:hover:bg-white/10 rounded-full transition-colors relative">
                  <ShoppingBag className="w-5 h-5" />
                  <span className="absolute top-1 right-1 w-4 h-4 bg-brand-orange text-white text-[10px] font-bold rounded-full flex items-center justify-center border border-white dark:border-gray-900">
                    2
                  </span>
                </button>
              </div>

              <div className="hidden lg:flex items-center gap-4">
                <button className="cursor-pointer text-sm font-semibold text-text-primary hover:text-brand-mint transition-colors">
                  {t("Navbar.login")}
                </button>
                <button className="cursor-pointer px-5 py-2 rounded-full border border-text-primary text-sm font-semibold text-text-primary hover:bg-text-primary hover:text-bg-primary transition-all">
                  {t("Navbar.register")}
                </button>
              </div>
            </div>
          </div>

          {/* Bottom Row: Navigation Links */}
          <div className="hidden md:flex items-center justify-center gap-12 h-14 text-sm font-bold tracking-wider text-text-primary">
            <a
              href="#"
              className="cursor-pointer text-brand-orange border-b-2 border-brand-orange pb-1"
            >
              {t("Navbar.home")}
            </a>
            <a
              href="#"
              className="cursor-pointer hover:text-brand-orange transition-colors"
            >
              {t("Navbar.allProducts")}
            </a>
            <a
              href="#"
              className="cursor-pointer hover:text-brand-orange transition-colors"
            >
              {t("Navbar.aboutUs")}
            </a>
            <a
              href="#"
              className="cursor-pointer hover:text-brand-orange transition-colors"
            >
              {t("Navbar.contactUs")}
            </a>
            <a
              href="#"
              className="cursor-pointer hover:text-brand-orange transition-colors"
            >
              {t("Navbar.tipsAndTricks")}
            </a>
          </div>
        </div>

        {/* Mobile Menu Drawer */}
        <div
          className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out bg-bg-secondary border-t ${isMobileMenuOpen ? "max-h-[500px] border-border-color border-opacity-100 opacity-100" : "max-h-0 border-opacity-0 opacity-0"}`}
        >
          <div className="px-6 py-4 flex flex-col gap-4">
            <Link
              href="/"
              onClick={() => setIsMobileMenuOpen(false)}
              className="py-2 text-text-primary text-sm font-bold border-b border-border-color/50"
            >
              {t("Navbar.home")}
            </Link>
            <Link
              href="/all-products"
              onClick={() => setIsMobileMenuOpen(false)}
              className="py-2 text-text-primary text-sm font-bold border-b border-border-color/50"
            >
              {t("Navbar.allProducts")}
            </Link>
            <Link
              href="/about-us"
              onClick={() => setIsMobileMenuOpen(false)}
              className="py-2 text-text-primary text-sm font-bold border-b border-border-color/50"
            >
              {t("Navbar.aboutUs")}
            </Link>
            <Link
              href="/contact-us"
              onClick={() => setIsMobileMenuOpen(false)}
              className="py-2 text-text-primary text-sm font-bold border-b border-border-color/50"
            >
              {t("Navbar.contactUs")}
            </Link>
            <Link
              href="/tips-and-tricks"
              onClick={() => setIsMobileMenuOpen(false)}
              className="py-2 text-text-primary text-sm font-bold border-b border-border-color/50"
            >
              {t("Navbar.tipsAndTricks")}
            </Link>

            <div className="flex flex-col gap-3 mt-4">
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="w-full cursor-pointer text-sm font-semibold text-text-primary py-3 rounded-full border border-text-primary hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
              >
                {t("Navbar.login")}
              </button>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="w-full cursor-pointer py-3 rounded-full bg-text-primary text-bg-primary text-sm font-semibold hover:opacity-90 transition-opacity"
              >
                {t("Navbar.register")}
              </button>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}
