"use client";

import React from "react";
import Image from "@/components/ui/AppImage";
import Link from "next/link";
import {
  Heart,
  Sun,
  Moon,
  Globe,
  ChevronDown,
  X,
  User,
  LogOut,
  Menu,
  Search,
} from "lucide-react";
import TopBanner from "./TopBanner";
import {
  GoogleIcon,
  FacebookIcon as FacebookProviderIcon,
  TwitterIcon as TwitterProviderIcon,
} from "@/svgs/AuthProviders.svgs";

const providerStyles = {
  google:
    "bg-white text-auth-google-text border-auth-google-border hover:border-auth-google-border-hover hover:shadow-sm",
  facebook:
    "bg-auth-facebook-bg text-auth-facebook-text border-auth-facebook-border hover:border-auth-facebook-border-hover hover:bg-auth-facebook-hover-bg",
  twitter:
    "bg-auth-twitter-bg text-auth-twitter-text border-auth-twitter-border hover:border-auth-twitter-border-hover hover:bg-auth-twitter-hover-bg",
};

const providerIconMap = {
  google: GoogleIcon,
  facebook: FacebookProviderIcon,
  twitter: TwitterProviderIcon,
};

export function NavbarUI({
  t,
  locale,
  isDark,
  session,
  isAuthenticated,
  isAuthLoading,
  navLinks,
  providers,
  isMobileMenuOpen,
  isAuthMenuOpen,
  isActive,
  toggleDark,
  toggleLang,
  toggleMobileMenu,
  closeMobileMenu,
  toggleAuthMenu,
  closeAuthMenu,
  loginWithProvider,
  logout,
}) {
  const userLabel = session?.user?.name || session?.user?.email || "Account";
  const firstLetter = userLabel?.trim()?.charAt(0)?.toUpperCase() || "U";
  const logoSrc = isDark ? "/assets/logo-white.svg" : "/assets/logo.svg";
  const logoMobileSrc = isDark
    ? "/assets/favicon-light.png"
    : "/assets/favicon-dark.png";

  return (
    <>
      <TopBanner />
      <nav className="px-6 md:px-10 w-full sticky top-0 z-50 bg-nav-glass backdrop-blur-md border-b border-border-color transition-colors duration-300">
        <div className="container mx-auto">
          <div className="flex items-center justify-between h-20 gap-4 lg:gap-8">
            <button
              onClick={toggleMobileMenu}
              className="md:hidden flex items-center gap-2 h-8 w-24 bg-transparent cursor-pointer"
            >
              <Menu className="w-6 h-6 text-text-primary shrink-0" />

              <div className="relative h-full w-full">
                <Image
                  src={logoMobileSrc}
                  alt="Ashpero Mobile Logo"
                  fill
                  className="object-contain object-left"
                  priority
                  sizes="96px"
                />
              </div>
            </button>

            <div className="hidden md:flex items-center justify-start gap-3 lg:gap-4 xl:gap-6 flex-1 min-w-0">
              <Link
                href="/"
                className="shrink-0 flex items-center relative h-12 w-32 lg:h-14 lg:w-40 bg-transparent cursor-pointer hover:opacity-80 transition-opacity"
              >
                <Image
                  src={logoSrc}
                  alt="Ashpero Logo"
                  fill
                  className="object-contain object-left"
                  priority
                  sizes="160px"
                />
              </Link>

              <div className="hidden lg:flex items-center gap-2 xl:gap-4 ml-2 overflow-hidden">
                <div className="w-[1px] h-6 bg-text-primary opacity-20" />
                <span className="font-playfair italic text-text-primary tracking-[0.1em] xl:tracking-[0.2em] text-[10px] xl:text-xs pt-1 uppercase opacity-100 font-bold whitespace-nowrap">
                  {t("Navbar.success")}
                </span>
              </div>
            </div>

            {/* Middle Search - responsive */}
            <div className="flex-1 flex justify-center max-w-[150px] md:max-w-[200px] lg:max-w-[300px] mx-2 md:mx-4 shrink">
              <Link href="/all-products" className="w-full flex items-center bg-black/5 dark:bg-white/5 border border-transparent hover:border-border-color rounded-full px-3 py-1.5 md:py-2 transition-colors cursor-pointer justify-center md:justify-start">
                <Search className="w-4 h-4 text-text-secondary md:mr-2 shrink-0" />
                <span className="text-xs text-text-secondary hidden md:block w-full truncate">
                  {locale === "ar" ? "ابحث عن منتج..." : "Search products..."}
                </span>
              </Link>
            </div>

            <div className="flex items-center gap-3 lg:gap-6 flex-shrink-0">
              <div className="flex items-center gap-2 lg:gap-4 text-text-primary">
                <button
                  onClick={toggleDark}
                  className="cursor-pointer p-1.5 lg:p-2 hover:bg-black/5 dark:hover:bg-white/10 rounded-full transition-colors"
                >
                  {isDark ? (
                    <Sun className="w-4 h-4 lg:w-5 lg:h-5" />
                  ) : (
                    <Moon className="w-4 h-4 lg:w-5 lg:h-5" />
                  )}
                </button>
                <button
                  onClick={toggleLang}
                  className="cursor-pointer p-1.5 lg:p-2 hover:bg-black/5 dark:hover:bg-white/10 rounded-full transition-colors flex items-center font-bold text-xs lg:text-sm"
                >
                  <Globe className="w-4 h-4 lg:w-5 lg:h-5 mr-1" />
                  {locale.toUpperCase()}
                </button>

                <div className="w-px h-6 bg-gray-300 dark:bg-gray-700 mx-1 hidden sm:block" />

                <Link
                  href="/wishlist"
                  className="cursor-pointer p-1.5 lg:p-2 hover:bg-black/5 dark:hover:bg-white/10 rounded-full transition-colors relative flex items-center justify-center"
                >
                  <Heart className="w-4 h-4 lg:w-5 lg:h-5" />
                </Link>
              </div>

              <div className="hidden lg:block relative">
                {isAuthenticated ? (
                  <div className="flex items-center gap-2">
                    <div className="w-9 h-9 rounded-full border border-border-color bg-brand-creme/70 dark:bg-white/10 overflow-hidden flex items-center justify-center text-sm font-bold text-text-primary shrink-0">
                      {session?.user?.image ? (
                        <Image
                          src={session.user.image}
                          alt={userLabel}
                          width={36}
                          height={36}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span>{firstLetter}</span>
                      )}
                    </div>
                    <span
                      className="text-xs text-text-secondary max-w-[140px] truncate"
                      title={userLabel}
                    >
                      {userLabel}
                    </span>
                    <button
                      onClick={logout}
                      className="cursor-pointer p-1.5 lg:p-2 hover:bg-black/5 dark:hover:bg-white/10 rounded-full transition-colors text-text-primary hover:text-brand-orange"
                      title="Logout"
                    >
                      <LogOut className="w-4 h-4 lg:w-5 lg:h-5" />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={toggleAuthMenu}
                    disabled={isAuthLoading}
                    className="cursor-pointer p-1.5 lg:p-2 hover:bg-black/5 dark:hover:bg-white/10 rounded-full transition-colors text-text-primary hover:text-brand-orange disabled:opacity-60 flex items-center justify-center"
                    title={t("Navbar.login")}
                  >
                    <User className="w-4 h-4 lg:w-5 lg:h-5" />
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="hidden md:flex items-center justify-center gap-6 lg:gap-12 h-14 text-sm font-bold tracking-wider text-text-primary">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`cursor-pointer transition-colors pb-1 whitespace-nowrap ${
                  isActive(link.href)
                    ? "text-brand-orange border-b-2 border-brand-orange"
                    : "hover:text-brand-orange"
                }`}
              >
                {t(link.labelKey)}
              </Link>
            ))}
          </div>
        </div>

        <div
          className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out bg-bg-secondary border-t ${
            isMobileMenuOpen
              ? "max-h-[500px] border-border-color border-opacity-100 opacity-100"
              : "max-h-0 border-opacity-0 opacity-0"
          }`}
        >
          <div className="px-6 py-4 flex flex-col gap-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={closeMobileMenu}
                className="py-2 text-text-primary text-sm font-bold border-b border-border-color/50"
              >
                {t(link.labelKey)}
              </Link>
            ))}

            <div className="flex flex-col gap-3 mt-4">
              {isAuthenticated ? (
                <>
                  <div className="flex items-center justify-center gap-3 py-1">
                    <div className="w-10 h-10 rounded-full border border-border-color bg-brand-creme/70 dark:bg-white/10 overflow-hidden flex items-center justify-center text-sm font-bold text-text-primary shrink-0">
                      {session?.user?.image ? (
                        <Image
                          src={session.user.image}
                          alt={userLabel}
                          width={40}
                          height={40}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span>{firstLetter}</span>
                      )}
                    </div>
                    <span className="text-sm font-semibold text-text-primary max-w-[170px] truncate">
                      {userLabel}
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      closeMobileMenu();
                      logout();
                    }}
                    className="w-full cursor-pointer flex items-center justify-center gap-2 text-sm font-semibold text-text-primary py-3 rounded-full border border-text-primary/70 hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </>
              ) : (
                <button
                  onClick={() => {
                    closeMobileMenu();
                    toggleAuthMenu();
                  }}
                  disabled={isAuthLoading}
                  className="w-full cursor-pointer flex items-center justify-center gap-2 text-sm font-semibold text-text-primary py-3 rounded-full border border-text-primary hover:bg-black/5 dark:hover:bg-white/5 transition-colors disabled:opacity-60"
                >
                  <User className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      </nav>

      {!isAuthenticated && isAuthMenuOpen ? (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <button
            type="button"
            aria-label="Close Login Modal"
            className="absolute inset-0 bg-black/45 backdrop-blur-sm"
            onClick={closeAuthMenu}
          />

          <div className="relative w-full max-w-md rounded-3xl border border-auth-modal-border auth-modal-surface backdrop-blur-2xl shadow-auth-modal p-6 md:p-7">
            <button
              onClick={closeAuthMenu}
              className="absolute top-4 right-4 w-8 h-8 rounded-full border border-auth-modal-close-border text-auth-modal-close-text hover:bg-white flex items-center justify-center cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <p className="text-[11px] tracking-[0.25em] font-bold uppercase text-text-secondary mb-2">
              Ashpero Account
            </p>
            <h3 className="font-playfair text-2xl md:text-3xl text-auth-modal-title mb-2">
              Continue To Login
            </h3>
            <p className="text-sm text-text-secondary mb-6">
              Choose your provider to sign in securely.
            </p>

            <div className="flex flex-col gap-3">
              {providers.length > 0 ? (
                providers.map((provider) => {
                  const ProviderIcon = providerIconMap[provider.id];

                  return (
                    <button
                      key={provider.id}
                      onClick={() => loginWithProvider(provider.id)}
                      className={`w-full py-3.5 px-4 rounded-xl border text-sm font-semibold transition-all hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer ${
                        providerStyles[provider.id] ||
                        "bg-auth-modal-fallback-bg text-auth-modal-title border-auth-modal-fallback-border"
                      }`}
                    >
                      {ProviderIcon ? (
                        <ProviderIcon className="w-4 h-4" />
                      ) : null}
                      <span>Continue with {provider.name || provider.id}</span>
                    </button>
                  );
                })
              ) : (
                <div className="rounded-xl border border-auth-modal-fallback-border bg-auth-modal-empty-bg p-4 text-sm text-text-secondary">
                  No providers configured yet. Add provider keys in `.env`.
                </div>
              )}
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
