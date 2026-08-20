"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Loader from "@/components/loader/loader";
import { useSiteContentQuery, useBestSellersQuery } from "@/features/home/queries";
import { mapHeroBackgroundSlides } from "@/features/home/mappers";

export default function HomeDropperLoader() {
  const [isReady, setIsReady] = useState(false);
  const contentQuery = useSiteContentQuery();
  const bestSellersQuery = useBestSellersQuery(12);

  const backgroundSlides = mapHeroBackgroundSlides(contentQuery.data || {});
  const firstSlideImage = backgroundSlides[0]?.image;

  useEffect(() => {
    let isCancelled = false;
    const startTime = Date.now();
    const MIN_LOADER_DURATION = 600;

    const finish = () => {
      const elapsed = Date.now() - startTime;
      const remaining = Math.max(0, MIN_LOADER_DURATION - elapsed);
      setTimeout(() => {
        if (!isCancelled) {
          setIsReady(true);
        }
      }, remaining);
    };

    if (firstSlideImage) {
      const img = new window.Image();
      img.src = firstSlideImage;
      if (img.complete) {
        finish();
      } else {
        img.onload = finish;
        img.onerror = finish;
      }
    } else if (!contentQuery.isLoading && !bestSellersQuery.isLoading) {
      finish();
    }

    // Safety fallback (maximum 2.5s)
    const safetyTimeout = setTimeout(finish, 2500);

    return () => {
      isCancelled = true;
      clearTimeout(safetyTimeout);
    };
  }, [firstSlideImage, contentQuery.isLoading, bestSellersQuery.isLoading]);

  return (
    <AnimatePresence>
      {!isReady && (
        <motion.div
          key="home-dropper-loader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="fixed inset-0 z-[300] bg-bg-primary flex items-center justify-center pointer-events-auto"
        >
          <Loader fullScreen />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
