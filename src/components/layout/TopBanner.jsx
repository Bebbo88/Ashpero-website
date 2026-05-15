"use client";

import { useSiteContentQuery } from "@/features/home/queries";
import { useLanguage } from "../../hooks/useLanguage";

export default function TopBanner() {
  const { t, locale } = useLanguage();
  const contentQuery = useSiteContentQuery();
  const content = contentQuery.data || {};
  const bannerText =
    locale === "ar"
      ? content.topBannerText_ar || content.topBannerText_en || t("TopBanner.message")
      : content.topBannerText_en || content.topBannerText_ar || t("TopBanner.message");

  return (
    <div className="w-full bg-brand-orange text-center text-[10px] sm:text-xs font-semibold py-2 text-white uppercase tracking-widest">
      {bannerText}
    </div>
  );
}
