"use client";

import React from "react";
import { useLanguage } from "@/hooks/useLanguage";

const arContent = {
  pageTitle: "سياسة الاستبدال والاسترجاع",
  sections: [
    {
      title: " سياسة الاستبدال والاسترجاع",
      intro:
        "في حالة الرغبة في استرداد أو استبدال الطلب، يجب إبلاغ الشركة قبل 48 ساعة بحد أقصى مع مراعاة سلامة المنتج وعدم تلفه أو استخدامه.",
    },
  ],
};

const enContent = {
  pageTitle: "Shipping and Returns Policy",
  sections: [
    {
      title: "Shipping and Returns Policy",
      intro:
        "If you wish to request a refund or exchange, you must notify the company within a maximum of 48 hours, provided the product remains intact, unused, and undamaged.",
    },
  ],
};

export default function PrivacyPolicyClient() {
  const { locale } = useLanguage();
  const isArabic = locale === "ar";
  const content = isArabic ? arContent : enContent;

  return (
    <div className="min-h-screen bg-bg-primary px-6 md:px-10 py-12 md:py-16">
      <div className="max-w-5xl mx-auto">
        <h1
          className={`font-playfair text-3xl md:text-5xl text-text-primary mb-10 ${
            isArabic ? "text-right" : "text-left"
          }`}
        >
          {content.pageTitle}
        </h1>

        <div className="space-y-8">
          {content.sections.map((section) => (
            <section
              key={section.title}
              className="rounded-3xl border border-border-color bg-bg-secondary p-6 md:p-8"
            >
              <h2
                className={`font-playfair text-2xl md:text-3xl text-text-primary mb-4 ${
                  isArabic ? "text-right" : "text-left"
                }`}
              >
                {section.title}
              </h2>

              {section.intro ? (
                <p
                  className={`text-text-secondary leading-8 mb-5 ${
                    isArabic ? "text-right" : "text-left"
                  }`}
                >
                  {section.intro}
                </p>
              ) : null}

              {Array.isArray(section.points) && section.points.length > 0 ? (
                <div className="space-y-4">
                  {section.points.map((point) => (
                    <div key={point.title}>
                      <h3
                        className={`text-text-primary font-semibold mb-1 ${
                          isArabic ? "text-right" : "text-left"
                        }`}
                      >
                        {point.title}
                      </h3>
                      <p
                        className={`text-text-secondary leading-7 ${
                          isArabic ? "text-right" : "text-left"
                        }`}
                      >
                        {point.text}
                      </p>
                    </div>
                  ))}
                </div>
              ) : null}

              {section.outro ? (
                <p
                  className={`mt-5 text-text-primary font-medium leading-8 ${
                    isArabic ? "text-right" : "text-left"
                  }`}
                >
                  {section.outro}
                </p>
              ) : null}
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
