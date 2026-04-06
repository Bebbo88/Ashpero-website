import { toAbsoluteAssetUrl } from "@/constants/config";

function getLocalizedValue(entity, locale, englishKey, arabicKey, fallbackKey) {
  if (!entity || typeof entity !== "object") {
    return "";
  }

  if (locale === "ar") {
    return entity[arabicKey] || entity[englishKey] || entity[fallbackKey] || "";
  }

  return entity[englishKey] || entity[arabicKey] || entity[fallbackKey] || "";
}

function formatPrice(value, locale) {
  const numericPrice = Number(value);

  if (!Number.isFinite(numericPrice)) {
    return "";
  }

  return new Intl.NumberFormat(locale === "ar" ? "ar-EG" : "en-US", {
    style: "currency",
    currency: "EGP",
    maximumFractionDigits: 0,
  }).format(numericPrice);
}

function resolveProductId(product, fallbackIndex) {
  return String(product?._id || product?.id || fallbackIndex + 1);
}

export function mapBestSellerProducts(products = [], locale = "en") {
  return products.map((product, index) => ({
    id: resolveProductId(product, index),
    image: toAbsoluteAssetUrl(product?.images?.[0] || "") || "/assets/photo1.jpeg",
    category: getLocalizedValue(product, locale, "category", "category", "category") || "Skincare",
    title: getLocalizedValue(product, locale, "name_en", "name_ar", "name") || "Product",
    price: formatPrice(product?.price, locale),
    priceNum: Number(product?.price) || 0,
  }));
}

export function mapHeroCards(products = [], locale = "en") {
  return mapBestSellerProducts(products, locale).slice(0, 6).map((product, index) => ({
    ...product,
    badge: index === 0 ? "Bestseller" : null,
  }));
}

export function mapHeroBackgroundSlides(content = {}) {
  const heroImages = Array.isArray(content.heroImages) ? content.heroImages : [];

  if (heroImages.length > 0) {
    // New uploads are appended in backend, so we show newest first.
    return heroImages.slice().reverse().map((path, index) => ({
      id: `hero-${index}`,
      image: toAbsoluteAssetUrl(path),
    }));
  }

  return [{ id: "hero-fallback", image: "/assets/background.jpg" }];
}

export function mapPrimaryBannerImage(content = {}) {
  const spotlightImages = Array.isArray(content.spotlightImages)
    ? content.spotlightImages
    : [];
  const banners = Array.isArray(content.banners) ? content.banners : [];
  const latestSpotlight = spotlightImages[spotlightImages.length - 1] || "";
  const latestBanner = banners[banners.length - 1] || "";
  const selectedBanner = latestSpotlight || latestBanner || "";
  return toAbsoluteAssetUrl(selectedBanner) || "/assets/background.jpg";
}
