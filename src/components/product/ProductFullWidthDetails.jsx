"use client";

import React, { useState } from "react";
import { Leaf, Sparkles, Share2, Copy, Check } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";
import {
  FacebookIcon,
  InstagramIcon,
  XIcon,
  TikTokIcon,
} from "@/svgs/ProductInfo.svgs";

function parseBulletPoints(content) {
  if (!content || typeof content !== "string") {
    return [];
  }

  return content
    .split(/\r?\n|[;]|,/g)
    .map((item) => item.replace(/^[-*\u2022]\s*/, "").trim())
    .filter(Boolean);
}

export default function ProductFullWidthDetails({ product }) {
  const { t, locale } = useLanguage();
  const isArabic = locale === "ar";
  const [copied, setCopied] = useState(false);

  const ingredientsText = product?.ingredients || "";
  const howToUseText = product?.howToUse || "";

  const ingredientPoints = parseBulletPoints(ingredientsText);
  const howToUsePoints = parseBulletPoints(howToUseText);

  const handleCopyLink = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleShareClick = (platform) => {
    if (typeof window === "undefined") return;
    const url = encodeURIComponent(window.location.href);
    const title = encodeURIComponent(product?.title || "");

    let shareUrl = "";
    if (platform === "facebook") {
      shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
    } else if (platform === "x") {
      shareUrl = `https://twitter.com/intent/tweet?url=${url}&text=${title}`;
    } else if (platform === "instagram") {
      shareUrl = `https://www.instagram.com/`;
    } else if (platform === "tiktok") {
      shareUrl = `https://www.tiktok.com/`;
    }

    if (shareUrl) {
      window.open(shareUrl, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <div className="w-full my-8 p-6 md:p-8 rounded-3xl bg-bg-secondary/60 border border-border-color shadow-sm">
      <div className="flex flex-col md:flex-row items-start justify-between gap-8 md:gap-10">
        {/* 1. Ingredients Column */}
        <div className="flex-1 w-full flex flex-col">
          <div className="flex items-center gap-2 mb-3 text-brand-mint border-b border-border-color/60 pb-2">
            <Leaf className="w-4 h-4" />
            <h3 className="font-playfair font-bold text-base text-text-primary">
              {t("ProductDetails.ingredients") || (isArabic ? "المكونات" : "Ingredients")}
            </h3>
          </div>
          <div className="text-xs sm:text-sm text-text-secondary leading-relaxed">
            {ingredientPoints.length > 0 ? (
              <ul className="space-y-1.5 ps-4 list-disc marker:text-brand-mint">
                {ingredientPoints.map((point, index) => (
                  <li key={index}>{point}</li>
                ))}
              </ul>
            ) : (
              <p>
                {ingredientsText ||
                  (isArabic
                    ? "مكونات طبيعية وآمنة 100% غنية بالفيتامينات والمغذيات الطبيعية."
                    : "100% natural and safe ingredients rich in vitamins.")}
              </p>
            )}
          </div>
        </div>

        {/* 2. How to Use Column */}
        <div className="flex-1 w-full flex flex-col">
          <div className="flex items-center gap-2 mb-3 text-brand-mint border-b border-border-color/60 pb-2">
            <Sparkles className="w-4 h-4" />
            <h3 className="font-playfair font-bold text-base text-text-primary">
              {t("ProductDetails.howToUse") || (isArabic ? "طريقة الاستخدام" : "How to Use")}
            </h3>
          </div>
          <div className="text-xs sm:text-sm text-text-secondary leading-relaxed">
            {howToUsePoints.length > 0 ? (
              <ul className="space-y-1.5 ps-4 list-disc marker:text-brand-mint">
                {howToUsePoints.map((point, index) => (
                  <li key={index}>{point}</li>
                ))}
              </ul>
            ) : (
              <p>
                {howToUseText ||
                  (isArabic
                    ? "يُفضل استخدام المنتج يومياً صباحاً ومساءً للحصول على أفضل النتائج."
                    : "Apply daily morning and evening for best results.")}
              </p>
            )}
          </div>
        </div>

        {/* 3. Share Product Column */}
        <div className="w-full md:w-auto shrink-0 flex flex-col md:items-end">
          <div className="flex items-center gap-2 mb-3 text-brand-mint border-b border-border-color/60 pb-2 w-full md:w-auto">
            <Share2 className="w-4 h-4" />
            <h3 className="font-playfair font-bold text-base text-text-primary">
              {t("ProductDetails.share") || (isArabic ? "مشاركة المنتج" : "Share Product")}
            </h3>
          </div>

          <div className="flex items-center gap-2.5 mt-1">
            <button
              type="button"
              onClick={handleCopyLink}
              className="py-2 px-3 rounded-xl border border-border-color bg-bg-primary text-xs font-semibold text-text-primary flex items-center gap-1.5 hover:border-brand-mint transition-colors cursor-pointer"
            >
              {copied ? <Check className="w-4 h-4 text-brand-mint" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? (isArabic ? "تم النسخ" : "Copied") : (isArabic ? "نسخ الرابط" : "Copy Link")}</span>
            </button>

            <button
              type="button"
              onClick={() => handleShareClick("facebook")}
              className="group w-9 h-9 rounded-xl border border-border-color bg-bg-primary flex items-center justify-center text-text-secondary hover:border-social-facebook transition-colors cursor-pointer"
              title="Facebook"
            >
              <FacebookIcon className="w-4 h-4 transition-colors group-hover:text-social-facebook" />
            </button>

            <button
              type="button"
              onClick={() => handleShareClick("x")}
              className="group w-9 h-9 rounded-xl border border-border-color bg-bg-primary flex items-center justify-center text-text-secondary hover:border-social-x transition-colors cursor-pointer"
              title="X / Twitter"
            >
              <XIcon className="w-4 h-4 transition-colors group-hover:text-social-x" />
            </button>

            <button
              type="button"
              onClick={() => handleShareClick("instagram")}
              className="group w-9 h-9 rounded-xl border border-border-color bg-bg-primary flex items-center justify-center text-text-secondary hover:border-social-instagram transition-colors cursor-pointer"
              title="Instagram"
            >
              <InstagramIcon className="w-4 h-4 transition-colors group-hover:text-social-instagram" />
            </button>

            <button
              type="button"
              onClick={() => handleShareClick("tiktok")}
              className="group w-9 h-9 rounded-xl border border-border-color bg-bg-primary flex items-center justify-center text-text-secondary hover:border-brand-mint transition-colors cursor-pointer"
              title="TikTok"
            >
              <TikTokIcon className="w-4 h-4 transition-colors group-hover:text-brand-mint" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
