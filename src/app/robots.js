import { CONFIG } from "@/constants/config";

const TRANSACTIONAL_PATHS = [
  "/checkout",
  "/success",
  "/failed",
  "/kiosk-success",
  "/my-orders",
  "/wishlist",
];

export default function robots() {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          ...TRANSACTIONAL_PATHS,
          ...TRANSACTIONAL_PATHS.map((path) => `/ar${path}`),
          "/api/",
        ],
      },
    ],
    sitemap: `${CONFIG.siteUrl}/sitemap.xml`,
  };
}
