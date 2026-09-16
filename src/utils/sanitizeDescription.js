import DOMPurify from "isomorphic-dompurify";

// Product descriptions are admin-authored HTML that use a `style` attribute
// only for brand-color highlights (e.g. `color: #f97316; font-weight: bold;`).
// Rather than allow arbitrary CSS (which DOMPurify's ALLOWED_ATTR would permit
// wholesale), restrict every style declaration down to this safe allow-list.
//
// This runs as a DOMPurify `uponSanitizeAttribute` hook rather than a raw
// pre-sanitize string regex: DOMPurify hands the hook the attribute value
// already parsed out of the DOM, so it's immune to how the value was quoted
// in the source HTML (single/double/unquoted) — a regex matching only
// `style="..."` would silently let a single-quoted `style='...'` through
// untouched.
const SAFE_STYLE_DECLARATION =
  /^(color\s*:\s*(#[0-9a-fA-F]{3,8}|rgb\(\s*\d{1,3}\s*,\s*\d{1,3}\s*,\s*\d{1,3}\s*\)|[a-zA-Z]+)|font-weight\s*:\s*(normal|bold|[1-9]00))$/i;

DOMPurify.addHook("uponSanitizeAttribute", (_node, data) => {
  if (data.attrName !== "style") {
    return;
  }

  const safeDeclarations = String(data.attrValue || "")
    .split(";")
    .map((declaration) => declaration.trim())
    .filter((declaration) => SAFE_STYLE_DECLARATION.test(declaration));

  data.attrValue = safeDeclarations.join("; ");
});

const DESCRIPTION_SANITIZE_CONFIG = {
  ALLOWED_TAGS: ["b", "strong", "span"],
  ALLOWED_ATTR: ["style"],
};

export function sanitizeProductDescription(description) {
  return DOMPurify.sanitize(description, DESCRIPTION_SANITIZE_CONFIG);
}
