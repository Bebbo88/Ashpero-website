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

function normalizeProductImages(images = []) {
  const normalizedImages = Array.isArray(images)
    ? images.map((imagePath) => toAbsoluteAssetUrl(imagePath)).filter(Boolean)
    : [];

  if (normalizedImages.length > 0) {
    return normalizedImages;
  }

  return ["/assets/photo1.jpeg"];
}

function resolveProductTitle(product, locale = "en") {
  return getLocalizedValue(product, locale, "name_en", "name_ar", "name") || "";
}

function resolveProductDescription(product, locale = "en") {
  return (
    getLocalizedValue(
      product,
      locale,
      "description_en",
      "description_ar",
      "description",
    ) || ""
  );
}

export function mapAllProducts(products = [], locale = "en", offers = []) {
  return products.map((product, index) => {
    const normalizedProduct = applyOfferToProduct(product, offers);

    const variants = Array.isArray(normalizedProduct?.variants)
      ? normalizedProduct.variants
      : [];

    const prices = variants
      .map((variant) => Number(variant?.price))
      .filter(Number.isFinite);

    const lowestPrice =
      prices.length > 0
        ? Math.min(...prices)
        : Number(normalizedProduct?.price) || 0;

    const finalPrice = normalizedProduct?.finalPrice || lowestPrice;

    return {
      id: String(
        normalizedProduct?._id ||
          normalizedProduct?.id ||
          `product-${index + 1}`,
      ),

      image:
        toAbsoluteAssetUrl(normalizedProduct?.images?.[0] || "") ||
        "/assets/photo1.jpeg",

      categoryRaw: String(normalizedProduct?.category || "").trim(),

      title: resolveProductTitle(normalizedProduct, locale),

      description: resolveProductDescription(normalizedProduct, locale),

      priceValue: finalPrice,

      price: formatPrice(finalPrice, locale),

      oldPrice: normalizedProduct?.hasOffer
        ? formatPrice(lowestPrice, locale)
        : "",

      hasOffer: normalizedProduct?.hasOffer || false,

      discountType: normalizedProduct?.discountType || "",

      discountValue: normalizedProduct?.discountValue || 0,

      variants,

      productType: Array.isArray(normalizedProduct?.productType)
        ? normalizedProduct.productType
            .map((value) => String(value).trim())
            .filter(Boolean)
        : [],

      skinType: Array.isArray(normalizedProduct?.skinType)
        ? normalizedProduct.skinType
            .map((value) => String(value).trim())
            .filter(Boolean)
        : [],

      createdAt: normalizedProduct?.createdAt || "",
    };
  });
}

export function mapProductDetails(product, locale = "en", offers = []) {
  if (!product || typeof product !== "object") {
    return null;
  }

  const normalizedProduct = applyOfferToProduct(product, offers);

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
      : Number(normalizedProduct?.price) || 0;

  const finalPrice = normalizedProduct?.finalPrice || lowestPrice;

  return {
    id: String(normalizedProduct._id || normalizedProduct.id || ""),

    images: normalizeProductImages(normalizedProduct.images),

    category:
      getLocalizedValue(
        normalizedProduct,
        locale,
        "category",
        "category",
        "category",
      ) || "",

    title: resolveProductTitle(normalizedProduct, locale),

    description: resolveProductDescription(normalizedProduct, locale),

    price: formatPrice(finalPrice, locale),

    oldPrice: normalizedProduct?.hasOffer
      ? formatPrice(lowestPrice, locale)
      : "",

    hasOffer: normalizedProduct?.hasOffer || false,

    discountType: normalizedProduct?.discountType || "",

    discountValue: normalizedProduct?.discountValue || 0,

    priceValue: finalPrice,

    variants,

    ingredients: getLocalizedValue(
      normalizedProduct,
      locale,
      "ingredients_en",
      "ingredients_ar",
      "ingredients",
    ),

    howToUse: getLocalizedValue(
      normalizedProduct,
      locale,
      "howToUse_en",
      "howToUse_ar",
      "howToUse",
    ),
  };
}

export function mapProductReviews(payload = {}) {
  const reviews = Array.isArray(payload.reviews) ? payload.reviews : [];

  const ratingsAverage = Number(payload.ratingsAverage);

  const ratingsCount = Number(payload.ratingsCount);

  return {
    reviews: reviews.map((review, index) => ({
      id: String(
        review._id || review.id || `${review.createdAt || "review"}-${index}`,
      ),

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
