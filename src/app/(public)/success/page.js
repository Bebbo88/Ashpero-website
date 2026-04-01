"use client";

import React from "react";
import Link from "next/link";
import { Check } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";

export default function SuccessPage() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-bg-primary flex flex-col items-center justify-center px-4 py-20 relative overflow-hidden">
      {/* Background accents */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand-mint/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-[480px] w-full flex flex-col items-center text-center relative z-10 transition-transform mt-[-5%]">
        {/* Success Icon */}
        <div className="w-24 h-24 bg-brand-mint/10 rounded-3xl flex items-center justify-center mb-6 shadow-sm border border-brand-mint/20">
          <div className="w-12 h-12 rounded-full border-2 border-brand-mint flex items-center justify-center bg-transparent">
            <Check className="w-6 h-6 text-brand-mint" strokeWidth={3} />
          </div>
        </div>

        {/* Title & Subtitle */}
        <h1 className="font-playfair text-4xl md:text-5xl font-bold text-brand-dark dark:text-brand-mint mb-4">
          {t("Status.success.title")}
        </h1>
        <p className="text-text-secondary text-sm md:text-base leading-relaxed mb-8 max-w-sm">
          {t("Status.success.subtitle")}
        </p>

        {/* Order Details Box */}
        <div className="w-full text-left bg-bg-secondary p-8 rounded-2xl border border-border-color shadow-sm mb-6">
          <div className="flex flex-col gap-6 text-sm font-montserrat">
            <div className="flex justify-between items-center text-text-secondary">
              <span className="uppercase text-[10px] tracking-widest font-bold">
                {t("Status.success.orderNumber")}
              </span>
              <span className="font-bold text-text-primary">ASHP-909HB</span>
            </div>

            <div className="h-px w-full bg-border-color line-dashed opacity-50" />

            <div className="flex justify-between items-center text-text-secondary">
              <span className="uppercase text-[10px] tracking-widest font-bold">
                {t("Status.success.estDelivery")}
              </span>
              <span className="font-semibold text-text-primary">
                {t("Status.success.deliveryDays")}
              </span>
            </div>

            <div className="h-px w-full bg-border-color line-dashed opacity-50" />

            <div className="flex justify-between items-center text-text-secondary">
              <span className="uppercase text-[10px] tracking-widest font-bold">
                {t("Status.success.status")}
              </span>
              <span className="font-bold text-brand-mint flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-brand-mint animate-pulse" />
                {t("Status.success.processing")}
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="w-full flex flex-col gap-3 mb-10">
          <Link
            href="/all-products"
            className="w-full py-4 bg-brand-mint text-white font-bold text-xs uppercase tracking-widest rounded-xl hover:bg-brand-dark transition-all shadow-lg shadow-brand-mint/20 hover:scale-[1.02]"
          >
            {t("Status.success.continueShoppingBtn")}
          </Link>
        </div>

        {/* Help Link */}
        <p className="text-xs text-text-secondary flex flex-col items-center gap-1">
          <span>
            {t("Status.success.questionsLine").replace(
              t("Status.success.supportEmail"),
              "",
            )}
          </span>
          <a
            href="mailto:support@ashpero.com"
            className="text-brand-mint font-semibold hover:underline decoration-brand-mint underline-offset-2"
          >
            {t("Status.success.supportEmail")}
          </a>
        </p>
      </div>
    </div>
  );
}
