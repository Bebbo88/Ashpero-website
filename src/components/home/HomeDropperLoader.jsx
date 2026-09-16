"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Loader from "@/components/loader/loader";
import { useSiteContentQuery, useBestSellersQuery } from "@/features/home/queries";
import { mapHeroBackgroundSlides } from "@/features/home/mappers";

const SESSION_FLAG = "home_dropper_shown";

export default function HomeDropperLoader() {
  // Must start identical on server and client (server has no window/
  // sessionStorage) — checking sessionStorage here directly, even guarded by
  // typeof window, previously made the client's first render disagree with
  // the server-rendered HTML and threw a hydration-mismatch error. The
  // session check now happens inside the effect below instead, which only
  // ever runs on the client after hydration.
  const [isReady, setIsReady] = useState(false);
  const contentQuery = useSiteContentQuery();
  const bestSellersQuery = useBestSellersQuery(12);

  const backgroundSlides = mapHeroBackgroundSlides(contentQuery.data || {});
  const firstSlideImage = backgroundSlides[0]?.image;

  useEffect(() => {
    let isCancelled = false;

    let alreadyShownThisSession = false;
    try {
      alreadyShownThisSession = Boolean(sessionStorage.getItem(SESSION_FLAG));
    } catch (_error) {
      alreadyShownThisSession = false;
    }

    if (alreadyShownThisSession) {
      setIsReady(true);
      return undefined;
    }

    const startTime = Date.now();
    // Just enough to avoid a jarring instant flash on a fast/cached load —
    // not an artificial delay. Real loading time (image/query fetch) still
    // determines how long this actually shows.
    const MIN_LOADER_DURATION = 150;

    const finish = () => {
      const elapsed = Date.now() - startTime;
      const remaining = Math.max(0, MIN_LOADER_DURATION - elapsed);
      setTimeout(() => {
        if (!isCancelled) {
          setIsReady(true);

          try {
            sessionStorage.setItem(SESSION_FLAG, "1");
          } catch (_error) {
            // ignore (private mode / storage disabled)
          }
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
