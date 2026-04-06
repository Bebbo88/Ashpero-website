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

function normalizeProductImages(images = []) {
  const normalizedImages = Array.isArray(images)
    ? images.map((imagePath) => toAbsoluteAssetUrl(imagePath)).filter(Boolean)
    : [];

  if (normalizedImages.length > 0) {
    return normalizedImages;
  }

  return ["/assets/photo1.jpeg"];
}

function normalizeSizePrices(sizePrices = [], locale = "en") {
  if (!Array.isArray(sizePrices)) {
    return [];
  }

  return sizePrices
    .map((entry) => {
      const size = String(entry?.size || "").trim();
      const numericPrice = Number(entry?.price);

      if (!size || !Number.isFinite(numericPrice)) {
        return null;
      }

      return {
        size,
        priceValue: numericPrice,
        priceLabel: formatPrice(numericPrice, locale),
      };
    })
    .filter(Boolean);
}

function resolveProductTitle(product, locale = "en") {
  return getLocalizedValue(product, locale, "name_en", "name_ar", "name") || "";
}

function resolveProductDescription(product, locale = "en") {
  return (
    getLocalizedValue(product, locale, "description_en", "description_ar", "description") || ""
  );
}

export function mapAllProducts(products = [], locale = "en") {
  return products.map((product, index) => ({
    id: String(product?._id || product?.id || `product-${index + 1}`),
    image: toAbsoluteAssetUrl(product?.images?.[0] || "") || "/assets/photo1.jpeg",
    categoryRaw: String(product?.category || "").trim(),
    title: resolveProductTitle(product, locale),
    description: resolveProductDescription(product, locale),
    priceValue: Number(product?.price) || 0,
    price: formatPrice(product?.price, locale),
    productType: Array.isArray(product?.productType)
      ? product.productType.map((value) => String(value).trim()).filter(Boolean)
      : [],
    skinType: Array.isArray(product?.skinType)
      ? product.skinType.map((value) => String(value).trim()).filter(Boolean)
      : [],
    createdAt: product?.createdAt || "",
  }));
}

export function mapProductDetails(product, locale = "en") {
  if (!product || typeof product !== "object") {
    return null;
  }

  const sizePrices = normalizeSizePrices(product.sizePrices, locale);
  const normalizedSizes = Array.isArray(product.sizes)
    ? product.sizes
    : sizePrices.map((entry) => entry.size);

  return {
    id: String(product._id || product.id || ""),
    images: normalizeProductImages(product.images),
    category: getLocalizedValue(product, locale, "category", "category", "category") || "",
    title: resolveProductTitle(product, locale),
    price: formatPrice(product.price, locale),
    priceValue: Number.isFinite(Number(product.price)) ? Number(product.price) : 0,
    description: resolveProductDescription(product, locale),
    sizes: normalizedSizes,
    sizePrices,
    ingredients: getLocalizedValue(product, locale, "ingredients_en", "ingredients_ar", "ingredients"),
    howToUse: getLocalizedValue(product, locale, "howToUse_en", "howToUse_ar", "howToUse"),
  };
}

export function mapProductReviews(payload = {}) {
  const reviews = Array.isArray(payload.reviews) ? payload.reviews : [];
  const ratingsAverage = Number(payload.ratingsAverage);
  const ratingsCount = Number(payload.ratingsCount);

  return {
    reviews: reviews.map((review, index) => ({
      id: String(review._id || review.id || `${review.createdAt || "review"}-${index}`),
      name: review.reviewerName || "",
      avatar: review.reviewerAvatar || "",
      rating: Number(review.rating) || 0,
      date: review.createdAt ? String(review.createdAt).slice(0, 10) : "",
      comment: review.comment || "",
    })),
    ratingsAverage: Number.isFinite(ratingsAverage) ? ratingsAverage : 0,
    ratingsCount: Number.isFinite(ratingsCount) ? ratingsCount : 0,
  };
}
