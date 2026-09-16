// Centralizes the mapping between a locale ("en" | "ar") and its URL prefix.
// English is the default, unprefixed locale (so every existing indexed URL
// keeps working with zero redirects); Arabic lives under an explicit "/ar"
// prefix so it has its own crawlable, indexable URLs.

export const DEFAULT_LOCALE = "en";
export const LOCALES = ["en", "ar"];

// Removes a leading "/ar" segment from a pathname, if present.
export function stripLocalePrefix(pathname) {
  const path = String(pathname || "/");
  if (path === "/ar") return "/";
  if (path.startsWith("/ar/")) return path.slice(3);
  return path;
}

// Rewrites a same-origin path (which may already carry a locale prefix,
// a query string, or a hash) so it points at the given locale instead.
export function localizePath(href, locale) {
  if (typeof href !== "string" || !href.startsWith("/")) {
    return href;
  }

  const splitIndex = href.search(/[?#]/);
  const pathPart = splitIndex === -1 ? href : href.slice(0, splitIndex);
  const rest = splitIndex === -1 ? "" : href.slice(splitIndex);

  const bare = stripLocalePrefix(pathPart);
  const localizedPath =
    locale === "ar" ? (bare === "/" ? "/ar" : `/ar${bare}`) : bare;

  return `${localizedPath}${rest}`;
}
