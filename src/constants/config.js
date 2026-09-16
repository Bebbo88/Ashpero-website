const rawApiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";
const rawSiteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.ashperoo.com";

export const CONFIG = {
  apiBaseUrl: rawApiBaseUrl.replace(/\/$/, ""),
  siteUrl: rawSiteUrl.replace(/\/$/, ""),
  requestTimeoutMs: 12000,
};

export function toAbsoluteAssetUrl(path) {
  if (!path || typeof path !== "string") {
    return "";
  }

  if (/^https?:\/\//i.test(path)) {
    return path;
  }

  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${CONFIG.apiBaseUrl}${normalizedPath}`;
}
