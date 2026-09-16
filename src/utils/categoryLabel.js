// Converts a raw product category string (as stored on the product, e.g.
// "anti aging") into the i18n translation key used under "AllProducts.categories"
// (e.g. "AllProducts.categories.antiAging").
export function normalizeCategoryTranslationKey(category) {
  const compact = String(category || "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ");

  if (!compact) {
    return "";
  }

  const tokens = compact.split(" ").filter(Boolean);
  if (tokens.length === 0) {
    return "";
  }

  if (tokens.join("") === "antiaging") {
    return "antiAging";
  }

  return tokens
    .map((token, index) =>
      index === 0 ? token : `${token.charAt(0).toUpperCase()}${token.slice(1)}`,
    )
    .join("");
}

// Resolves a raw category value to its translated display label, falling
// back to the raw value when no translation exists for it.
export function resolveCategoryLabel(categoryValue, t) {
  const normalizedKey = normalizeCategoryTranslationKey(categoryValue);

  if (normalizedKey) {
    const translationKey = `AllProducts.categories.${normalizedKey}`;
    const translated = t(translationKey);

    if (translated !== translationKey) {
      return translated;
    }
  }

  return categoryValue;
}
