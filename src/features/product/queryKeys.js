export const productQueryKeys = {
  all: ["product"],
  list: (paramsKey = "") => [...productQueryKeys.all, "list", String(paramsKey || "")],
  details: (productId) => [...productQueryKeys.all, "details", String(productId || "")],
  reviews: (productId) => [...productQueryKeys.all, "reviews", String(productId || "")],
};
