"use client";

import React, { useEffect, useMemo, useState } from "react";
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
import { fetchShippingSettings } from "@/services/shippingService";
import EmptyState from "@/components/ui/EmptyState";
import { savePendingCheckout } from "@/utils/checkoutSession";
import { saveOrderReference } from "@/utils/ordersStorage";
const DEFAULT_DIAL_CODE = "+20";

const DEFAULT_FALLBACK_GOVERNORATES = [
  { name_ar: "القاهرة", name_en: "Cairo", shippingCost: 50, isFreeShipping: false, isActive: true },
  { name_ar: "الجيزة", name_en: "Giza", shippingCost: 50, isFreeShipping: false, isActive: true },
  { name_ar: "الإسكندرية", name_en: "Alexandria", shippingCost: 55, isFreeShipping: false, isActive: true },
  { name_ar: "القليوبية", name_en: "Qalyubia", shippingCost: 55, isFreeShipping: false, isActive: true },
  { name_ar: "الدقهلية", name_en: "Dakahlia", shippingCost: 60, isFreeShipping: false, isActive: true },
  { name_ar: "الشرقية", name_en: "Sharqia", shippingCost: 60, isFreeShipping: false, isActive: true },
  { name_ar: "الغربية", name_en: "Gharbia", shippingCost: 60, isFreeShipping: false, isActive: true },
  { name_ar: "المنوفية", name_en: "Monufia", shippingCost: 60, isFreeShipping: false, isActive: true },
  { name_ar: "كفر الشيخ", name_en: "Kafr El Sheikh", shippingCost: 60, isFreeShipping: false, isActive: true },
  { name_ar: "البحيرة", name_en: "Beheira", shippingCost: 60, isFreeShipping: false, isActive: true },
  { name_ar: "دمياط", name_en: "Damietta", shippingCost: 60, isFreeShipping: false, isActive: true },
  { name_ar: "بورسعيد", name_en: "Port Said", shippingCost: 60, isFreeShipping: false, isActive: true },
  { name_ar: "الإسماعيلية", name_en: "Ismailia", shippingCost: 60, isFreeShipping: false, isActive: true },
  { name_ar: "السويس", name_en: "Suez", shippingCost: 60, isFreeShipping: false, isActive: true },
  { name_ar: "بني سويف", name_en: "Beni Suef", shippingCost: 65, isFreeShipping: false, isActive: true },
  { name_ar: "الفيوم", name_en: "Fayoum", shippingCost: 65, isFreeShipping: false, isActive: true },
  { name_ar: "المنيا", name_en: "Minya", shippingCost: 70, isFreeShipping: false, isActive: true },
  { name_ar: "أسيوط", name_en: "Asyut", shippingCost: 70, isFreeShipping: false, isActive: true },
  { name_ar: "سوهاج", name_en: "Sohag", shippingCost: 75, isFreeShipping: false, isActive: true },
  { name_ar: "قنا", name_en: "Qena", shippingCost: 75, isFreeShipping: false, isActive: true },
  { name_ar: "الأقصر", name_en: "Luxor", shippingCost: 80, isFreeShipping: false, isActive: true },
  { name_ar: "أسوان", name_en: "Aswan", shippingCost: 80, isFreeShipping: false, isActive: true },
  { name_ar: "البحر الأحمر", name_en: "Red Sea", shippingCost: 85, isFreeShipping: false, isActive: true },
  { name_ar: "مطروح", name_en: "Matrouh", shippingCost: 85, isFreeShipping: false, isActive: true },
  { name_ar: "الوادي الجديد", name_en: "New Valley", shippingCost: 90, isFreeShipping: false, isActive: true },
  { name_ar: "شمال سيناء", name_en: "North Sinai", shippingCost: 90, isFreeShipping: false, isActive: true },
  { name_ar: "جنوب سيناء", name_en: "South Sinai", shippingCost: 90, isFreeShipping: false, isActive: true },
];

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
  city: "",
  state: "",
  address1: "",
  address2: "",
  orderNote: "",
  paymentMethod: "cash",
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

  return z.object({
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
      .optional()
      .default(DEFAULT_DIAL_CODE),

    phone: z
      .string()
      .trim()
      .transform(normalizeDigits)
      .refine(
        (value) => /^[0-9]{7,15}$/.test(value),
        isArabic ? "أدخل رقم هاتف صحيح." : "Enter a valid phone number.",
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

    orderNote: z
      .string()
      .trim()
      .max(
        500,
        isArabic ? "ملاحظات الطلب طويلة جدًا." : "Order note is too long.",
      ),

    paymentMethod: z.enum(["card", "kiosk", "cash"]),
  });
}

