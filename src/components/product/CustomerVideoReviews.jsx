"use client";

import React, { useState } from "react";
import { Play, Video } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";

export default function CustomerVideoReviews({ customerReviewVideos }) {
  const { locale } = useLanguage();
  const isArabic = locale === "ar";
  const [activeVideo, setActiveVideo] = useState(null);

  const videos = Array.isArray(customerReviewVideos)
    ? customerReviewVideos.filter((v) => typeof v === "string" && v.trim() !== "")
    : [];

  if (videos.length === 0) {
    return null;
  }

  return (
    <section className="w-full py-10 my-10 bg-bg-primary">
      <div className="max-w-6xl mx-auto px-4">
        {/* Section Header */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl bg-brand-mint/10 text-brand-mint flex items-center justify-center border border-brand-mint/20">
            <Video className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-2xl md:text-3xl font-playfair font-bold text-text-primary">
              {isArabic ? "تجارب ومراجعات العملاء" : "Customer Video Reviews"}
            </h2>
            <p className="text-xs sm:text-sm text-text-secondary mt-1">
              {isArabic
                ? "شاهد آراء وتجارب عميلاتنا الحقيقية مع هذا المنتج"
                : "Watch real customer feedback and experiences"}
            </p>
          </div>
        </div>

        {/* Video Cards Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
          {videos.map((videoUrl, index) => (
            <div
              key={index}
              className="group relative rounded-xl md:rounded-2xl overflow-hidden bg-black/90 border border-border-color shadow-md hover:shadow-xl transition-all duration-300 flex flex-col"
            >
              <div className="relative aspect-[6/9] w-full max-h-[220px] sm:max-h-[300px] md:max-h-[400px] bg-slate-900 overflow-hidden flex items-center justify-center">
                <video
                  src={videoUrl}
                  preload="none"
                  playsInline
                  controls
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
