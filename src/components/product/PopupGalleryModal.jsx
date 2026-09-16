"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "@/components/ui/AppImage";
import { X, ChevronLeft, ChevronRight, Images } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";

export function PopupGalleryTrigger({ popupGallery, onOpen }) {
  const { locale } = useLanguage();
  const isArabic = locale === "ar";

  const images = Array.isArray(popupGallery)
    ? popupGallery.filter((img) => typeof img === "string" && img.trim() !== "")
    : [];

  if (images.length === 0) {
    return null;
  }

  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onOpen();
      }}
      title={isArabic ? `عرض صور الجاليري (${images.length})` : `View Gallery (${images.length})`}
      aria-label={isArabic ? "عرض صور الجاليري" : "View Gallery"}
      className="inline-flex items-center justify-center gap-1.5 p-2 sm:px-3 sm:py-1.5 rounded-full bg-brand-mint text-white font-bold text-xs shadow-md hover:bg-brand-dark hover:scale-105 active:scale-95 transition-all cursor-pointer z-30"
    >
      <Images className="w-4 h-4 shrink-0" />
      {/* <span className="hidden sm:inline">
        {isArabic ? `معرض الصور (${images.length})` : `Gallery (${images.length})`}
      </span> */}
      <span className="sm:hidden text-[10px] font-extrabold leading-none bg-white/20 px-1 py-0.5 rounded-full">
        {images.length}
      </span>
    </button>
  );
}

export default function PopupGalleryModal({ popupGallery, isOpen, onClose }) {
  const { locale } = useLanguage();
  const isArabic = locale === "ar";
  const [selectedIndex, setSelectedIndex] = useState(0);
  const dialogRef = useRef(null);
  const closeButtonRef = useRef(null);
  const previouslyFocusedRef = useRef(null);
  const onCloseRef = useRef(onClose);

  const images = Array.isArray(popupGallery)
    ? popupGallery.filter((img) => typeof img === "string" && img.trim() !== "")
    : [];

  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  // Depends only on `isOpen` — every call site passes a fresh inline
  // `onClose` function on every render, so depending on `onClose` directly
  // here would re-run this effect (and re-steal focus back to the close
  // button) on any unrelated re-render of the host component while the
  // modal is open, not just on actual open/close transitions.
  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === "Escape") {
        onCloseRef.current?.();
        return;
      }

      if (e.key !== "Tab" || !dialogRef.current) {
        return;
      }

      const focusable = dialogRef.current.querySelectorAll(
        'a[href], button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])',
      );
      if (focusable.length === 0) {
        return;
      }

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }

    if (isOpen) {
      previouslyFocusedRef.current = document.activeElement;
      window.addEventListener("keydown", handleKeyDown);
      closeButtonRef.current?.focus();
    } else if (previouslyFocusedRef.current) {
      previouslyFocusedRef.current.focus?.();
      previouslyFocusedRef.current = null;
    }
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  if (!isOpen || images.length === 0) {
    return null;
  }

  const activeImage = images[selectedIndex] || images[0];

  const handleNext = (e) => {
    e?.preventDefault();
    e?.stopPropagation();
    setSelectedIndex((prev) => (prev + 1) % images.length);
  };

  const handlePrev = (e) => {
    e?.preventDefault();
    e?.stopPropagation();
    setSelectedIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const handleClose = (e) => {
    e?.preventDefault();
    e?.stopPropagation();
    onClose?.();
  };

  return (
    <div
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        handleClose(e);
      }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-md transition-all"
    >
      {/* Modal White Container */}
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label={isArabic ? "معرض الصور الإضافي" : "Popup Gallery"}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
        className="relative z-10 w-full max-w-xl bg-white dark:bg-slate-900 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col max-h-[85vh]"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/80">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-brand-mint/10 flex items-center justify-center text-brand-mint border border-brand-mint/20">
              <Images className="w-3.5 h-3.5" />
            </div>
            <h3 className="font-playfair font-bold text-sm sm:text-base text-slate-900 dark:text-white">
              {isArabic ? "معرض الصور الإضافي" : "Popup Gallery"}
            </h3>
            <span className="text-[11px] font-mono font-bold text-brand-mint bg-brand-mint/10 px-2 py-0.5 rounded-full border border-brand-mint/20">
              {selectedIndex + 1} / {images.length}
            </span>
          </div>

          <button
            ref={closeButtonRef}
            type="button"
            onClick={handleClose}
            aria-label={isArabic ? "إغلاق" : "Close"}
            className="w-8 h-8 rounded-full bg-slate-200/60 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-red-500 hover:text-white transition-all cursor-pointer flex items-center justify-center"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Main Image View */}
        <div className="relative flex-1 bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-3 min-h-[240px] sm:min-h-[320px] max-h-[360px]">
          <div className="relative w-full h-full aspect-[4/3] max-h-[340px]">
            <Image
              src={activeImage}
              alt={`Popup Gallery ${selectedIndex + 1}`}
              fill
              className="object-contain"
              sizes="(max-width: 768px) 100vw, 600px"
            />
          </div>

          {/* Navigation Arrows (flipped for RTL so "next" always moves in reading direction) */}
          {images.length > 1 && (
            <>
              <button
                type="button"
                onClick={isArabic ? handleNext : handlePrev}
                aria-label={isArabic ? "التالي" : "Previous"}
                className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white dark:bg-slate-800 text-slate-800 dark:text-white hover:bg-brand-mint hover:text-white border border-slate-200 dark:border-slate-700 shadow-md cursor-pointer flex items-center justify-center transition-all hover:scale-105 active:scale-95"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <button
                type="button"
                onClick={isArabic ? handlePrev : handleNext}
                aria-label={isArabic ? "السابق" : "Next"}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white dark:bg-slate-800 text-slate-800 dark:text-white hover:bg-brand-mint hover:text-white border border-slate-200 dark:border-slate-700 shadow-md cursor-pointer flex items-center justify-center transition-all hover:scale-105 active:scale-95"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </>
          )}
        </div>

        {/* Thumbnails Row */}
        {images.length > 1 && (
          <div className="p-3 bg-slate-50 dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 flex items-center justify-center gap-2.5 overflow-x-auto">
            {images.map((imgUrl, idx) => (
              <button
                key={idx}
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setSelectedIndex(idx);
                }}
                className={`relative w-12 h-12 sm:w-14 sm:h-14 rounded-lg overflow-hidden border-2 transition-all cursor-pointer ${idx === selectedIndex
                    ? "border-brand-mint ring-2 ring-brand-mint/30 scale-105 shadow-sm"
                    : "border-transparent opacity-60 hover:opacity-100"
                  }`}
              >
                <Image src={imgUrl} alt={`Thumbnail ${idx + 1}`} fill className="object-cover" />
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
