"use client";

import React, { useState, useRef } from "react";
import Image from "@/components/ui/AppImage";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { useLanguage } from "@/hooks/useLanguage";

export default function ProductGallery({ images, productName }) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const swiperRef = useRef(null);
  const { locale } = useLanguage();

  const isArabic = locale === "ar";

  const handleThumbnailClick = (idx) => {
    setSelectedIndex(idx);
    if (swiperRef.current && swiperRef.current.swiper) {
      swiperRef.current.swiper.slideTo(idx);
    }
  };

  return (
    <div className="flex flex-col-reverse md:flex-row gap-4 lg:items-start">
      {/* Thumbnails */}
      <div className="flex md:flex-col gap-3 overflow-x-auto md:overflow-y-auto md:max-h-[520px] scrollbar-hide">
        {images.map((img, idx) => (
          <button
            key={idx}
            aria-label={`View ${productName} image ${idx + 1}`}
            onClick={() => handleThumbnailClick(idx)}
            className={`relative shrink-0 w-16 h-16 md:w-20 md:h-20 rounded-xl overflow-hidden cursor-pointer border-2 transition-all duration-200 ${
              selectedIndex === idx
                ? "border-brand-mint shadow-[0_0_0_1px_var(--color-brand-mint)]"
                : "border-transparent hover:border-gray-300 dark:hover:border-gray-600"
            }`}
          >
            <Image
              src={img}
              alt={`${productName} ${idx + 1}`}
              fill
              loading="lazy"
              className="object-cover"
              sizes="80px"
            />
          </button>
        ))}
      </div>

      {/* Main Image */}
      <div className="relative w-full flex-1 aspect-square md:aspect-[4/5] max-h-[440px] md:max-h-[560px] rounded-2xl overflow-hidden bg-brand-creme dark:bg-white/5 group">
        <Swiper
          ref={swiperRef}
          key={locale}
          dir={isArabic ? "rtl" : "ltr"}
          onSlideChange={(swiper) => setSelectedIndex(swiper.activeIndex)}
          className="w-full h-full"
          grabCursor
        >
          {images.map((img, idx) => (
            <SwiperSlide key={idx} className="relative w-full h-full">
              <Image
                src={img}
                alt={`${productName} view ${idx + 1}`}
                fill
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority={idx === 0}
                loading={idx === 0 ? "eager" : "lazy"}
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
}
