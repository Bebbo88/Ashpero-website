"use client";

import Link from "next/link";
import { useLanguage } from "@/hooks/useLanguage";
import { localizePath } from "@/utils/localePath";

// Drop-in replacement for next/link's <Link> that automatically prefixes
// internal hrefs with the current locale (e.g. "/all-products" becomes
// "/ar/all-products" while browsing the Arabic site). Non-string hrefs and
// external/absolute URLs are passed through untouched.
export default function AppLink({ href, ...props }) {
  const { locale } = useLanguage();
  const localizedHref = localizePath(href, locale);

  return <Link href={localizedHref} {...props} />;
}
