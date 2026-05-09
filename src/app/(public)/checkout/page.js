"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import Image from "@/components/ui/AppImage";
import { useRouter } from "next/navigation";
import {
  Lock,
  CreditCard,
  Banknote,
  ShoppingBag,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLanguage } from "@/hooks/useLanguage";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { clearCart } from "@/store/slices/cartSlice";
import { createOrder } from "@/services/orderService";
import { applyCoupon } from "@/services/couponService";
import EmptyState from "@/components/ui/EmptyState";
import { savePendingCheckout } from "@/utils/checkoutSession";
import { saveOrderReference } from "@/utils/ordersStorage";
const DEFAULT_DIAL_CODE = "+20";

const PHONE_COUNTRIES = [
  { dialCode: "+20", flag: "EG", labelEn: "Egypt", labelAr: "مصر" },
  {
    dialCode: "+966",
    flag: "SA",
    labelEn: "Saudi Arabia",
    labelAr: "السعودية",
  },
  { dialCode: "+971", flag: "AE", labelEn: "UAE", labelAr: "الإمارات" },
  { dialCode: "+965", flag: "KW", labelEn: "Kuwait", labelAr: "الكويت" },
  { dialCode: "+974", flag: "QA", labelEn: "Qatar", labelAr: "قطر" },
  {
    dialCode: "+1",
    flag: "US",
    labelEn: "United States",
    labelAr: "الولايات المتحدة",
  },
  {
    dialCode: "+44",
    flag: "GB",
    labelEn: "United Kingdom",
    labelAr: "المملكة المتحدة",
  },
];

const initialFormValues = {
  customerName: "",
  phoneCountryCode: DEFAULT_DIAL_CODE,
  phone: "",
  walletPhone: "",
  secondaryPhoneCountryCode: DEFAULT_DIAL_CODE,
  secondaryPhone: "",
  email: "",
  city: "",
  state: "",
  address1: "",
  address2: "",
  postalCode: "",
  orderNote: "",
  paymentMethod: "card",
};

function normalizeDigits(value) {
  return String(value || "").replace(/\D/g, "");
}

function toFlagEmoji(countryCode) {
  return countryCode
    .toUpperCase()
    .replace(/./g, (char) => String.fromCodePoint(127397 + char.charCodeAt(0)));
}

function formatInternationalPhone(dialCode, localPhone) {
  const cleaned = normalizeDigits(localPhone).replace(/^0+/, "");
  return `${dialCode}${cleaned}`;
}

