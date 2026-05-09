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

export function applyOfferToProduct(product, offers = []) {
  const productId = String(product?._id || product?.id || "");

  if (!productId) {
    return {
      ...product,
      hasOffer: false,
    };
  }

  const matchedOffer = offers.find((offer) =>
    Array.isArray(offer?.productIds)
      ? offer.productIds.some((item) => String(item?._id || item) === productId)
      : false,
  );

  if (!matchedOffer) {
    return {
      ...product,
      hasOffer: false,
    };
  }

  const variants = Array.isArray(product?.variants) ? product.variants : [];

  const prices = variants
    .map((variant) => Number(variant?.price))
    .filter(Number.isFinite);

  const basePrice =
    prices.length > 0 ? Math.min(...prices) : Number(product?.price);

  const discountedPrice = calculateDiscountedPrice(
    basePrice,
    matchedOffer.discountType,
    matchedOffer.discountValue,
  );

  return {
    ...product,
    hasOffer: true,
    oldPrice: basePrice,
    finalPrice: discountedPrice,
    discountType: matchedOffer.discountType,
    discountValue: matchedOffer.discountValue,
  };
}
