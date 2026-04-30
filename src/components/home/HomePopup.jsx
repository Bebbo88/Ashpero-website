"use client";

import React, { useState, useEffect } from "react";
import Image from "@/components/ui/AppImage";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/hooks/useLanguage";
import { useOffersQuery } from "@/features/offer/queries";

const POPUP_IMAGE_SRC = "/assets/popupp.jpg";
const SPLASH_COMPLETE_EVENT = "ashperoo:splash-complete";

let popupImagePreloadPromise;

function preloadPopupImage() {
  if (popupImagePreloadPromise) {
    return popupImagePreloadPromise;
  }

  popupImagePreloadPromise = new Promise((resolve) => {
    let timeoutId;
    const resolveOnce = () => {
      clearTimeout(timeoutId);
      resolve();
    };

    const link = document.createElement("link");
    link.rel = "preload";
    link.as = "image";
    link.href = POPUP_IMAGE_SRC;
    link.fetchPriority = "high";
    document.head.appendChild(link);

    const image = new window.Image();
    image.onload = resolveOnce;
    image.onerror = resolveOnce;
    image.src = POPUP_IMAGE_SRC;

    if (image.complete) {
      resolveOnce();
    } else {
      timeoutId = setTimeout(resolveOnce, 2500);
    }
  });

  return popupImagePreloadPromise;
}

export default function HomePopup() {
  const [isVisible, setIsVisible] = useState(false);
  const { locale } = useLanguage();
  const isRtl = locale === "ar";

  const { data: offers, isLoading: isOffersLoading } = useOffersQuery();
  const activeOffer = offers && offers.length > 0 ? offers[0] : null;

  let currentDateTime = "";
  if (activeOffer?.endDate) {
    const end = new Date(activeOffer.endDate);
    const prefix = isRtl ? "ينتهي العرض في: " : "Offer ends at: ";

    currentDateTime =
      prefix +
      end.toLocaleString(isRtl ? "ar-EG" : "en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
  }

  useEffect(() => {
    preloadPopupImage();
  }, []);

  useEffect(() => {
    if (sessionStorage.getItem("home_popup_shown") || isOffersLoading) {
      return;
    }

    if (!activeOffer) {
      return;
    }

    let timeoutId;
    let isCancelled = false;

    const showAfterImageReady = async () => {
      await preloadPopupImage();

      if (!isCancelled) {
        timeoutId = setTimeout(() => {
          if (!isCancelled) {
            setIsVisible(true);
          }
        }, 500);
      }
    };

    // Check both sessionStorage and cookie, because if the user opens a new tab,
    // the splash screen might be skipped (cookie is true), but sessionStorage is empty.
    const splashDoneInSession = sessionStorage.getItem("splash_shown");
    const splashDoneInCookie = document.cookie.includes("splash_shown=true");

    if (splashDoneInSession || splashDoneInCookie) {
      showAfterImageReady();
    } else {
      window.addEventListener(SPLASH_COMPLETE_EVENT, showAfterImageReady, {
        once: true,
      });
    }

    return () => {
      isCancelled = true;
      clearTimeout(timeoutId);
      window.removeEventListener(SPLASH_COMPLETE_EVENT, showAfterImageReady);
    };
  }, [isOffersLoading, activeOffer]);

  const closePopup = () => {
    setIsVisible(false);
    sessionStorage.setItem("home_popup_shown", "true");
  };

  // Don't render anything if not visible (saves DOM nodes)
  if (!isVisible) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[150] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          onClick={closePopup}
        >
          {/* Prevent clicks inside from closing */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative w-full max-w-sm md:max-w-md bg-bg-primary rounded-xl overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={closePopup}
              className="absolute top-12 right-4 rtl:right-auto rtl:left-4 z-20 w-8 h-8 flex items-center justify-center bg-black/50 hover:bg-black/80 text-white rounded-full transition-colors"
              aria-label="Close popup"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>

            {/* Ticker Container */}
            <div className="w-full bg-brand-primary text-white py-2 overflow-hidden relative z-10 flex items-center">
              <motion.div
                animate={{
                  x: isRtl ? ["-100%", "100%"] : ["100%", "-100%"],
                }}
                transition={{
                  repeat: Infinity,
                  duration: 10,
                  ease: "linear",
                }}
                className="whitespace-nowrap font-medium text-sm md:text-base px-4"
                style={{ direction: isRtl ? "rtl" : "ltr" }}
              >
                {currentDateTime}
              </motion.div>
            </div>

            {/* Popup Image */}
            <div className="w-full bg-bg-secondary">
              <Image
                src={POPUP_IMAGE_SRC}
                alt="Ashpero Popup Offer"
                width={800}
                height={800}
                className="w-full h-auto object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
                unoptimized
                priority={true}
                loading="eager"
                fetchPriority="high"
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
