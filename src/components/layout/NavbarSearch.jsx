"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X } from "lucide-react";
import Link from "next/link";
import Image from "@/components/ui/AppImage";
import { useProductsQuery } from "@/features/product/queries";
import { mapAllProducts } from "@/features/product/mappers";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import { useLanguage } from "@/hooks/useLanguage";
import { buildProductPath } from "@/utils/productUrl";

const MAX_PRODUCT_RESULTS = 6;
const MAX_CATEGORY_RESULTS = 4;

function normalizeText(str) {
  return String(str || "")
    .toLowerCase()
    .trim();
}

function matchesQuery(text, query) {
  return normalizeText(text).includes(normalizeText(query));
}

export default function NavbarSearch() {
  const { locale } = useLanguage();
  const isArabic = locale === "ar";

  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false); // Desktop dropdown open
  const [isMobileExpanded, setIsMobileExpanded] = useState(false); // Mobile input expanded

  const debouncedQuery = useDebouncedValue(query, 300);

  const containerRef = useRef(null);
  const inputRef = useRef(null);
  const mobileInputRef = useRef(null);

  // Fetch all products once (cached by react-query)
  const { data: rawProducts = [] } = useProductsQuery();

  const allProducts = useMemo(
    () => mapAllProducts(rawProducts, locale),
    [rawProducts, locale]
  );

  // Filter results based on debounced query — search both AR and EN fields
  const { filteredProducts, filteredCategories } = useMemo(() => {
    if (!debouncedQuery.trim()) {
      return { filteredProducts: [], filteredCategories: [] };
    }

    const q = debouncedQuery;

    // Map products in BOTH locales to get both names for matching
    const productsEn = mapAllProducts(rawProducts, "en");
    const productsAr = mapAllProducts(rawProducts, "ar");

    const products = allProducts
      .filter((_, idx) => {
        const en = productsEn[idx];
        const ar = productsAr[idx];
        return (
          matchesQuery(en?.title, q) ||
          matchesQuery(ar?.title, q) ||
          matchesQuery(en?.categoryRaw, q) ||
          matchesQuery(ar?.categoryRaw, q)
        );
      })
      .slice(0, MAX_PRODUCT_RESULTS);

    // Extract unique categories that match (in both languages)
    const categorySet = new Set();
    allProducts.forEach((p, idx) => {
      const enCat = productsEn[idx]?.categoryRaw;
      const arCat = productsAr[idx]?.categoryRaw;
      if (enCat && (matchesQuery(enCat, q) || matchesQuery(arCat, q))) {
        categorySet.add(p.categoryRaw); // store as displayed in current locale
      }
    });
    const categories = Array.from(categorySet).slice(0, MAX_CATEGORY_RESULTS);

    return { filteredProducts: products, filteredCategories: categories };
  }, [debouncedQuery, allProducts, rawProducts]);

  const hasResults =
    filteredProducts.length > 0 || filteredCategories.length > 0;
  const showDropdown = isOpen && debouncedQuery.trim().length > 0;

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
        setIsMobileExpanded(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // ESC key closes search
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setIsOpen(false);
        setIsMobileExpanded(false);
        setQuery("");
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Auto-focus mobile input when expanded
  useEffect(() => {
    if (isMobileExpanded && mobileInputRef.current) {
      mobileInputRef.current.focus();
    }
  }, [isMobileExpanded]);

  const handleSelect = () => {
    setIsOpen(false);
    setIsMobileExpanded(false);
    setQuery("");
  };

  const placeholder = isArabic ? "ابحث عن منتج أو كاتيجوري..." : "Search products or categories...";

  return (
    <div ref={containerRef} className="relative flex-1 flex justify-center">
      {/* ── DESKTOP SEARCH (md and up) ── */}
      <div className="hidden md:flex w-full max-w-[280px] lg:max-w-[450px] flex-col items-stretch relative mx-4">
        <div
          className={`flex items-center bg-black/5 dark:bg-white/5 border rounded-xl px-3 py-1.5 md:py-2 transition-all duration-200 gap-2 ${
            isOpen
              ? "border-brand-mint shadow-[0_0_0_2px_rgba(12,109,109,0.15)]"
              : "border-transparent hover:border-border-color"
          }`}
        >
          <Search className="w-4 h-4 text-text-secondary shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setIsOpen(true);
            }}
            onFocus={() => setIsOpen(true)}
            placeholder={placeholder}
            aria-label={isArabic ? "بحث" : "Search"}
            className="bg-transparent text-xs text-text-primary placeholder:text-text-secondary outline-none w-full min-w-0"
          />
          <AnimatePresence>
            {query && (
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.15 }}
                onClick={() => {
                  setQuery("");
                  inputRef.current?.focus();
                }}
                aria-label="Clear search"
                className="shrink-0 text-text-secondary hover:text-text-primary transition-colors cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </motion.button>
            )}
          </AnimatePresence>
        </div>

        {/* Desktop Dropdown */}
        <AnimatePresence>
          {showDropdown && (
            <motion.div
              key="desktop-dropdown"
              initial={{ opacity: 0, y: -8, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.98 }}
              transition={{ duration: 0.18, ease: "easeOut" }}
              className="absolute top-full mt-2 w-full min-w-[280px] bg-bg-primary border border-border-color rounded-2xl shadow-soft overflow-hidden z-[999]"
            >
              <SearchResults
                query={debouncedQuery}
                products={filteredProducts}
                categories={filteredCategories}
                hasResults={hasResults}
                onSelect={handleSelect}
                isArabic={isArabic}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── MOBILE: Search icon (only visible below md) ── */}
      <div className="flex md:hidden items-center">
        <motion.button
          initial={false}
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsMobileExpanded(true)}
          aria-label={isArabic ? "فتح البحث" : "Open search"}
          className="p-1.5 hover:bg-black/5 dark:hover:bg-white/10 rounded-full transition-colors text-text-primary cursor-pointer"
        >
          <Search className="w-4 h-4" />
        </motion.button>
      </div>

      {/* ── MOBILE OVERLAY (fixed, sits on top of entire navbar) ── */}
      <AnimatePresence>
        {isMobileExpanded && (
          <>
            {/* Backdrop */}
            <motion.div
              key="mobile-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/30 backdrop-blur-sm z-[998]"
              onClick={() => {
                setIsMobileExpanded(false);
                setQuery("");
              }}
            />

            {/* Search bar overlay — sits at top of screen, same height as navbar */}
            <motion.div
              key="mobile-overlay"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
              className="fixed top-0 left-0 right-0 z-[999] bg-bg-primary border-b border-border-color shadow-soft px-4 py-3 flex flex-col gap-2"
            >
              {/* Input row */}
              <div className="flex items-center gap-3 bg-black/5 dark:bg-white/5 border border-brand-mint rounded-full px-4 py-2.5 shadow-[0_0_0_2px_rgba(12,109,109,0.15)]">
                <Search className="w-4 h-4 text-text-secondary shrink-0" />
                <input
                  ref={mobileInputRef}
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder={placeholder}
                  aria-label={isArabic ? "بحث" : "Search"}
                  className="bg-transparent text-sm text-text-primary placeholder:text-text-secondary outline-none w-full min-w-0"
                />
                <button
                  onClick={() => {
                    setIsMobileExpanded(false);
                    setQuery("");
                  }}
                  aria-label="Close search"
                  className="shrink-0 text-text-secondary hover:text-text-primary transition-colors cursor-pointer p-0.5"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Results dropdown (inside the overlay panel) */}
              <AnimatePresence>
                {debouncedQuery.trim() && (
                  <motion.div
                    key="mobile-results"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.18, ease: "easeOut" }}
                    className="bg-bg-primary border border-border-color rounded-2xl overflow-hidden shadow-soft"
                  >
                    <SearchResults
                      query={debouncedQuery}
                      products={filteredProducts}
                      categories={filteredCategories}
                      hasResults={hasResults}
                      onSelect={handleSelect}
                      isArabic={isArabic}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Sub-component: Dropdown Results ──
function SearchResults({ query, products, categories, hasResults, onSelect, isArabic }) {
  if (!hasResults) {
    return (
      <div className="p-6 text-center">
        <p className="text-sm text-text-secondary">
          {isArabic ? `لا توجد نتائج لـ "${query}"` : `No results for "${query}"`}
        </p>
      </div>
    );
  }

  return (
    <div className="max-h-[420px] overflow-y-auto">
      {/* Category shortcuts */}
      {categories.length > 0 && (
        <div className="px-3 pt-3 pb-2">
          <p className="text-[10px] font-bold tracking-widest uppercase text-text-secondary mb-2 px-1">
            {isArabic ? "الفئات" : "Categories"}
          </p>
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <Link
                key={cat}
                href={`/all-products?category=${encodeURIComponent(cat)}`}
                onClick={onSelect}
                className="px-3 py-1 rounded-full bg-brand-mint/10 text-brand-mint text-xs font-semibold border border-brand-mint/20 hover:bg-brand-mint/20 transition-colors"
              >
                {cat}
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Divider */}
      {categories.length > 0 && products.length > 0 && (
        <div className="mx-3 my-1 border-t border-border-color" />
      )}

      {/* Product results */}
      {products.length > 0 && (
        <div className="py-1">
          <p className="text-[10px] font-bold tracking-widest uppercase text-text-secondary mb-1 px-4 pt-2">
            {isArabic ? "المنتجات" : "Products"}
          </p>
          {products.map((product) => (
            <Link
              key={product.id}
              href={buildProductPath(product.id, product.title)}
              onClick={onSelect}
              className="flex items-center gap-3 px-3 py-2.5 hover:bg-black/5 dark:hover:bg-white/5 transition-colors group"
            >
              {/* Thumbnail */}
              <div className="relative shrink-0 w-10 h-10 rounded-xl overflow-hidden bg-surface-muted">
                <Image
                  src={product.image}
                  alt={product.title}
                  fill
                  sizes="40px"
                  className="object-cover"
                />
              </div>
              {/* Info */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-text-primary truncate group-hover:text-brand-mint transition-colors">
                  {product.title}
                </p>
                {product.categoryRaw && (
                  <p className="text-[10px] text-text-secondary uppercase tracking-wider truncate">
                    {product.categoryRaw}
                  </p>
                )}
              </div>
              {/* Price */}
              <span className="shrink-0 text-sm font-bold text-brand-mint">
                {product.price}
              </span>
            </Link>
          ))}
        </div>
      )}

      {/* View all link */}
      <div className="px-3 py-2 border-t border-border-color">
        <Link
          href={`/all-products?search=${encodeURIComponent(query)}`}
          onClick={onSelect}
          className="block w-full text-center text-xs font-semibold text-brand-mint hover:underline py-1"
        >
          {isArabic ? `عرض كل نتائج "${query}"` : `View all results for "${query}"`}
        </Link>
      </div>
    </div>
  );
}
