"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ArrowRight } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";
import Image from "@/components/ui/AppImage";

export default function AboutUsPage() {
  const { t, locale } = useLanguage();
  const [openFaqIndex, setOpenFaqIndex] = useState(null);

  const toggleFaq = (index) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  const timelineEvents = [
    {
      year: t("AboutUs.events.year2012.year"),
      title: t("AboutUs.events.year2012.title"),
      desc: t("AboutUs.events.year2012.description"),
    },
    {
      year: t("AboutUs.events.year2015.year"),
      title: t("AboutUs.events.year2015.title"),
      desc: t("AboutUs.events.year2015.description"),
    },
    {
      year: t("AboutUs.events.year2018.year"),
      title: t("AboutUs.events.year2018.title"),
      desc: t("AboutUs.events.year2018.description"),
    },
  ];

  const faqs = [
    { q: t("AboutUs.faqs.q1.question"), a: t("AboutUs.faqs.q1.answer") },
    { q: t("AboutUs.faqs.q2.question"), a: t("AboutUs.faqs.q2.answer") },
    { q: t("AboutUs.faqs.q3.question"), a: t("AboutUs.faqs.q3.answer") },
  ];

  return (
    <div className="min-h-screen bg-bg-primary overflow-hidden">
      <div className="w-full">
        <Image
          src="/assets/about us.jpg"
          alt="About Ashperoo"
          width={1920}
          height={1080}
          priority
          className="w-full h-auto object-cover"
          sizes="100vw"
        />
      </div>

      {/* Timeline / Roadmap Section */}
      <section className="py-20 md:py-28 px-6 bg-bg-secondary border-y border-border-color">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16 md:mb-20">
            <h2 className="text-xs md:text-sm font-bold text-brand-orange tracking-widest uppercase mb-2">
              {t("AboutUs.timelineSubtitle")}
            </h2>
            <h3 className="text-3xl md:text-4xl lg:text-5xl font-playfair font-bold text-brand-dark dark:text-brand-mint">
              {t("AboutUs.timelineTitle")}
            </h3>
          </div>

          <div className="relative border-s-2 border-brand-mint/30 rtl:border-s-0 rtl:border-r-2 rtl:border-r-brand-mint/30 opacity-90 ms-4 md:mx-auto md:w-3/4 lg:w-2/3">
            {timelineEvents.map((item, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, x: locale === 'ar' ? 30 : -30 }} // RTL Slide adjust
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                className={`min-h-[160px] ms-8 rtl:ms-0 rtl:mr-8 relative ${idx !== timelineEvents.length - 1 ? 'mb-10' : ''}`}
              >
                {/* Timeline Dot Component */}
                <div className="absolute w-4 h-4 bg-brand-mint rounded-full -start-[41px] rtl:-start-auto rtl:-end-[41px] top-1.5 border-4 border-bg-secondary shadow-sm shadow-brand-mint/20 z-10 box-content"></div>
                
                {/* Box Content */}
                <div className="bg-bg-primary p-6 md:p-8 rounded-3xl border border-border-color shadow-card-subtle dark:shadow-none transition-transform hover:-translate-y-1">
                  <span className="text-brand-orange text-lg md:text-xl font-serif font-bold block mb-2">{item.year}</span>
                  <h4 className="text-xl md:text-2xl font-playfair font-bold text-brand-dark dark:text-brand-mint mb-3">{item.title}</h4>
                  <p className="text-text-secondary leading-relaxed text-sm md:text-base">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQs Section */}
      <section className="py-24 px-6 relative">
        {/* Subtle Background Accent */}
        <div className="absolute top-1/2 left-0 w-1/3 h-1/2 bg-brand-orange/5 blur-[120px] rounded-full pointer-events-none -translate-y-1/2" />
        
        <div className="max-w-3xl mx-auto relative z-10">
          <div className="text-center mb-16 md:mb-20">
            <h2 className="text-xs md:text-sm font-bold text-brand-orange tracking-widest uppercase mb-2">
              {t("AboutUs.faqSubtitle")}
            </h2>
            <h3 className="text-3xl md:text-4xl font-playfair font-bold text-brand-dark dark:text-brand-mint">
              {t("AboutUs.faqTitle")}
            </h3>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`bg-bg-secondary border border-border-color rounded-2xl overflow-hidden transition-all duration-300 ${openFaqIndex === index ? 'shadow-faq-open border-brand-mint/30' : 'hover:border-text-primary/10 hover:shadow-sm'}`}
              >
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full flex items-center justify-between p-6 text-left focus:outline-none"
                >
                  <span className={`font-semibold md:text-lg transition-colors ${openFaqIndex === index ? 'text-brand-mint' : 'text-text-primary'}`}>
                    {faq.q}
                  </span>
                  <motion.div
                    animate={{ rotate: openFaqIndex === index ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                    className="shrink-0 ml-4 rtl:ml-0 rtl:mr-4 text-text-secondary"
                  >
                    <ChevronDown className="w-5 h-5" />
                  </motion.div>
                </button>
                <AnimatePresence>
                  {openFaqIndex === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                    >
                      <div className="px-6 pb-6 text-text-secondary leading-relaxed border-t border-border-color mt-2 pt-4">
                        {faq.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 md:py-32 px-6 bg-brand-dark flex items-center relative overflow-hidden">
        {/* Abstract elegant overlays to ensure contrast against dark */}
        <div className="absolute inset-0 bg-brand-dark opacity-90 z-0"></div>
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-mint/20 blur-[150px] rounded-full mix-blend-screen pointer-events-none"></div>
        
        <div className="max-w-3xl mx-auto text-center relative z-10 text-white">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl lg:text-6xl font-playfair font-semibold mb-6 md:mb-8"
          >
            {t("AboutUs.ctaTitle")}
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-lg md:text-xl opacity-80 mb-10 max-w-2xl mx-auto"
          >
            {t("AboutUs.ctaDesc")}
          </motion.p>
          <motion.div
             initial={{ opacity: 0, scale: 0.9 }}
             whileInView={{ opacity: 1, scale: 1 }}
             viewport={{ once: true }}
             transition={{ delay: 0.2 }}
          >
            <Link
              href="/contact-us"
              className="inline-flex items-center gap-3 px-8 md:px-10 py-4 bg-brand-mint text-white font-bold tracking-wide rounded-full hover:bg-white hover:text-brand-dark transition-all hover:scale-105 active:scale-95 shadow-brand-primary"
            >
              {t("AboutUs.ctaButton")}
              {/* If language is arabic, arrow flips correctly */}
              <ArrowRight className={`w-5 h-5 ${locale === 'ar' ? 'rotate-180' : ''}`} />
            </Link>
          </motion.div>
        </div>
      </section>

    </div>
  );
}
