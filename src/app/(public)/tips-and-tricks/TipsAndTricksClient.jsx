"use client";

import React, { useCallback } from "react";
import Image from "@/components/ui/AppImage";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/hooks/useLanguage";
import { useDispatch, useSelector } from "react-redux";
import { setActiveTipItem, clearActiveTipItem } from "@/store/slices/tipsSlice";
import VideoCard from "@/components/tips/Video";
import SmallCard from "@/components/tips/Image";

import { useTipsQuery } from "@/features/tips/queries";

const MODAL_IMAGE_SIZES = "(max-width: 768px) 100vw, 80vw";

export default function TipsAndTricksClient() {
  const { t, locale } = useLanguage();
  const dispatch = useDispatch();
  const activeItem = useSelector((state) => state.tips.activeTipItem);
  const { data: tips = [] } = useTipsQuery(locale);

  const isRtl = locale === "ar";
  const handleOpenTipCard = useCallback(
    (item) => {
      dispatch(setActiveTipItem(item));
    },
    [dispatch],
  );

  const handleCloseModal = useCallback(() => {
    dispatch(clearActiveTipItem());
  }, [dispatch]);

  return (
    <div className="min-h-screen bg-bg-secondary pb-24">
      {/* Header Section */}
      <section className="bg-bg-secondary pt-12 md:pt-16 pb-10 lg:pb-12 px-4">
        <div className="container mx-auto max-w-[1400px]">
          <div className="flex flex-col w-full max-w-2xl">
            <span className="text-brand-mint text-xs font-bold tracking-[0.2em] uppercase mb-4">
              {t("TipsAndTricks.subtitle")}
            </span>
            <h1 className="font-playfair text-4xl md:text-5xl lg:text-6xl text-text-primary font-bold mb-4">
              {t("TipsAndTricks.title")}
            </h1>
            <p className="font-montserrat text-text-secondary text-sm md:text-base leading-relaxed">
              {t("TipsAndTricks.description")}
            </p>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="px-4">
        <div className="container mx-auto max-w-[1400px] flex flex-col gap-10 lg:gap-12">
          {tips.length === 0 ? (
            <div className="rounded-2xl border border-border-color bg-bg-primary px-6 py-10 text-sm text-text-secondary">
              {locale === "ar"
                ? "لا توجد Tips متاحة حالياً."
                : "No tips are available right now."}
            </div>
          ) : (
            tips.map((row, rowIdx) => {
              const isReversed = rowIdx % 2 !== 0;

              return (
                  <div
                    key={row.id}
                    className="grid grid-cols-1 lg:grid-cols-3 gap-5 md:gap-7 lg:gap-8 lg:items-stretch"
                  >
                  {/* Video Block */}
                  <div
                    className={`lg:col-span-2 flex flex-col h-full ${
                      isReversed ? "lg:order-2" : "lg:order-1"
                    } lg:min-h-[500px]`}
                  >
                    <VideoCard item={row} index={rowIdx} />
                  </div>

                  {/* Image Cards Block */}
                  <div
                    className={`flex flex-col gap-5 md:gap-7 lg:gap-8 h-full ${
                      isReversed ? "lg:order-1" : "lg:order-2"
                    }`}
                  >
                    {row.cards.map((item, cardIdx) => (
                      <div
                        key={item.id}
                        className="flex-1 flex flex-col min-h-[220px]"
                      >
                        <SmallCard
                          item={item}
                          imageLoading={rowIdx === 0 ? "eager" : "lazy"}
                          onOpen={handleOpenTipCard}
                          index={rowIdx + cardIdx + 1}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </section>

      {/* Modal */}
      <AnimatePresence>
        {activeItem ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[300] flex items-center justify-center p-4 md:p-6 bg-black/50 backdrop-blur-md"
            onClick={handleCloseModal}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              onClick={(event) => event.stopPropagation()}
              className="bg-bg-primary w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl flex flex-col will-change-transform no-scrollbar relative"
              dir={isRtl ? "rtl" : "ltr"}
            >
              <div className="relative w-full aspect-video md:aspect-[21/9] bg-gray-100 shrink-0">
                <Image
                  src={activeItem.image}
                  fill
                  sizes={MODAL_IMAGE_SIZES}
                  className="object-cover"
                  alt={activeItem.title}
                />
                <button
                  onClick={handleCloseModal}
                  className={`absolute top-4 ${isRtl ? "left-4" : "right-4"} md:top-6 ${
                    isRtl ? "left-6" : "right-6"
                  } w-10 h-10 bg-black/40 hover:bg-black/70 text-white rounded-full flex items-center justify-center backdrop-blur-sm transition-colors cursor-pointer z-10`}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-6 md:p-8 lg:p-12 flex flex-col relative z-20 -mt-6 rounded-t-3xl bg-bg-primary">
                <h2 className="font-playfair text-3xl md:text-4xl lg:text-5xl text-text-primary font-bold mb-6">
                  {activeItem.title}
                </h2>
                <p className="font-montserrat text-text-secondary text-sm md:text-base leading-relaxed">
                  {activeItem.description}
                </p>
              </div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

