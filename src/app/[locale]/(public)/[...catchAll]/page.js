import { notFound } from "next/navigation";

// Any URL under a valid locale prefix that doesn't match a real page lands
// here. Without this, Next.js's App Router falls back to its own bare
// built-in 404 (no locale, no site chrome, generic title) for a genuinely
// unmatched path — this route exists purely to route that case through the
// same custom not-found boundary used everywhere else (see [locale]/not-found.js).
export default function CatchAllNotFound() {
  notFound();
}
