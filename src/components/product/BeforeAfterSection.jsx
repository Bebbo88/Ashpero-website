"use client";

import React, { useState } from "react";
import Image from "@/components/ui/AppImage";
import { useLanguage } from "@/hooks/useLanguage";

export default function BeforeAfterSection({ beforeAfterImages }) {
  const { locale } = useLanguage();
  const isArabic = locale === "ar";
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);

  const before = beforeAfterImages?.before;
  const after = beforeAfterImages?.after;

  if (!before || !after) {
    return null;
  }

  const handleMove = (clientX, rect) => {
    const x = clientX - rect.left;
    let percentage = (x / rect.width) * 100;
    if (percentage < 0) percentage = 0;
    if (percentage > 100) percentage = 100;
    setSliderPosition(percentage);
  };

  const handleTouchMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    handleMove(e.touches[0].clientX, rect);
  };

  const handleMouseMove = (e) => {
    if (!isDragging && e.type !== "click") return;
    const rect = e.currentTarget.getBoundingClientRect();
    handleMove(e.clientX, rect);
  };

  return (
    <section className="w-full py-12 bg-bg-secondary/40 border-y border-border-color my-12 rounded-3xl px-4 sm:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-playfair font-bold text-text-primary">
            {isArabic ? "النتائج وقبل وبعد الاستخدام" : "Real Results: Before & After"}
          </h2>
          <p className="text-xs sm:text-sm text-text-secondary mt-2">
            {isArabic
              ? "اسحب السلايدر لمشاهدة الفرق المذهل والنتائج الفعالة"
              : "Drag the slider to see the visible difference"}
          </p>
        </div>

        {/* Interactive Comparison Container */}
        <div
          className="relative w-full aspect-[4/3] sm:aspect-[16/9] max-h-[500px] rounded-2xl overflow-hidden shadow-xl select-none cursor-ew-resize touch-none border border-border-color"
          onMouseDown={() => setIsDragging(true)}
          onMouseUp={() => setIsDragging(false)}
          onMouseLeave={() => setIsDragging(false)}
          onMouseMove={handleMouseMove}
          onTouchMove={handleTouchMove}
          onClick={(e) => handleMove(e.clientX, e.currentTarget.getBoundingClientRect())}
        >
          {/* After Image (Background / Full Width) */}
          <div className="absolute inset-0 w-full h-full">
            <Image
              src={after}
              alt="After Result"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 800px"
            />
            <span className="absolute bottom-4 right-4 bg-brand-mint text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-md uppercase tracking-wider">
              {isArabic ? "بعد الاستخدام" : "After"}
            </span>
          </div>

          {/* Before Image (Clipped Overlay) */}
          <div
            className="absolute inset-y-0 left-0 overflow-hidden"
            style={{ width: `${sliderPosition}%` }}
          >
            <div className="absolute inset-0 w-full h-full min-w-[300px] sm:min-w-[600px] md:min-w-[800px]">
              <Image
                src={before}
                alt="Before Result"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 800px"
              />
            </div>
            <span className="absolute bottom-4 left-4 bg-black/70 text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-md uppercase tracking-wider">
              {isArabic ? "قبل الاستخدام" : "Before"}
            </span>
          </div>

          {/* Slider Divider Bar */}
          <div
            className="absolute top-0 bottom-0 w-1 bg-white shadow-[0_0_12px_rgba(0,0,0,0.5)] cursor-ew-resize pointer-events-none"
            style={{ left: `${sliderPosition}%` }}
          >
            <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-9 h-9 rounded-full bg-white text-brand-dark flex items-center justify-center shadow-lg border-2 border-brand-mint">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2.5"
                  d="M8 7l-5 5 5 5M16 7l5 5-5 5"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
