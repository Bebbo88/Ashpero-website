"use client";

import React from "react";
import Image from "@/components/ui/AppImage";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";

import styles from "@/animations/HeroSection.animations.module.css";
import HeroLoader from "./HeroLoader";

export function HeroSectionUI({ backgroundSlides, isArabic }) {
  const canLoop = backgroundSlides.length > 1;

  return (
    <section className={`${styles.root} relative w-full overflow-hidden select-none`}>
      <div className="w-full relative">
        {backgroundSlides.length > 0 ? (
          <Swiper
            // Force Swiper to fully re-initialize when language changes
            key={isArabic ? "ar" : "en"}
            dir={isArabic ? "rtl" : "ltr"}
            modules={[Autoplay, Pagination]}
            loop={canLoop}
            speed={700}
            autoplay={
              canLoop ? { delay: 5000, disableOnInteraction: false } : false
            }
            pagination={
              canLoop
                ? {
                    clickable: true,
                    dynamicBullets: false,
                    renderBullet: (index, className) => {
                      return `<button type="button" aria-label="Slide ${index + 1}" class="${className}"></button>`;
                    },
                  }
                : false
            }
            allowTouchMove={true}
            initialSlide={0}
            className="w-full relative hero-banner-swiper"
          >
            {backgroundSlides.map((slide, idx) => (
              <SwiperSlide key={`${slide.id}-${idx}`}>
                {slide.image && (
                  <div className="relative w-full overflow-hidden">
                    <Image
                      src={slide.image}
                      alt="Ashperoo Offer Banner"
                      width={1920}
                      height={1080}
                      sizes="100vw"
                      priority={idx === 0}
                      loading={idx === 0 ? "eager" : "lazy"}
                      className="w-full h-auto object-cover"
                    />
                  </div>
                )}
              </SwiperSlide>
            ))}
          </Swiper>
        ) : (
          <HeroLoader />
        )}
      </div>
    </section>
  );
}
