"use client";

import React, { useState, useRef, useCallback } from "react";
import Image from "@/components/ui/AppImage";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { useLanguage } from "@/hooks/useLanguage";
import { ZoomIn, ZoomOut, Sparkles } from "lucide-react";

export default function ProductGallery({ images = [], productName = "" }) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomPos, setZoomPos] = useState({ x: 50, y: 50 });
  const [isMobileZoomActive, setIsMobileZoomActive] = useState(false);

  const swiperRef = useRef(null);
  const imageContainerRef = useRef(null);
  const { locale } = useLanguage();
  const isArabic = locale === "ar";

  const handleThumbnailClick = (idx) => {
    setSelectedIndex(idx);
    setIsZoomed(false);
    setIsMobileZoomActive(false);
    if (swiperRef.current && swiperRef.current.swiper) {
      swiperRef.current.swiper.slideTo(idx);
    }
  };

  const handleMouseMove = useCallback((e) => {
    if (!imageContainerRef.current) return;
    const rect = imageContainerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100));
    const y = Math.max(0, Math.min(100, ((e.clientY - rect.top) / rect.height) * 100));
    setZoomPos({ x, y });
  }, []);

  const handleMouseEnter = useCallback(() => {
    setIsZoomed(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsZoomed(false);
    setZoomPos({ x: 50, y: 50 });
  }, []);

  const handleTouchMove = useCallback((e) => {
    if (!isMobileZoomActive || !imageContainerRef.current) return;
    const touch = e.touches[0];
    const rect = imageContainerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(100, ((touch.clientX - rect.left) / rect.width) * 100));
    const y = Math.max(0, Math.min(100, ((touch.clientY - rect.top) / rect.height) * 100));
    setZoomPos({ x, y });
  }, [isMobileZoomActive]);

  const toggleMobileZoom = (e) => {
    e.stopPropagation();
    setIsMobileZoomActive((prev) => !prev);
    setIsZoomed((prev) => !prev);
  };

  const currentImage = images[selectedIndex] || images[0] || "/assets/photo1.jpeg";

  return (
    <div className="flex flex-col-reverse md:flex-row gap-4 lg:items-start select-none">
      {/* Thumbnails */}
      <div className="flex md:flex-col gap-3 overflow-x-auto md:overflow-y-auto md:max-h-[520px] scrollbar-hide no-scrollbar [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] py-1">
        {images.map((img, idx) => (
          <button
            key={idx}
            type="button"
            aria-label={`View ${productName} image ${idx + 1}`}
            onClick={() => handleThumbnailClick(idx)}
            className={`relative shrink-0 w-16 h-16 md:w-20 md:h-20 rounded-xl overflow-hidden cursor-pointer border-2 transition-all duration-200 ${
              selectedIndex === idx
                ? "border-brand-mint shadow-md ring-2 ring-brand-mint/30 scale-105"
                : "border-transparent opacity-70 hover:opacity-100 hover:border-gray-300 dark:hover:border-gray-600"
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

      {/* Main Image with Interactive Inner Zoom */}
      <div
        ref={imageContainerRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onTouchMove={handleTouchMove}
        className={`relative w-full flex-1 aspect-square md:aspect-[4/5] max-h-[440px] md:max-h-[560px] rounded-2xl overflow-hidden bg-brand-creme dark:bg-white/5 group ${
          isZoomed || isMobileZoomActive ? "cursor-zoom-in" : "cursor-default"
        }`}
      >
        {/* Floating Zoom Indicator / Mobile Toggle */}
        <div className="absolute top-3 right-3 z-30 flex items-center gap-1.5 pointer-events-auto">
          <button
            type="button"
            onClick={toggleMobileZoom}
            aria-label="Toggle Image Zoom"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/50 hover:bg-black/70 backdrop-blur-md text-white text-[11px] font-medium shadow-md transition-all duration-200 cursor-pointer"
          >
            {isZoomed || isMobileZoomActive ? (
              <>
                <ZoomOut className="w-3.5 h-3.5 text-brand-mint" />
                <span className="hidden sm:inline">
                  {isArabic ? "تصغير" : "Reset"}
                </span>
              </>
            ) : (
              <>
                <ZoomIn className="w-3.5 h-3.5 text-brand-mint" />
                <span className="hidden sm:inline">
                  {isArabic ? "تكبير التفاصيل" : "Hover to zoom"}
                </span>
              </>
            )}
          </button>
        </div>

        {/* Desktop & Mobile Interactive Zoom Viewer */}
        <div className="relative w-full h-full overflow-hidden">
          <Swiper
            ref={swiperRef}
            key={locale}
            dir={isArabic ? "rtl" : "ltr"}
            onSlideChange={(swiper) => {
              setSelectedIndex(swiper.activeIndex);
              setIsZoomed(false);
              setIsMobileZoomActive(false);
            }}
            allowTouchMove={!isMobileZoomActive}
            className="w-full h-full"
          >
            {images.map((img, idx) => (
              <SwiperSlide key={idx} className="relative w-full h-full overflow-hidden">
                <div
                  className="w-full h-full relative overflow-hidden"
                  style={{
                    transformOrigin: `${zoomPos.x}% ${zoomPos.y}%`,
                    transform: (isZoomed || isMobileZoomActive) && selectedIndex === idx ? "scale(2.2)" : "scale(1)",
                    transition: (isZoomed || isMobileZoomActive)
                      ? "transform 0.08s ease-out"
                      : "transform 0.35s cubic-bezier(0.4, 0, 0.2, 1)",
                  }}
                >
                  <Image
                    src={img}
                    alt={`${productName} view ${idx + 1}`}
                    fill
                    className="object-cover pointer-events-none"
                    sizes="(max-width: 768px) 100vw, 50vw"
                    priority={idx === 0}
                    loading={idx === 0 ? "eager" : "lazy"}
                  />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </div>
  );
}