function createCheckoutSchema(locale) {
  const isArabic = locale === "ar";

  const blockedDomains = [
    "mailinator.com",
    "tempmail.com",
    "10minutemail.com",
    "guerrillamail.com",
    "fakeinbox.com",
  ];

  return z
    .object({
      customerName: z
        .string()
        .trim()
        .min(
          5,
          isArabic
            ? "أدخل الاسم الكامل الحقيقي."
            : "Enter your full real name.",
        )
        .max(80, isArabic ? "الاسم طويل جدًا." : "Name is too long.")
        .refine(
          (value) =>
            /^[\p{L}\s]+$/u.test(value) &&
            value.trim().split(/\s+/).length >= 2,
          isArabic
            ? "يجب إدخال الاسم الأول واسم العائلة بحروف فقط."
            : "Please enter first and last name using letters only.",
        ),

      phoneCountryCode: z
        .string()
        .trim()
        .min(
          1,
          isArabic ? "اختر كود الدولة." : "Please select a country code.",
        ),

      phone: z
        .string()
        .trim()
        .transform(normalizeDigits)
        .refine(
          (value) => /^[0-9]{7,15}$/.test(value),
          isArabic ? "أدخل رقم هاتف صحيح." : "Enter a valid phone number.",
        ),

      walletPhone: z
        .string()
        .trim()
        .transform(normalizeDigits)
        .refine(
          (value) => value === "" || /^[0-9]{7,15}$/.test(value),
          isArabic ? "أدخل رقم محفظة صحيح." : "Enter a valid wallet number.",
        )
        .optional()
        .default(""),

      secondaryPhoneCountryCode: z
        .string()
        .trim()
        .optional()
        .default(DEFAULT_DIAL_CODE),

      secondaryPhone: z
        .string()
        .trim()
        .transform(normalizeDigits)
        .refine(
          (value) => value === "" || /^[0-9]{7,15}$/.test(value),
          isArabic
            ? "أدخل رقم هاتف بديل صحيح."
            : "Enter a valid alternate phone number.",
        )
        .optional()
        .default(""),

      email: z
        .string()
        .trim()
        .min(1, isArabic ? "البريد الإلكتروني مطلوب." : "Email is required.")
        .email(
          isArabic
            ? "أدخل بريد إلكتروني صحيح."
            : "Enter a valid email address.",
        )
        .max(
          120,
          isArabic ? "البريد الإلكتروني طويل جدًا." : "Email is too long.",
        )
        .refine(
          (value) => {
            const domain = value.split("@")[1]?.toLowerCase();

            return !blockedDomains.includes(domain);
          },
          {
            message: isArabic
              ? "البريد الإلكتروني المؤقت غير مسموح."
              : "Disposable email addresses are not allowed.",
          },
        ),

      city: z
        .string()
        .trim()
        .min(2, isArabic ? "المدينة مطلوبة." : "City is required.")
        .max(
          60,
          isArabic ? "اسم المدينة طويل جدًا." : "City name is too long.",
        ),

      state: z
        .string()
        .trim()
        .min(2, isArabic ? "المحافظة مطلوبة." : "State/Province is required.")
        .max(
          60,
          isArabic
            ? "اسم المحافظة طويل جدًا."
            : "State/Province name is too long.",
        ),

      address1: z
        .string()
        .trim()
        .min(
          10,
          isArabic
            ? "أدخل عنوانًا تفصيليًا صحيحًا."
            : "Please enter a detailed address.",
        )
        .max(160, isArabic ? "العنوان طويل جدًا." : "Address is too long."),

      address2: z
        .string()
        .trim()
        .max(
          160,
          isArabic
            ? "العنوان الإضافي طويل جدًا."
            : "Additional address is too long.",
        ),

      postalCode: z
        .string()
        .trim()
        .max(
          20,
          isArabic ? "الرمز البريدي طويل جدًا." : "Postal code is too long.",
        )
        .refine(
          (value) => value === "" || /^[a-zA-Z0-9\- ]+$/.test(value),
          isArabic ? "الرمز البريدي غير صحيح." : "Invalid postal code.",
        ),

      orderNote: z
        .string()
        .trim()
        .max(
          500,
          isArabic ? "ملاحظات الطلب طويلة جدًا." : "Order note is too long.",
        ),

      paymentMethod: z.enum(["card", "wallet", "kiosk", "cash"]),
    })

    .refine(
      (data) => !data.secondaryPhone || data.phone !== data.secondaryPhone,
      {
        message: isArabic
          ? "الرقم البديل يجب أن يكون مختلفًا."
          : "Alternate phone must be different.",
        path: ["secondaryPhone"],
      },
    )

    .refine(
      (data) => data.paymentMethod !== "wallet" || Boolean(data.walletPhone),
      {
        message: isArabic ? "رقم المحفظة مطلوب." : "Wallet number is required.",
        path: ["walletPhone"],
      },
    );
}

function getInputClass(hasError) {
  return `w-full px-4 py-3.5 bg-bg-primary border rounded-xl text-sm transition-colors ${
    hasError
      ? "border-status-error focus:outline-none focus:ring-2 focus:ring-status-error/15"
      : "border-border-color focus:outline-none focus:ring-2 focus:ring-brand-mint/15"
  }`;
}

function getPhoneInputClass(hasError) {
  return `flex-1 px-4 py-3.5 bg-transparent text-sm transition-colors focus:outline-none ${
    hasError ? "text-status-error" : "text-text-primary"
  }`;
}

