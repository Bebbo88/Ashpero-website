"use client";

import React, { useMemo } from "react";
import Image from "@/components/ui/AppImage";
import { useSiteContentQuery } from "@/features/home/queries";
import { mapHomeOfferBannerImage } from "@/features/home/mappers";
import Link from "next/link";

export default function OfferBanner() {
  const contentQuery = useSiteContentQuery();

  const bannerImage = useMemo(
    () => mapHomeOfferBannerImage(contentQuery.data || {}),
    [contentQuery.data],
  );

  return (
    <section className="w-full px-6 lg:px-10 py-10">
      <Link
        href="/offers"
        className="relative w-full rounded-3xl overflow-hidden flex items-center group cursor-pointer shadow-lg hover:shadow-xl transition-shadow duration-300 block bg-surface-muted"
      >
        {/* 🟢 Image */}
        {bannerImage && (
          <div className="w-full">
            <Image
              src={bannerImage}
              alt="Offer Background"
              width={1920}
              height={1080}
              loading="lazy"
              className="w-full h-auto object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              sizes="100vw"
            />
          </div>
        )}
      </Link>
    </section>
  );
}
