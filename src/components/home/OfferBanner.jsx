"use client";

import React from "react";
import Image from "next/image";
import { useLanguage } from "../../hooks/useLanguage";

export default function OfferBanner() {
  const { t } = useLanguage();

  return (
    <section className="w-full px-6 lg:px-10 py-10">
      <div className="relative w-full rounded-3xl overflow-hidden min-h-[320px] md:min-h-[380px] flex items-center">
        {/* Background Image */}
        <div className="absolute inset-0">
          <Image
            src="/assets/background.jpg"
            alt="Offer Background"
            fill
            className="object-cover"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-black/40" />
        </div>

        {/* Content */}
        <div className="relative z-10 px-8 md:px-14 lg:px-20 py-12 max-w-2xl">
          <span className="text-brand-orange font-bold tracking-[0.2em] text-xs uppercase mb-4 block">
            {t("Offer.label")}
          </span>
          <h2 className="font-playfair text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-[1.15] mb-5">
            {t("Offer.title")}
          </h2>
          <p className="text-white/70 text-sm md:text-base leading-relaxed mb-8 max-w-md">
            {t("Offer.description")}
          </p>
          <button className="bg-brand-orange text-white px-8 py-3.5 rounded-full font-bold text-sm hover:bg-orange-600 transition-colors cursor-pointer shadow-lg shadow-brand-orange/30">
            {t("Offer.cta")}
          </button>
        </div>
      </div>
    </section>
  );
}
