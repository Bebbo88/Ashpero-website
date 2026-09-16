"use client";

import React from "react";
import { useLanguage } from "@/hooks/useLanguage";

const arContent = {
  pageTitle: "سياسة الخصوصية والشروط والأحكام",
  sections: [
    {
      title: "1. سياسة الخصوصية",
      intro:
        "توضح سياسة الخصوصية هذه كيفية جمع واستخدام وحماية بياناتك الشخصية عند إجراء عملية شراء عبر الإنترنت من أشبيرو لصناعة وتجارة مستحضرات التجميل.",
      points: [
        {
          title: "1.1 جمع المعلومات",
          text: "نجمع المعلومات الشخصية الضرورية لإتمام عملية الشراء وتقديم الخدمات ذات الصلة، بما في ذلك على سبيل المثال لا الحصر: الاسم بالكامل، تفاصيل الاتصال، تاريخ الميلاد، التاريخ الطبي (عند الحاجة)، ومعلومات الدفع.",
        },
        {
          title: "1.2 استخدام المعلومات",
          text: "تُستخدم معلوماتك فقط لمعالجة الشراء، وتقديم الخدمات ذات الصلة، والتواصل بشأن الطلبات، وتحسين خدماتنا.",
        },
        {
          title: "1.3 مشاركة البيانات والإفصاح عنها",
          text: "لن تقوم الشركة بكشف بياناتك الشخصية لطرف ثالث باستثناء مقدمي الخدمة المعتمدين المتورطين في معالجة المدفوعات أو عندما يقتضي القانون ذلك.",
        },
        {
          title: "1.4 أمان البيانات",
          text: "تتخذ الشركة التدابير الفنية والتنظيمية المناسبة لحماية بياناتك ضد الوصول غير المصرح به أو التعديل أو الكشف أو التدمير.",
        },
        {
          title: "1.5 الاحتفاظ بالبيانات",
          text: "يتم الاحتفاظ بالبيانات الشخصية طالما كانت ضرورية لتحقيق الأغراض المحددة في سياسة الخصوصية هذه أو حسبما يقتضيه القانون المعمول به.",
        },
        {
          title: "1.6 حقوقك",
          text: "لديك الحق في الوصول إلى معلوماتك الشخصية وتصحيحها أو طلب حذفها عن طريق التواصل معنا عبر البريد الإلكتروني: info@ashperoo.com",
        },
      ],
      outro:
        "بإجراء الشراء عبر الإنترنت، فإنك توافق على سياسة الخصوصية هذه وتقر بقراءتها وفهمها.",
    },
    {
      title: "2. الشروط والأحكام",
      points: [
        {
          title: "2.1 عملية الشراء",
          text: "يجب أن يتم الشراء عبر القنوات المعتمدة، بما في ذلك الموقع الرسمي https://ashperoo.com/ أو الهاتف أو المنصات الإلكترونية المعتمدة.",
        },
        {
          title: "2.2 دقة المعلومات",
          text: "تتعهد بتقديم معلومات دقيقة وكاملة أثناء الشراء لضمان إتمام العملية بسلاسة.",
        },
        {
          title: "2.3 الإلغاء وإعادة الجدولة",
          text: "يجب إبلاغ الشركة بأي إلغاء أو تغيير في الطلب قبل 24 ساعة على الأقل من الوقت المحدد. عدم الامتثال لذلك قد يؤدي إلى فرض رسوم إلغاء.",
        },
        {
          title: "2.4 شروط الدفع",
          text: "يجب إتمام الدفع وفقًا للطريقة المتفق عليها. قد يؤدي عدم الدفع إلى إلغاء الشراء.",
        },
        {
          title: "2.5 الحق في رفض الخدمة",
          text: "تحتفظ الشركة بالحق في رفض أو إلغاء أي طلب لأسباب تشمل، على سبيل المثال لا الحصر، السلامة، عدم الامتثال لسياسات الشركة، أو أي اعتبارات أخرى صالحة.",
        },
        {
          title: "2.6 المسؤولية",
          text: "بإجراء الطلب عبر الإنترنت، فإنك توافق على الامتثال لهذه الشروط والأحكام.",
        },
      ],
    },
    {
      title: "3. سياسة الاسترداد والاستبدال",
      intro:
        "في حالة الرغبة في استرداد أو استبدال الطلب، يجب إبلاغ الشركة قبل 48 ساعة بحد أقصى مع مراعاة سلامة المنتج وعدم تلفه أو استخدامه.",
    },
    {
      title: "4. حل النزاعات",
      intro:
        "في حال وجود نزاعات تتعلق بالدفع أو أي استفسارات أخرى، يجب على العملاء التواصل مع الشركة عبر البريد الإلكتروني info@ashperoo.com",
    },
  ],
};

