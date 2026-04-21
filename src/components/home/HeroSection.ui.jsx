"use client";

import React from "react";
import Image from "@/components/ui/AppImage";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";

import "swiper/css";

import styles from "@/animations/HeroSection.animations.module.css";
import HeroLoader from "./HearoLoader";

export function HeroSectionUI({ backgroundSlides }) {
  const canLoop = backgroundSlides.length > 1;
  const startIdx = canLoop ? 1 : 0;

  return (
    <section className={`${styles.root} relative w-full`}>
      <div className="w-full">
        {backgroundSlides.length > 0 ? (
          <Swiper
            modules={[Autoplay]}
            loop={canLoop}
            speed={700}
            autoplay={
              canLoop ? { delay: 5000, disableOnInteraction: false } : false
            }
            allowTouchMove={false}
            initialSlide={startIdx}
            className="w-full"
          >
            {backgroundSlides.map((slide, idx) => (
              <SwiperSlide key={`${slide.id}-${idx}`}>
                {slide.image && (
                  <Image
                    src={slide.image}
                    alt="Ashpero Background"
                    width={1920}
                    height={1080}
                    sizes="100vw"
                    // 🔥 أهم تعديل
                    priority={idx === startIdx}
                    // 🔥 Lazy لباقي الصور
                    loading={idx === startIdx ? "eager" : "lazy"}
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
