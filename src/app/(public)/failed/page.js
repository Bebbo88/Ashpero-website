"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { AlertCircle } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";
import { useCheckoutSummary } from "@/hooks/useCheckoutSummary";
import { initializePaymobPayment } from "@/services/paymentService";

export default function FailedPage() {
  const { t, locale } = useLanguage();
  const searchParams = useSearchParams();
  const router = useRouter();
  const { orderId, summary } = useCheckoutSummary(searchParams);
  const [isRetrying, setIsRetrying] = useState(false);
  const [retryError, setRetryError] = useState("");

  const currencyFormatter = useMemo(
    () =>
      new Intl.NumberFormat(locale === "ar" ? "ar-EG" : "en-US", {
        style: "currency",
        currency: "EGP",
        maximumFractionDigits: 0,
      }),
    [locale],
  );

  async function handleRetry() {
    if (!orderId) {
      router.push("/checkout");
      return;
    }

    try {
      setRetryError("");
      setIsRetrying(true);
      const payment = await initializePaymobPayment(orderId);

      if (!payment.checkoutUrl) {
        throw new Error(
          locale === "ar"
            ? "تعذر بدء محاولة دفع جديدة."
            : "Unable to start a new payment attempt.",
        );
      }

      window.location.assign(payment.checkoutUrl);
    } catch (error) {
      setRetryError(error?.message || "Unable to retry payment.");
      setIsRetrying(false);
    }
  }

  return (
    <div className="min-h-screen bg-bg-primary flex flex-col items-center justify-center px-4 py-20 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-red-500/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-[480px] w-full flex flex-col items-center text-center relative z-10 transition-transform mt-[-5%]">
        <div className="w-24 h-24 bg-red-50 rounded-3xl flex items-center justify-center mb-6 shadow-sm border border-red-100 dark:bg-red-500/10 dark:border-red-500/20">
          <div className="w-12 h-12 rounded-full border-2 border-status-error flex items-center justify-center">
            <AlertCircle className="w-6 h-6 text-status-error" strokeWidth={2.5} />
          </div>
        </div>

        <h1 className="font-playfair text-4xl md:text-5xl font-bold text-status-error mb-4">
          {t("Status.failed.title")}
        </h1>
        <p className="text-text-secondary text-sm md:text-base leading-relaxed mb-8 max-w-sm">
          {t("Status.failed.subtitle")}
        </p>

        <div className="w-full flex flex-col gap-3 mb-10">
          <button
            type="button"
            onClick={handleRetry}
            disabled={isRetrying}
            className="w-full py-4 bg-status-error text-white font-bold text-xs uppercase tracking-widest rounded-xl hover:bg-status-error-hover transition-colors shadow-soft disabled:opacity-60"
          >
            {isRetrying
              ? locale === "ar"
                ? "جاري إعادة التوجيه..."
                : "Redirecting..."
              : t("Status.failed.retryBtn")}
          </button>
        </div>

        {retryError ? (
          <div className="w-full mb-4 rounded-xl border border-status-error/25 bg-status-error-soft px-4 py-3 text-sm text-status-error">
            {retryError}
          </div>
        ) : null}

        <div className="w-full text-left bg-bg-secondary p-8 rounded-2xl border border-border-color shadow-sm mb-6">
          <h3 className="font-playfair text-lg font-bold text-text-primary mb-6 uppercase tracking-wider">
            {t("Status.failed.orderSummary")}
          </h3>

          <div className="flex flex-col gap-4 text-sm font-montserrat">
            <div className="flex justify-between items-center text-text-secondary gap-3">
              <span className="uppercase text-[10px] tracking-wider font-bold">
                {t("Status.failed.referenceNo")}
              </span>
              <span className="font-semibold text-text-primary text-right break-all">
                {summary?.merchantOrderId || orderId || "--"}
              </span>
            </div>

            <div className="h-px w-full bg-border-color my-1" />

            <div className="flex justify-between items-center text-text-secondary gap-3">
              <span>{t("Status.failed.subtotal")}</span>
              <span className="font-medium text-text-primary">
                {currencyFormatter.format(
                  Number(summary?.finalPrice || summary?.totalPrice || 0),
                )}
              </span>
            </div>
            <div className="flex justify-between items-center text-text-secondary gap-3">
              <span>{t("Checkout.paymentMethod")}</span>
              <span className="font-medium text-text-primary">
                {summary?.paymentMethod === "cash_on_delivery"
                  ? t("Checkout.cashOnDelivery")
                  : t("Checkout.creditCard")}
              </span>
            </div>

            <div className="h-px w-full bg-border-color my-1" />

            <div className="flex justify-between items-center mt-1 gap-3">
              <span className="font-bold text-text-primary uppercase text-xs tracking-wider">
                {t("Status.failed.totalAmount")}
              </span>
              <span className="font-bold text-brand-mint text-lg">
                {currencyFormatter.format(
                  Number(summary?.finalPrice || summary?.totalPrice || 0),
                )}
              </span>
            </div>
          </div>
        </div>

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
