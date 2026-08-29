import { toAbsoluteAssetUrl } from "@/constants/config";
import { applyOfferToProduct } from "@/utils/applyOffer";

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

export function mapBestSellerProducts(
  products = [],
  locale = "en",
  offers = [],
) {
  return products
    .map((product, index) => {
      const normalizedProduct = applyOfferToProduct(product, offers);

      const image = toAbsoluteAssetUrl(normalizedProduct?.images?.[0]);

      const variants = Array.isArray(normalizedProduct?.variants)
        ? normalizedProduct.variants.map((variant) => ({
            size: String(variant.size || "").trim(),

            price: Number(variant.price) || 0,

            stock: Number(variant.stock) || 0,

            priceLabel: formatPrice(variant.price, locale),
          }))
        : [];

      const lowestPrice =
        variants.length > 0
          ? Math.min(...variants.map((variant) => variant.price))
          : 0;

      const finalPrice = normalizedProduct?.finalPrice || lowestPrice;

      return {
        id: resolveProductId(normalizedProduct, index),

        image: image || null,

        category:
          getLocalizedValue(
            normalizedProduct,
            locale,
            "category",
            "category",
            "category",
          ) || "Skincare",

        title:
          getLocalizedValue(
            normalizedProduct,
            locale,
            "name_en",
            "name_ar",
            "name",
          ) || "Product",

        price: formatPrice(finalPrice, locale),

        priceNum: finalPrice,

        oldPrice: normalizedProduct?.hasOffer
          ? formatPrice(lowestPrice, locale)
          : "",

        hasOffer: normalizedProduct?.hasOffer || false,

        discountType: normalizedProduct?.discountType || "",

        discountValue: normalizedProduct?.discountValue || 0,

        variants,

        beforeAfterImages: normalizedProduct?.beforeAfterImages || null,

        popupGallery: Array.isArray(normalizedProduct?.popupGallery)
          ? normalizedProduct.popupGallery
          : [],

        customerReviewVideos: Array.isArray(normalizedProduct?.customerReviewVideos)
          ? normalizedProduct.customerReviewVideos
          : [],
      };
    })
    .filter((product) => product.image);
}

export function mapHeroCards(products = [], locale = "en", offers = []) {
  return mapBestSellerProducts(products, locale, offers)
    .slice(0, 6)
    .map((product, index) => ({
      ...product,
      badge: index === 0 ? "Bestseller" : null,
    }));
}

export function mapHeroBackgroundSlides(content = {}) {
  const heroImages = Array.isArray(content.heroImages)
    ? content.heroImages
    : [];

  return heroImages
    .slice()
    .reverse()
    .map((path, index) => {
      const image = toAbsoluteAssetUrl(path);

      return {
        id: `hero-${index}`,
        image: image || null,
      };
    })
    .filter((slide) => slide.image);
}

function getLatestImagePath(items) {
  if (!Array.isArray(items) || items.length === 0) {
    return "";
  }

  return items[items.length - 1] || "";
}

export function mapHomeOfferBannerImage(content = {}) {
  const selectedBanner =
    getLatestImagePath(content.banners) ||
    getLatestImagePath(content.spotlightImages) ||
    getLatestImagePath(content.heroImages) ||
    "";

  const image = toAbsoluteAssetUrl(selectedBanner);

  return image || null;
}

export function mapOffersPageBannerImage(content = {}) {
  const selectedBanner =
    content?.offersBannerImage ||
    getLatestImagePath(content?.spotlightImages) ||
    getLatestImagePath(content?.banners) ||
    getLatestImagePath(content?.heroImages) ||
    "";

  const image = toAbsoluteAssetUrl(selectedBanner);

  return image || null;
}

export function mapProductsPageBannerImage(content = {}) {
  const selectedBanner = content?.productsBannerImage || "";
  const image = toAbsoluteAssetUrl(selectedBanner);

  return image || "/assets/all_productss.jpg";
}

export function mapPrimaryBannerImage(content = {}) {
  return mapOffersPageBannerImage(content);
}
