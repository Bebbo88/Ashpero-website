"use client";

import React from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCards, Autoplay, Pagination } from "swiper/modules";

import "swiper/css";
import "swiper/css/effect-cards";
import "swiper/css/pagination";

import styles from "@/animations/HeroSection.animations.module.css";

export function HeroSectionUI({ t, isArabic, heroCards, backgroundSlides, heroStats }) {
  return (
    <section className={`${styles.root} relative w-full h-screen min-h-[800px] overflow-hidden bg-[#1A3C28]`}>
      <div className="absolute inset-0 z-0">
        <Swiper modules={[Autoplay]} loop speed={15000} autoplay={{ delay: 0, disableOnInteraction: false }} allowTouchMove={false} className="h-full w-full opacity-60 mix-blend-multiply">
          {backgroundSlides.map((slide, idx) => (
            <SwiperSlide key={`${slide}-${idx}`} className="w-full h-full relative">
              <Image src="/assets/background.jpg" alt="Ashpero Background" fill className="object-cover" priority={idx === 0} />
            </SwiperSlide>
          ))}
        </Swiper>
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-bg-primary/20 pointer-events-none z-10" />
      </div>

      <div className="px-15 relative z-10 container mx-auto px-6 h-full flex flex-col justify-center">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center mt-10 md:mt-0">
          <div className={`flex flex-col gap-6 text-white pt-10 lg:pt-0 ${styles.fadeInUp}`}>
            <span className="text-brand-mint font-bold tracking-[0.2em] text-xs md:text-sm uppercase">{t("Hero.subtitle")}</span>
            <h1 className="font-playfair text-5xl md:text-7xl lg:text-[80px] font-bold leading-[1.1]">
              {t("Hero.titleLine1")}
              <br />
              <span className="italic font-light">{t("Hero.titleLine2")}</span>
            </h1>
            <p className="text-white/80 max-w-lg leading-relaxed text-sm md:text-base pr-4">{t("Hero.description")}</p>

            <div className="flex flex-wrap items-center gap-4 mt-6">
              <button className="bg-brand-mint text-[#0F3120] px-8 py-4 rounded-sm font-bold text-sm hover:bg-white transition-colors flex items-center gap-2 group cursor-pointer shadow-lg shadow-brand-mint/20">
                {t("Hero.shopCollection")}
                <span className={`text-lg transition-transform ${isArabic ? "group-hover:-translate-x-1 rotate-180" : "group-hover:translate-x-1"}`}>{"\u2192"}</span>
              </button>
              <button className="border border-white/30 text-white px-8 py-4 rounded-sm font-bold text-sm hover:bg-white/10 transition-colors cursor-pointer">{t("Hero.theScience")}</button>
            </div>

            <div className="flex flex-wrap items-center gap-8 md:gap-16 mt-8 md:mt-16 pt-8 border-t border-white/20">
              {heroStats.map((stat) => (
                <div key={stat.value} className="flex flex-col">
                  <span className="text-3xl font-bold font-playfair">{stat.value}</span>
                  <span className="text-[10px] tracking-widest text-[#B2C4D6] mt-1">{stat.label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="relative h-[450px] md:h-[550px] w-full flex items-center justify-center lg:justify-end">
            <Swiper effect="cards" grabCursor modules={[EffectCards, Pagination]} pagination={{ clickable: true }} className="w-[280px] md:w-[320px] h-[400px] md:h-[480px] hero-swiper" dir={isArabic ? "rtl" : "ltr"}>
              {heroCards.map((card) => (
                <SwiperSlide key={card.id} className="rounded-2xl p-4 border border-white/20 bg-black/40 backdrop-blur-xl shadow-2xl flex items-center flex-col justify-between">
                  <div className="relative w-full h-[65%] rounded-xl overflow-hidden mb-4 bg-white/5 shadow-inner">
                    {card.badgeKey ? <div className="absolute top-3 right-3 bg-brand-mint text-[#0F3120] text-[10px] font-bold px-3 py-1 rounded-full z-20 shadow-md">{t(`Hero.cards.${card.badgeKey}`)}</div> : null}
                    <Image src={card.image} alt={t(`Hero.cards.${card.titleKey}`)} fill className="object-cover transition-transform hover:scale-110 duration-500" sizes="(max-width: 768px) 280px, 320px" />
                  </div>

                  <div className="flex flex-col gap-1 text-white px-2 mb-2 w-full text-left">
                    <span className="text-[10px] font-bold tracking-widest text-[#B2C4D6] uppercase">{t(`Hero.cards.${card.labelKey}`)}</span>
                    <div className="flex justify-between items-end gap-2 mt-1 w-full">
                      <h3 className="font-playfair text-xl md:text-2xl leading-tight text-white">{t(`Hero.cards.${card.titleKey}`)}</h3>
                      <span className="font-sans font-medium text-brand-mint text-xl">{card.price}</span>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>
      </div>
    </section>
  );
}
