"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Send } from "lucide-react";
import { useLanguage } from "../../hooks/useLanguage";

const InstagramIcon = (props) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
  </svg>
);

const XIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z" />
  </svg>
);

const WhatsAppIcon = (props) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
  </svg>
);

export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="px-10 w-full bg-gradient-to-r from-[#175F4A] to-[#0E3E2F] text-white pt-16 pb-8 border-t border-white/10 ">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 mb-16">
          {/* Column 1: Logo & Description */}
          <div className="flex flex-col gap-6 col-span-1">
            <Link href="/" className="relative h-12 w-48">
              <Image
                src="/assets/logo white.svg"
                alt="Ashpero Logo"
                fill
                className="object-contain object-left rtl:object-right"
              />
            </Link>
            <p className="text-sm leading-relaxed text-white/90 pr-4 rtl:pr-0 rtl:pl-4">
              {t("Footer.description")}
            </p>
            {/* Social Icons */}
            <div className="flex items-center gap-5 mt-2">
              <a
                href="#"
                aria-label="Instagram"
                className="hover:text-brand-orange transition-colors"
              >
                <InstagramIcon className="w-5 h-5" />
              </a>
              <a
                href="#"
                aria-label="X (Twitter)"
                className="hover:text-brand-orange transition-colors"
              >
                <XIcon className="w-4 h-4" />
              </a>
              <a
                href="#"
                aria-label="WhatsApp"
                className="hover:text-brand-orange transition-colors"
              >
                <WhatsAppIcon className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Column 2: Explore */}
          <div className="flex flex-col gap-5 col-span-1 lg:pl-8">
            <h3 className="font-bold tracking-widest text-sm uppercase mb-2 text-white">
              {t("Footer.explore")}
            </h3>
            <Link
              href="/all-products"
              className="text-sm font-medium text-white/80 hover:text-white transition-colors"
            >
              {t("Footer.allProducts")}
            </Link>
            <Link
              href="/about-us"
              className="text-sm font-medium text-white/80 hover:text-white transition-colors"
            >
              {t("Footer.aboutUs")}
            </Link>

            <Link
              href="/tips-and-tricks"
              className="text-sm font-medium text-white/80 hover:text-white transition-colors"
            >
              {t("Footer.tipsAndTricks")}
            </Link>
          </div>

          {/* Column 3: Customer Care */}
          <div className="flex flex-col gap-5 col-span-1">
            <h3 className="font-bold tracking-widest text-sm uppercase mb-2 text-white">
              {t("Footer.customerCare")}
            </h3>
            <Link
              href="/shipping"
              className="text-sm font-medium text-white/80 hover:text-white transition-colors"
            >
              {t("Footer.shippingReturns")}
            </Link>

            <Link
              href="/privacy"
              className="text-sm font-medium text-white/80 hover:text-white transition-colors"
            >
              {t("Footer.privacyPolicy")}
            </Link>
            <Link
              href="/contact-us"
              className="text-sm font-medium text-white/80 hover:text-white transition-colors"
            >
              {t("Footer.contactUs")}
            </Link>
          </div>

          {/* Column 4: Concierge */}
          <div className="flex flex-col gap-5 col-span-1">
            <h3 className="font-bold tracking-widest text-sm uppercase mb-2 text-white">
              {t("Footer.reachUs")}
            </h3>
            <p className="text-sm font-medium text-white/80 leading-relaxed">
              {t("Footer.subscribeText")}
            </p>
            <form className="mt-2 flex w-full relative group shadow-sm">
              <input
                type="email"
                placeholder={t("Footer.emailPlaceholder")}
                className="w-full bg-[#B2C4D6] text-brand-dark rounded-l-md px-4 py-3 text-sm focus:outline-none placeholder:text-[#506a5b] rtl:rounded-l-none rtl:rounded-r-md transition-all font-medium"
              />
              <button
                type="button"
                className="bg-brand-orange hover:bg-[#DE5C38] transition-colors rounded-r-md px-4 py-3 flex items-center justify-center cursor-pointer rtl:rounded-r-none rtl:rounded-l-md shrink-0 border border-brand-orange"
              >
                <Send className="w-5 h-5 text-white transform rtl:-scale-x-100" />
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/20 pt-8 mt-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-[11px] font-semibold text-white/60 tracking-wider uppercase text-center md:text-left rtl:md:text-right">
            {t("Footer.copyright")}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-8">
            <p className="text-[11px] font-semibold text-white/60 tracking-widest uppercase transition-colors">
              {t("Footer.terms")}
            </p>
            <p className="text-[11px] font-semibold text-white/60 tracking-widest uppercase transition-colors">
              {t("Footer.accessibility")}
            </p>
            <p className="text-[11px] font-semibold text-white/60 tracking-widest uppercase transition-colors">
              {t("Footer.cookies")}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
