"use client";

import React, { useState, useMemo } from "react";
import { SlidersHorizontal, ChevronDown, Grid2X2, Grid3X3 } from "lucide-react";
import ProductCard from "./ProductCard";
import ProductFilter from "./ProductFilter";
import { useLanguage } from "../../hooks/useLanguage";

const ALL_PRODUCTS = [
  {
    id: 1,
    image: "/assets/photo1.jpeg",
    categoryKey: "antiAging",
    titleKey: "retinol",
    price: "$84.00",
    priceNum: 84,
    skinConcern: ["aging"],
    productType: ["serums"],
    skinType: ["normal", "dry"],
  },
  {
    id: 2,
    image: "/assets/photo2.jpeg",
    categoryKey: "hydration",
    titleKey: "hyaluronic",
    price: "$62.00",
    priceNum: 62,
    skinConcern: ["dryness"],
    productType: ["serums"],
    skinType: ["dry", "combination"],
  },
  {
    id: 3,
    image: "/assets/photo3.jpeg",
    categoryKey: "glow",
    titleKey: "goldOil",
    price: "$120.00",
    priceNum: 120,
    skinConcern: ["darkSpots"],
    productType: ["oils"],
    skinType: ["normal", "dry"],
  },
  {
    id: 4,
    image: "/assets/photo4.jpeg",
    categoryKey: "cleansing",
    titleKey: "cleanser",
    price: "$45.00",
    priceNum: 45,
    skinConcern: ["acne", "sensitivity"],
    productType: ["cleansers"],
    skinType: ["oily", "combination", "sensitive"],
  },
  {
    id: 5,
    image: "/assets/photo1.jpeg",
    categoryKey: "antiAging",
    titleKey: "retinolNight",
    price: "$92.00",
    priceNum: 92,
    skinConcern: ["aging"],
    productType: ["moisturizers"],
    skinType: ["normal", "dry"],
  },
  {
    id: 6,
    image: "/assets/photo3.jpeg",
    categoryKey: "glow",
    titleKey: "vitaminCSerum",
    price: "$78.00",
    priceNum: 78,
    skinConcern: ["darkSpots", "aging"],
    productType: ["serums"],
    skinType: ["normal", "oily", "combination"],
  },
  {
    id: 7,
    image: "/assets/photo2.jpeg",
    categoryKey: "hydration",
    titleKey: "moisturizer",
    price: "$56.00",
    priceNum: 56,
    skinConcern: ["dryness"],
    productType: ["moisturizers"],
    skinType: ["dry", "normal"],
  },
  {
    id: 8,
    image: "/assets/photo4.jpeg",
    categoryKey: "cleansing",
    titleKey: "foamCleanser",
    price: "$38.00",
    priceNum: 38,
    skinConcern: ["acne"],
    productType: ["cleansers"],
    skinType: ["oily", "combination"],
  },
];

const SORT_OPTIONS = [
  { key: "featured", labelKey: "featured" },
  { key: "priceLow", labelKey: "priceLow" },
  { key: "priceHigh", labelKey: "priceHigh" },
  { key: "newest", labelKey: "newest" },
];

const priceRangeCheck = (priceNum, range) => {
  switch (range) {
    case "under30":
      return priceNum < 30;
    case "from30to60":
      return priceNum >= 30 && priceNum <= 60;
    case "from60to100":
      return priceNum >= 60 && priceNum <= 100;
    case "over100":
      return priceNum > 100;
    default:
      return true;
  }
};

