"use client";

import React, { useEffect, useMemo } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Check, LoaderCircle } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";
import { useCheckoutSummary } from "@/hooks/useCheckoutSummary";
import { useAppDispatch } from "@/store/hooks";
import { clearCart } from "@/store/slices/cartSlice";
import { clearPendingCheckout } from "@/utils/checkoutSession";

function getStatusLabel(summary, locale, t) {
  if (summary?.paymentMethod === "cash_on_delivery") {
    return locale === "ar" ? "قيد التأكيد عند الاستلام" : "Cash on delivery";
  }

  if (summary?.paymentStatus === "paid") {
    return t("Status.success.processing");
  }

  return locale === "ar" ? "جاري تأكيد الدفع" : "Payment confirmation in progress";
}

export default function SuccessPage() {
  const { t, locale } = useLanguage();
  const searchParams = useSearchParams();
  const dispatch = useAppDispatch();
  const { summary, status } = useCheckoutSummary(searchParams, { poll: true });

  useEffect(() => {
    if (!summary) {
      return;
    }

    if (summary.paymentMethod === "cash_on_delivery" || summary.paymentStatus === "paid") {
      dispatch(clearCart());
      clearPendingCheckout();
    }
  }, [dispatch, summary]);

  const currencyFormatter = useMemo(
    () =>
      new Intl.NumberFormat(locale === "ar" ? "ar-EG" : "en-US", {
        style: "currency",
        currency: "EGP",
        maximumFractionDigits: 0,
      }),
    [locale],
  );

  const orderLabel = summary?.merchantOrderId || summary?._id || searchParams.get("orderId") || "--";
  const orderTotal = currencyFormatter.format(
    Number(summary?.finalPrice || summary?.totalPrice || 0),
  );
  const statusLabel = getStatusLabel(summary, locale, t);
  const showPending = summary?.paymentMethod === "card" && summary?.paymentStatus !== "paid";

  return (
    <div className="min-h-screen bg-bg-primary flex flex-col items-center justify-center px-4 py-20 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand-mint/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-[480px] w-full flex flex-col items-center text-center relative z-10 transition-transform mt-[-5%]">
        <div className="w-24 h-24 bg-brand-mint/10 rounded-3xl flex items-center justify-center mb-6 shadow-sm border border-brand-mint/20">
          <div className="w-12 h-12 rounded-full border-2 border-brand-mint flex items-center justify-center bg-transparent">
            {showPending ? (
              <LoaderCircle className="w-6 h-6 text-brand-mint animate-spin" strokeWidth={2.5} />
            ) : (
              <Check className="w-6 h-6 text-brand-mint" strokeWidth={3} />
            )}
          </div>
        </div>

        <h1 className="font-playfair text-4xl md:text-5xl font-bold text-brand-dark dark:text-brand-mint mb-4">
          {t("Status.success.title")}
        </h1>
        <p className="text-text-secondary text-sm md:text-base leading-relaxed mb-8 max-w-sm">
          {showPending
            ? locale === "ar"
              ? "رجعنا من بوابة الدفع، وبنراجع حالة العملية الآن."
              : "We received your checkout return and are confirming the payment now."
            : t("Status.success.subtitle")}
        </p>

        <div className="w-full text-left bg-bg-secondary p-8 rounded-2xl border border-border-color shadow-sm mb-6">
          <div className="flex flex-col gap-6 text-sm font-montserrat">
            <div className="flex justify-between items-center text-text-secondary gap-3">
              <span className="uppercase text-[10px] tracking-widest font-bold">
                {t("Status.success.orderNumber")}
              </span>
              <span className="font-bold text-text-primary text-right break-all">{orderLabel}</span>
            </div>

            <div className="h-px w-full bg-border-color line-dashed opacity-50" />

            <div className="flex justify-between items-center text-text-secondary gap-3">
              <span className="uppercase text-[10px] tracking-widest font-bold">
                {t("Checkout.total")}
              </span>
              <span className="font-semibold text-text-primary">{orderTotal}</span>
            </div>

            <div className="h-px w-full bg-border-color line-dashed opacity-50" />

            <div className="flex justify-between items-center text-text-secondary gap-3">
              <span className="uppercase text-[10px] tracking-widest font-bold">
                {t("Status.success.status")}
              </span>
              <span className="font-bold text-brand-mint flex items-center gap-1.5 text-right">
                <span className="w-2 h-2 rounded-full bg-brand-mint animate-pulse" />
                {statusLabel}
              </span>
            </div>
          </div>
        </div>

        {status === "loading" ? (
          <p className="mb-6 text-xs text-text-secondary">
            {locale === "ar" ? "جاري تحديث حالة الطلب..." : "Refreshing order status..."}
          </p>
        ) : null}

        <div className="w-full flex flex-col gap-3 mb-10">
          <Link
            href="/all-products"
            className="w-full py-4 bg-brand-mint text-white font-bold text-xs uppercase tracking-widest rounded-xl hover:bg-brand-dark transition-all shadow-lg shadow-brand-mint/20 hover:scale-[1.02]"
          >
            {t("Status.success.continueShoppingBtn")}
          </Link>
        </div>

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
