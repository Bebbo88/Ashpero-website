"use client";

import React from "react";
import Image from "next/image";
import { useLanguage } from "../../hooks/useLanguage";

const products = [
  { id: 1, image: "/assets/photo1.jpeg", nameKey: "product1" },
  { id: 2, image: "/assets/photo2.jpeg", nameKey: "product2" },
  { id: 3, image: "/assets/photo3.jpeg", nameKey: "product3" },
  { id: 4, image: "/assets/photo4.jpeg", nameKey: "product4" },
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

        {/* 4 Product Photos Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {products.map((product) => (
            <div
              key={product.id}
              className="relative aspect-[3/5] rounded-2xl overflow-hidden group cursor-pointer"
            >
              {/* Product Image */}
              <Image
                src={product.image}
                alt={t(`UseItFeelIt.products.${product.nameKey}`)}
                fill
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                sizes="(max-width: 768px) 50vw, 25vw"
              />

              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              {/* Product Name on Hover */}
              <div className="absolute bottom-0 left-0 right-0 p-5 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                <p className="text-white font-playfair text-lg md:text-xl font-medium">
                  {t(`UseItFeelIt.products.${product.nameKey}`)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
