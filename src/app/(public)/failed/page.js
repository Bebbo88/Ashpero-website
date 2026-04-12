"use client";

import React from "react";
import Link from "next/link";
import { AlertCircle } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";

export default function FailedPage() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-bg-primary flex flex-col items-center justify-center px-4 py-20 relative overflow-hidden">
      {/* Background accents */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-red-500/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-[480px] w-full flex flex-col items-center text-center relative z-10 transition-transform mt-[-5%]">
        {/* Error Icon */}
        <div className="w-24 h-24 bg-red-50 rounded-3xl flex items-center justify-center mb-6 shadow-sm border border-red-100 dark:bg-red-500/10 dark:border-red-500/20">
          <div className="w-12 h-12 rounded-full border-2 border-status-error flex items-center justify-center">
            <AlertCircle className="w-6 h-6 text-status-error" strokeWidth={2.5} />
          </div>
        </div>

        {/* Title & Subtitle */}
        <h1 className="font-playfair text-4xl md:text-5xl font-bold text-status-error mb-4">
          {t("Status.failed.title")}
        </h1>
        <p className="text-text-secondary text-sm md:text-base leading-relaxed mb-8 max-w-sm">
          {t("Status.failed.subtitle")}
        </p>

        {/* Action Buttons */}
        <div className="w-full flex flex-col gap-3 mb-10">
          <Link
            href="/checkout"
            className="w-full py-4 bg-status-error text-white font-bold text-xs uppercase tracking-widest rounded-xl hover:bg-status-error-hover transition-colors shadow-soft"
          >
            {t("Status.failed.retryBtn")}
          </Link>
        </div>

        {/* Order Summary Box */}
        <div className="w-full text-left bg-bg-secondary p-8 rounded-2xl border border-border-color shadow-sm mb-6">
          <h3 className="font-playfair text-lg font-bold text-text-primary mb-6 uppercase tracking-wider">
            {t("Status.failed.orderSummary")}
          </h3>

          <div className="flex flex-col gap-4 text-sm font-montserrat">
            <div className="flex justify-between items-center text-text-secondary">
              <span className="uppercase text-[10px] tracking-wider font-bold">
                {t("Status.failed.referenceNo")}
              </span>
              <span className="font-semibold text-text-primary">
                ASHP-909HB
              </span>
            </div>

            <div className="h-px w-full bg-border-color my-1" />

            <div className="flex justify-between items-center text-text-secondary">
              <span>{t("Status.failed.subtotal")}</span>
              <span className="font-medium text-text-primary">$110.00</span>
            </div>
            <div className="flex justify-between items-center text-text-secondary">
              <span>{t("Status.failed.processingFee")}</span>
              <span className="font-medium text-text-primary">$0.00</span>
            </div>

            <div className="h-px w-full bg-border-color my-1" />

            <div className="flex justify-between items-center mt-1">
              <span className="font-bold text-text-primary uppercase text-xs tracking-wider">
                {t("Status.failed.totalAmount")}
              </span>
              <span className="font-bold text-brand-mint text-lg">$110.00</span>
            </div>
          </div>
        </div>

        {/* Help Link */}
        <p className="text-xs text-text-secondary">
          {t("Status.failed.helpLine").replace(
            t("Status.failed.helpCenter"),
            "",
          )}
          <Link
            href="/contact-us"
            className="text-brand-mint font-semibold hover:underline decoration-brand-mint underline-offset-2 ml-1"
          >
            {t("Status.failed.helpCenter")}
          </Link>
        </p>
      </div>
    </div>
  );
}
