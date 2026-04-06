function toSlugSegment(value) {
  return String(value || "")
    .normalize("NFKD")
    .toLowerCase()
    .trim()
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\p{L}\p{N}\s-]/gu, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export function buildProductPath(productId, productName) {
  const id = String(productId || "").trim();
  if (!id) {
    return "/product";
  }

  const slug = toSlugSegment(productName) || "product";
  return `/product/${slug}-${id}`;
}

export function extractProductIdFromParam(paramValue) {
  const raw = String(paramValue || "").trim();
  if (!raw) {
    return "";
  }

  const parts = raw.split("-").filter(Boolean);
  return parts.length > 1 ? parts[parts.length - 1] : raw;
}
