"use client";

import { useState, useEffect } from "react";
import { useSiteContentQuery } from "@/features/home/queries";
import { useLanguage } from "../../hooks/useLanguage";

function useCountdown(targetDate) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isExpired: true,
  });

  useEffect(() => {
    if (!targetDate) return;

    function calculate() {
      const target = new Date(targetDate).getTime();
      const now = new Date().getTime();
      const diff = target - now;

      if (diff <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: true });
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeLeft({ days, hours, minutes, seconds, isExpired: false });
    }

    calculate();
    const interval = setInterval(calculate, 1000);
    return () => clearInterval(interval);
  }, [targetDate]);

  return timeLeft;
}

export default function TopBanner() {
  const { t, locale } = useLanguage();
  const contentQuery = useSiteContentQuery();
  const content = contentQuery.data || {};

  const isAr = locale === "ar";
  const bannerText = isAr
    ? content.topBannerText_ar || content.topBannerText_en || t("TopBanner.message")
    : content.topBannerText_en || content.topBannerText_ar || t("TopBanner.message");

  const countdownEnabled =
    content.countdownEnabled === true || content.countdownEnabled === "true";
  const countdownTargetDate = content.countdownTargetDate;
  const timerTitle = isAr
    ? content.countdownTitle_ar || content.countdownTitle_en || "ينتهي العرض خلال:"
    : content.countdownTitle_en || content.countdownTitle_ar || "Offer ends in:";

  const timeLeft = useCountdown(countdownTargetDate);
  const showTimer = Boolean(countdownEnabled && countdownTargetDate && !timeLeft.isExpired);

  const labels = isAr
    ? { d: "ي", h: "س", m: "ق", s: "ث" }
    : { d: "d", h: "h", m: "m", s: "s" };

  return (
    <div className="w-full bg-brand-mint dark:bg-[#0c3629] text-white py-2 px-4 shadow-sm transition-all duration-300">
      <div className="container mx-auto flex flex-col sm:flex-row items-center justify-center gap-1.5 sm:gap-4 text-center">
        <span className="text-[11px] sm:text-xs font-bold tracking-widest uppercase text-white/95">
          {bannerText}
        </span>

        {showTimer && (
          <div className="flex items-center gap-2 bg-black/30 backdrop-blur-md px-3 py-0.5 rounded-full border border-white/15 shadow-sm">
            <span className="text-xs font-bold text-amber-300 tracking-wider">
              {timerTitle}
            </span>

            <div className="flex items-center gap-1 font-mono text-xs sm:text-sm font-black dir-ltr">
              {timeLeft.days > 0 && (
                <span className="bg-white/20 px-2 py-0.5 rounded-md text-white min-w-[28px] text-center shadow-inner">
                  {String(timeLeft.days).padStart(2, "0")}
                  <span className="text-[9px] font-sans font-normal text-amber-200/90 ms-0.5">
                    {labels.d}
                  </span>
                </span>
              )}
              <span className="bg-white/20 px-2 py-0.5 rounded-md text-white min-w-[28px] text-center shadow-inner">
                {String(timeLeft.hours).padStart(2, "0")}
                <span className="text-[9px] font-sans font-normal text-amber-200/90 ms-0.5">
                  {labels.h}
                </span>
              </span>
              <span className="text-amber-300/80 font-bold text-xs sm:text-sm">:</span>
              <span className="bg-white/20 px-2 py-0.5 rounded-md text-white min-w-[28px] text-center shadow-inner">
                {String(timeLeft.minutes).padStart(2, "0")}
                <span className="text-[9px] font-sans font-normal text-amber-200/90 ms-0.5">
                  {labels.m}
                </span>
              </span>
              <span className="text-amber-300/80 font-bold text-xs sm:text-sm">:</span>
              <span className="bg-white/20 px-2 py-0.5 rounded-md text-white min-w-[28px] text-center shadow-inner">
                {String(timeLeft.seconds).padStart(2, "0")}
                <span className="text-[9px] font-sans font-normal text-amber-200/90 ms-0.5">
                  {labels.s}
                </span>
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
