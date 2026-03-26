"use client";

import React from "react";
import Image from "next/image";
import { useLanguage } from "../../hooks/useLanguage";

export default function HeritageCTA() {
  const { t } = useLanguage();

  const stats = [
    { valueKey: "stat1Value", labelKey: "stat1Label" },
    { valueKey: "stat2Value", labelKey: "stat2Label" },
    { valueKey: "stat3Value", labelKey: "stat3Label" },
  ];

  return (
    <section className="w-full bg-bg-primary">
      <div className="container mx-auto px-6 lg:px-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-20 items-center">
          {/* Left: Photo with overlay card */}
          <div className="relative">
            <div className="relative aspect-[4/5] rounded-2xl overflow-hidden">
              <Image
                src="/assets/CTA.png"
                alt="Ashpero Heritage"
                fill
                className="object-contain"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
          </div>

          {/* Right: Heritage Content */}
          <div className="flex flex-col pt-6 md:pt-0">
            <h2 className="font-playfair text-3xl md:text-4xl lg:text-[42px] text-text-primary leading-tight mb-8">
              {t("Heritage.titleLine1")}
              <br />
              <span className="font-bold">{t("Heritage.titleLine2")}</span>
            </h2>

            <p className="text-text-secondary text-sm md:text-[15px] leading-[1.8] mb-5">
              {t("Heritage.paragraph1")}
            </p>
            <p className="text-text-secondary text-sm md:text-[15px] leading-[1.8] mb-10">
              {t("Heritage.paragraph2")}
            </p>

            {/* Stats Row */}
            <div className="flex items-start gap-8 md:gap-12">
              {stats.map((stat, i) => (
                <div key={i} className="flex flex-col">
                  <span className="text-brand-orange font-bold text-xl md:text-2xl mb-1">
                    {t(`Heritage.${stat.valueKey}`)}
                  </span>
                  <span className="text-text-secondary text-[10px] md:text-xs font-bold tracking-[0.15em] uppercase">
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
