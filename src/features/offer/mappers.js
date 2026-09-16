import { toAbsoluteAssetUrl } from "@/constants/config";

function formatCurrency(value, locale = "en") {
  const numericValue = Number(value);
  if (!Number.isFinite(numericValue)) {
    return "";
  }

  return new Intl.NumberFormat(locale === "ar" ? "ar-EG" : "en-US", {
    style: "currency",
    currency: "EGP",
    maximumFractionDigits: 0,
  }).format(numericValue);
}

function getLocalizedValue(entity, locale, englishKey, arabicKey, fallbackKey) {
  if (!entity || typeof entity !== "object") {
    return "";
  }

  if (locale === "ar") {
    return entity[arabicKey] || entity[englishKey] || entity[fallbackKey] || "";
  }

  return entity[englishKey] || entity[arabicKey] || entity[fallbackKey] || "";
}

function buildDiscountLabel(offer, locale = "en") {
  const discountType = String(offer?.discountType || "").toLowerCase();
  const discountValue = Number(offer?.discountValue);

  if (!Number.isFinite(discountValue)) {
    return locale === "ar" ? "خصم" : "Sale";
  }

  if (discountType === "percentage") {
    return locale === "ar" ? `%${discountValue} خصم` : `${discountValue}% OFF`;
  }

  if (discountType === "fixed") {
    return locale === "ar"
      ? `${formatCurrency(discountValue, locale)} خصم`
      : `${formatCurrency(discountValue, locale)} OFF`;
  }

  return locale === "ar" ? "خصم" : "Sale";
}

function calculateDiscountedPrice(basePrice, discountType, discountValue) {
  const price = Number(basePrice);
  const value = Number(discountValue);

  if (!Number.isFinite(price)) {
    return 0;
  }

  if (!Number.isFinite(value) || value < 0) {
    return price;
  }

  if (String(discountType).toLowerCase() === "percentage") {
    return Math.max(0, price - (price * value) / 100);
  }

  if (String(discountType).toLowerCase() === "fixed") {
    return Math.max(0, price - value);
  }

  return price;
}

export function mapOfferProducts(offers = [], locale = "en") {
  const byProductId = new Map();
  // Tracks each product's best (largest) savings across possibly multiple
  // applicable offers, separately from the exposed `discountValue` field
  // (which callers/ProductCard expect to be the offer's raw discount value,
  // e.g. "20" for 20%, not a computed currency amount).
  const bestSavingsById = new Map();

  for (const offer of offers) {
    const products = Array.isArray(offer?.productIds) ? offer.productIds : [];
    const badge = buildDiscountLabel(offer, locale);
    const offerTitle = getLocalizedValue(
      offer,
      locale,
      "title_en",
      "title_ar",
      "title",
    );

    for (const product of products) {
      if (product?.isBundle) {
        continue;
      }

      const productId = String(product?._id || product?.id || "").trim();
      const variants = Array.isArray(product?.variants) ? product.variants : [];

      const prices = variants
        .map((variant) => Number(variant?.price))
        .filter(Number.isFinite);

      const basePrice =
        prices.length > 0 ? Math.min(...prices) : Number(product?.price);

      if (!productId || !Number.isFinite(basePrice)) {
        continue;
      }

      const discountedPrice = calculateDiscountedPrice(
        basePrice,
        offer?.discountType,
        offer?.discountValue,
      );

      const savings = basePrice - discountedPrice;
      const bestSavingsSoFar = bestSavingsById.get(productId) ?? -Infinity;

      if (savings <= bestSavingsSoFar) {
        continue;
      }

      bestSavingsById.set(productId, savings);

      byProductId.set(productId, {
        id: productId,
        title:
          getLocalizedValue(product, locale, "name_en", "name_ar", "name") ||
          "Product",
        description: offerTitle || "",
        image:
          toAbsoluteAssetUrl(product?.images?.[0] || "") ||
          "/assets/photo1.jpeg",
        price: formatCurrency(discountedPrice, locale),
        priceNum: discountedPrice,
        oldPrice: formatCurrency(basePrice, locale),
        badge,
        isWishlisted: false,
        // Same fields ProductCard already uses on the all-products page to
        // render the discount badge and the popup-gallery trigger.
        hasOffer: true,
        discountType: String(offer?.discountType || "").toLowerCase(),
        discountValue: Number(offer?.discountValue) || 0,
        popupGallery: Array.isArray(product?.popupGallery)
          ? product.popupGallery
          : [],
        // ProductCard's "Add to Cart" needs these to actually work — without
        // them it silently no-ops (no variant to add, stock check vacuously
        // passes/fails).
        variants: Array.isArray(product?.variants) ? product.variants : [],
        inStock: product?.inStock !== false,
        category: String(product?.category || "").trim(),
      });
    }
  }

  return Array.from(byProductId.values());
}