export default function AllProductsPage() {
  const { t } = useLanguage();
  const [filters, setFilters] = useState({
    category: [],
    skinConcern: [],
    productType: [],
    skinType: [],
    priceRange: [],
  });
  const [sortBy, setSortBy] = useState("featured");
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [gridCols, setGridCols] = useState(4);

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const clearAllFilters = () => {
    setFilters({
      category: [],
      skinConcern: [],
      productType: [],
      skinType: [],
      priceRange: [],
    });
  };

  const filteredProducts = useMemo(() => {
    let result = ALL_PRODUCTS.filter((product) => {
      // Filter by category
      if (
        filters.category.length > 0 &&
        !filters.category.includes(product.categoryKey)
      )
        return false;
      // Filter by skin concern
      if (
        filters.skinConcern.length > 0 &&
        !filters.skinConcern.some((f) => product.skinConcern.includes(f))
      )
        return false;
      // Filter by product type
      if (
        filters.productType.length > 0 &&
        !filters.productType.some((f) => product.productType.includes(f))
      )
        return false;
      // Filter by skin type
      if (
        filters.skinType.length > 0 &&
        !filters.skinType.some((f) => product.skinType.includes(f))
      )
        return false;
      // Filter by price range
      if (
        filters.priceRange.length > 0 &&
        !filters.priceRange.some((r) => priceRangeCheck(product.priceNum, r))
      )
        return false;
      return true;
    });

    // Sort
    switch (sortBy) {
      case "priceLow":
        result.sort((a, b) => a.priceNum - b.priceNum);
        break;
      case "priceHigh":
        result.sort((a, b) => b.priceNum - a.priceNum);
        break;
      case "newest":
        result.sort((a, b) => b.id - a.id);
        break;
      default:
        break;
    }

    return result;
  }, [filters, sortBy]);

  // Map product data to display format
  const displayProducts = filteredProducts.map((p) => ({
    id: p.id,
    image: p.image,
    category: t(`AllProducts.categories.${p.categoryKey}`),
    title: t(`AllProducts.products.${p.titleKey}`),
    price: p.price,
  }));

  const activeFilterCount = Object.values(filters).reduce(
    (count, arr) => count + arr.length,
    0,
  );

  return (
    <section className="w-full bg-bg-primary min-h-screen">
      {/* Hero Header */}
      <div className="w-full bg-gradient-to-r from-[#69b578] via-[#2B4E38] to-[#1F3325] pt-12 pb-8 md:pt-16 md:pb-12">
        <div className="container mx-auto px-6 lg:px-10">
          <p className="font-sans text-[11px] font-bold tracking-[0.3em] uppercase text-white/60 mb-2">
            {t("AllProducts.subtitle")}
          </p>
          <h1 className="font-serif text-3xl md:text-4xl lg:text-5xl font-medium text-white tracking-wide">
            {t("AllProducts.title")}
          </h1>
          <p className="mt-2 text-sm text-white/75 max-w-xl leading-relaxed">
            {t("AllProducts.description")}
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 lg:px-10 py-10 md:py-14">
        {/* Toolbar */}
        <div className="flex items-center justify-between mb-8 pb-6 border-b border-border-color">
          {/* Left: Mobile filter toggle + result count */}
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
              {displayProducts.length} {t("AllProducts.productCount")}
            </span>
          </div>

          {/* Right: Sort + Grid toggle */}
          <div className="flex items-center gap-4">
            {/* Sort Dropdown */}
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
                        className={`w-full text-left rtl:text-right px-4 py-3 text-sm transition-colors cursor-pointer
                          ${
                            sortBy === opt.key
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

            {/* Grid Toggle */}
            <div className="hidden md:flex items-center gap-1 border border-border-color rounded-lg p-0.5">
              <button
                onClick={() => setGridCols(3)}
                className={`p-1.5 rounded-md transition-colors cursor-pointer ${
                  gridCols === 3
                    ? "bg-brand-dark dark:bg-brand-mint text-white"
                    : "text-text-secondary hover:text-text-primary"
                }`}
              >
                <Grid2X2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setGridCols(4)}
                className={`p-1.5 rounded-md transition-colors cursor-pointer ${
                  gridCols === 4
                    ? "bg-brand-dark dark:bg-brand-mint text-white"
                    : "text-text-secondary hover:text-text-primary"
                }`}
              >
                <Grid3X3 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Layout: Filter Sidebar + Product Grid */}
        <div className="flex gap-10 lg:gap-14">
          {/* Filter Sidebar */}
          <ProductFilter
            filters={filters}
            onFilterChange={handleFilterChange}
            onClearAll={clearAllFilters}
            isMobileOpen={isMobileFilterOpen}
            onMobileClose={() => setIsMobileFilterOpen(false)}
          />

          {/* Product Grid */}
          <div className="flex-1">
            {displayProducts.length > 0 ? (
              <div
                className={`grid gap-x-5 gap-y-10 grid-cols-2 ${
                  gridCols === 3
                    ? "md:grid-cols-2 lg:grid-cols-3"
                    : "md:grid-cols-3 lg:grid-cols-4"
                }`}
              >
                {displayProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="w-20 h-20 rounded-full bg-brand-creme dark:bg-brand-dark/20 flex items-center justify-center mb-6">
                  <SlidersHorizontal className="w-8 h-8 text-text-secondary" />
                </div>
                <h3 className="font-serif text-xl font-medium text-text-primary mb-2">
                  {t("AllProducts.noResults")}
                </h3>
                <p className="text-sm text-text-secondary max-w-sm">
                  {t("AllProducts.noResultsDesc")}
                </p>
                <button
                  onClick={clearAllFilters}
                  className="mt-6 px-6 py-2.5 rounded-full bg-brand-dark dark:bg-brand-mint text-white text-sm font-semibold hover:opacity-90 transition-opacity cursor-pointer"
                >
                  {t("AllProducts.filters.clearAll")}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

    </section>
  );
}
