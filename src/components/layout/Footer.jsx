"use client";

import React from "react";
import Image from "@/components/ui/AppImage";
import Link from "next/link";
import { useLanguage } from "../../hooks/useLanguage";
import {
  InstagramIcon,
  XIcon,
  WhatsAppIcon,
  FacebookIcon,
  TiktokIcon,
  LinkedinIcon,
  YoutubeIcon,
} from "@/svgs/ContactUsClient.svgs";

export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="px-10 w-full footer-gradient text-white pt-16 pb-8 border-t border-white/10 ">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 mb-16">
          {/* Column 1: Logo & Description */}
          <div className="flex flex-col gap-6 col-span-1">
            <Link href="/" className="relative h-12 w-48">
              <Image
                src="/assets/logo-white.svg"
                alt="Ashperoo Logo"
                fill
                sizes="192px"
                className="object-contain object-left rtl:object-right"
              />
            </Link>
            <p className="text-sm leading-relaxed text-white/90 pr-4 rtl:pr-0 rtl:pl-4">
              {t("Footer.description")}
            </p>
            {/* Social Icons */}
            <div className="flex flex-wrap items-center gap-4 mt-2">
              <a
                href="https://www.facebook.com/Ashperoo1"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="hover:text-brand-orange transition-transform hover:scale-110"
              >
                <FacebookIcon className="w-5 h-5" />
              </a>
              <a
                href="https://www.instagram.com/ashperoo?igsh=MWo1djBnaGprMjJkMw=="
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="hover:text-brand-orange transition-transform hover:scale-110"
              >
                <InstagramIcon className="w-5 h-5" />
              </a>
              <a
                href="https://www.tiktok.com/@ashperoo1?_r=1&_t=ZS-95gKOyN0MFU"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="TikTok"
                className="hover:text-brand-orange transition-transform hover:scale-110"
              >
                <TiktokIcon className="w-5 h-5" />
              </a>
              <a
                href="https://www.linkedin.com/company/ashperoo-cosmetics-serum/?viewAsMember=true"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="hover:text-brand-orange transition-transform hover:scale-110"
              >
                <LinkedinIcon className="w-5 h-5" />
              </a>
              <a
                href="https://wa.me/201108851834"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp"
                className="hover:text-brand-orange transition-transform hover:scale-110"
              >
                <WhatsAppIcon className="w-5 h-5" />
              </a>
              <a
                href="https://www.youtube.com/@ashperoo1"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="YouTube"
                className="hover:text-brand-orange transition-transform hover:scale-110"
              >
                <YoutubeIcon className="w-5 h-5" />
              </a>
              <a
                href="https://x.com/ashperoo"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="X (Twitter)"
                className="hover:text-brand-orange transition-transform hover:scale-110"
              >
                <XIcon className="w-4 h-4" />
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
              href="/returns"
              className="text-sm font-medium text-white/80 hover:text-white transition-colors"
            >
              {t("Footer.shippingReturns")}
            </Link>

            <Link
              href="/privacy-policy"
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
          <div className="flex flex-col gap-2">
            <h3 className="text-lg font-bold tracking-wider mb-2">
              {t("Footer.location")}
            </h3>
            <address className="not-italic text-sm text-neutral-400 leading-relaxed mb-2">
              شارع 151 , برج الجزيزة 2 , اعلي فرع فودافون
              <br />
              Maadi, Cairo Governorate 11728
            </address>
            <div className="w-full h-32 bg-neutral-800 rounded-lg overflow-hidden border border-neutral-700  relative opacity-80 hover:opacity-100 transition-opacity duration-300">
              <iframe
                title="Ashperoo Location"
                src="https://www.google.com/maps/embed?pb=!1m24!1m12!1m3!1d587.9715772149435!2d31.249601688401594!3d29.960787771412367!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!4m9!3e0!4m3!3m2!1d29.9721464!2d31.2474879!4m3!3m2!1d29.960507!2d31.249933!5e0!3m2!1sen!2seg!4v1776512009253!5m2!1sen!2seg"
                width="100%"
                height="100%"
                style={{
                  border: 0,
                  filter:
                    "invert(100%) hue-rotate(180deg) contrast(1.5) brightness(0.8) grayscale(0.5)",
                }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
          </div>
        </div>

        {/* Bottom Bar with Payment Badges */}
        <div className="border-t border-white/20 pt-8 mt-4 flex flex-col xl:flex-row justify-between items-center gap-6">
          <div className="flex flex-col items-center md:items-start rtl:md:items-end gap-1.5 text-center md:text-left rtl:md:text-right">
            <p className="text-[11px] font-semibold text-white/80 tracking-wider uppercase">
              {t("Footer.copyright")}
            </p>
            <p className="text-xs text-white/70 font-normal leading-relaxed">
              {t("Footer.licenseInfoLine1")}
              <br />
              {t("Footer.licenseInfoLine2")}
            </p>
          </div>

          <div className="flex flex-col md:flex-row items-center gap-4">
            <span className="text-[9px] font-bold text-white/80 tracking-[0.2em] uppercase shrink-0">
              {t("Checkout.securePaymob") || "SECURED VIA PAYMOB"}
            </span>
            <div className="flex items-center flex-wrap justify-center gap-2">
              <Image
                src="/assets/visa.png"
                alt="Visa"
                width={80}
                height={48}
                className="object-contain h-8 md:h-11 w-auto bg-white rounded-md shadow p-1 hover:scale-105 transition-transform"
              />
              <Image
                src="/assets/master.png"
                alt="Mastercard"
                width={80}
                height={48}
                className="object-contain h-8 md:h-11 w-auto bg-white rounded-md shadow p-1 hover:scale-105 transition-transform"
              />
              <Image
                src="/assets/meeza.png"
                alt="Meeza"
                width={80}
                height={48}
                className="object-contain h-8 md:h-11 w-auto bg-white rounded-md shadow p-1 hover:scale-105 transition-transform"
              />
              <Image
                src="/assets/fawry.jpg"
                alt="Fawry"
                width={80}
                height={48}
                className="object-contain h-8 md:h-11 w-auto bg-white rounded-md shadow p-1 hover:scale-105 transition-transform"
              />
              <Image
                src="/assets/aman.jpg"
                alt="Aman"
                width={80}
                height={48}
                className="object-contain h-8 md:h-11 w-auto bg-white rounded-md shadow p-1 hover:scale-105 transition-transform object-center"
              />
              <Image
                src="/assets/vodacash.png"
                alt="Vodafone Cash"
                width={80}
                height={48}
                className="object-contain h-8 md:h-11 w-auto bg-white rounded-md shadow p-1 hover:scale-105 transition-transform"
              />
              <Image
                src="/assets/orangecash.png"
                alt="Orange Cash"
                width={80}
                height={48}
                className="object-contain h-8 md:h-11 w-auto bg-white rounded-md shadow p-1 hover:scale-105 transition-transform"
              />
              <Image
                src="/assets/e&money.png"
                alt="E& Money"
                width={80}
                height={48}
                className="object-contain h-8 md:h-11 w-auto bg-white rounded-md shadow p-1 hover:scale-105 transition-transform"
              />
              <Image
                src="/assets/wepay.png"
                alt="WE Pay"
                width={80}
                height={48}
                className="object-contain h-8 md:h-11 w-auto bg-white rounded-md shadow p-1 hover:scale-105 transition-transform"
              />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
