export function calculateDiscountedPrice(basePrice, discountType, discountValue) {
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

  const matchingOffers = offers.filter((offer) =>
    Array.isArray(offer?.productIds)
      ? offer.productIds.some((item) => String(item?._id || item) === productId)
      : false,
  );

  if (matchingOffers.length === 0) {
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

  // A product can be in more than one active offer at once — pick the one
  // that actually saves the customer the most, same selection rule already
  // used by mapOfferProducts, instead of whichever offer happens to appear
  // first in the array.
  let bestOffer = matchingOffers[0];
  let bestDiscountedPrice = calculateDiscountedPrice(
    basePrice,
    bestOffer.discountType,
    bestOffer.discountValue,
  );
  let bestSavings = basePrice - bestDiscountedPrice;

  for (const offer of matchingOffers.slice(1)) {
    const discountedPrice = calculateDiscountedPrice(
      basePrice,
      offer.discountType,
      offer.discountValue,
    );
    const savings = basePrice - discountedPrice;

    if (savings > bestSavings) {
      bestOffer = offer;
      bestDiscountedPrice = discountedPrice;
      bestSavings = savings;
    }
  }

  return {
    ...product,
    hasOffer: true,
    oldPrice: basePrice,
    finalPrice: bestDiscountedPrice,
    discountType: bestOffer.discountType,
    discountValue: bestOffer.discountValue,
  };
}
