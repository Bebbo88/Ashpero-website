import { notFound } from "next/navigation";
import ProductDetailsPage from "@/components/product/ProductDetailsPage";
import { extractProductIdFromParam, buildProductPath } from "@/utils/productUrl";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { fetchProductById } from "@/services/productService";
import { fetchOffers } from "@/services/offerService";
import { productQueryKeys } from "@/features/product/queryKeys";
import { offerQueryKeys } from "@/features/offer/queryKeys";
import { CONFIG, toAbsoluteAssetUrl } from "@/constants/config";
import { localizePath } from "@/utils/localePath";

// ISR: Revalidate every 60s for price/stock accuracy
export const revalidate = 60;

export async function generateMetadata({ params }) {
  const { id, locale } = await params;
  const resolvedId = extractProductIdFromParam(id);

  let product = null;
  try {
    product = await fetchProductById(resolvedId);
  } catch (err) {
    if (err?.status === 404) {
      notFound();
    }
    // Network/server error — fall through to the generic metadata below
    // rather than 404-ing a page that might genuinely exist.
  }

  if (product) {
    const slugSource =
      product.name_en || product.name_ar || product.name || "Product";
    const title =
      locale === "ar"
        ? product.name_ar || product.name_en || product.name || "Product"
        : product.name_en || product.name_ar || product.name || "Product";
    const desc =
      locale === "ar"
        ? product.description_ar || product.description_en || product.description || "Shop premium Ashpero product."
        : product.description_en || product.description_ar || product.description || "Shop premium Ashpero product.";
    const fullTitle = `${title} | Ashperoo Skincare`;
    const description = desc.slice(0, 160);
    const bareProductPath = buildProductPath(resolvedId, slugSource);
    const url = `${CONFIG.siteUrl}${localizePath(bareProductPath, locale)}`;
    const enUrl = `${CONFIG.siteUrl}${bareProductPath}`;
    const arUrl = `${CONFIG.siteUrl}${localizePath(bareProductPath, "ar")}`;
    const firstImage = Array.isArray(product.images)
      ? toAbsoluteAssetUrl(product.images[0])
      : null;
    const ogImage = firstImage || `${CONFIG.siteUrl}/assets/about-us.jpg`;

    return {
      title: fullTitle,
      description,
      alternates: {
        canonical: url,
        languages: { en: enUrl, ar: arUrl, "x-default": enUrl },
      },
      openGraph: {
        title: fullTitle,
        description,
        url,
        siteName: "Ashperoo",
        images: [{ url: ogImage }],
        type: "website",
      },
      twitter: {
        card: "summary_large_image",
        title: fullTitle,
        description,
        images: [ogImage],
      },
    };
  }

  return {
    title: `Product | Ashperoo Skincare`,
    description: `Shop premium Ashpero skincare. Read reviews, instructions, and ingredients.`,
  };
}

function buildProductJsonLd(product, resolvedId, locale) {
  if (!product) {
    return null;
  }

  const name = product.name_en || product.name_ar || product.name || "Product";
  const description =
    product.description_en || product.description_ar || product.description || "";
  const images = Array.isArray(product.images)
    ? product.images.map((image) => toAbsoluteAssetUrl(image)).filter(Boolean)
    : [];

  const variantPrices = Array.isArray(product.variants)
    ? product.variants.map((variant) => Number(variant?.price)).filter(Number.isFinite)
    : [];
  const price = variantPrices.length > 0 ? Math.min(...variantPrices) : Number(product.price) || 0;

  const totalStock = Array.isArray(product.variants)
    ? product.variants.reduce((sum, variant) => sum + (Number(variant?.stock) || 0), 0)
    : 0;
  const isAvailable = product.inStock !== false && totalStock > 0;

  const productUrl = `${CONFIG.siteUrl}${localizePath(buildProductPath(resolvedId, name), locale)}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name,
    description,
    sku: resolvedId,
    url: productUrl,
    brand: {
      "@type": "Brand",
      name: "Ashperoo",
    },
  };

  if (images.length > 0) {
    jsonLd.image = images;
  }

  if (price > 0) {
    jsonLd.offers = {
      "@type": "Offer",
      url: productUrl,
      priceCurrency: "EGP",
      price: price.toFixed(2),
      availability: isAvailable
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
    };
  }

  const ratingsCount = Number(product.ratingsCount) || 0;
  if (ratingsCount > 0) {
    jsonLd.aggregateRating = {
      "@type": "AggregateRating",
      ratingValue: Number(product.ratingsAverage) || 0,
      reviewCount: ratingsCount,
    };
  }

  return jsonLd;
}

function buildBreadcrumbJsonLd(product, resolvedId, locale) {
  const name = product?.name_en || product?.name_ar || product?.name || "Product";
  const productUrl = `${CONFIG.siteUrl}${localizePath(buildProductPath(resolvedId, name), locale)}`;

  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: `${CONFIG.siteUrl}${localizePath("/", locale)}`,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "All Products",
        item: `${CONFIG.siteUrl}${localizePath("/all-products", locale)}`,
      },
      { "@type": "ListItem", position: 3, name, item: productUrl },
    ],
  };
}

export default async function ProductDetails({ params }) {
  const { id, locale } = await params;
  const resolvedId = extractProductIdFromParam(id);

  const queryClient = new QueryClient();
  let product = null;

  try {
    const [productResult] = await Promise.all([
      queryClient.fetchQuery({
        queryKey: productQueryKeys.details(resolvedId),
        queryFn: () => fetchProductById(resolvedId),
      }),
      queryClient.prefetchQuery({
        queryKey: offerQueryKeys.list(),
        queryFn: fetchOffers,
      }),
    ]);
    product = productResult;
  } catch (err) {
    if (err?.status === 404) {
      notFound();
    }
    // Network/server error — degrade gracefully instead of 404-ing a page
    // that might genuinely exist; ProductDetailsPage's own error state
    // handles a temporarily-unreachable backend.
    console.error("Prefetch error for product:", err);
  }

  const productJsonLd = buildProductJsonLd(product, resolvedId, locale);
  const breadcrumbJsonLd = product ? buildBreadcrumbJsonLd(product, resolvedId, locale) : null;

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      {productJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
        />
      )}
      {breadcrumbJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
        />
      )}
      <ProductDetailsPage productId={resolvedId} />
    </HydrationBoundary>
  );
}