const enContent = {
  pageTitle: "Privacy Policy & Terms",
  sections: [
    {
      title: "1. Privacy Policy",
      intro:
        "This Privacy Policy explains how Ashperoo for Cosmetics Manufacturing and Trading collects, uses, and protects your personal data when you make an online purchase.",
      points: [
        {
          title: "1.1 Information Collection",
          text: "We collect personal information necessary to complete your purchase and provide related services, including but not limited to: full name, contact details, date of birth, medical history (where required), and payment information.",
        },
        {
          title: "1.2 Use of Information",
          text: "Your information is used only to process purchases, provide related services, communicate regarding orders, and improve our services.",
        },
        {
          title: "1.3 Data Sharing and Disclosure",
          text: "The company does not disclose your personal data to third parties, except authorized service providers involved in payment processing or when required by law.",
        },
        {
          title: "1.4 Data Security",
          text: "The company applies appropriate technical and organizational measures to protect your data against unauthorized access, alteration, disclosure, or destruction.",
        },
        {
          title: "1.5 Data Retention",
          text: "Personal data is retained only as long as necessary to fulfill the purposes stated in this Privacy Policy or as required by applicable law.",
        },
        {
          title: "1.6 Your Rights",
          text: "You have the right to access, correct, or request deletion of your personal information by contacting us at: info@ashperoo.com",
        },
      ],
      outro:
        "By completing an online purchase, you agree to this Privacy Policy and acknowledge that you have read and understood it.",
    },
    {
      title: "2. Terms and Conditions",
      points: [
        {
          title: "2.1 Purchase Process",
          text: "Purchases must be made through approved channels, including our official website https://ashperoo.com/, phone, or approved electronic platforms.",
        },
        {
          title: "2.2 Accuracy of Information",
          text: "You agree to provide accurate and complete information during checkout to ensure smooth order processing.",
        },
        {
          title: "2.3 Cancellation and Rescheduling",
          text: "The company must be notified of any cancellation or change at least 24 hours before the scheduled time. Failure to comply may result in cancellation fees.",
        },
        {
          title: "2.4 Payment Terms",
          text: "Payment must be completed according to the agreed method. Failure to pay may result in cancellation of the purchase.",
        },
        {
          title: "2.5 Right to Refuse Service",
          text: "The company reserves the right to refuse or cancel any order for reasons including, but not limited to, safety, non-compliance with company policies, or other valid considerations.",
        },
        {
          title: "2.6 Liability",
          text: "By placing an online order, you agree to comply with these Terms and Conditions.",
        },
      ],
    },
    {
      title: "3. Refund and Exchange Policy",
      intro:
        "If you wish to request a refund or exchange, you must notify the company within a maximum of 48 hours, provided the product remains intact, unused, and undamaged.",
    },
    {
      title: "4. Dispute Resolution",
      intro:
        "For payment disputes or any other inquiries, customers must contact the company at: info@ashperoo.com",
    },
  ],
};

export default function PrivacyPolicyClient() {
  const { locale } = useLanguage();
  const isArabic = locale === "ar";
  const content = isArabic ? arContent : enContent;

  return (
    <div className="min-h-screen bg-bg-primary px-6 md:px-10 py-12 md:py-16">
      <div className="max-w-5xl mx-auto">
        <h1
          className={`font-playfair text-3xl md:text-5xl text-text-primary mb-10 ${
            isArabic ? "text-right" : "text-left"
          }`}
        >
          {content.pageTitle}
        </h1>

        <div className="space-y-8">
          {content.sections.map((section) => (
            <section
              key={section.title}
              className="rounded-3xl border border-border-color bg-bg-secondary p-6 md:p-8"
            >
              <h2
                className={`font-playfair text-2xl md:text-3xl text-text-primary mb-4 ${
                  isArabic ? "text-right" : "text-left"
                }`}
              >
                {section.title}
              </h2>

              {section.intro ? (
                <p
                  className={`text-text-secondary leading-8 mb-5 ${
                    isArabic ? "text-right" : "text-left"
                  }`}
                >
                  {section.intro}
                </p>
              ) : null}

              {Array.isArray(section.points) && section.points.length > 0 ? (
                <div className="space-y-4">
                  {section.points.map((point) => (
                    <div key={point.title}>
                      <h3
                        className={`text-text-primary font-semibold mb-1 ${
                          isArabic ? "text-right" : "text-left"
                        }`}
                      >
                        {point.title}
                      </h3>
                      <p
                        className={`text-text-secondary leading-7 ${
                          isArabic ? "text-right" : "text-left"
                        }`}
                      >
                        {point.text}
                      </p>
                    </div>
                  ))}
                </div>
              ) : null}

              {section.outro ? (
                <p
                  className={`mt-5 text-text-primary font-medium leading-8 ${
                    isArabic ? "text-right" : "text-left"
                  }`}
                >
                  {section.outro}
                </p>
              ) : null}
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