function getInputClass(hasError) {
  return `w-full px-4 py-3.5 bg-bg-primary border rounded-xl text-sm transition-colors ${hasError
    ? "border-status-error focus:outline-none focus:ring-2 focus:ring-status-error/15"
    : "border-border-color focus:outline-none focus:ring-2 focus:ring-brand-mint/15"
    }`;
}

function getPhoneInputClass(hasError) {
  return `flex-1 px-4 py-3.5 bg-transparent text-sm transition-colors focus:outline-none ${hasError ? "text-status-error" : "text-text-primary"
    }`;
}

export default function CheckoutPage() {
  const { t, locale } = useLanguage();
  const dispatch = useAppDispatch();
  const router = useRouter();
  const reduxCartItems = useAppSelector((state) => state.cart.items || []);
  const [cartItems, setCartItems] = useState([]);
  const [isBuyNow, setIsBuyNow] = useState(false);
  const [trackedCheckout, setTrackedCheckout] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const urlParams = new URLSearchParams(window.location.search);
      const buyNowFlag = urlParams.get("buyNow") === "true";
      setIsBuyNow(buyNowFlag);

      if (buyNowFlag) {
        const raw = sessionStorage.getItem("buy_now_checkout_item");
        if (raw) {
          try {
            const parsed = JSON.parse(raw);
            setCartItems(Array.isArray(parsed) ? parsed : [parsed]);
            return;
          } catch (e) {
            console.error("Failed to parse buyNow checkout item", e);
          }
        }
      }
    }
    setCartItems(reduxCartItems);
  }, [reduxCartItems]);

  const [submitError, setSubmitError] = useState("");
  const [promoCode, setPromoCode] = useState("");
  const [promoStatus, setPromoStatus] = useState("idle");
  const [promoMessage, setPromoMessage] = useState("");
  const [discountAmount, setDiscountAmount] = useState(0);
  const [appliedPromoCode, setAppliedPromoCode] = useState("");
  const [shippingSettings, setShippingSettings] = useState(null);

  useEffect(() => {
    let isMounted = true;
    fetchShippingSettings().then((data) => {
      if (isMounted && data) {
        setShippingSettings(data);
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

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
  const selectedState = watch("state");

  const governoratesList = useMemo(() => {
    if (
      shippingSettings &&
      Array.isArray(shippingSettings.governorates) &&
      shippingSettings.governorates.length > 0
    ) {
      return shippingSettings.governorates.filter((g) => g.isActive !== false);
    }
    return DEFAULT_FALLBACK_GOVERNORATES;
  }, [shippingSettings]);

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

  const isGlobalFree = Boolean(shippingSettings?.globalFreeShipping);

  const matchedGovernorate = useMemo(() => {
    if (!selectedState) return null;
    const term = String(selectedState).trim().toLowerCase();
    return (
      governoratesList.find(
        (g) =>
          g.name_ar.toLowerCase() === term ||
          g.name_en.toLowerCase() === term,
      ) || null
    );
  }, [selectedState, governoratesList]);

  const isGovFree = Boolean(matchedGovernorate?.isFreeShipping);

  const isFreeShipping =
    isGlobalFree ||
    isGovFree ||
    (matchedGovernorate && Number(matchedGovernorate.shippingCost) === 0);

  const shippingCost = useMemo(() => {
    if (subtotal <= 0) return 0;
    if (isFreeShipping) return 0;
    if (matchedGovernorate) {
      return Number(matchedGovernorate.shippingCost) || 0;
    }
    return Number(shippingSettings?.defaultShippingCost) || 50;
  }, [subtotal, isFreeShipping, matchedGovernorate, shippingSettings]);

  const effectiveDiscount = useMemo(
    () => Math.min(Math.max(Number(discountAmount || 0), 0), subtotal),
    [discountAmount, subtotal],
  );

  const discountedSubtotal = useMemo(
    () => Math.max(subtotal - effectiveDiscount, 0),
    [subtotal, effectiveDiscount],
  );

  const finalTotal = useMemo(
    () => Math.max(discountedSubtotal + (selectedState ? shippingCost : 0), 0),
    [discountedSubtotal, shippingCost, selectedState],
  );

  useEffect(() => {
    if (typeof window !== 'undefined' && window.fbq && finalTotal > 0 && !trackedCheckout) {
      window.fbq('track', 'InitiateCheckout', {
        value: finalTotal,
        currency: 'EGP'
      });
      setTrackedCheckout(true);
    }
  }, [finalTotal, trackedCheckout]);

  const subtotalLabel = currencyFormatter.format(subtotal);
  const discountLabel = currencyFormatter.format(effectiveDiscount);
  const totalLabel = currencyFormatter.format(finalTotal);

  const shippingLabel = useMemo(() => {
    if (!selectedState) {
      return t("Checkout.selectGovernorateNotice") || (locale === "ar" ? "حدد المحافظة" : "Select governorate");
    }
    if (isFreeShipping || shippingCost === 0) {
      return t("Checkout.free") || (locale === "ar" ? "مجاني" : "Free");
    }
    return currencyFormatter.format(shippingCost);
  }, [selectedState, isFreeShipping, shippingCost, t, locale, currencyFormatter]);

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
    if (cartItems.length === 0) {
      return;
    }

    setSubmitError("");

    try {
      const payload = {
        customerName: values.customerName.trim(),
        phone: formatInternationalPhone(
          values.phoneCountryCode || DEFAULT_DIAL_CODE,
          values.phone,
        ),
        email: "",
        address:
          `${values.address1} ${values.address2}`.trim() ||
          values.address1.trim(),
        shippingAddress: {
          country: "Egypt",
          governorate: values.state.trim(),
          city: values.city.trim(),
          street: values.address1.trim(),
          area: values.address2.trim(),
          postalCode: "",
          fullAddress:
            `${values.address1} ${values.address2} ${values.city} ${values.state}`
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
        if (!isBuyNow) {
          dispatch(clearCart());
        } else {
          sessionStorage.removeItem("buy_now_checkout_item");
        }
        router.push(`/success?orderId=${nextOrder._id || ""}&paymentMethod=${nextOrder.paymentMethod || "cash_on_delivery"}&finalPrice=${nextOrder.finalPrice || finalTotal}&merchantOrderId=${nextOrder.merchantOrderId || ""}`);
        return;
      }

      if (
        nextOrder.paymentMethod === "card" ||
        nextOrder.paymentMethod === "wallet"
      ) {
        const redirectUrl =
          nextPayment.iframeUrl ||
          nextPayment.redirectionUrl ||
          nextPayment.paymentUrl ||
          nextPayment.redirectUrl;

        if (redirectUrl) {
          window.location.href = redirectUrl;
          return;
        }

        setSubmitError(
          locale === "ar"
            ? "فشل في تحويلك لصفحة الدفع الإلكتروني. يرجى المحاولة مرة أخرى."
            : "Failed to redirect to payment gateway. Please try again.",
        );
        return;
      }

      if (nextOrder.paymentMethod === "kiosk") {
        if (!isBuyNow) {
          dispatch(clearCart());
        } else {
          sessionStorage.removeItem("buy_now_checkout_item");
        }

        const billReference =
          nextPayment.billReference || nextPayment.paymentUrl;

        router.push(
          `/kiosk-success?billReference=${billReference}&finalPrice=${nextOrder.finalPrice || finalTotal}&merchantOrderId=${nextOrder.merchantOrderId || ""}&orderId=${nextOrder._id || ""}`,
        );

        return;
      }

      if (!isBuyNow) {
        dispatch(clearCart());
      } else {
        sessionStorage.removeItem("buy_now_checkout_item");
      }

      router.push(
        `/success?orderId=${nextOrder._id || ""}&paymentMethod=${nextOrder.paymentMethod || ""}&finalPrice=${nextOrder.finalPrice || finalTotal}&merchantOrderId=${nextOrder.merchantOrderId || ""}`,
      );
    } catch (error) {
      setSubmitError(
        error?.message ||
        (locale === "ar"
          ? "تعذر إرسال الطلب. يرجى المحاولة لاحقاً."
          : "Failed to place order. Please try again later."),
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
    <div className="w-full bg-bg-primary min-h-screen py-10 md:py-16">
      <div className="container mx-auto px-6 lg:px-10">
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

        <div className="flex flex-col lg:flex-row gap-10 lg:gap-14 items-start relative">
          <div className="flex-1 w-full min-w-0">
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
                  <div className="md:col-span-2">
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

                  <div className="md:col-span-2">
                    <span className="text-xs text-text-secondary mb-1.5 block">
                      {locale === "ar" ? "رقم الهاتف" : "Phone Number"}
                    </span>
                    <div
                      className={`flex items-center rounded-xl border overflow-hidden bg-bg-primary transition-colors ${errors.phone || errors.phoneCountryCode
                          ? "border-status-error focus-within:ring-2 focus-within:ring-status-error/15"
                          : "border-border-color focus-within:border-brand-mint focus-within:ring-2 focus-within:ring-brand-mint/15"
                        }`}
                    >
                      <select
                        {...register("phoneCountryCode")}
                        defaultValue={DEFAULT_DIAL_CODE}
                        className="w-[125px] sm:w-[135px] shrink-0 px-3 py-3.5 bg-bg-secondary text-text-primary text-xs sm:text-sm border-e border-border-color focus:outline-none cursor-pointer"
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
                </div>
              </section>

              <section>
                <h3 className="font-playfair text-xl md:text-2xl font-bold text-text-primary mb-6">
                  {t("Checkout.shippingAddress")}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <select
                      {...register("state")}
                      className={`${getInputClass(Boolean(errors.state))} cursor-pointer`}
                    >
                      <option value="">
                        {t("Checkout.selectGovernoratePlaceholder") || (locale === "ar" ? "-- اختر المحافظة --" : "-- Select Governorate --")}
                      </option>
                      {governoratesList.map((gov) => {
                        const label = locale === "ar" ? gov.name_ar : gov.name_en;
                        const isGovFreeNow = isGlobalFree || gov.isFreeShipping || Number(gov.shippingCost) === 0;
                        const freeShippingText = t("Checkout.freeShippingOption") || (locale === "ar" ? "(شحن مجاني)" : "(Free Shipping)");
                        const priceLabel = isGovFreeNow
                          ? ` ${freeShippingText}`
                          : ` (${gov.shippingCost} ${locale === "ar" ? "ج.م" : "EGP"})`;

                        return (
                          <option key={gov._id || gov.name_en} value={gov.name_ar}>
                            {label} {priceLabel}
                          </option>
                        );
                      })}
                    </select>
                    {errors.state ? (
                      <p className="mt-1.5 text-xs text-status-error">
                        {errors.state.message}
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
                </div>
              </section>

              <section>
                <h3 className="font-playfair text-xl md:text-2xl font-bold text-text-primary mb-6">
                  {t("Checkout.paymentMethod")}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <label
                    className={`relative flex items-center justify-between p-5 cursor-pointer rounded-xl border-2 transition-all shadow-sm ${paymentMethod === "cash"
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
                      <div
                        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${paymentMethod === "cash"
                            ? "border-brand-mint"
                            : "border-border-color"
                          }`}
                      >
                        {paymentMethod === "cash" && (
                          <div className="w-2.5 h-2.5 rounded-full bg-brand-mint" />
                        )}
                      </div>
                      <div>
                        <span className="font-bold text-text-primary block text-sm">
                          {t("Checkout.cashOnDelivery")}
                        </span>
                        <span className="text-xs text-text-secondary">
                          {locale === "ar"
                            ? "الدفع نقدًا عند استلام الطلب"
                            : "Pay with cash upon delivery"}
                        </span>
                      </div>
                    </div>
                    <Banknote className="w-6 h-6" />
                  </label>

                  <label
                    className={`relative flex items-center justify-between p-5 cursor-pointer rounded-xl border-2 transition-all shadow-sm ${paymentMethod === "card"
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
                      <div
                        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${paymentMethod === "card"
                            ? "border-brand-mint"
                            : "border-border-color"
                          }`}
                      >
                        {paymentMethod === "card" && (
                          <div className="w-2.5 h-2.5 rounded-full bg-brand-mint" />
                        )}
                      </div>
                      <div>
                        <span className="font-bold text-text-primary block text-sm">
                          {t("Checkout.creditCard")}
                        </span>
                        <span className="text-xs text-text-secondary">
                          {locale === "ar"
                            ? "الدفع عبر البطاقة البنكية أو المحفظة"
                            : "Pay via Debit/Credit Card or Wallet"}
                        </span>
                      </div>
                    </div>
                    <CreditCard className="w-6 h-6" />
                  </label>
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

              {/* Mobile-Only Order Summary: Positioned right before the submit button */}
              <div className="block lg:hidden">
                <div className="bg-bg-primary p-4 sm:p-5 rounded-2xl border border-border-color shadow-sm">
                  <h3 className="font-playfair text-lg font-bold text-text-primary mb-4">
                    {t("Checkout.orderSummary")}
                  </h3>

                  <div className="flex flex-col gap-3.5 mb-4">
                    {cartItems.map((item) => (
                      <div
                        key={`mob-${item.productId}-${item.size || "default"}`}
                        className="flex items-center gap-3"
                      >
                        <div className="relative w-12 h-12 bg-surface-muted rounded-lg shrink-0">
                          <Image
                            src={item.image}
                            alt={item.title}
                            fill
                            sizes="48px"
                            className="object-cover rounded-lg"
                          />
                          <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-brand-mint text-white text-[9px] font-bold rounded-full flex items-center justify-center shadow-sm">
                            {item.quantity}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-text-primary font-bold text-xs sm:text-sm truncate">
                            {item.title}
                          </h4>
                          {item.size ? (
                            <p className="text-text-secondary text-[11px] mt-0.5">
                              {locale === "ar"
                                ? `الحجم: ${item.size}`
                                : `Size: ${item.size}`}
                            </p>
                          ) : null}
                        </div>
                        <div className="text-text-primary font-bold text-xs sm:text-sm shrink-0">
                          {currencyFormatter.format(
                            Number(item.priceValue || 0) *
                            Number(item.quantity || 1),
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mb-4">
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={promoCode}
                        onChange={handlePromoInputChange}
                        placeholder={t("Checkout.promoPlaceholder")}
                        className="flex-1 px-3 py-2 bg-bg-primary border border-border-color rounded-xl text-xs text-text-primary uppercase tracking-wide focus:outline-none focus:border-brand-mint"
                      />
                      <button
                        type="button"
                        onClick={handleApplyPromo}
                        disabled={promoStatus === "applying"}
                        className="px-3 py-2 rounded-xl bg-brand-mint text-white text-xs font-bold tracking-widest uppercase hover:opacity-90 transition-all disabled:opacity-60 cursor-pointer"
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

                  <div className="flex flex-col gap-2.5 py-3.5 border-y border-border-color mb-4">
                    <div className="flex justify-between items-center text-xs sm:text-sm">
                      <span className="text-text-secondary">
                        {t("Checkout.subtotal")}
                      </span>
                      <span className="font-semibold text-text-primary">
                        {subtotalLabel}
                      </span>
                    </div>
                    {effectiveDiscount > 0 ? (
                      <div className="flex justify-between items-center text-xs sm:text-sm">
                        <span className="text-text-secondary">
                          {t("Checkout.discount") || (locale === "ar" ? "الخصم" : "Discount")}
                        </span>
                        <span className="font-semibold text-status-success">
                          - {discountLabel}
                        </span>
                      </div>
                    ) : null}
                    <div className="flex justify-between items-center text-xs sm:text-sm">
                      <span className="text-text-secondary">
                        {t("Checkout.shipping")}
                      </span>
                      <span
                        className={`font-semibold ${
                          isFreeShipping || (selectedState && shippingCost === 0)
                            ? "text-brand-mint"
                            : "text-text-primary"
                        }`}
                      >
                        {shippingLabel}
                      </span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center mb-4">
                    <span className="text-text-primary font-playfair text-base font-bold">
                      {t("Checkout.total")}
                    </span>
                    <span className="text-text-primary font-playfair text-lg font-bold">
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

              {submitError ? (
                <div className="rounded-xl border border-status-error/25 bg-status-error-soft px-4 py-3 text-sm text-status-error">
                  {submitError}
                </div>
              ) : null}

              <Link
                href="/returns"
                target="_blank"
                className="block text-center text-xs text-brand-orange hover:underline font-medium mb-3 transition-colors"
              >
                {t("Checkout.returnPolicyNotice")}
              </Link>

              <button
                type="submit"
                disabled={isSubmitting}
                aria-label={
                  paymentMethod === "card" || paymentMethod === "wallet"
                    ? t("Checkout.completePayment")
                    : t("Checkout.confirmOrder")
                }
                className="w-full py-4 cursor-pointer bg-brand-mint text-white text-center font-bold text-xs uppercase tracking-widest rounded-xl hover:bg-opacity-90 transition-all disabled:opacity-60 shadow-md"
              >
                {isSubmitting
                  ? paymentMethod === "card" || paymentMethod === "wallet"
                    ? t("Checkout.redirectingPayment")
                    : t("Checkout.placingOrder")
                  : paymentMethod === "card" || paymentMethod === "wallet"
                    ? t("Checkout.completePayment")
                    : t("Checkout.confirmOrder")}
              </button>
            </form>
          </div>

          {/* Desktop-Only Sticky Summary Column: Sticks and smoothly scrolls with the page */}
          <div className="hidden lg:block lg:w-[360px] xl:w-[400px] shrink-0 sticky top-28 self-start">
            <div className="bg-bg-primary p-5 md:p-6 rounded-2xl border border-border-color shadow-sm">
              <h3 className="font-playfair text-xl font-bold text-text-primary mb-6">
                {t("Checkout.orderSummary")}
              </h3>

              <div className="flex flex-col gap-4 mb-6">
                {cartItems.map((item) => (
                  <div
                    key={`desk-${item.productId}-${item.size || "default"}`}
                    className="flex items-center gap-3.5"
                  >
                    <div className="relative w-14 h-14 bg-surface-muted rounded-lg shrink-0">
                      <Image
                        src={item.image}
                        alt={item.title}
                        fill
                        sizes="56px"
                        className="object-cover rounded-lg"
                      />
                      <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-brand-mint text-white text-[9px] font-bold rounded-full flex items-center justify-center shadow-sm">
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

              <div className="mb-5">
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={promoCode}
                    onChange={handlePromoInputChange}
                    placeholder={t("Checkout.promoPlaceholder")}
                    className="flex-1 px-3.5 py-2.5 bg-bg-primary border border-border-color rounded-xl text-xs text-text-primary uppercase tracking-wide focus:outline-none focus:border-brand-mint"
                  />
                  <button
                    type="button"
                    onClick={handleApplyPromo}
                    disabled={promoStatus === "applying"}
                    className="px-3.5 py-2.5 rounded-xl bg-brand-mint text-white text-xs font-bold tracking-widest uppercase hover:opacity-90 transition-all disabled:opacity-60 cursor-pointer"
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

              <div className="flex flex-col gap-3 py-4 border-y border-border-color mb-5">
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
                      {t("Checkout.discount") || (locale === "ar" ? "الخصم" : "Discount")}
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
                  <span
                    className={`font-semibold ${
                      isFreeShipping || (selectedState && shippingCost === 0)
                        ? "text-brand-mint"
                        : "text-text-primary"
                    }`}
                  >
                    {shippingLabel}
                  </span>
                </div>
              </div>

              <div className="flex justify-between items-center mb-6">
                <span className="text-text-primary font-playfair text-lg font-bold">
                  {t("Checkout.total")}
                </span>
                <span className="text-text-primary font-playfair text-xl font-bold">
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
