"use client";

import React, { useEffect } from "react";
import Link from "@/components/ui/AppLink";
import { useLanguage } from "@/hooks/useLanguage";

export default function ErrorBoundary({ error, reset }) {
  const { t } = useLanguage();

  useEffect(() => {
    console.error("Unhandled render error:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-bg-primary flex flex-col items-center justify-center relative overflow-hidden px-6">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-status-error/5 rounded-full blur-3xl opacity-50 pointer-events-none" />

      <div className="relative z-10 flex flex-col items-center justify-center text-center">
        <h1 className="text-2xl md:text-3xl font-bold font-serif text-text-primary mb-3">
          {t("ErrorPage.title")}
        </h1>

        <p className="text-text-secondary text-sm md:text-base max-w-sm mx-auto mb-10">
          {t("ErrorPage.description")}
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3">
          <button
            type="button"
            onClick={reset}
            className="inline-flex items-center justify-center px-8 py-3.5 rounded-full bg-brand-dark dark:bg-brand-mint text-white tracking-wide font-semibold text-sm hover:scale-105 active:scale-95 transition-all shadow-soft cursor-pointer"
          >
            {t("ErrorPage.tryAgain")}
          </button>

          <Link
            href="/"
            className="inline-flex items-center justify-center px-8 py-3.5 rounded-full border border-border-color text-text-primary tracking-wide font-semibold text-sm hover:scale-105 active:scale-95 transition-all cursor-pointer"
          >
            {t("ErrorPage.returnHome")}
          </Link>
        </div>
      </div>
    </div>
  );
}
