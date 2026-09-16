import { NextResponse } from "next/server";

// The whole route tree lives under src/app/[locale]/..., so every request
// needs a locale segment to match a page. Arabic URLs already carry it
// ("/ar/all-products" -> params.locale === "ar"). English is the default,
// unprefixed locale — existing indexed URLs like "/all-products" must keep
// resolving exactly as before, so those are rewritten internally to
// "/en/all-products" without changing what the browser/crawler sees.
export function proxy(request) {
  const { pathname } = request.nextUrl;

  if (pathname === "/ar" || pathname.startsWith("/ar/")) {
    return NextResponse.next();
  }

  const url = request.nextUrl.clone();
  url.pathname = `/en${pathname === "/" ? "" : pathname}`;
  return NextResponse.rewrite(url);
}

export const config = {
  matcher: ["/((?!_next|api|.*\\..*).*)"],
};
