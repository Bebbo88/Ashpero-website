"use client";

import React, { useMemo, useState } from "react";
import {
  SlidersHorizontal,
  ChevronDown,
  Grid2X2,
  Grid3X3,
  Search,
} from "lucide-react";
import Image from "@/components/ui/AppImage";
import ProductCard from "./ProductCard";
import ProductFilter from "./ProductFilter";
import EmptyState from "@/components/ui/EmptyState";
import ProductCardSkeleton from "./ProductCardSkeleton";
import Loader from "@/components/loader/loader";
import { useLanguage } from "../../hooks/useLanguage";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import { mapAllProducts } from "@/features/product/mappers";
import { useProductsQuery } from "@/features/product/queries";
import { useOffersQuery } from "@/features/offer/queries";
import { useSiteContentQuery } from "@/features/home/queries";
import { mapProductsPageBannerImage } from "@/features/home/mappers";

const SORT_OPTIONS = [
  { key: "featured", labelKey: "featured" },
  { key: "priceLow", labelKey: "priceLow" },
  { key: "priceHigh", labelKey: "priceHigh" },
  { key: "newest", labelKey: "newest" },
];

const PRICE_RANGE_OPTIONS = [
  "under100",
  "from100to300",
  "from300to500",
  "from500to700",
  "over700",
];

const priceRangeCheck = (priceNum, range) => {
  switch (range) {
    case "under100":
      return priceNum < 100;
    case "from100to300":
      return priceNum >= 100 && priceNum <= 300;
    case "from300to500":
      return priceNum >= 300 && priceNum <= 500;
    case "from500to700":
      return priceNum >= 500 && priceNum <= 700;
    case "over700":
      return priceNum > 700;
    default:
      return true;
  }
};

const normalizeList = (values = []) =>
  values
    .map((value) => String(value || "").trim())
    .filter(Boolean)
    .filter(
      (value, index, list) =>
        list.findIndex(
          (entry) => entry.toLowerCase() === value.toLowerCase(),
        ) === index,
    );

function normalizeCategoryTranslationKey(category) {
  const compact = String(category || "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ");

  if (!compact) {
    return "";
  }

  const tokens = compact.split(" ").filter(Boolean);
  if (tokens.length === 0) {
    return "";
  }

  if (tokens.join("") === "antiaging") {
    return "antiAging";
  }

  return tokens
    .map((token, index) =>
      index === 0 ? token : `${token.charAt(0).toUpperCase()}${token.slice(1)}`,
    )
    .join("");
}

function formatTokenLabel(token) {
  return String(token || "")
    .split(/[-_\s]+/)
    .filter(Boolean)
    .map((part) => `${part.charAt(0).toUpperCase()}${part.slice(1)}`)
    .join(" ");
}

function getPriceRangeLabel(range, locale) {
  if (locale === "ar") {
    if (range === "under100") return "أقل من 100 ج.م";
    if (range === "from100to300") return "100 إلى 300 ج.م";
    if (range === "from300to500") return "300 إلى 500 ج.م";
    if (range === "from500to700") return "500 إلى 700 ج.م";
    if (range === "over700") return "أكثر من 700 ج.م";
  }

  if (range === "under100") return "Under 100 EGP";
  if (range === "from100to300") return "100 - 300 EGP";
  if (range === "from300to500") return "300 - 500 EGP";
  if (range === "from500to700") return "500 - 700 EGP";
  if (range === "over700") return "Above 700 EGP";

  return range;
}

