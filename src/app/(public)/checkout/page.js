"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Lock, CreditCard, Banknote } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";

export default function CheckoutPage() {
  const { t } = useLanguage();
  const [paymentMethod, setPaymentMethod] = useState("card");

  return (
    <div className="min-h-screen bg-bg-primary pt-10 pb-20 px-4 md:px-8 overflow-hidden">
      <div className="max-w-[1200px] mx-auto">
        
        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 text-[10px] md:text-xs font-montserrat uppercase tracking-[0.1em] text-text-secondary mb-8 overflow-x-auto whitespace-nowrap pb-2">
          <Link href="/" className="hover:text-brand-mint transition-colors">Home</Link>
          <span>&gt;</span>
          <span className="hover:text-brand-mint transition-colors cursor-pointer">Shopping Cart</span>
          <span>&gt;</span>
          <span className="hover:text-brand-mint transition-colors cursor-pointer">Checkout</span>
          <span>&gt;</span>
          <span className="text-text-primary font-bold">{t("Checkout.title")}</span>
        </div>

        {/* Page Title */}
        <h1 className="font-playfair text-3xl md:text-4xl lg:text-5xl font-bold text-text-primary mb-10">
          {t("Checkout.title")}
        </h1>

        <div className="flex flex-col lg:flex-row gap-10 lg:gap-14">
          
          {/* Left Column: Form */}
          <div className="flex-1">
            <form className="flex flex-col gap-10">
              
              {/* Contact Information */}
              <section>
                <h3 className="font-playfair text-xl md:text-2xl font-bold text-text-primary mb-6">
                  {t("Checkout.contactInfo")}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] md:text-xs font-bold uppercase tracking-[0.1em] text-text-secondary">{t("Checkout.fullName")}</label>
                    <input type="text" placeholder={t("Checkout.fullNameHolder")} className="w-full px-4 py-3.5 bg-bg-primary border border-border-color rounded-xl focus:outline-none focus:ring-1 focus:ring-brand-mint focus:border-brand-mint transition-colors text-text-primary text-sm placeholder:text-text-secondary/50" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] md:text-xs font-bold uppercase tracking-[0.1em] text-text-secondary">{t("Checkout.email")}</label>
                    <input type="email" placeholder={t("Checkout.emailHolder")} className="w-full px-4 py-3.5 bg-bg-primary border border-border-color rounded-xl focus:outline-none focus:ring-1 focus:ring-brand-mint focus:border-brand-mint transition-colors text-text-primary text-sm placeholder:text-text-secondary/50" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] md:text-xs font-bold uppercase tracking-[0.1em] text-text-secondary">{t("Checkout.phone")}</label>
                    <input type="tel" placeholder={t("Checkout.phoneHolder")} className="w-full px-4 py-3.5 bg-bg-primary border border-border-color rounded-xl focus:outline-none focus:ring-1 focus:ring-brand-mint focus:border-brand-mint transition-colors text-text-primary text-sm placeholder:text-text-secondary/50" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] md:text-xs font-bold uppercase tracking-[0.1em] text-text-secondary">{t("Checkout.altPhone")}</label>
                    <input type="tel" placeholder={t("Checkout.altPhoneHolder")} className="w-full px-4 py-3.5 bg-bg-primary border border-border-color rounded-xl focus:outline-none focus:ring-1 focus:ring-brand-mint focus:border-brand-mint transition-colors text-text-primary text-sm placeholder:text-text-secondary/50" />
                  </div>
                </div>
              </section>

              {/* Shipping Address */}
              <section>
                <h3 className="font-playfair text-xl md:text-2xl font-bold text-text-primary mb-6">
                  {t("Checkout.shippingAddress")}
                </h3>
                <div className="flex flex-col gap-5">
                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] md:text-xs font-bold uppercase tracking-[0.1em] text-text-secondary">{t("Checkout.address1")}</label>
                    <input type="text" placeholder={t("Checkout.address1Holder")} className="w-full px-4 py-3.5 bg-bg-primary border border-border-color rounded-xl focus:outline-none focus:ring-1 focus:ring-brand-mint focus:border-brand-mint transition-colors text-text-primary text-sm placeholder:text-text-secondary/50" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] md:text-xs font-bold uppercase tracking-[0.1em] text-text-secondary">{t("Checkout.address2")}</label>
                    <input type="text" placeholder={t("Checkout.address2Holder")} className="w-full px-4 py-3.5 bg-bg-primary border border-border-color rounded-xl focus:outline-none focus:ring-1 focus:ring-brand-mint focus:border-brand-mint transition-colors text-text-primary text-sm placeholder:text-text-secondary/50" />
                  </div>
                  
                  {/* City, State, ZIP */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                    <div className="flex flex-col gap-2">
                      <label className="text-[10px] md:text-xs font-bold uppercase tracking-[0.1em] text-text-secondary">{t("Checkout.city")}</label>
                      <input type="text" placeholder={t("Checkout.cityHolder")} className="w-full px-4 py-3.5 bg-bg-primary border border-border-color rounded-xl focus:outline-none focus:ring-1 focus:ring-brand-mint focus:border-brand-mint transition-colors text-text-primary text-sm placeholder:text-text-secondary/50" />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-[10px] md:text-xs font-bold uppercase tracking-[0.1em] text-text-secondary">{t("Checkout.state")}</label>
                      <input type="text" placeholder={t("Checkout.stateHolder")} className="w-full px-4 py-3.5 bg-bg-primary border border-border-color rounded-xl focus:outline-none focus:ring-1 focus:ring-brand-mint focus:border-brand-mint transition-colors text-text-primary text-sm placeholder:text-text-secondary/50" />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-[10px] md:text-xs font-bold uppercase tracking-[0.1em] text-text-secondary">{t("Checkout.postal")}</label>
                      <input type="text" placeholder={t("Checkout.postalHolder")} className="w-full px-4 py-3.5 bg-bg-primary border border-border-color rounded-xl focus:outline-none focus:ring-1 focus:ring-brand-mint focus:border-brand-mint transition-colors text-text-primary text-sm placeholder:text-text-secondary/50" />
                    </div>
                  </div>
                </div>
              </section>

              {/* Payment Method */}
              <section>
                <h3 className="font-playfair text-xl md:text-2xl font-bold text-text-primary mb-6">
                  {t("Checkout.paymentMethod")}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  
                  {/* Card Option */}
                  <label className={`relative flex items-center justify-between p-5 cursor-pointer rounded-xl border-2 transition-all shadow-sm ${paymentMethod === 'card' ? 'border-brand-mint bg-brand-mint/5 shadow-brand-mint/10' : 'border-border-color bg-bg-primary hover:border-gray-300 hover:bg-gray-50 dark:hover:bg-brand-dark/30'}`}>
                    <input 
                       type="radio" 
                       name="paymentMethod" 
                       value="card" 
                       checked={paymentMethod === "card"}
                       onChange={() => setPaymentMethod("card")}
                       className="sr-only"
                    />
                    <div className="flex items-center gap-4">
                      <div className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 transition-colors ${paymentMethod === 'card' ? 'border-brand-mint' : 'border-gray-400'}`}>
                        {paymentMethod === 'card' && <div className="w-2.5 h-2.5 bg-brand-mint rounded-full" />}
                      </div>
                      <span className={`font-semibold text-sm ${paymentMethod === 'card' ? 'text-brand-mint' : 'text-text-primary'}`}>{t("Checkout.creditCard")}</span>
                    </div>
                    <CreditCard className={`w-6 h-6 transition-colors ${paymentMethod === 'card' ? 'text-brand-mint' : 'text-text-secondary'}`} />
                  </label>

                  {/* Cash Option */}
                  <label className={`relative flex items-center justify-between p-5 cursor-pointer rounded-xl border-2 transition-all shadow-sm ${paymentMethod === 'cash' ? 'border-brand-mint bg-brand-mint/5 shadow-brand-mint/10' : 'border-border-color bg-bg-primary hover:border-gray-300 hover:bg-gray-50 dark:hover:bg-brand-dark/30'}`}>
                    <input 
                       type="radio" 
                       name="paymentMethod" 
                       value="cash" 
                       checked={paymentMethod === "cash"}
                       onChange={() => setPaymentMethod("cash")}
                       className="sr-only"
                    />
                    <div className="flex items-center gap-4">
                      <div className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 transition-colors ${paymentMethod === 'cash' ? 'border-brand-mint' : 'border-gray-400'}`}>
                        {paymentMethod === 'cash' && <div className="w-2.5 h-2.5 bg-brand-mint rounded-full" />}
                      </div>
                      <span className={`font-semibold text-sm ${paymentMethod === 'cash' ? 'text-brand-mint' : 'text-text-primary'}`}>{t("Checkout.cashOnDelivery")}</span>
                    </div>
                    <Banknote className={`w-6 h-6 transition-colors ${paymentMethod === 'cash' ? 'text-brand-mint' : 'text-text-secondary'}`} />
                  </label>

                </div>
              </section>

              {/* Special Instructions */}
              <section>
                <h3 className="font-playfair text-xl md:text-2xl font-bold text-text-primary mb-6">
                  {t("Checkout.specialInstructions")}
                </h3>
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] md:text-xs font-bold uppercase tracking-[0.1em] text-text-secondary">{t("Checkout.orderNotes")}</label>
                  <textarea rows="4" placeholder={t("Checkout.orderNotesHolder")} className="w-full px-4 py-3.5 bg-bg-primary border border-border-color rounded-xl focus:outline-none focus:ring-1 focus:ring-brand-mint focus:border-brand-mint transition-colors text-text-primary text-sm placeholder:text-text-secondary/50 resize-none"></textarea>
                </div>
              </section>

            </form>
          </div>

          {/* Right Column: Order Summary */}
          <div className="lg:w-[420px] xl:w-[480px]">
            <div className="bg-bg-primary p-6 md:p-8 rounded-3xl border border-border-color shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none sticky top-24">
              <h3 className="font-playfair text-2xl font-bold text-text-primary mb-8">
                {t("Checkout.orderSummary")}
              </h3>

              {/* Mock Order Items */}
              <div className="flex flex-col gap-6 mb-8">
                {/* Item 1 */}
                <div className="flex items-center gap-4">
                  <div className="relative w-16 h-16 bg-gray-100 rounded-lg shrink-0">
                    <Image src="/assets/photo1.jpeg" alt="Luminous Algae Serum" fill className="object-cover rounded-lg" />
                    <span className="absolute -top-2 -right-2 w-5 h-5 bg-brand-mint text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-sm">
                      1
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-text-primary font-bold text-sm truncate">Luminous Algae Serum</h4>
                    <p className="text-text-secondary text-xs mt-0.5">30 ml / 1.0 fl. oz</p>
                  </div>
                  <div className="text-text-primary font-bold text-sm shrink-0">
                    $64.00
                  </div>
                </div>

                {/* Item 2 */}
                <div className="flex items-center gap-4">
                  <div className="relative w-16 h-16 bg-gray-100 rounded-lg shrink-0">
                    <Image src="/assets/photo2.jpeg" alt="Midnight Miracle Night Cream" fill className="object-cover rounded-lg" />
                    <span className="absolute -top-2 -right-2 w-5 h-5 bg-brand-mint text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-sm">
                      1
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-text-primary font-bold text-sm truncate">Midnight Miracle Night Cream</h4>
                    <p className="text-text-secondary text-xs mt-0.5">50 ml / 1.69 fl. oz</p>
                  </div>
                  <div className="text-text-primary font-bold text-sm shrink-0">
                    $45.00
                  </div>
                </div>
              </div>

              {/* Promo Code */}
              <div className="flex gap-3 mb-8">
                <input type="text" placeholder={t("Checkout.promoPlaceholder")} className="flex-1 px-4 py-3 bg-bg-secondary border border-border-color rounded-xl focus:outline-none focus:ring-1 focus:ring-brand-mint text-text-primary text-sm placeholder:text-text-secondary/60 uppercase" />
                <button className="px-6 py-3 bg-text-secondary/10 text-text-secondary font-bold text-xs uppercase tracking-wider rounded-xl hover:bg-text-secondary/20 transition-colors">
                  {t("Checkout.apply")}
                </button>
              </div>

              {/* Totals */}
              <div className="flex flex-col gap-4 py-6 border-y border-border-color mb-6">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-text-secondary">{t("Checkout.subtotal")}</span>
                  <span className="font-semibold text-text-primary">$109.00</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-text-secondary">{t("Checkout.shipping")}</span>
                  <span className="font-semibold text-brand-mint">{t("Checkout.free")}</span>
                </div>
              </div>

              <div className="flex justify-between items-center mb-8">
                <span className="text-text-primary font-playfair text-xl font-bold">{t("Checkout.total")}</span>
                <div className="flex items-baseline gap-2">
                  <span className="text-text-secondary text-xs">USD</span>
                  <span className="text-text-primary font-playfair text-2xl font-bold">$109.00</span>
                </div>
              </div>

              <Link href="/success" className="block w-full py-4 bg-brand-mint text-white text-center font-bold text-xs uppercase tracking-widest rounded-xl hover:bg-opacity-90 transition-all hover:shadow-lg shadow-brand-mint/20 mb-4">
                {t("Checkout.continue")}
              </Link>
              
              <div className="flex items-center justify-center gap-2 text-text-secondary/70">
                <Lock className="w-3.5 h-3.5" />
                <span className="text-[10px] tracking-wide">{t("Checkout.secureCheckout")}</span>
              </div>

            </div>
          </div>

        </div>

        {/* Minimal Footer Links specific to checkout flow */}
        <div className="mt-20 pt-8 border-t border-border-color flex flex-col items-center justify-center gap-4 text-[10px] text-text-secondary/70 uppercase tracking-widest">
          <div className="flex flex-wrap items-center justify-center gap-6 md:gap-10">
            <Link href="#" className="hover:text-text-primary transition-colors">Privacy Policy</Link>
            <Link href="#" className="hover:text-text-primary transition-colors">Refund Policy</Link>
            <Link href="#" className="hover:text-text-primary transition-colors">Terms of Service</Link>
          </div>
          <p>© 2026 Ashpero Skincare, All Rights Reserved</p>
        </div>

      </div>
    </div>
  );
}
