"use client";

import React from "react";
import Image from "@/components/ui/AppImage";
import { useLanguage } from "../../hooks/useLanguage";

export default function HeritageCTA() {
  const { t, locale } = useLanguage();
  const isArabic = locale === "ar";

  const stats = [
    { valueKey: "stat1Value", labelKey: "stat1Label" },
    { valueKey: "stat2Value", labelKey: "stat2Label" },
    { valueKey: "stat3Value", labelKey: "stat3Label" },
  ];

  return (
    <section className="w-full bg-bg-primary py-8 md:py-10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10 lg:gap-14 items-center">
          {/* Left: Photo with overlay card */}
          <div className="relative mx-auto w-full max-w-[420px] md:max-w-none">
            <div className="w-full rounded-2xl overflow-hidden">
              <Image
                src="/assets/heritage.jpg"
                alt="Ashpero Heritage"
                width={800}
                height={1000}
                className="w-full h-auto object-cover p-2 sm:p-3"
                sizes="(max-width: 768px) 90vw, 50vw"
              />
            </div>
          </div>

          {/* Right: Heritage Content */}
          <div
            className={`flex flex-col pt-2 md:pt-0 text-center md:text-start ${isArabic ? "md:text-right" : ""}`}
          >
            <h2 className="font-playfair text-2xl sm:text-3xl md:text-4xl lg:text-[42px] text-text-primary leading-tight mb-6 md:mb-8">
              <span className="block md:inline">
                {t("Heritage.titleLine1")}
              </span>
              <span className="hidden md:inline">{` `}</span>
              <span className="block md:inline font-bold">
                {t("Heritage.titleLine2")}
              </span>
            </h2>

            <p className="text-text-secondary text-sm md:text-[15px] leading-[1.8] mb-4 md:mb-5">
              {t("Heritage.paragraph1")}
            </p>
            <p className="text-text-secondary text-sm md:text-[15px] leading-[1.8] mb-8 md:mb-10">
              {t("Heritage.paragraph2")}
            </p>

            {/* Stats Row */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-5 sm:gap-6 md:gap-8">
              {stats.map((stat, i) => (
                <div
                  key={i}
                  className={`flex flex-col items-center min-w-0 ${isArabic ? "md:items-end" : "md:items-start"}`}
                >
                  <span className="text-brand-orange font-bold text-xl md:text-2xl mb-1">
                    {t(`Heritage.${stat.valueKey}`)}
                  </span>
                  <span className="text-text-secondary text-[10px] md:text-xs font-bold tracking-[0.08em] md:tracking-[0.15em] uppercase break-words">
                    {t(`Heritage.${stat.labelKey}`)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