export default function CheckoutPage() {
  const { t, locale } = useLanguage();
  const dispatch = useAppDispatch();
  const router = useRouter();
  const cartItems = useAppSelector((state) => state.cart.items || []);

  const [submitError, setSubmitError] = useState("");
  const [promoCode, setPromoCode] = useState("");
  const [promoStatus, setPromoStatus] = useState("idle");
  const [promoMessage, setPromoMessage] = useState("");
  const [discountAmount, setDiscountAmount] = useState(0);
  const [appliedPromoCode, setAppliedPromoCode] = useState("");

  const checkoutSchema = useMemo(() => createCheckoutSchema(locale), [locale]);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(checkoutSchema),
    defaultValues: initialFormValues,
    mode: "onBlur",
    reValidateMode: "onChange",
  });

  const paymentMethod = watch("paymentMethod");

  const countryOptions = useMemo(
    () =>
      PHONE_COUNTRIES.map((country) => ({
        ...country,
        label: locale === "ar" ? country.labelAr : country.labelEn,
      })),
    [locale],
  );

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

  const discountedSubtotal = useMemo(
    () => Math.max(subtotal - effectiveDiscount, 0),
    [subtotal, effectiveDiscount],
  );

  const finalTotal = useMemo(() => discountedSubtotal, [discountedSubtotal]);

  const subtotalLabel = currencyFormatter.format(subtotal);
  const discountLabel = currencyFormatter.format(effectiveDiscount);
  const totalLabel = currencyFormatter.format(finalTotal);

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
          ? "من فضلك أدخل كود الخصم."
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
          ? "تم تطبيق كود الخصم بنجاح."
          : "Promo code applied successfully.",
      );
    } catch (error) {
      setDiscountAmount(0);
      setAppliedPromoCode("");
      setPromoStatus("error");
      setPromoMessage(
        error?.message ||
          (locale === "ar"
            ? "الكود غير صحيح أو منتهي الصلاحية."
            : "Invalid or expired promo code."),
      );
    }
  };

  const submitOrder = async (values) => {
    console.log(cartItems);
    if (cartItems.length === 0) {
      return;
    }

    setSubmitError("");

    try {
      console.log(values.paymentMethod);
      const payload = {
        customerName: values.customerName.trim(),
        phone:
          values.paymentMethod === "wallet"
            ? normalizeDigits(values.walletPhone)
            : formatInternationalPhone(values.phoneCountryCode, values.phone),
        secondaryPhone: values.secondaryPhone
          ? formatInternationalPhone(
              values.secondaryPhoneCountryCode,
              values.secondaryPhone,
            )
          : "",
        email: values.email.trim(),
        address:
          `${values.address1} ${values.address2}`.trim() ||
          values.address1.trim(),
        shippingAddress: {
          country: "Egypt",
          governorate: values.state.trim(),
          city: values.city.trim(),
          street: values.address1.trim(),
          area: values.address2.trim(),
          postalCode: values.postalCode.trim(),
          fullAddress:
            `${values.address1} ${values.address2} ${values.city} ${values.state} ${values.postalCode}`
              .replace(/\s+/g, " ")
              .trim(),
        },
        orderNote: values.orderNote.trim(),
        paymentMethod:
          values.paymentMethod === "cash"
            ? "cash_on_delivery"
            : values.paymentMethod,
        items: cartItems.map((item) => ({
          productId: item.productId,

          quantity: Number(item.quantity || 1),

          size: item.size || "",
        })),
      };

      const hasExceededStock = cartItems.some(
        (item) => Number(item.quantity || 0) > Number(item.stock || 0),
      );

      if (hasExceededStock) {
        setSubmitError(
          locale === "ar"
            ? "بعض المنتجات لم تعد متوفرة بالكمية المطلوبة."
            : "Some products are no longer available in the requested quantity.",
        );

        return;
      }

      const result = await createOrder(payload);
      const nextOrder = result?.order || {};
      const nextPayment = result?.payment || {};
      console.log("NEXT PAYMENT:", nextPayment);

      savePendingCheckout({
        orderId: nextOrder._id || "",
        merchantOrderId: nextOrder.merchantOrderId || "",
        totalPrice: nextOrder.finalPrice || nextOrder.totalPrice || finalTotal,
        paymentMethod: nextOrder.paymentMethod || payload.paymentMethod,
        paymentStatus: nextOrder.paymentStatus || "pending",
        orderStatus: nextOrder.orderStatus || "new",
        createdAt: nextOrder.createdAt || new Date().toISOString(),
      });
      saveOrderReference({
        orderId: nextOrder._id,
        merchantOrderId: nextOrder.merchantOrderId,
        createdAt: nextOrder.createdAt,
      });

      if (nextOrder.paymentMethod === "cash_on_delivery") {
        dispatch(clearCart());
        router.push(`/success?orderId=${nextOrder._id || ""}&source=cod`);
        return;
      }

      if (nextPayment.mode === "redirect" && nextPayment.checkoutUrl) {
        window.location.assign(nextPayment.checkoutUrl);
        return;
      }

      if (nextPayment.mode === "kiosk" && nextPayment.billReference) {
        dispatch(clearCart());

        router.push(
          `/kiosk-success?reference=${nextPayment.billReference}&orderId=${nextOrder._id || ""}`,
        );

        return;
      }

      throw new Error(
        locale === "ar"
          ? "تعذر بدء عملية الدفع الإلكتروني. تحقق من إعدادات Paymob."
          : "Unable to start online payment. Please verify the Paymob checkout configuration.",
      );
    } catch (error) {
      const backendMessage =
        error?.response?.data?.message || error?.message || "";

      let friendlyMessage = backendMessage;

      if (backendMessage.toLowerCase().includes("receiver is not registered")) {
        friendlyMessage =
          locale === "ar"
            ? "رقم المحفظة غير مسجل في خدمة الدفع الإلكتروني."
            : "This wallet number is not registered for mobile payments.";
      }

      setSubmitError(
        friendlyMessage ||
          (locale === "ar"
            ? "حدث خطأ أثناء إنشاء الطلب."
            : "Failed to create order."),
      );
    }
  };

  if (cartItems.length === 0) {
    const invalidVariant = cartItems.some((item) => !item.size);

    if (invalidVariant) {
      setSubmitError(
        locale === "ar"
          ? "يوجد منتج بدون حجم محدد."
          : "A product variant is missing.",
      );

      return;
    }
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
            <form
              className="flex flex-col gap-10"
              onSubmit={handleSubmit(submitOrder)}
              noValidate
            >
              <section>
                <h3 className="font-playfair text-xl md:text-2xl font-bold text-text-primary mb-6">
                  {t("Checkout.contactInfo")}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <input
                      {...register("customerName")}
                      placeholder={t("Checkout.fullNameHolder")}
                      className={getInputClass(Boolean(errors.customerName))}
                    />
                    {errors.customerName ? (
                      <p className="mt-1.5 text-xs text-status-error">
                        {errors.customerName.message}
                      </p>
                    ) : null}
                  </div>

                  <div>
                    <input
                      {...register("email")}
                      type="email"
                      placeholder={t("Checkout.emailHolder")}
                      className={getInputClass(Boolean(errors.email))}
                    />
                    {errors.email ? (
                      <p className="mt-1.5 text-xs text-status-error">
                        {errors.email.message}
                      </p>
                    ) : null}
                  </div>

                  <div>
                    <div
                      className={`flex items-center mt-6 rounded-xl border overflow-hidden ${
                        errors.phone || errors.phoneCountryCode
                          ? "border-status-error"
                          : "border-border-color"
                      }`}
                    >
                      <select
                        {...register("phoneCountryCode")}
                        className="w-[130px] shrink-0 px-3 py-3.5 bg-bg-secondary text-text-primary text-sm border-e border-border-color focus:outline-none"
                      >
                        {countryOptions.map((country) => (
                          <option
                            key={country.dialCode}
                            value={country.dialCode}
                          >
                            {`${toFlagEmoji(country.flag)} ${country.dialCode}`}
                          </option>
                        ))}
                      </select>
                      <input
                        {...register("phone")}
                        inputMode="numeric"
                        onInput={(event) => {
                          event.currentTarget.value = normalizeDigits(
                            event.currentTarget.value,
                          );
                        }}
                        placeholder={t("Checkout.phoneHolder")}
                        className={getPhoneInputClass(
                          Boolean(errors.phone || errors.phoneCountryCode),
                        )}
                      />
                    </div>
                    {errors.phone || errors.phoneCountryCode ? (
                      <p className="mt-1.5 text-xs text-status-error">
                        {errors.phone?.message ||
                          errors.phoneCountryCode?.message}
                      </p>
                    ) : null}
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs text-text-secondary">
                        {locale === "ar" ? "رقم بديل" : "Alternate Phone"}
                      </span>
                      <span className="text-[10px] font-semibold text-brand-mint bg-brand-mint/10 px-2 py-0.5 rounded-full">
                        {locale === "ar" ? "اختياري" : "Optional"}
                      </span>
                    </div>
                    <div
                      className={`flex items-center rounded-xl border overflow-hidden ${
                        errors.secondaryPhone ||
                        errors.secondaryPhoneCountryCode
                          ? "border-status-error"
                          : "border-border-color"
                      }`}
                    >
                      <select
                        {...register("secondaryPhoneCountryCode")}
                        className="w-[130px] shrink-0 px-3 py-3.5 bg-bg-secondary text-text-primary text-sm border-e border-border-color focus:outline-none"
                      >
                        {countryOptions.map((country) => (
                          <option
                            key={country.dialCode}
                            value={country.dialCode}
                          >
                            {`${toFlagEmoji(country.flag)} ${country.dialCode}`}
                          </option>
                        ))}
                      </select>
                      <input
                        {...register("secondaryPhone")}
                        inputMode="numeric"
                        onInput={(event) => {
                          event.currentTarget.value = normalizeDigits(
                            event.currentTarget.value,
                          );
                        }}
                        placeholder={t("Checkout.altPhoneHolder")}
                        className={getPhoneInputClass(
                          Boolean(
                            errors.secondaryPhone ||
                            errors.secondaryPhoneCountryCode,
                          ),
                        )}
                      />
                    </div>
                    {errors.secondaryPhone ||
                    errors.secondaryPhoneCountryCode ? (
                      <p className="mt-1.5 text-xs text-status-error">
                        {errors.secondaryPhone?.message ||
                          errors.secondaryPhoneCountryCode?.message}
                      </p>
                    ) : null}
                  </div>
                </div>
              </section>

              <section>
                <h3 className="font-playfair text-xl md:text-2xl font-bold text-text-primary mb-6">
                  {t("Checkout.shippingAddress")}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="md:col-span-2">
                    <input
                      {...register("address1")}
                      placeholder={t("Checkout.address1Holder")}
                      className={getInputClass(Boolean(errors.address1))}
                    />
                    {errors.address1 ? (
                      <p className="mt-1.5 text-xs text-status-error">
                        {errors.address1.message}
                      </p>
                    ) : null}
                  </div>

                  <div className="md:col-span-2">
                    <input
                      {...register("address2")}
                      placeholder={t("Checkout.address2Holder")}
                      className={getInputClass(Boolean(errors.address2))}
                    />
                    {errors.address2 ? (
                      <p className="mt-1.5 text-xs text-status-error">
                        {errors.address2.message}
                      </p>
                    ) : null}
                  </div>

                  <div>
                    <input
                      {...register("city")}
                      placeholder={t("Checkout.cityHolder")}
                      className={getInputClass(Boolean(errors.city))}
                    />
                    {errors.city ? (
                      <p className="mt-1.5 text-xs text-status-error">
                        {errors.city.message}
                      </p>
                    ) : null}
                  </div>

                  <div>
                    <input
                      {...register("state")}
                      placeholder={t("Checkout.stateHolder")}
                      className={getInputClass(Boolean(errors.state))}
                    />
                    {errors.state ? (
                      <p className="mt-1.5 text-xs text-status-error">
                        {errors.state.message}
                      </p>
                    ) : null}
                  </div>

                  <div>
                    <input
                      {...register("postalCode")}
                      placeholder={t("Checkout.postalHolder")}
                      className={getInputClass(Boolean(errors.postalCode))}
                    />
                    {errors.postalCode ? (
                      <p className="mt-1.5 text-xs text-status-error">
                        {errors.postalCode.message}
                      </p>
                    ) : null}
                  </div>
                </div>
              </section>

              <section>
                <h3 className="font-playfair text-xl md:text-2xl font-bold text-text-primary mb-6">
                  {t("Checkout.paymentMethod")}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <label
                    className={`relative flex items-center justify-between p-5 cursor-pointer rounded-xl border-2 transition-all shadow-sm ${
                      paymentMethod === "card"
                        ? "border-brand-mint bg-brand-mint/5"
                        : "border-border-color bg-bg-primary"
                    }`}
                  >
                    <input
                      type="radio"
                      value="card"
                      {...register("paymentMethod")}
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
                    className={`relative flex items-center justify-between p-5 cursor-pointer rounded-xl border-2 transition-all shadow-sm ${
                      paymentMethod === "cash"
                        ? "border-brand-mint bg-brand-mint/5"
                        : "border-border-color bg-bg-primary"
                    }`}
                  >
                    <input
                      type="radio"
                      value="cash"
                      {...register("paymentMethod")}
                      className="sr-only"
                    />
                    <div className="flex items-center gap-4">
                      <span className="font-semibold text-sm">
                        {t("Checkout.cashOnDelivery")}
                      </span>
                    </div>
                    <Banknote className="w-6 h-6" />
                  </label>
                  <label
                    className={`relative flex items-center justify-between p-5 cursor-pointer rounded-xl border-2 transition-all shadow-sm ${
                      paymentMethod === "wallet"
                        ? "border-brand-mint bg-brand-mint/5"
                        : "border-border-color bg-bg-primary"
                    }`}
                  >
                    <input
                      type="radio"
                      value="wallet"
                      {...register("paymentMethod")}
                      className="sr-only"
                    />

                    <div className="flex items-center gap-4">
                      <span className="font-semibold text-sm">
                        {t("Checkout.wallet")}
                      </span>{" "}
                    </div>

                    <Banknote className="w-6 h-6" />
                  </label>
                  <label
                    className={`relative flex items-center justify-between p-5 cursor-pointer rounded-xl border-2 transition-all shadow-sm ${
                      paymentMethod === "kiosk"
                        ? "border-brand-mint bg-brand-mint/5"
                        : "border-border-color bg-bg-primary"
                    }`}
                  >
                    <input
                      type="radio"
                      value="kiosk"
                      {...register("paymentMethod")}
                      className="sr-only"
                    />

                    <div className="flex items-center gap-4">
                      <span className="font-semibold text-sm">
                        {t("Checkout.kiosk")}
                      </span>
                    </div>

                    <Banknote className="w-6 h-6" />
                  </label>
                  {paymentMethod === "wallet" ? (
                    <div className="mt-5">
                      <label className="mb-2 block text-sm font-semibold text-text-primary">
                        {locale === "ar" ? "رقم المحفظة" : "Wallet Number"}
                      </label>

                      <input
                        {...register("walletPhone")}
                        inputMode="numeric"
                        onInput={(event) => {
                          event.currentTarget.value = normalizeDigits(
                            event.currentTarget.value,
                          );
                        }}
                        placeholder={t("Checkout.walletPlaceholder")}
                        className={getInputClass(Boolean(errors.walletPhone))}
                      />

                      {errors.walletPhone ? (
                        <p className="mt-1.5 text-xs text-status-error">
                          {errors.walletPhone.message}
                        </p>
                      ) : null}
                    </div>
                  ) : null}
                </div>
              </section>

              <section>
                <textarea
                  {...register("orderNote")}
                  rows="4"
                  placeholder={t("Checkout.orderNotesHolder")}
                  className={getInputClass(Boolean(errors.orderNote))}
                />
                {errors.orderNote ? (
                  <p className="mt-1.5 text-xs text-status-error">
                    {errors.orderNote.message}
                  </p>
                ) : null}
              </section>

              {submitError ? (
                <div className="rounded-xl border border-status-error/25 bg-status-error-soft px-4 py-3 text-sm text-status-error">
                  {submitError}
                </div>
              ) : null}

              <button
                type="submit"
                disabled={isSubmitting}
                aria-label={t("Checkout.continue")}
                className="w-full py-4 cursor-pointer bg-brand-mint text-white text-center font-bold text-xs uppercase tracking-widest rounded-xl hover:bg-opacity-90 transition-all disabled:opacity-60"
              >
                {isSubmitting
                  ? paymentMethod === "card" || paymentMethod === "wallet"
                    ? locale === "ar"
                      ? "جاري تحويلك لصفحة الدفع..."
                      : "Redirecting to payment..."
                    : locale === "ar"
                      ? "جاري تأكيد الطلب..."
                      : "Placing order..."
                  : t("Checkout.continue")}
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
                          {locale === "ar"
                            ? `الحجم: ${item.size}`
                            : `Size: ${item.size}`}
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
                        ? "جاري..."
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
                      {locale === "ar" ? "الخصم" : "Discount"}
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
