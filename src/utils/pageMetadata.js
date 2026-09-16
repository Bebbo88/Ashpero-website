import { CONFIG } from "@/constants/config";
import { localizePath } from "@/utils/localePath";

// Used whenever a page doesn't have its own dedicated banner image, so
// social shares (Facebook/WhatsApp) still render a real preview image
// instead of a blank one.
const DEFAULT_OG_IMAGE = `${CONFIG.siteUrl}/assets/about-us.jpg`;

// Builds a consistent title/description/canonical/hreflang/OpenGraph/Twitter
// metadata object for a page. `path` is the *unprefixed* (English) route
// (e.g. "/about-us"); `locale` picks which language variant this render is
// for, so canonical points at the URL actually being served while
// `alternates.languages` still tells search engines about both.
export function buildPageMetadata({ path, title, description, image, locale = "en" }) {
  const url = `${CONFIG.siteUrl}${localizePath(path, locale)}`;
  const enUrl = `${CONFIG.siteUrl}${path}`;
  const arUrl = `${CONFIG.siteUrl}${localizePath(path, "ar")}`;
  const ogImage = image ? `${CONFIG.siteUrl}${image}` : DEFAULT_OG_IMAGE;

  return {
    title,
    description,
    alternates: {
      canonical: url,
      languages: {
        en: enUrl,
        ar: arUrl,
        "x-default": enUrl,
      },
    },
    openGraph: {
      title,
      description,
      url,
      siteName: "Ashperoo",
      images: [{ url: ogImage }],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
  };
}
