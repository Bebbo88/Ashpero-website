"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart, Sun, Moon, Globe } from "lucide-react";
import TopBanner from "./TopBanner";

export function NavbarUI({
  t,
  locale,
  isDark,
  navLinks,
  isMobileMenuOpen,
  isActive,
  toggleDark,
  toggleLang,
  toggleMobileMenu,
  closeMobileMenu,
}) {
  return (
    <>
      <TopBanner />
      <nav className="px-6 md:px-10 w-full sticky top-0 z-50 bg-nav-glass backdrop-blur-md border-b border-border-color transition-colors duration-300">
        <div className="container mx-auto">
          <div className="flex items-center justify-between h-20 gap-4 lg:gap-8">
            <button onClick={toggleMobileMenu} className="md:hidden flex items-center relative h-8 w-24 bg-transparent cursor-pointer">
              <Image src="/assets/logo mob.svg" alt="Ashpero Mobile Logo" fill className="object-contain object-left" />
            </button>

            <div className="hidden md:flex items-center justify-start gap-3 lg:gap-4 xl:gap-6 flex-1 min-w-0">
              <Link href="/" className="flex-shrink-0 flex items-center relative h-12 w-32 lg:h-14 lg:w-40 bg-transparent cursor-pointer hover:opacity-80 transition-opacity">
                <Image src={isDark ? "/assets/logo white.svg" : "/assets/logo.svg"} alt="Ashpero Logo" fill className="object-contain object-left" />
              </Link>

              <div className="hidden lg:flex items-center gap-2 xl:gap-4 ml-2 overflow-hidden">
                <div className="w-[1px] h-6 bg-text-primary opacity-20" />
                <span className="font-playfair italic text-text-primary tracking-[0.1em] xl:tracking-[0.2em] text-[10px] xl:text-xs pt-1 uppercase opacity-80 whitespace-nowrap">{t("Navbar.madeInEgypt")}</span>

                <div className="hidden xl:flex items-center gap-4">
                  <div className="w-[1px] h-6 bg-text-primary opacity-20" />
                  <span className="font-playfair italic text-text-primary tracking-[0.2em] text-xs pt-1 uppercase opacity-80 whitespace-nowrap">{t("Navbar.luxurySkincare")}</span>
                  <div className="w-[1px] h-6 bg-text-primary opacity-20" />
                  <span className="font-playfair italic text-text-primary tracking-[0.2em] text-xs pt-1 uppercase opacity-80 whitespace-nowrap">{t("Navbar.naturalIngredients")}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 lg:gap-6 flex-shrink-0">
              <div className="flex items-center gap-2 lg:gap-4 text-text-primary">
                <button onClick={toggleDark} className="cursor-pointer p-1.5 lg:p-2 hover:bg-black/5 dark:hover:bg-white/10 rounded-full transition-colors">
                  {isDark ? <Sun className="w-4 h-4 lg:w-5 lg:h-5" /> : <Moon className="w-4 h-4 lg:w-5 lg:h-5" />}
                </button>
                <button onClick={toggleLang} className="cursor-pointer p-1.5 lg:p-2 hover:bg-black/5 dark:hover:bg-white/10 rounded-full transition-colors flex items-center font-bold text-xs lg:text-sm">
                  <Globe className="w-4 h-4 lg:w-5 lg:h-5 mr-1" />
                  {locale.toUpperCase()}
                </button>

                <div className="w-px h-6 bg-gray-300 dark:bg-gray-700 mx-1 hidden sm:block" />

                <Link href="/wishlist" className="cursor-pointer p-1.5 lg:p-2 hover:bg-black/5 dark:hover:bg-white/10 rounded-full transition-colors relative flex items-center justify-center">
                  <Heart className="w-4 h-4 lg:w-5 lg:h-5" />
                </Link>
              </div>

              <div className="hidden lg:flex items-center gap-4">
                <button className="cursor-pointer text-sm font-semibold text-text-primary hover:text-brand-mint transition-colors">{t("Navbar.login")}</button>
              </div>
            </div>
          </div>

          <div className="hidden md:flex items-center justify-center gap-6 lg:gap-12 h-14 text-sm font-bold tracking-wider text-text-primary">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href} className={`cursor-pointer transition-colors pb-1 whitespace-nowrap ${isActive(link.href) ? "text-brand-orange border-b-2 border-brand-orange" : "hover:text-brand-orange"}`}>
                {t(link.labelKey)}
              </Link>
            ))}
          </div>
        </div>

        <div className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out bg-bg-secondary border-t ${isMobileMenuOpen ? "max-h-[500px] border-border-color border-opacity-100 opacity-100" : "max-h-0 border-opacity-0 opacity-0"}`}>
          <div className="px-6 py-4 flex flex-col gap-4">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href} onClick={closeMobileMenu} className="py-2 text-text-primary text-sm font-bold border-b border-border-color/50">
                {t(link.labelKey)}
              </Link>
            ))}

            <div className="flex flex-col gap-3 mt-4">
              <button onClick={closeMobileMenu} className="w-full cursor-pointer text-sm font-semibold text-text-primary py-3 rounded-full border border-text-primary hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
                {t("Navbar.login")}
              </button>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}