export default function AllProductsPage() {
  const { t, locale } = useLanguage();
  const [filters, setFilters] = useState({
    category: [],
    productType: [],
    skinType: [],
    priceRange: [],
  });
  const [sortBy, setSortBy] = useState("featured");
  const [searchInput, setSearchInput] = useState("");
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [gridCols, setGridCols] = useState(4);

  const debouncedSearch = useDebouncedValue(searchInput.trim(), 450);

  const facetsQuery = useProductsQuery({ isActive: true, isBundle: false });
  const offersQuery = useOffersQuery();
  const siteContentQuery = useSiteContentQuery();

  const headerBannerImage = useMemo(
    () => mapProductsPageBannerImage(siteContentQuery.data),
    [siteContentQuery.data],
  );

  const productsQuery = useProductsQuery({
    isActive: true,
    isBundle: false,
    search: debouncedSearch || undefined,
    category:
      filters.category.length > 0 ? filters.category.join(",") : undefined,
    productType:
      filters.productType.length > 0
        ? filters.productType.join(",")
        : undefined,
    skinType:
      filters.skinType.length > 0 ? filters.skinType.join(",") : undefined,
  });

  const products = useMemo(
    () => mapAllProducts(productsQuery.data, locale, offersQuery.data),
    [locale, productsQuery.data, offersQuery.data],
  );

  const facetsProducts = useMemo(
    () => mapAllProducts(facetsQuery.data, locale, offersQuery.data),
    [facetsQuery.data, locale, offersQuery.data],
  );

  const categoryOptions = useMemo(
    () => normalizeList(facetsProducts.map((product) => product.categoryRaw)),
    [facetsProducts],
  );
  const productTypeOptions = useMemo(
    () =>
      normalizeList(
        facetsProducts.flatMap((product) =>
          Array.isArray(product.productType) ? product.productType : [],
        ),
      ),
    [facetsProducts],
  );
  const skinTypeOptions = useMemo(
    () =>
      normalizeList(
        facetsProducts.flatMap((product) =>
          Array.isArray(product.skinType) ? product.skinType : [],
        ),
      ),
    [facetsProducts],
  );

  const filterSections = useMemo(
    () => [
      { key: "category", options: categoryOptions },
      { key: "productType", options: productTypeOptions },
      { key: "skinType", options: skinTypeOptions },
      { key: "priceRange", options: PRICE_RANGE_OPTIONS },
    ],
    [categoryOptions, productTypeOptions, skinTypeOptions],
  );

  const resolveCategoryLabel = (categoryValue) => {
    const normalizedKey = normalizeCategoryTranslationKey(categoryValue);

    if (normalizedKey) {
      const translationKey = `AllProducts.categories.${normalizedKey}`;
      const translated = t(translationKey);

      if (translated !== translationKey) {
        return translated;
      }
    }

    return categoryValue;
  };

  const resolveFilterOptionLabel = (section, option) => {
    if (section.key === "category") {
      return resolveCategoryLabel(option);
    }

    if (section.key === "priceRange") {
      return getPriceRangeLabel(option, locale);
    }

    const translationKey = `AllProducts.filters.${section.key}.options.${option}`;
    const translated = t(translationKey);

    if (translated !== translationKey) {
      return translated;
    }

    return formatTokenLabel(option);
  };

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const clearAllFilters = () => {
    setFilters({
      category: [],
      productType: [],
      skinType: [],
      priceRange: [],
    });
  };

  const filteredProducts = useMemo(() => {
    let result = products.filter((product) => {
      if (
        filters.priceRange.length > 0 &&
        !filters.priceRange.some((range) =>
          priceRangeCheck(Number(product.priceValue || 0), range),
        )
      ) {
        return false;
      }

      return true;
    });

    switch (sortBy) {
      case "priceLow":
        result = [...result].sort((a, b) => a.priceValue - b.priceValue);
        break;
      case "priceHigh":
        result = [...result].sort((a, b) => b.priceValue - a.priceValue);
        break;
      case "newest":
        result = [...result].sort(
          (a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0),
        );
        break;
      default:
        break;
    }

    return result.map((product) => ({
      ...product,

      category: resolveCategoryLabel(product.categoryRaw),

      priceNum: product.priceValue,
    }));
  }, [filters.priceRange, products, sortBy]);

  const activeFilterCount = Object.values(filters).reduce(
    (count, arr) => count + arr.length,
    0,
  );

  const isLoading =
    productsQuery.isLoading || facetsQuery.isLoading || offersQuery.isLoading;

  if (isLoading && products.length === 0) {
    return <Loader fullScreen />;
  }

  const isError =
    productsQuery.isError || facetsQuery.isError || offersQuery.isError;
  const errorMessage =
    productsQuery.error?.message ||
    facetsQuery.error?.message ||
    offersQuery.error?.message ||
    "";

  return (
    <section className="w-full bg-bg-primary min-h-screen">
      <div className="w-full">
        {headerBannerImage && (
          <Image
            src={headerBannerImage}
            alt="All Products"
            width={1920}
            height={1080}
            priority
            className="w-full h-auto object-cover"
            sizes="100vw"
          />
        )}
      </div>

      <div className="container mx-auto px-6 lg:px-10 py-10 md:py-14">
        <div className="flex items-center justify-between mb-8 pb-6 border-b border-border-color">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsMobileFilterOpen(true)}
              className="lg:hidden flex items-center gap-2 text-sm font-semibold text-text-primary hover:text-brand-orange transition-colors cursor-pointer"
            >
              <SlidersHorizontal className="w-4 h-4" />
              {t("AllProducts.filters.title")}
              {activeFilterCount > 0 && (
                <span className="w-5 h-5 rounded-full bg-brand-orange text-white text-[10px] font-bold flex items-center justify-center">
                  {activeFilterCount}
                </span>
              )}
            </button>
            <span className="text-sm text-text-secondary">
              {filteredProducts.length} {t("AllProducts.productCount")}
            </span>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative hidden md:block">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" />
              <input
                value={searchInput}
                onChange={(event) => setSearchInput(event.target.value)}
                placeholder={
                  locale === "ar" ? "ابحث عن منتج..." : "Search products..."
                }
                className="w-52 lg:w-64 rounded-lg border border-border-color bg-bg-primary py-2 ps-9 pe-3 text-sm text-text-primary outline-none focus:border-brand-orange"
              />
            </div>

            <div className="relative">
              <button
                onClick={() => setIsSortOpen(!isSortOpen)}
                className="flex items-center gap-2 text-sm font-medium text-text-primary hover:text-brand-orange transition-colors cursor-pointer"
              >
                {t("AllProducts.sortBy")}:{" "}
                <span className="font-semibold">
                  {t(`AllProducts.sort.${sortBy}`)}
                </span>
                <ChevronDown
                  className={`w-4 h-4 transition-transform duration-200 ${isSortOpen ? "rotate-180" : ""}`}
                />
              </button>
              {isSortOpen && (
                <>
                  <div
                    className="fixed inset-0 z-30"
                    onClick={() => setIsSortOpen(false)}
                  />
                  <div className="absolute right-0 rtl:right-auto rtl:left-0 top-full mt-2 w-48 bg-bg-primary border border-border-color rounded-xl shadow-xl z-40 overflow-hidden">
                    {SORT_OPTIONS.map((opt) => (
                      <button
                        key={opt.key}
                        onClick={() => {
                          setSortBy(opt.key);
                          setIsSortOpen(false);
                        }}
                        className={`w-full text-left rtl:text-right px-4 py-3 text-sm transition-colors cursor-pointer ${sortBy === opt.key
                          ? "bg-brand-creme dark:bg-brand-dark/30 text-brand-orange font-semibold"
                          : "text-text-primary hover:bg-gray-50 dark:hover:bg-white/5"
                          }`}
                      >
                        {t(`AllProducts.sort.${opt.labelKey}`)}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            <div className="hidden md:flex items-center gap-1 border border-border-color rounded-lg p-0.5">
              <button
                onClick={() => setGridCols(3)}
                className={`p-1.5 rounded-md transition-colors cursor-pointer ${gridCols === 3
                  ? "bg-brand-dark dark:bg-brand-mint text-white"
                  : "text-text-secondary hover:text-text-primary"
                  }`}
              >
                <Grid2X2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setGridCols(4)}
                className={`p-1.5 rounded-md transition-colors cursor-pointer ${gridCols === 4
                  ? "bg-brand-dark dark:bg-brand-mint text-white"
                  : "text-text-secondary hover:text-text-primary"
                  }`}
              >
                <Grid3X3 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        <div className="flex gap-10 lg:gap-14">
          <ProductFilter
            filters={filters}
            onFilterChange={handleFilterChange}
            onClearAll={clearAllFilters}
            isMobileOpen={isMobileFilterOpen}
            onMobileClose={() => setIsMobileFilterOpen(false)}
            filterSections={filterSections}
            resolveOptionLabel={resolveFilterOptionLabel}
          />

          <div className="flex-1">
            {isLoading ? (
              <div
                className={`grid gap-x-5 gap-y-10 grid-cols-2 ${gridCols === 3
                  ? "md:grid-cols-2 lg:grid-cols-3"
                  : "md:grid-cols-3 lg:grid-cols-4"
                  }`}
              >
                {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                  <ProductCardSkeleton key={i} />
                ))}
              </div>
            ) : null}

            {isError ? (
              <div className="rounded-2xl border border-red-200 bg-red-50/80 p-8 text-center">
                <p className="text-sm font-semibold text-red-700">
                  Failed to load products.
                </p>
                <p className="mt-2 text-xs text-red-600">
                  {errorMessage ||
                    "Check API URL, backend status, and CORS origins."}
                </p>
              </div>
            ) : null}

            {!isLoading && !isError && filteredProducts.length > 0 ? (
              <div
                className={`grid gap-x-5 gap-y-10 grid-cols-2 ${gridCols === 3
                  ? "md:grid-cols-2 lg:grid-cols-3"
                  : "md:grid-cols-3 lg:grid-cols-4"
                  }`}
              >
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : null}

            {!isLoading && !isError && filteredProducts.length === 0 ? (
              <EmptyState
                title={t("AllProducts.noResults")}
                description={t("AllProducts.noResultsDesc")}
                actionButton={
                  <button
                    onClick={clearAllFilters}
                    className="px-6 py-2.5 rounded-full bg-brand-dark dark:bg-brand-mint text-white text-sm font-semibold hover:opacity-90 transition-opacity cursor-pointer"
                  >
                    {t("AllProducts.filters.clearAll")}
                  </button>
                }
              />
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
