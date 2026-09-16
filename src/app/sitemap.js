import { CONFIG } from "@/constants/config";
import { fetchProducts } from "@/services/productService";
import { buildProductPath } from "@/utils/productUrl";
import { localizePath } from "@/utils/localePath";

const STATIC_ROUTES = [
  { path: "/", changeFrequency: "daily", priority: 1 },
  { path: "/all-products", changeFrequency: "daily", priority: 0.9 },
  { path: "/offers", changeFrequency: "daily", priority: 0.8 },
  { path: "/tips-and-tricks", changeFrequency: "weekly", priority: 0.6 },
  { path: "/about-us", changeFrequency: "monthly", priority: 0.5 },
  { path: "/contact-us", changeFrequency: "monthly", priority: 0.4 },
  { path: "/returns", changeFrequency: "yearly", priority: 0.3 },
  { path: "/privacy-policy", changeFrequency: "yearly", priority: 0.3 },
];

// Builds one sitemap entry per locale for a given bare (English) path, each
// carrying `alternates.languages` so crawlers can discover the sibling
// locale's URL directly from either entry.
function buildLocalizedEntries(path, rest) {
  const enUrl = `${CONFIG.siteUrl}${path}`;
  const arUrl = `${CONFIG.siteUrl}${localizePath(path, "ar")}`;
  const languages = { en: enUrl, ar: arUrl };

  return [
    { url: enUrl, alternates: { languages }, ...rest },
    { url: arUrl, alternates: { languages }, ...rest },
  ];
}

export default async function sitemap() {
  const now = new Date();

  const staticEntries = STATIC_ROUTES.flatMap((route) =>
    buildLocalizedEntries(route.path, {
      lastModified: now,
      changeFrequency: route.changeFrequency,
      priority: route.priority,
    }),
  );

  let productEntries = [];

  try {
    const products = await fetchProducts({ isActive: true });

    productEntries = (Array.isArray(products) ? products : []).flatMap((product) => {
      const name = product.name_en || product.name_ar || product.name || "";
      const path = buildProductPath(product._id || product.id, name);

      return buildLocalizedEntries(path, {
        lastModified: product.updatedAt ? new Date(product.updatedAt) : now,
        changeFrequency: "weekly",
        priority: 0.7,
      });
    });
  } catch (_error) {
    // If the API is unreachable at build/request time, ship the sitemap with
    // static routes only rather than failing the whole route.
    productEntries = [];
  }

  return [...staticEntries, ...productEntries];
}
