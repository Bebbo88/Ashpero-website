"use client";

import React from "react";
import Image from "@/components/ui/AppImage";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import Skeleton from "@/components/ui/Skeleton";

import "swiper/css";
import "swiper/css/effect-cards";
import "swiper/css/pagination";

import styles from "@/animations/HeroSection.animations.module.css";

export function HeroSectionUI({ backgroundSlides }) {
  const canLoop = backgroundSlides.length > 1;

  return (
    <section className={`${styles.root} relative w-full h-[77dvh]  `}>
      <div className="absolute inset-0 z-0">
        {backgroundSlides.length > 0 ? (
          <Swiper
            modules={[Autoplay]}
            loop={canLoop}
            speed={700}
            autoplay={
              canLoop ? { delay: 5000, disableOnInteraction: false } : false
            }
            allowTouchMove={false}
            className="h-full w-full"
          >
            {backgroundSlides.map((slide, idx) => (
              <SwiperSlide
                key={`${slide.id}-${idx}`}
                className="w-full h-full relative"
              >
                <Image
                  src={slide.image}
                  alt="Ashpero Background"
                  fill
                  className="fit "
                  priority={idx === 0}
                  loading={idx === 0 ? "eager" : undefined}
                  fetchPriority={idx === 0 ? "high" : undefined}
                  sizes="100vw"
                />
              </SwiperSlide>
            ))}
          </Swiper>
        ) : (
          <Skeleton className="w-full h-full rounded-none" />
        )}
      </div>

      {/* <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-10 min-h-screen flex flex-col justify-center py-24 sm:py-28 lg:py-16">
        <div className="text-center md:text-start grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-12 lg:gap-20 items-center">
          <div className="relative h-[360px] sm:h-[420px] md:h-[500px] lg:h-[560px] w-full flex items-center justify-center lg:justify-end">
            <Swiper
              effect="cards"
              grabCursor
              modules={[EffectCards, Pagination]}
              pagination={{ clickable: true }}
              className="w-[220px] sm:w-[280px] md:w-[320px] h-[300px] sm:h-[380px] md:h-[480px] hero-swiper"
              dir={isArabic ? "rtl" : "ltr"}
            >
              {heroCards.map((card) => (
                <SwiperSlide
                  key={card.id}
                  className="rounded-2xl p-4 border border-white/20 bg-black/40 backdrop-blur-xl shadow-2xl flex items-center flex-col justify-between"
                >
                  <div className="relative w-full h-[65%] rounded-xl overflow-hidden mb-4 bg-white/5 shadow-inner">
                    {card.badge ? (
                      <div className="absolute top-3 right-3 bg-brand-mint text-hero-badge-text text-[10px] font-bold px-3 py-1 rounded-full z-20 shadow-md">
                        {card.badge}
                      </div>
                    ) : null}
                    <Image
                      src={card.image}
                      alt={card.title}
                      fill
                      className="object-cover transition-transform hover:scale-110 duration-500"
                      sizes="(max-width: 640px) 220px, (max-width: 768px) 280px, 320px"
                    />
                  </div>

                  <div className="flex flex-col gap-1 text-white px-2 mb-2 w-full text-left">
                    <span className="text-[10px] font-bold tracking-widest text-hero-category-muted uppercase">
                      {card.category}
                    </span>
                    <div className="flex justify-between items-end gap-2 mt-1 w-full">
                      <h3 className="font-playfair text-lg md:text-2xl leading-tight text-white truncate">
                        {card.title}
                      </h3>
                      <span className="font-sans font-medium text-brand-mint text-lg md:text-xl shrink-0">
                        {card.price}
                      </span>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
            {isLoading ? (
              <div className="absolute -bottom-10 sm:-bottom-12 left-1/2 -translate-x-1/2 text-xs text-white/70 tracking-wide">
                Loading featured products...
              </div>
            ) : null}
          </div>
        </div>
      </div> */}
    </section>
  );
}
