"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useLanguage } from "../../hooks/useLanguage";

const products = [
  { id: 1, video: "/assets/الهيالورنيك - فيديو 1.mp4", nameKey: "product2" },
  { id: 2, video: "/assets/كولاجين - فيديو 2.mp4", nameKey: "product3" }, // Maybe product3 is close to collagen or gold, whatever
  { id: 3, video: "/assets/فيتامين سي - فيديو 3.mp4", nameKey: "product1" }, // Vitamin C
  { id: 4, video: "/assets/الريتينول - فيديو 4.mp4", nameKey: "product4" }, // Retinol
];

export default function UseItFeelIt() {
  const { t } = useLanguage();

  return (
    <section className="w-full py-20 bg-bg-primary overflow-hidden">
      <div className="container mx-auto px-6 lg:px-10">
        {/* Section Header */}
        <div className="flex flex-col items-center justify-center mb-14 text-center">
          <h2 className="font-playfair text-3xl md:text-4xl lg:text-5xl text-text-primary font-medium tracking-wide">
            {t("UseItFeelIt.title")}
          </h2>
          <div className="w-16 h-[3px] bg-brand-orange rounded-full mt-5"></div>
        </div>

        {/* 4 Product Videos Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 md:gap-16 max-w-6xl mx-auto py-10">
          {products.map((product) => (
            <div
              key={product.id}
              className="flex justify-center"
              style={{ perspective: "600px", perspectiveOrigin: "50% 50%" }}
            >
              {/* Outer tilt wrapper — holds the 3D angle */}
              <div
                className="relative w-full max-w-[240px] md:max-w-[260px] group cursor-pointer"
                style={{
                  transformStyle: "preserve-3d",
                  transform: "rotateY(-14deg) rotateX(4deg)",
                  transition: "transform 0.5s cubic-bezier(0.23, 1, 0.32, 1)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform =
                    "rotateY(-2deg) rotateX(1deg) translateY(-8px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform =
                    "rotateY(-14deg) rotateX(4deg)";
                }}
              >
                {/* === 3D EDGE LAYERS (stacked behind) === */}
                {[...Array(10)].map((_, i) => (
                  <div
                    key={i}
                    className="absolute inset-0 rounded-2xl"
                    style={{
                      transform: `translateZ(${-(i + 1) * 3}px)`,
                      backgroundColor:
                        i < 5
                          ? `rgba(0,0,0,${0.12 + i * 0.04})`
                          : `rgba(0,0,0,${0.4 - i * 0.02})`,
                    }}
                  />
                ))}

                {/* === MAIN CARD FACE === */}
                <div
                  className="relative w-full aspect-[9/18] rounded-2xl overflow-hidden"
                  style={{
                    transform: "translateZ(0px)",
                    boxShadow:
                      "20px 30px 60px rgba(0,0,0,0.5), 8px 12px 20px rgba(0,0,0,0.3), 2px 4px 8px rgba(0,0,0,0.2)",
                  }}
                >
                  {/* Video */}
                  <video
                    src={product.video}
                    autoPlay
                    muted
                    loop
                    playsInline
                    preload="none"
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />

                  {/* Specular highlight — top-left glare */}
                  <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-transparent pointer-events-none rounded-2xl" />

                  {/* Hover dark overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                  {/* Product Name on Hover */}
                  <div className="absolute bottom-0 left-0 right-0 p-5 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 text-center">
                    <p className="text-white font-playfair text-lg md:text-xl font-medium drop-shadow-lg">
                      {t(`UseItFeelIt.products.${product.nameKey}`)}
                    </p>
                  </div>
                </div>

                {/* === BOTTOM EDGE FACE (visible bottom thickness) === */}
                {/* <div
                  className="absolute bottom-0 left-0 right-0 h-[20px] rounded-b-2xl"
                  style={{
                    transform: "rotateX(-90deg) translateZ(10px)",
                    transformOrigin: "bottom",
                    background:
                      "linear-gradient(to right, rgba(0,0,0,0.6), rgba(0,0,0,0.4))",
                  }}
                /> */}

                {/* === RIGHT EDGE FACE (visible side thickness) === */}
                {/* <div
                  className="absolute top-0 right-0 w-[20px] h-full rounded-r-2xl"
                  style={{
                    transform: "rotateY(90deg) translateZ(10px)",
                    transformOrigin: "right",
                    background:
                      "linear-gradient(to bottom, rgba(0,0,0,0.5), rgba(0,0,0,0.3))",
                  }}
                /> */}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
