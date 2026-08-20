"use client";

import React, { useEffect, useRef, useState } from "react";
import { useLanguage } from "../../hooks/useLanguage";
import ScrollAnimationWrapper from "../ui/ScrollAnimationWrapper";

const products = [
  {
    id: 1,
    video: "/assets/hyaluronic-video.mp4",
    nameKey: "product2",
  },
  {
    id: 2,
    video: "/assets/collagen-video.mp4",
    nameKey: "product3",
  },
  {
    id: 3,
    video: "/assets/vitamin-c-video.mp4",
    nameKey: "product1",
  },
  {
    id: 4,
    video: "/assets/retinol-video.mp4",
    nameKey: "product4",
  },
];

function LazyVideoCard({ product, t }) {
  const containerRef = useRef(null);
  const videoRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const element = containerRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (videoRef.current) {
            videoRef.current.play().catch(() => {});
          }
        } else {
          if (videoRef.current) {
            videoRef.current.pause();
          }
        }
      },
      { rootMargin: "150px 0px", threshold: 0.1 }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={containerRef}
      className="flex justify-center"
      style={{ perspective: "600px", perspectiveOrigin: "50% 50%" }}
    >
      <div
        className="relative w-full max-w-[240px] md:max-w-[300px] lg:max-w-[340px] group cursor-pointer"
        style={{
          transformStyle: "preserve-3d",
          transform: "rotateY(-14deg) rotateX(4deg)",
          transition: "transform 0.5s cubic-bezier(0.23, 1, 0.32, 1)",
        }}
        onMouseEnter={(event) => {
          event.currentTarget.style.transform =
            "rotateY(-2deg) rotateX(1deg) translateY(-8px)";
        }}
        onMouseLeave={(event) => {
          event.currentTarget.style.transform =
            "rotateY(-14deg) rotateX(4deg)";
        }}
      >
        {[...Array(10)].map((_, index) => (
          <div
            key={index}
            className="absolute inset-0 rounded-2xl"
            style={{
              transform: `translateZ(${-(index + 1) * 3}px)`,
              backgroundColor:
                index < 5
                  ? `rgba(var(--ds-video-depth-rgb), ${0.12 + index * 0.04})`
                  : `rgba(var(--ds-video-depth-rgb), ${0.4 - index * 0.02})`,
            }}
          />
        ))}

        <div
          className="relative w-full aspect-[9/16] rounded-2xl overflow-hidden video-card-shadow"
          style={{ transform: "translateZ(0px)" }}
        >
          <video
            ref={videoRef}
            src={product.video}
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          />

          <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-transparent pointer-events-none rounded-2xl" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

          <div className="absolute bottom-0 left-0 right-0 p-5 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 text-center">
            <p className="text-white font-playfair text-lg md:text-xl font-medium drop-shadow-lg">
              {t(`UseItFeelIt.products.${product.nameKey}`)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function UseItFeelIt() {
  const { t } = useLanguage();

  return (
    <section className="w-full py-20 bg-bg-primary overflow-hidden">
      <div className="container mx-auto px-6 lg:px-10">
        <ScrollAnimationWrapper animation="fade-up">
          <div className="flex flex-col items-center justify-center mb-14 text-center">
            <h2 className="font-playfair text-3xl md:text-4xl lg:text-5xl text-text-primary font-medium tracking-wide">
              {t("UseItFeelIt.title")}
            </h2>
            <div className="w-16 h-[3px] bg-brand-orange rounded-full mt-5" />
          </div>
        </ScrollAnimationWrapper>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 max-w-7xl mx-auto py-10">
          {products.map((product, index) => (
            <ScrollAnimationWrapper
              key={product.id}
              animation={index < 2 ? "slide-from-right" : "slide-from-left"}
              delay={index * 0.1}
            >
              <LazyVideoCard product={product} t={t} />
            </ScrollAnimationWrapper>
          ))}
        </div>
      </div>
    </section>
  );
}

