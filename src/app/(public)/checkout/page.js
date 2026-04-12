"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  Lock,
  CreditCard,
  Banknote,
  ShoppingBag,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { clearCart } from "@/store/slices/cartSlice";
import { createOrder } from "@/services/orderService";
import { applyCoupon } from "@/services/couponService";
import EmptyState from "@/components/ui/EmptyState";

const initialForm = {
  customerName: "",
  phone: "",
  secondaryPhone: "",
  email: "",
  city: "",
  state: "",
  address1: "",
  address2: "",
  postalCode: "",
  orderNote: "",
};

export default function CheckoutPage() {
  const { t, locale } = useLanguage();
  const dispatch = useAppDispatch();
  const router = useRouter();
  const cartItems = useAppSelector((state) => state.cart.items || []);

  const [paymentMethod, setPaymentMethod] = useState("card");
  const [form, setForm] = useState(initialForm);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [promoCode, setPromoCode] = useState("");
  const [promoStatus, setPromoStatus] = useState("idle");
  const [promoMessage, setPromoMessage] = useState("");
  const [discountAmount, setDiscountAmount] = useState(0);
  const [appliedPromoCode, setAppliedPromoCode] = useState("");

  const subtotal = useMemo(
    () =>
      cartItems.reduce(
        (acc, item) =>
          acc + Number(item.priceValue || 0) * Number(item.quantity || 1),
        0,
      ),
    [cartItems],
  );

  const currencyFormatter = useMemo(
    () =>
      new Intl.NumberFormat(locale === "ar" ? "ar-EG" : "en-US", {
        style: "currency",
        currency: "EGP",
        maximumFractionDigits: 0,
      }),
    [locale],
  );

  const effectiveDiscount = useMemo(
    () => Math.min(Math.max(Number(discountAmount || 0), 0), subtotal),
    [discountAmount, subtotal],
  );

  const finalTotal = useMemo(
    () => Math.max(subtotal - effectiveDiscount, 0),
    [subtotal, effectiveDiscount],
  );

  const subtotalLabel = currencyFormatter.format(subtotal);
  const discountLabel = currencyFormatter.format(effectiveDiscount);
  const totalLabel = currencyFormatter.format(finalTotal);

  const handleFieldChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handlePromoInputChange = (event) => {
    const nextValue = String(event.target.value || "").toUpperCase();
    setPromoCode(nextValue);

    if (promoStatus !== "idle") {
      setPromoStatus("idle");
      setPromoMessage("");
    }

    if (appliedPromoCode && nextValue.trim() !== appliedPromoCode) {
      setAppliedPromoCode("");
      setDiscountAmount(0);
    }
  };

  const handleApplyPromo = async () => {
    const normalizedCode = promoCode.trim().toUpperCase();

    if (!normalizedCode) {
      setPromoStatus("error");
      setPromoMessage(
        locale === "ar"
          ? "\u0645\u0646 \u0641\u0636\u0644\u0643 \u0627\u062f\u062e\u0644 \u0643\u0648\u062f \u0627\u0644\u062e\u0635\u0645."
          : "Please enter a promo code.",
      );
      return;
    }

    if (subtotal <= 0) {
      return;
    }

    setPromoStatus("applying");
    setPromoMessage("");

    try {
      const result = await applyCoupon({
        code: normalizedCode,
        orderTotal: subtotal,
      });

      const nextDiscount = Math.min(
        Math.max(Number(result.discount || 0), 0),
        subtotal,
      );

      setDiscountAmount(nextDiscount);
      setAppliedPromoCode(normalizedCode);
      setPromoStatus("success");
      setPromoMessage(
        locale === "ar"
          ? "\u062a\u0645 \u062a\u0637\u0628\u064a\u0642 \u0643\u0648\u062f \u0627\u0644\u062e\u0635\u0645 \u0628\u0646\u062c\u0627\u062d."
          : "Promo code applied successfully.",
      );
    } catch (error) {
      setDiscountAmount(0);
      setAppliedPromoCode("");
      setPromoStatus("error");
      setPromoMessage(
        error?.message ||
          (locale === "ar"
            ? "\u0627\u0644\u0643\u0648\u062f \u063a\u064a\u0631 \u0635\u062d\u064a\u062d \u0623\u0648 \u0645\u0646\u062a\u0647\u064a \u0627\u0644\u0635\u0644\u0627\u062d\u064a\u0629."
            : "Invalid or expired promo code."),
      );
    }
  };

  const canSubmit =
    cartItems.length > 0 &&
    form.customerName.trim() &&
    form.phone.trim() &&
    (form.address1.trim() || form.city.trim());

  const submitOrder = async (event) => {
    event.preventDefault();

    if (!canSubmit || isSubmitting) {
      return;
    }

    setSubmitError("");
    setIsSubmitting(true);

    try {
      const payload = {
        customerName: form.customerName.trim(),
        phone: form.phone.trim(),
        secondaryPhone: form.secondaryPhone.trim(),
        email: form.email.trim(),
        address:
          `${form.address1} ${form.address2}`.trim() || form.address1.trim(),
        shippingAddress: {
          country: "Egypt",
          governorate: form.state.trim(),
          city: form.city.trim(),
          street: form.address1.trim(),
          area: form.address2.trim(),
          postalCode: form.postalCode.trim(),
          fullAddress:
            `${form.address1} ${form.address2} ${form.city} ${form.state} ${form.postalCode}`
              .replace(/\s+/g, " ")
              .trim(),
        },
        orderNote: form.orderNote.trim(),
        paymentMethod: paymentMethod === "cash" ? "cash_on_delivery" : "card",
        items: cartItems.map((item) => ({
          productId: item.productId,
          quantity: Number(item.quantity || 1),
        })),
      };

      await createOrder(payload);
      dispatch(clearCart());
      router.push("/success");
    } catch (error) {
      setSubmitError(
        error?.message || "Failed to create order. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-bg-primary pt-10 pb-20 px-4 md:px-8">
        <div className="max-w-[900px] mx-auto">
          <EmptyState
            icon={ShoppingBag}
            title={t("CartDrawer.emptyTitle") || "Your Cart is Empty"}
            description={
              t("CartDrawer.emptyDesc") ||
              "You haven't added any items to your cart yet."
            }
            actionButton={
              <Link
                href="/all-products"
                className="inline-flex items-center justify-center px-6 py-3 rounded-full bg-brand-mint text-white font-semibold hover:bg-brand-orange transition-colors"
              >
                {t("Wishlist.browseCatalog")}
              </Link>
            }
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg-primary pt-10 pb-20 px-4 md:px-8 overflow-hidden">
      <div className="max-w-[1200px] mx-auto">
        <div className="flex items-center gap-2 text-[10px] md:text-xs font-montserrat uppercase tracking-[0.1em] text-text-secondary mb-8 overflow-x-auto whitespace-nowrap pb-2">
          <Link href="/" className="hover:text-brand-mint transition-colors">
            Home
          </Link>
          <span>&gt;</span>
          <span>{t("Checkout.title")}</span>
        </div>

        <h1 className="font-playfair text-3xl md:text-4xl lg:text-5xl font-bold text-text-primary mb-10">
          {t("Checkout.title")}
        </h1>

        <div className="flex flex-col lg:flex-row gap-10 lg:gap-14">
          <div className="flex-1">
            <form className="flex flex-col gap-10" onSubmit={submitOrder}>
              <section>
                <h3 className="font-playfair text-xl md:text-2xl font-bold text-text-primary mb-6">
                  {t("Checkout.contactInfo")}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <input
                    name="customerName"
                    value={form.customerName}
                    onChange={handleFieldChange}
                    placeholder={t("Checkout.fullNameHolder")}
                    className="w-full px-4 py-3.5 bg-bg-primary border border-border-color rounded-xl text-sm"
                    required
                  />
                  <input
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleFieldChange}
                    placeholder={t("Checkout.emailHolder")}
                    className="w-full px-4 py-3.5 bg-bg-primary border border-border-color rounded-xl text-sm"
                  />
                  <input
                    name="phone"
                    value={form.phone}
                    onChange={handleFieldChange}
                    placeholder={t("Checkout.phoneHolder")}
                    className="w-full px-4 py-3.5 bg-bg-primary border border-border-color rounded-xl text-sm"
                    required
                  />
                  <input
                    name="secondaryPhone"
                    value={form.secondaryPhone}
                    onChange={handleFieldChange}
                    placeholder={t("Checkout.altPhoneHolder")}
                    className="w-full px-4 py-3.5 bg-bg-primary border border-border-color rounded-xl text-sm"
                  />
                </div>
              </section>

              <section>
                <h3 className="font-playfair text-xl md:text-2xl font-bold text-text-primary mb-6">
                  {t("Checkout.shippingAddress")}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <input
                    name="address1"
                    value={form.address1}
                    onChange={handleFieldChange}
                    placeholder={t("Checkout.address1Holder")}
                    className="w-full px-4 py-3.5 bg-bg-primary border border-border-color rounded-xl text-sm md:col-span-2"
                    required
                  />
                  <input
                    name="address2"
                    value={form.address2}
                    onChange={handleFieldChange}
                    placeholder={t("Checkout.address2Holder")}
                    className="w-full px-4 py-3.5 bg-bg-primary border border-border-color rounded-xl text-sm md:col-span-2"
                  />
                  <input
                    name="city"
                    value={form.city}
                    onChange={handleFieldChange}
                    placeholder={t("Checkout.cityHolder")}
                    className="w-full px-4 py-3.5 bg-bg-primary border border-border-color rounded-xl text-sm"
                    required
                  />
                  <input
                    name="state"
                    value={form.state}
                    onChange={handleFieldChange}
                    placeholder={t("Checkout.stateHolder")}
                    className="w-full px-4 py-3.5 bg-bg-primary border border-border-color rounded-xl text-sm"
                  />
                  <input
                    name="postalCode"
                    value={form.postalCode}
                    onChange={handleFieldChange}
                    placeholder={t("Checkout.postalHolder")}
                    className="w-full px-4 py-3.5 bg-bg-primary border border-border-color rounded-xl text-sm"
                  />
                </div>
              </section>

              <section>
                <h3 className="font-playfair text-xl md:text-2xl font-bold text-text-primary mb-6">
                  {t("Checkout.paymentMethod")}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <label
                    className={`relative flex items-center justify-between p-5 cursor-pointer rounded-xl border-2 transition-all shadow-sm ${paymentMethod === "card" ? "border-brand-mint bg-brand-mint/5" : "border-border-color bg-bg-primary"}`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="card"
                      checked={paymentMethod === "card"}
                      onChange={() => setPaymentMethod("card")}
                      className="sr-only"
                    />
                    <div className="flex items-center gap-4">
                      <span className="font-semibold text-sm">
                        {t("Checkout.creditCard")}
                      </span>
                    </div>
                    <CreditCard className="w-6 h-6" />
                  </label>

                  <label
                    className={`relative flex items-center justify-between p-5 cursor-pointer rounded-xl border-2 transition-all shadow-sm ${paymentMethod === "cash" ? "border-brand-mint bg-brand-mint/5" : "border-border-color bg-bg-primary"}`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="cash"
                      checked={paymentMethod === "cash"}
                      onChange={() => setPaymentMethod("cash")}
                      className="sr-only"
                    />
                    <div className="flex items-center gap-4">
                      <span className="font-semibold text-sm">
                        {t("Checkout.cashOnDelivery")}
                      </span>
                    </div>
                    <Banknote className="w-6 h-6" />
                  </label>
                </div>
              </section>

              <section>
                <textarea
                  name="orderNote"
                  rows="4"
                  value={form.orderNote}
                  onChange={handleFieldChange}
                  placeholder={t("Checkout.orderNotesHolder")}
                  className="w-full px-4 py-3.5 bg-bg-primary border border-border-color rounded-xl text-sm resize-none"
                />
              </section>

              {submitError ? (
                <div className="rounded-xl border border-status-error/25 bg-status-error-soft px-4 py-3 text-sm text-status-error">
                  {submitError}
                </div>
              ) : null}

              <button
                type="submit"
                disabled={!canSubmit || isSubmitting}
                className="w-full py-4 bg-brand-mint text-white text-center font-bold text-xs uppercase tracking-widest rounded-xl hover:bg-opacity-90 transition-all disabled:opacity-60"
              >
                {isSubmitting ? "Processing..." : t("Checkout.continue")}
              </button>
            </form>
          </div>

          <div className="lg:w-[420px] xl:w-[480px]">
            <div className="bg-bg-primary p-6 md:p-8 rounded-3xl border border-border-color shadow-card sticky top-24">
              <h3 className="font-playfair text-2xl font-bold text-text-primary mb-8">
                {t("Checkout.orderSummary")}
              </h3>

              <div className="flex flex-col gap-6 mb-8">
                {cartItems.map((item) => (
                  <div
                    key={`${item.productId}-${item.size || "default"}`}
                    className="flex items-center gap-4"
                  >
                    <div className="relative w-16 h-16 bg-surface-muted rounded-lg shrink-0">
                      <Image
                        src={item.image}
                        alt={item.title}
                        fill
                        sizes="64px"
                        className="object-cover rounded-lg"
                      />
                      <span className="absolute -top-2 -right-2 w-5 h-5 bg-brand-mint text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-sm">
                        {item.quantity}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-text-primary font-bold text-sm truncate">
                        {item.title}
                      </h4>
                      {item.size ? (
                        <p className="text-text-secondary text-xs mt-0.5">
                          {item.size}
                        </p>
                      ) : null}
                    </div>
                    <div className="text-text-primary font-bold text-sm shrink-0">
                      {currencyFormatter.format(
                        Number(item.priceValue || 0) *
                          Number(item.quantity || 1),
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mb-6">
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={promoCode}
                    onChange={handlePromoInputChange}
                    placeholder={t("Checkout.promoPlaceholder")}
                    className="flex-1 px-4 py-3 bg-bg-primary border border-border-color rounded-xl text-sm text-text-primary uppercase tracking-wide focus:outline-none focus:border-brand-mint"
                  />
                  <button
                    type="button"
                    onClick={handleApplyPromo}
                    disabled={promoStatus === "applying"}
                    className="px-4 py-3 rounded-xl bg-brand-mint text-white text-xs font-bold tracking-widest uppercase hover:opacity-90 transition-all disabled:opacity-60"
                  >
                    {promoStatus === "applying"
                      ? locale === "ar"
                        ? "\u062c\u0627\u0631\u064a..."
                        : "Applying..."
                      : t("Checkout.apply")}
                  </button>
                </div>

                {promoStatus === "success" ? (
                  <div className="mt-2 flex items-center gap-1.5 text-xs text-status-success">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>
                      {promoMessage}
                      {appliedPromoCode ? ` (${appliedPromoCode})` : ""}
                    </span>
                  </div>
                ) : null}

                {promoStatus === "error" ? (
                  <div className="mt-2 flex items-center gap-1.5 text-xs text-status-error">
                    <XCircle className="w-4 h-4" />
                    <span>{promoMessage}</span>
                  </div>
                ) : null}
              </div>

              <div className="flex flex-col gap-4 py-6 border-y border-border-color mb-6">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-text-secondary">
                    {t("Checkout.subtotal")}
                  </span>
                  <span className="font-semibold text-text-primary">
                    {subtotalLabel}
                  </span>
                </div>
                {effectiveDiscount > 0 ? (
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-text-secondary">
                      {locale === "ar" ? "\u0627\u0644\u062e\u0635\u0645" : "Discount"}
                    </span>
                    <span className="font-semibold text-status-success">
                      - {discountLabel}
                    </span>
                  </div>
                ) : null}
                <div className="flex justify-between items-center text-sm">
                  <span className="text-text-secondary">
                    {t("Checkout.shipping")}
                  </span>
                  <span className="font-semibold text-brand-mint">
                    {t("Checkout.free")}
                  </span>
                </div>
              </div>

              <div className="flex justify-between items-center mb-8">
                <span className="text-text-primary font-playfair text-xl font-bold">
                  {t("Checkout.total")}
                </span>
                <span className="text-text-primary font-playfair text-2xl font-bold">
                  {totalLabel}
                </span>
              </div>

              <div className="flex items-center justify-center gap-2 text-text-secondary/70">
                <Lock className="w-3.5 h-3.5" />
                <span className="text-[10px] tracking-wide">
                  {t("Checkout.secureCheckout")}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}



