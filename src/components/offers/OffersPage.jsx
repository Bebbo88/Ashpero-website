"use client";

import React, { useMemo, useState } from "react";
import Image from "@/components/ui/AppImage";
import { Search } from "lucide-react";
import ProductCard from "@/components/product/ProductCard";
import EmptyState from "@/components/ui/EmptyState";
import ProductCardSkeleton from "@/components/product/ProductCardSkeleton";
import { useLanguage } from "@/hooks/useLanguage";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import { useSiteContentQuery } from "@/features/home/queries";
import { mapOffersPageBannerImage } from "@/features/home/mappers";
import { mapOfferProducts } from "@/features/offer/mappers";
import { useOffersQuery } from "@/features/offer/queries";
import { AnimatePresence } from "framer-motion";
import HeroLoader from "../home/HearoLoader";

function matchSearch(item, searchTerm) {
  if (!searchTerm) {
    return true;
  }

  const normalized = searchTerm.toLowerCase();
  return (
    String(item.title || "")
      .toLowerCase()
      .includes(normalized) ||
    String(item.description || "")
      .toLowerCase()
      .includes(normalized)
  );
}

export default function OffersPage() {
  const { t, locale } = useLanguage();
  const [searchValue, setSearchValue] = useState("");
  const debouncedSearch = useDebouncedValue(searchValue.trim(), 350);

  const offersQuery = useOffersQuery();
  const siteContentQuery = useSiteContentQuery();

  const products = useMemo(
    () => mapOfferProducts(offersQuery.data, locale),
    [offersQuery.data, locale],
  );

  const filteredProducts = useMemo(
    () => products.filter((item) => matchSearch(item, debouncedSearch)),
    [debouncedSearch, products],
  );

  const headerImage = useMemo(
    () => mapOffersPageBannerImage(siteContentQuery.data),
    [siteContentQuery.data],
  );

  const isLoading = siteContentQuery.isLoading || !headerImage;

  return (
    <div className="w-full">
      <div className="relative w-full min-h-[240px] md:min-h-[380px]  overflow-hidden shadow-card">
        {/* Ã°Å¸Å¸Â¡ Loader */}
        {isLoading && (
          <AnimatePresence>
            <HeroLoader />
          </AnimatePresence>
        )}
        {!isLoading && (
          <Image
            src={headerImage}
            alt="Offers Header"
            fill
            className="object-fill"
            priority
            sizes="100vw"
          />
        )}
      </div>

      <div className="container mx-auto px-4 md:px-6 lg:px-8 py-8 md:py-12 max-w-7xl">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="text-2xl md:text-3xl font-serif text-text-primary mb-1">
              {t("Offers.sectionTitle")}
            </h2>
            <p className="text-gray-500 dark:text-gray-400 text-sm font-light">
              {t("Offers.sectionDesc")}
            </p>
          </div>

          <div className="relative w-full md:w-[300px]">
            <Search className="w-4 h-4 text-text-secondary absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              value={searchValue}
              onChange={(event) => setSearchValue(event.target.value)}
              placeholder={
                locale === "ar" ? "???? ?? ??????..." : "Search offers..."
              }
              className="w-full rounded-xl border border-border-color bg-bg-primary py-2.5 ps-9 pe-3 text-sm text-text-primary outline-none focus:border-brand-orange"
            />
          </div>
        </div>

        {offersQuery.isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-10 md:gap-x-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        ) : null}

        {offersQuery.isError ? (
          <div className="rounded-2xl border border-red-200 bg-red-50/80 p-8 text-center">
            <p className="text-sm font-semibold text-red-700">
              Failed to load offers.
            </p>
            <p className="mt-2 text-xs text-red-600">
              {offersQuery.error?.message ||
                "Please check backend status and try again."}
            </p>
          </div>
        ) : null}

        {!offersQuery.isLoading &&
        !offersQuery.isError &&
        filteredProducts.length > 0 ? (
          <>
            <div className="mb-5 text-xs tracking-wide text-text-secondary">
              {locale === "ar"
                ? `??? ???????? ????????: ${filteredProducts.length}`
                : `Showing ${filteredProducts.length} offer products`}
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-10 md:gap-x-6">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </>
        ) : null}

        {!offersQuery.isLoading &&
        !offersQuery.isError &&
        filteredProducts.length === 0 ? (
          <EmptyState
            title={t("AllProducts.noResults")}
            description={t("AllProducts.noResultsDesc")}
          />
        ) : null}
      </div>
    </div>
  );
}
