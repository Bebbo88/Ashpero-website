"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { useLanguage } from "@/hooks/useLanguage";

const MapPin = ({ className }) => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"/><circle cx="12" cy="10" r="3"/></svg>);
const Phone = ({ className }) => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>);
const Mail = ({ className }) => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>);
const Instagram = ({ className }) => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>);
const Facebook = ({ className }) => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>);
const Twitter = ({ className }) => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></svg>);

export default function ContactUsPage() {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({ name: "", email: "", subject: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setFormData({ name: "", email: "", subject: "", message: "" });
      alert("Message sent successfully!");
    }, 1500);
  };

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <div className="min-h-screen bg-bg-primary pt-12 md:pt-16 pb-20 px-6 md:px-10 lg:px-20 overflow-hidden relative">
      {/* Abstract Background Accents */}
      <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-brand-mint/10 dark:bg-brand-mint/5 blur-[100px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-1/4 h-1/4 bg-brand-orange/10 dark:bg-brand-orange/5 blur-[100px] rounded-full pointer-events-none" />
      
      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.6 }}
           className="text-center mb-16"
        >
          <span className="text-brand-orange text-sm font-bold tracking-[0.2em] uppercase mb-4 block">
            {t("ContactUs.subtitle")}
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-playfair font-semibold text-brand-dark dark:text-brand-mint mb-6">
            {t("ContactUs.title")}
          </h1>
          <p className="text-text-secondary text-base lg:text-lg max-w-2xl mx-auto leading-relaxed">
            {t("ContactUs.description")}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
          
          {/* Left Column: Info */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-col space-y-8"
          >
            <div className="bg-bg-secondary p-8 rounded-3xl border border-border-color shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none transition-shadow">
              
              {/* Address */}
              <div className="flex items-start gap-5 mb-8 group">
                <div className="w-14 h-14 bg-brand-mint/10 text-brand-mint rounded-full flex items-center justify-center shrink-0 group-hover:bg-brand-mint group-hover:text-white transition-colors duration-300">
                  <MapPin className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-text-primary mb-2 font-playfair">{t("ContactUs.addressTitle")}</h3>
                  <p className="text-text-secondary leading-relaxed">{t("ContactUs.address")}</p>
                </div>
              </div>

              {/* Phone */}
              <div className="flex items-start gap-5 mb-8 group">
                <div className="w-14 h-14 bg-brand-mint/10 text-brand-mint rounded-full flex items-center justify-center shrink-0 group-hover:bg-brand-mint group-hover:text-white transition-colors duration-300">
                  <Phone className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-text-primary mb-2 font-playfair">{t("ContactUs.phoneTitle")}</h3>
                  <p className="text-text-secondary">{t("ContactUs.phone")}</p>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-start gap-5 group">
                <div className="w-14 h-14 bg-brand-mint/10 text-brand-mint rounded-full flex items-center justify-center shrink-0 group-hover:bg-brand-mint group-hover:text-white transition-colors duration-300">
                  <Mail className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-text-primary mb-2 font-playfair">{t("ContactUs.emailTitle")}</h3>
                  <p className="text-text-secondary">{t("ContactUs.email")}</p>
                </div>
              </div>
            </div>

            {/* Socials */}
            <div className="p-4 md:p-8">
              <h3 className="text-2xl font-bold text-brand-dark dark:text-brand-creme mb-6 font-playfair">{t("ContactUs.socialsTitle")}</h3>
              <div className="flex gap-4">
                <a href="#" className="w-14 h-14 border-2 border-brand-mint/20 bg-brand-mint/5 rounded-full flex items-center justify-center text-brand-mint hover:bg-brand-mint hover:text-white transition-all hover:scale-105 active:scale-95">
                  <Instagram className="w-6 h-6" />
                </a>
                <a href="#" className="w-14 h-14 border-2 border-brand-mint/20 bg-brand-mint/5 rounded-full flex items-center justify-center text-brand-mint hover:bg-brand-mint hover:text-white transition-all hover:scale-105 active:scale-95">
                  <Facebook className="w-6 h-6" />
                </a>
                <a href="#" className="w-14 h-14 border-2 border-brand-mint/20 bg-brand-mint/5 rounded-full flex items-center justify-center text-brand-mint hover:bg-brand-mint hover:text-white transition-all hover:scale-105 active:scale-95">
                  <Twitter className="w-6 h-6" />
                </a>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <div className="bg-bg-secondary p-8 md:p-12 rounded-3xl border border-border-color shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none">
              <h2 className="text-3xl font-playfair font-bold text-text-primary mb-8">{t("ContactUs.formTitle")}</h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-semibold text-text-primary mb-2 tracking-wide block">
                    {t("ContactUs.formName")}
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder={t("ContactUs.formNamePlaceholder")}
                    className="w-full px-5 py-4 bg-bg-primary border border-border-color rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-mint text-text-primary transition-all placeholder:text-text-primary/30"
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-semibold text-text-primary mb-2 tracking-wide block">
                    {t("ContactUs.formEmail")}
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder={t("ContactUs.formEmailPlaceholder")}
                    className="w-full px-5 py-4 bg-bg-primary border border-border-color rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-mint text-text-primary transition-all placeholder:text-text-primary/30"
                  />
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-semibold text-text-primary mb-2 tracking-wide block">
                    {t("ContactUs.formSubject")}
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    placeholder={t("ContactUs.formSubjectPlaceholder")}
                    className="w-full px-5 py-4 bg-bg-primary border border-border-color rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-mint text-text-primary transition-all placeholder:text-text-primary/30"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-semibold text-text-primary mb-2 tracking-wide block">
                    {t("ContactUs.formMessage")}
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows="5"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    placeholder={t("ContactUs.formMessagePlaceholder")}
                    className="w-full px-5 py-4 bg-bg-primary border border-border-color rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-mint text-text-primary transition-all placeholder:text-text-primary/30 resize-none"
                  ></textarea>
                </div>

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
