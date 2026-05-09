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

  for (const offer of offers) {
    const products = Array.isArray(offer?.productIds) ? offer.productIds : [];
    console.log(products);
    const badge = buildDiscountLabel(offer, locale);
    const offerTitle = getLocalizedValue(
      offer,
      locale,
      "title_en",
      "title_ar",
      "title",
    );

    for (const product of products) {
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

      const nextItem = {
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
        discountValue: basePrice - discountedPrice,
      };

      const currentItem = byProductId.get(productId);
      if (!currentItem || nextItem.discountValue > currentItem.discountValue) {
        byProductId.set(productId, nextItem);
      }
    }
  }

  return Array.from(byProductId.values());
}
