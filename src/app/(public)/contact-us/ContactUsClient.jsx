"use client";

import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLanguage } from "@/hooks/useLanguage";
import Image from "@/components/ui/AppImage";
import {
  MapPinIcon,
  PhoneIcon,
  MailIcon,
  InstagramIcon,
  FacebookIcon,
  TiktokIcon,
  LinkedinIcon,
  YoutubeIcon,
  XIcon,
  WhatsAppIcon,
} from "@/svgs/ContactUsClient.svgs";

function createContactSchema(locale) {
  const isArabic = locale === "ar";

  return z.object({
    name: z
      .string()
      .trim()
      .min(
        2,
        isArabic
          ? "الاسم يجب أن يكون حرفين على الأقل."
          : "Name must be at least 2 characters.",
      )
      .max(80, isArabic ? "الاسم طويل جدًا." : "Name is too long."),
    email: z
      .string()
      .trim()
      .email(
        isArabic
          ? "يرجى إدخال بريد إلكتروني صحيح."
          : "Please enter a valid email address.",
      )
      .max(
        120,
        isArabic ? "البريد الإلكتروني طويل جدًا." : "Email is too long.",
      ),
    subject: z
      .string()
      .trim()
      .min(
        3,
        isArabic
          ? "الموضوع يجب أن يكون 3 أحرف على الأقل."
          : "Subject must be at least 3 characters.",
      )
      .max(120, isArabic ? "الموضوع طويل جدًا." : "Subject is too long."),
    message: z
      .string()
      .trim()
      .min(
        10,
        isArabic
          ? "الرسالة يجب أن تكون 10 أحرف على الأقل."
          : "Message must be at least 10 characters.",
      )
      .max(1500, isArabic ? "الرسالة طويلة جدًا." : "Message is too long."),
  });
}

function getInputClass(hasError) {
  return `w-full px-5 py-4 bg-bg-primary border rounded-xl focus:outline-none focus:ring-2 text-text-primary transition-all placeholder:text-text-primary/50 ${
    hasError
      ? "border-status-error focus:ring-status-error/15"
      : "border-border-color focus:ring-brand-mint/20"
  }`;
}

