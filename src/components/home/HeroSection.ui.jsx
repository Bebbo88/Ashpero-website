"use client";

import React from "react";
import Image from "@/components/ui/AppImage";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";

import "swiper/css";

import styles from "@/animations/HeroSection.animations.module.css";
import HeroLoader from "./HeroLoader";

export function HeroSectionUI({ backgroundSlides, isArabic }) {
  const canLoop = backgroundSlides.length > 1;

  return (
    <section className={`${styles.root} relative w-full`}>
      <div className="w-full">
        {backgroundSlides.length > 0 ? (
          <Swiper
            // Force Swiper to fully re-initialize when language changes
            // This is strictly required so Swiper recalculates its internal
            // RTL/LTR coordinates and prevents swiping into blank space.
            key={isArabic ? "ar" : "en"}
            dir={isArabic ? "rtl" : "ltr"}
            modules={[Autoplay]}
            loop={canLoop}
            speed={700}
            autoplay={
              canLoop ? { delay: 5000, disableOnInteraction: false } : false
            }
            allowTouchMove={false}
            initialSlide={0}
            className="w-full"
          >
            {backgroundSlides.map((slide, idx) => (
              <SwiperSlide key={`${slide.id}-${idx}`}>
                {slide.image && (
                  <Image
                    src={slide.image}
                    alt="Ashperoo Background"
                    width={1920}
                    height={1080}
                    sizes="100vw"
                    priority={idx === 0}
                    loading={idx === 0 ? "eager" : "lazy"}
                    className="w-full h-auto object-cover"
                  />
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
