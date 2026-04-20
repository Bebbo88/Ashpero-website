"use client";

import React, { useMemo } from "react";
import Image from "@/components/ui/AppImage";
import { useLanguage } from "../../hooks/useLanguage";
import { useSiteContentQuery } from "@/features/home/queries";
import { mapHomeOfferBannerImage } from "@/features/home/mappers";
import Link from "next/link";
import { AnimatePresence } from "framer-motion";
import HeroLoader from "./HearoLoader";

export default function OfferBanner() {
  const { t } = useLanguage();
  const contentQuery = useSiteContentQuery();

  const bannerImage = useMemo(
    () => mapHomeOfferBannerImage(contentQuery.data || {}),
    [contentQuery.data],
  );

  const isLoading = contentQuery.isLoading || !bannerImage;

  return (
    <section className="w-full px-6 lg:px-10 py-10">
      <Link
        href="/offers"
        className="relative w-full rounded-3xl overflow-hidden min-h-[320px] md:min-h-[380px] flex items-center group cursor-pointer shadow-lg hover:shadow-xl transition-shadow duration-300 block"
      >
        {/* 🟡 Loader */}
        {isLoading && (
          <AnimatePresence>
            <HeroLoader />
          </AnimatePresence>
        )}

        {/* 🟢 Image */}
        {!isLoading && (
          <div className="absolute inset-0">
            <Image
              src={bannerImage}
              alt="Offer Background"
              fill
              className="object-fill transition-transform duration-700 ease-out group-hover:scale-105"
              sizes="100vw"
            />
          </div>
        )}
      </Link>
    </section>
  );
}
