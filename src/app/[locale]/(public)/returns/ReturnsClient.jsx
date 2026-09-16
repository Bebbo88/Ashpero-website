"use client";

import React from "react";
import { useLanguage } from "@/hooks/useLanguage";

const arContent = {
  pageTitle: "سياسة الشحن والاستبدال",
  sections: [
    {
      title: " سياسة الاستبدال والاسترجاع",
      intro:
        "في حالة الرغبة في استرداد أو استبدال الطلب، يجب إبلاغ الشركة قبل 48 ساعة بحد أقصى مع مراعاة سلامة المنتج وعدم تلفه أو استخدامه.",
    },
    {
      title: " سياسة الشحن",
      points: [
        {
          title: "تغطية الشحن",
          text: "يتم الشحن لجميع محافظات مصر.",
        },
        {
          title: "تجهيز الطلب",
          text: "يتم تجهيز الطلب خلال 24–48 ساعة.",
        },
        {
          title: "مدة التوصيل",
          text: "القاهرة والجيزة: 3–5 أيام عمل\nباقي المحافظات: 3–7 أيام عمل",
        },
        {
          title: "شركات الشحن",
          text: "يتم الشحن من خلال شركات شحن موثوقة، ويتم إرسال رقم تتبع الشحنة للعميل بعد إتمام الشحن.",
        },
      ],
    },
  ],
};

const enContent = {
  pageTitle: "Shipping and Returns Policy",
  sections: [
    {
      title: "Returns Policy",
      intro:
        "If you wish to request a refund or exchange, you must notify the company within a maximum of 48 hours, provided the product remains intact, unused, and undamaged.",
    },
    {
      title: "Shipping Policy",
      points: [
        {
          title: "Coverage",
          text: "Shipping is available to all governorates within Egypt.",
        },
        {
          title: "Order Preparation",
          text: "Orders are prepared within 24–48 hours.",
        },
        {
          title: "Delivery Time",
          text: "Cairo & Giza: 3–5 business days\nOther governorates: 3–7 business days",
        },
        {
          title: "Shipping Partners",
          text: "We deliver through trusted shipping companies. A tracking number will be sent to the customer after shipment.",
        },
      ],
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
                  className={`text-text-secondary leading-8 mb-5 whitespace-pre-line ${
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
                        className={`text-text-secondary leading-7 whitespace-pre-line ${
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
