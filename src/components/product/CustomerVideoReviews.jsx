"use client";

import React, { useState, useEffect, useRef } from "react";
import { Play, Video, X, Maximize2 } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";

function getVideoPoster(url) {
  if (!url || typeof url !== "string") return undefined;
  if (url.includes("cloudinary.com") && url.includes("/video/upload/")) {
    const [prefix, suffix] = url.split("/video/upload/");
    const cleanSuffix = suffix.replace(/\.mp4(\?.*)?$/i, ".jpg");
    return `${prefix}/video/upload/so_0,f_auto,q_auto:eco,w_600/${cleanSuffix}`;
  }
  return undefined;
}

// Only mounts the <video> element (and its metadata request) once the card
// actually scrolls near the viewport — mirrors the pattern already used
// correctly in UseItFeelIt.jsx and tips/Video.jsx, instead of every review
// video firing a request the instant the page renders.
function LazyReviewVideoCard({ videoUrl, posterUrl, onExpand, expandLabel }) {
  const containerRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const element = containerRef.current;
    if (!element) return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: "400px 0px", threshold: 0.1 }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={containerRef}
      className="group relative rounded-xl md:rounded-2xl overflow-hidden bg-slate-950 border border-border-color shadow-md hover:shadow-xl transition-all duration-300 flex flex-col"
    >
      <div className="relative aspect-[9/16] w-full max-h-[280px] sm:max-h-[360px] md:max-h-[440px] bg-slate-950 overflow-hidden flex items-center justify-center">
        {isVisible ? (
          <video
            src={videoUrl}
            poster={posterUrl}
            preload="metadata"
            playsInline
            controls
            className="w-full h-full object-contain bg-black"
          />
        ) : posterUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={posterUrl}
            alt=""
            className="w-full h-full object-contain bg-black"
          />
        ) : null}

        <button
          type="button"
          onClick={onExpand}
          title={expandLabel}
          aria-label={expandLabel}
          className="absolute top-2.5 right-2.5 rtl:right-auto rtl:left-2.5 z-20 w-8 h-8 rounded-full bg-black/60 backdrop-blur-sm text-white flex items-center justify-center opacity-0 group-hover:opacity-100 hover:bg-brand-mint transition-all duration-300 cursor-pointer shadow-md"
        >
          <Maximize2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

export default function CustomerVideoReviews({ customerReviewVideos }) {
  const { t, locale } = useLanguage();
  const isArabic = locale === "ar";
  const [activeVideo, setActiveVideo] = useState(null);

  const videos = Array.isArray(customerReviewVideos)
    ? customerReviewVideos.filter((v) => typeof v === "string" && v.trim() !== "")
    : [];

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setActiveVideo(null);
      }
    };
    if (activeVideo) {
      window.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [activeVideo]);

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
              {t("ProductDetails.videoReviewsTitle")}
            </h2>
            <p className="text-xs sm:text-sm text-text-secondary mt-1">
              {t("ProductDetails.videoReviewsDesc")}
            </p>
          </div>
        </div>

        {/* Video Cards Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
          {videos.map((videoUrl, index) => (
            <LazyReviewVideoCard
              key={index}
              videoUrl={videoUrl}
              posterUrl={getVideoPoster(videoUrl)}
              onExpand={() => setActiveVideo(videoUrl)}
              expandLabel={isArabic ? "تكبير الفيديو" : "Expand Video"}
            />
          ))}
        </div>
      </div>

      {/* Fullscreen Video Modal (Lightbox) */}
      {activeVideo && (
        <div
          onClick={() => setActiveVideo(null)}
          className="fixed inset-0 z-[200] flex items-center justify-center p-4 md:p-8 bg-black/85 backdrop-blur-md animate-fadeIn"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-2xl max-h-[90vh] bg-black rounded-3xl overflow-hidden shadow-2xl border border-white/10 flex flex-col items-center justify-center"
          >
            <button
              type="button"
              onClick={() => setActiveVideo(null)}
              className="absolute top-4 right-4 rtl:right-auto rtl:left-4 z-30 w-10 h-10 rounded-full bg-white/20 text-white hover:bg-red-500 hover:text-white transition-colors flex items-center justify-center cursor-pointer shadow-lg"
              aria-label="Close video"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-full h-full max-h-[85vh] flex items-center justify-center bg-black">
              <video
                src={activeVideo}
                autoPlay
                controls
                playsInline
                className="w-full max-h-[85vh] object-contain rounded-2xl"
              />
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
