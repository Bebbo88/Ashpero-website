"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Play, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/hooks/useLanguage";

// Large Video Card Component
const VideoCard = ({ item }) => (
  <div className="flex flex-col gap-3 group w-full h-full lg:col-span-2">
    <div className="relative w-full rounded-xl md:rounded-2xl overflow-hidden bg-gray-100 h-[250px] md:h-[350px] lg:h-[450px]">
      <Image src={item.image} alt={item.title} fill className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out" />
      <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors duration-300" />
      
      {/* Play Button Overlay */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-14 h-14 md:w-16 md:h-16 bg-white/90 backdrop-blur-sm rounded-xl flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform duration-300">
           <Play className="w-6 h-6 md:w-8 md:h-8 text-brand-mint fill-brand-mint align-middle relative translate-x-0.5" />
        </div>
      </div>
      
      {/* Category Label Overlay */}
      {item.category && (
         <div className="absolute top-4 left-4 md:top-5 md:left-5 bg-brand-mint text-white px-3 md:px-3 py-1 md:py-1.5 text-[10px] md:text-xs font-bold rounded-full tracking-[0.15em] uppercase shadow-sm">
           {item.category}
         </div>
      )}
    </div>
    {(item.title || item.description) && (
      <div className="flex flex-col mt-2 px-2 max-w-2xl bg-bg-secondary">
        <h3 className="font-playfair text-xl md:text-2xl font-bold text-text-primary mb-1.5 line-clamp-2 group-hover:text-brand-orange transition-colors">
          {item.title}
        </h3>
        <p className="font-montserrat text-text-secondary text-xs md:text-sm leading-relaxed line-clamp-2 md:line-clamp-3">
          {item.description}
        </p>
      </div>
    )}
  </div>
);

// Small Image Card Component
const SmallCard = ({ item, onClick }) => (
  <div onClick={onClick} className="flex flex-col bg-bg-primary w-full rounded-xl md:rounded-2xl overflow-hidden shadow-sm border border-border-color group cursor-pointer hover:shadow-md transition-all duration-300 flex-1 h-full hover:border-brand-mint/30">
    <div className="relative w-full h-[150px] md:h-[180px] lg:h-[200px] bg-gray-100 overflow-hidden shrink-0">
       <Image src={item.image} alt={item.title} fill className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out" />
    </div>
    <div className="flex flex-col p-4 md:p-5 flex-1 justify-center">
      <h4 className="font-playfair text-lg md:text-xl font-bold text-text-primary mb-1.5 line-clamp-2 group-hover:text-brand-orange transition-colors">
        {item.title}
      </h4>
      <p className="font-montserrat text-text-secondary text-xs sm:text-sm leading-relaxed line-clamp-2 md:line-clamp-3">
        {item.description}
      </p>
    </div>
  </div>
);


export default function TipsAndTricks() {
  const { t, locale } = useLanguage();
  const [activeItem, setActiveItem] = useState(null);
  
  const isRtl = locale === 'ar';

  // Mocked state mimicking a flat array from a database
  const tipsData = [
    {
      id: 1,
      type: "video",
      category: t("TipsAndTricks.items.item1.category"),
      title: t("TipsAndTricks.items.item1.title"),
      description: t("TipsAndTricks.items.item1.description"),
      image: "/assets/photo1.jpeg",
    },
    {
      id: 2,
      type: "image",
      title: t("TipsAndTricks.items.item2.title"),
      description: t("TipsAndTricks.items.item2.description"),
      image: "/assets/photo2.jpeg",
    },
    {
      id: 3,
      type: "image",
      title: t("TipsAndTricks.items.item3.title"),
      description: t("TipsAndTricks.items.item3.description"),
      image: "/assets/photo3.jpeg",
    },
    {
      id: 4,
      type: "image",
      title: t("TipsAndTricks.items.item4.title"),
      description: t("TipsAndTricks.items.item4.description"),
      image: "/assets/photo4.jpeg",
    },
    {
      id: 5,
      type: "image",
      title: t("TipsAndTricks.items.item5.title"),
      description: t("TipsAndTricks.items.item5.description"),
      image: "/assets/photo1.jpeg",
    },
    {
      id: 6,
      type: "video",
      category: t("TipsAndTricks.items.item6.category"),
      title: t("TipsAndTricks.items.item6.title"),
      description: t("TipsAndTricks.items.item6.description"),
      image: "/assets/photo2.jpeg",
    },
  ];

  // Helper to chunk flat array into groups of 3
  const chunkedTips = [];
  for (let i = 0; i < tipsData.length; i += 3) {
    chunkedTips.push(tipsData.slice(i, i + 3));
  }

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

      {/* Grid Layout Section */}
      <section className="px-4">
        <div className="container mx-auto max-w-[1400px] flex flex-col gap-10 lg:gap-14">
          
          {chunkedTips.map((group, rowIdx) => {
            // Alternate layout directions based on row index
            const isReversed = rowIdx % 2 !== 0; // Odd rows (1, 3, 5) have reverse layout
            // First item in the group is always the primary video card, next up to 2 are small cards
            const videoItem = group[0];
            const smallItems = group.slice(1);

            return (
              <div 
                key={rowIdx} 
                className="grid grid-cols-1 lg:grid-cols-3 gap-5 md:gap-6 lg:gap-8 lg:max-h-[85vh]"
              >
                {/* Large Video Area (Always on left by default / order-1. When reversed -> order-2) */}
                <div className={`lg:col-span-2 flex ${isReversed ? "lg:order-2" : "lg:order-1"}`}>
                  {videoItem && <VideoCard item={videoItem} />}
                </div>

                {/* Small Cards Column */}
                <div className={`flex flex-col gap-5 md:gap-6 lg:gap-8 h-full ${isReversed ? "lg:order-1" : "lg:order-2"}`}>
                   {smallItems.map(item => (
                     <div key={item.id} className="flex-1 min-h-[150px] lg:min-h-[200px] flex">
                        <SmallCard item={item} onClick={() => setActiveItem(item)} />
                     </div>
                   ))}
                   {/* Handle cases where the row may be missing items (keep layout intact) */}
                   {smallItems.length === 1 && <div className="flex-1 hidden lg:block" />}
                   {smallItems.length === 0 && <div className="flex-1 hidden lg:block" />}
                </div>
              </div>
            );
          })}
          
        </div>
      </section>

      {/* Article Overlay / Modal */}
      <AnimatePresence>
        {activeItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[300] flex items-center justify-center p-4 md:p-6 bg-black/50 backdrop-blur-md"
            onClick={() => setActiveItem(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-bg-primary w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl flex flex-col will-change-transform no-scrollbar relative"
              dir={isRtl ? "rtl" : "ltr"}
            >
              <div className="relative w-full aspect-video md:aspect-[21/9] bg-gray-100 shrink-0">
                <Image src={activeItem.image} fill className="object-cover" alt={activeItem.title} />
                <button 
                  onClick={() => setActiveItem(null)}
                  className={`absolute top-4 ${isRtl ? "left-4" : "right-4"} md:top-6 ${isRtl ? "left-6" : "right-6"} w-10 h-10 bg-black/40 hover:bg-black/70 text-white rounded-full flex items-center justify-center backdrop-blur-sm transition-colors cursor-pointer z-10`}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-6 md:p-8 lg:p-12 flex flex-col relative z-20 -mt-6 rounded-t-3xl bg-bg-primary">
                {activeItem.category && (
                   <span className="text-brand-mint text-[10px] md:text-sm font-bold tracking-[0.2em] uppercase mb-4 inline-block w-fit px-4 py-2 bg-brand-mint/10 rounded-full">
                     {activeItem.category}
                   </span>
                )}
                <h2 className="font-playfair text-3xl md:text-4xl lg:text-5xl text-text-primary font-bold mb-6">
                  {activeItem.title}
                </h2>
                <div className="font-montserrat text-text-secondary text-sm md:text-base leading-relaxed space-y-6">
                  <p className="text-lg font-medium text-text-primary border-l-4 border-brand-mint pl-4">
                     {activeItem.description}
                  </p>
                  
                  {/* Mock content representing the article/tip body */}
                  <h3 className="font-playfair text-xl md:text-2xl font-bold text-text-primary mt-8 mb-4">
                    {isRtl ? "الفوائد والرؤى الرئيسية" : "Key Benefits & Insights"}
                  </h3>
                  <ul className="list-disc transform space-y-3 ps-5">
                    <li>{isRtl ? "ابدأي بلوحة نظيفة: تأكدي من أن بشرتك خالية تماماً من المكياج والشوائب." : "Start with a clean canvas: ensure your skin is completely free of makeup and impurities."}</li>
                    <li>{isRtl ? "الترتيب هو المفتاح: دائماً طبقي المنتجات من الأخف كثافة إلى الأثقل." : "Layering is key: always apply products from thinnest to thickest consistency."}</li>
                    <li>{isRtl ? "لا تتسرعي: دعي كل طبقة تُمتص بالكامل قبل الانتقال للخطوة التالية." : "Don't rush: allow each layer to fully absorb before moving to the next step."}</li>
                    <li>{isRtl ? "الاستمرارية أهم من الكثافة - العناية اليومية اللطيفة تتفوق على العلاجات القاسية العرضية." : "Consistency matters more than intensity - gentle daily care outperforms harsh occasional treatments."}</li>
                  </ul>
                  
                  <p className="mt-8 text-sm md:text-base italic bg-bg-secondary p-6 rounded-xl border border-border-color">
                    {isRtl ? "تذكري أن تجديد خلايا البشرة يستغرق حوالي 28 يوماً. يجب منح أي روتين جديد شهرًا على الأقل لإظهار فعاليته الحقيقية. التطبيق الصبور والواعي سيثمر دائمًا عن أفضل النتائج لبشرتك." : "Remember that skin cell turnover takes roughly 28 days. Any new routine should be given at least a month to show its true efficacy. Patient, mindful application will always yield the best results for your unique complexion."}
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
