"use client";

import React, { useEffect, useRef, useState } from "react";
import { useLanguage } from "../../hooks/useLanguage";
import ScrollAnimationWrapper from "../ui/ScrollAnimationWrapper";
import Image from "../ui/AppImage";

// These used to be raw local MP4s (2.8-5.1 MB each, ~14.6 MB total) served
// with no compression/format negotiation. The files are stored as a
// 1280x720 pixel grid but carry a 9:16 Display Aspect Ratio override — the
// raw pixels are landscape, but every video player (correctly) stretches
// them to portrait on playback, which is why the original <video> tag (no
// Cloudinary involved) displayed them correctly. Cloudinary's transform
// pipeline doesn't honor that DAR override — treating the raw 1280x720 as
// literally landscape, plain resizing distorted it and c_fill cropped it
// wrong. c_scale (not crop) forced back to ar_9:16 reproduces the same
// stretch a browser does natively, restoring the original look.
const CLOUDINARY_VIDEO_TRANSFORM = "c_scale,ar_9:16,w_720,q_auto:good,f_auto";

// These four clips are the only media the site addresses by hand - everything
// else carries a full URL from the database. That makes this the one place a
// Cloudinary account change has to be applied manually.
const CLOUDINARY_CLOUD_NAME = "nsria8zb";

function buildOptimizedVideoUrl(publicId) {
  return `https://res.cloudinary.com/${CLOUDINARY_CLOUD_NAME}/video/upload/${CLOUDINARY_VIDEO_TRANSFORM}/Ashpero/Home/${publicId}.mp4`;
}

function buildVideoPosterUrl(publicId) {
  return `https://res.cloudinary.com/${CLOUDINARY_CLOUD_NAME}/video/upload/so_0,${CLOUDINARY_VIDEO_TRANSFORM}/Ashpero/Home/${publicId}.jpg`;
}

const products = [
  {
    id: 1,
    video: buildOptimizedVideoUrl("hyaluronic-video"),
    poster: buildVideoPosterUrl("hyaluronic-video"),
    nameKey: "product2",
  },
  {
    id: 2,
    video: buildOptimizedVideoUrl("collagen-video"),
    poster: buildVideoPosterUrl("collagen-video"),
    nameKey: "product3",
  },
  {
    id: 3,
    video: buildOptimizedVideoUrl("vitamin-c-video"),
    poster: buildVideoPosterUrl("vitamin-c-video"),
    nameKey: "product1",
  },
  {
    id: 4,
    video: buildOptimizedVideoUrl("retinol-video"),
    poster: buildVideoPosterUrl("retinol-video"),
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
      // Generous lead margin so the video has time to buffer before it's
      // actually scrolled into view, instead of only starting to load the
      // instant it appears (which is what showed a black box briefly).
      { rootMargin: "600px 0px", threshold: 0.1 }
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
          {/* object-cover, same as the original — fills the card, cropping
              the 16:9 source the same way it always did. */}
          {/* Poster stays mounted underneath the whole time — the video is
              layered on top only once visible, so there's never a frame with
              neither one painted (which is what showed as a black box). */}
          <Image
            src={product.poster}
            alt=""
            fill
            sizes="(max-width: 768px) 240px, (max-width: 1024px) 300px, 340px"
            className="object-cover"
          />

          {isVisible && (
            <video
              ref={videoRef}
              src={product.video}
              poster={product.poster}
              autoPlay
              muted
              loop
              playsInline
              preload="auto"
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            />
          )}

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

