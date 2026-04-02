const rawApiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";

export const CONFIG = {
  apiBaseUrl: rawApiBaseUrl.replace(/\/$/, ""),
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