export default function ContactUsPage() {
  const { t, locale } = useLanguage();
  const [submitState, setSubmitState] = useState({ type: "idle", message: "" });

  const contactSchema = useMemo(() => createContactSchema(locale), [locale]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: "",
    },
    mode: "onBlur",
    reValidateMode: "onChange",
  });

  const handleFormSubmit = async (values) => {
    setSubmitState({ type: "idle", message: "" });

    try {
      const response = await fetch(
        process.env.NEXT_PUBLIC_API_BASE_URL + "/contact",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(values),
        },
      );

      const payload = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(
          payload?.error ||
            (locale === "ar"
              ? "تعذر إرسال الرسالة الآن. حاول مرة أخرى."
              : "Failed to send your message. Please try again."),
        );
      }

      reset();
      setSubmitState({
        type: "success",
        message:
          locale === "ar"
            ? "تم إرسال رسالتك بنجاح."
            : "Your message has been sent successfully.",
      });
    } catch (error) {
      setSubmitState({
        type: "error",
        message:
          error?.message ||
          (locale === "ar"
            ? "حدث خطأ أثناء إرسال الرسالة."
            : "An error occurred while sending the message."),
      });
    }
  };

  return (
    <div className="min-h-screen bg-bg-primary pb-20 overflow-hidden relative">
      <div className="w-full">
        <Image
          src="/assets/contact us.jpg"
          alt="Contact Ashperoo"
          width={1920}
          height={1080}
          priority
          className="w-full h-auto object-cover"
          sizes="100vw"
        />
      </div>
      <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-brand-mint/10 dark:bg-brand-mint/5 blur-[100px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-1/4 h-1/4 bg-brand-orange/10 dark:bg-brand-orange/5 blur-[100px] rounded-full pointer-events-none" />
      <div className="max-w-7xl mx-auto px-6 md:px-10 lg:px-20 pt-12 md:pt-16 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-col space-y-8"
          >
            <div className="bg-bg-secondary p-8 rounded-3xl border border-border-color shadow-card dark:shadow-none transition-shadow">
              <div className="flex items-start gap-5 mb-8 group">
                <div className="w-14 h-14 bg-brand-mint/10 text-brand-mint rounded-full flex items-center justify-center shrink-0 group-hover:bg-brand-mint group-hover:text-white transition-colors duration-300">
                  <MapPinIcon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-text-primary mb-2 font-playfair">
                    {t("ContactUs.addressTitle")}
                  </h3>
                  <p className="text-text-secondary leading-relaxed">
                    بجانب كنتاكي، برج الجزيرة 2، شارع 151 اكاديمية السادات,
                    Maadi, Cairo Governorate 11728
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-5 mb-8 group">
                <div className="w-14 h-14 bg-brand-mint/10 text-brand-mint rounded-full flex items-center justify-center shrink-0 group-hover:bg-brand-mint group-hover:text-white transition-colors duration-300">
                  <PhoneIcon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-text-primary mb-2 font-playfair">
                    {t("ContactUs.phoneTitle")}
                  </h3>
                  <p className="text-text-secondary">+20 109 431 7717</p>
                </div>
              </div>

              <div className="flex items-start gap-5 group">
                <div className="w-14 h-14 bg-brand-mint/10 text-brand-mint rounded-full flex items-center justify-center shrink-0 group-hover:bg-brand-mint group-hover:text-white transition-colors duration-300">
                  <MailIcon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-text-primary mb-2 font-playfair">
                    {t("ContactUs.emailTitle")}
                  </h3>
                  <p className="text-text-secondary"> info@ashperoo.com</p>
                </div>
              </div>
            </div>

            <div className="p-4 md:p-8">
              <h3 className="text-2xl font-bold text-brand-dark dark:text-brand-primary mb-6 font-playfair">
                {t("ContactUs.socialsTitle")}
              </h3>
              <div className="flex flex-wrap gap-3">
                <a
                  href="https://www.facebook.com/Ashperoo1"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook"
                  className="w-10 h-10 border-2 border-brand-mint/20 bg-brand-mint/5 rounded-full flex items-center justify-center text-brand-mint hover:bg-brand-mint hover:text-white transition-all hover:scale-105 active:scale-95"
                >
                  <FacebookIcon className="w-5 h-5" />
                </a>
                <a
                  href="https://www.instagram.com/ashperoo?igsh=MWo1djBnaGprMjJkMw=="
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                  className="w-10 h-10 border-2 border-brand-mint/20 bg-brand-mint/5 rounded-full flex items-center justify-center text-brand-mint hover:bg-brand-mint hover:text-white transition-all hover:scale-105 active:scale-95"
                >
                  <InstagramIcon className="w-5 h-5" />
                </a>
                <a
                  href="https://www.tiktok.com/@ashperoo1?_r=1&_t=ZS-95gKOyN0MFU"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="TikTok"
                  className="w-10 h-10 border-2 border-brand-mint/20 bg-brand-mint/5 rounded-full flex items-center justify-center text-brand-mint hover:bg-brand-mint hover:text-white transition-all hover:scale-105 active:scale-95"
                >
                  <TiktokIcon className="w-5 h-5" />
                </a>
                <a
                  href="https://www.linkedin.com/company/ashperoo-cosmetics-serum/?viewAsMember=true"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn"
                  className="w-10 h-10 border-2 border-brand-mint/20 bg-brand-mint/5 rounded-full flex items-center justify-center text-brand-mint hover:bg-brand-mint hover:text-white transition-all hover:scale-105 active:scale-95"
                >
                  <LinkedinIcon className="w-5 h-5" />
                </a>
                <a
                  href="https://wa.me/201108851834"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="WhatsApp"
                  className="w-10 h-10 border-2 border-brand-mint/20 bg-brand-mint/5 rounded-full flex items-center justify-center text-brand-mint hover:bg-brand-mint hover:text-white transition-all hover:scale-105 active:scale-95"
                >
                  <WhatsAppIcon className="w-5 h-5" />
                </a>
                <a
                  href="https://www.youtube.com/@ashperoo1"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="YouTube"
                  className="w-10 h-10 border-2 border-brand-mint/20 bg-brand-mint/5 rounded-full flex items-center justify-center text-brand-mint hover:bg-brand-mint hover:text-white transition-all hover:scale-105 active:scale-95"
                >
                  <YoutubeIcon className="w-5 h-5" />
                </a>
                <a
                  href="https://x.com/ashperoo"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="X (Twitter)"
                  className="w-10 h-10 border-2 border-brand-mint/20 bg-brand-mint/5 rounded-full flex items-center justify-center text-brand-mint hover:bg-brand-mint hover:text-white transition-all hover:scale-105 active:scale-95"
                >
                  <XIcon className="w-5 h-5" />
                </a>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <div className="bg-bg-secondary p-8 md:p-12 rounded-3xl border border-border-color shadow-card dark:shadow-none">
              <h2 className="text-3xl font-playfair font-bold text-text-primary mb-8">
                {t("ContactUs.formTitle")}
              </h2>

              <form
                onSubmit={handleSubmit(handleFormSubmit)}
                className="space-y-6"
                noValidate
              >
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-semibold text-text-primary mb-2 tracking-wide"
                  >
                    {t("ContactUs.formName")}
                  </label>
                  <input
                    id="name"
                    type="text"
                    {...register("name")}
                    placeholder={t("ContactUs.formNamePlaceholder")}
                    className={getInputClass(Boolean(errors.name))}
                  />
                  {errors.name ? (
                    <p className="mt-1.5 text-xs text-status-error">
                      {errors.name.message}
                    </p>
                  ) : null}
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-semibold text-text-primary mb-2 tracking-wide"
                  >
                    {t("ContactUs.formEmail")}
                  </label>
                  <input
                    id="email"
                    type="email"
                    {...register("email")}
                    placeholder={t("ContactUs.formEmailPlaceholder")}
                    className={getInputClass(Boolean(errors.email))}
                  />
                  {errors.email ? (
                    <p className="mt-1.5 text-xs text-status-error">
                      {errors.email.message}
                    </p>
                  ) : null}
                </div>

                <div>
                  <label
                    htmlFor="subject"
                    className="block text-sm font-semibold text-text-primary mb-2 tracking-wide"
                  >
                    {t("ContactUs.formSubject")}
                  </label>
                  <input
                    id="subject"
                    type="text"
                    {...register("subject")}
                    placeholder={t("ContactUs.formSubjectPlaceholder")}
                    className={getInputClass(Boolean(errors.subject))}
                  />
                  {errors.subject ? (
                    <p className="mt-1.5 text-xs text-status-error">
                      {errors.subject.message}
                    </p>
                  ) : null}
                </div>

                <div>
                  <label
                    htmlFor="message"
                    className="block text-sm font-semibold text-text-primary mb-2 tracking-wide"
                  >
                    {t("ContactUs.formMessage")}
                  </label>
                  <textarea
                    id="message"
                    rows="5"
                    {...register("message")}
                    placeholder={t("ContactUs.formMessagePlaceholder")}
                    className={`${getInputClass(Boolean(errors.message))} resize-none`}
                  />
                  {errors.message ? (
                    <p className="mt-1.5 text-xs text-status-error">
                      {errors.message.message}
                    </p>
                  ) : null}
                </div>

                {submitState.type === "success" ? (
                  <div className="rounded-xl border border-status-success/30 bg-status-success-soft px-4 py-3 text-sm text-status-success">
                    {submitState.message}
                  </div>
                ) : null}

                {submitState.type === "error" ? (
                  <div className="rounded-xl border border-status-error/30 bg-status-error-soft px-4 py-3 text-sm text-status-error">
                    {submitState.message}
                  </div>
                ) : null}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 bg-brand-mint text-white font-bold rounded-xl hover:bg-brand-dark hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:hover:scale-100 mt-4 shadow-lg shadow-brand-mint/20 flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      {t("ContactUs.formSending")}
                    </>
                  ) : (
                    t("ContactUs.formSubmit")
                  )}
                </button>
              </form>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
