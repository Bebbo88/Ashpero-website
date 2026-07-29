"use client";

import React, { useState } from "react";
import { ChevronDown, ChevronUp, X } from "lucide-react";
import { useLanguage } from "../../hooks/useLanguage";
import { CheckIcon } from "@/svgs/ProductFilter.svgs";
import animationStyles from "@/animations/ProductFilter.animations.module.css";

const DEFAULT_FILTER_SECTIONS = [
  { key: "category", titleFallback: "Category", options: [] },
  { key: "productType", options: [] },
  { key: "skinType", options: [] },
  {
    key: "priceRange",
    options: ["under100", "from100to300", "from300to500", "from500to700", "over700"],
  },
];

export default function ProductFilter({
  filters,
  onFilterChange,
  onClearAll,
  isMobileOpen,
  onMobileClose,
  filterSections = DEFAULT_FILTER_SECTIONS,
  resolveOptionLabel,
}) {
  const { t } = useLanguage();
  const [expandedSections, setExpandedSections] = useState({
    category: true,
    productType: true,
    skinType: true,
    priceRange: false,
  });

  const getSectionTitle = (section) => {
    const key = `AllProducts.filters.${section.key}.title`;
    const translated = t(key);
    return translated === key
      ? section.titleFallback || section.key
      : translated;
  };

  const getOptionLabel = (section, option) => {
    if (typeof resolveOptionLabel === "function") {
      return resolveOptionLabel(section, option);
    }

    const key = `AllProducts.filters.${section.key}.options.${option}`;
    const translated = t(key);
    return translated === key
      ? section.optionLabels?.[option] || option
      : translated;
  };

  const toggleSection = (key) => {
    setExpandedSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleCheckboxChange = (sectionKey, option) => {
    const current = filters[sectionKey] || [];
    const updated = current.includes(option)
      ? current.filter((o) => o !== option)
      : [...current, option];
    onFilterChange(sectionKey, updated);
  };

  const activeFilterCount = Object.values(filters).reduce(
    (count, arr) => count + (arr?.length || 0),
    0,
  );

  const filterContent = (
    <>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-sans text-sm font-bold tracking-[0.2em] uppercase text-text-primary">
          {t("AllProducts.filters.title")}
        </h3>
        {activeFilterCount > 0 && (
          <button
            onClick={onClearAll}
            className="text-[11px] font-semibold tracking-wider uppercase text-brand-orange hover:text-brand-orange/80 transition-colors cursor-pointer"
          >
            {t("AllProducts.filters.clearAll")}
          </button>
        )}
      </div>

      {/* Filter Sections */}
      <div className="flex flex-col divide-y divide-border-color">
        {filterSections.map((section) => (
          <div key={section.key} className="py-5 first:pt-0">
            {/* Section Header */}
            <button
              onClick={() => toggleSection(section.key)}
              className="w-full flex items-center justify-between cursor-pointer group"
            >
              <span className="text-xs font-bold tracking-[0.15em] uppercase text-text-primary group-hover:text-brand-orange transition-colors">
                {getSectionTitle(section)}
              </span>
              {expandedSections[section.key] ? (
                <ChevronUp className="w-4 h-4 text-text-secondary" />
              ) : (
                <ChevronDown className="w-4 h-4 text-text-secondary" />
              )}
            </button>

            {/* Section Options */}
            {expandedSections[section.key] && (
              <div className="mt-4 flex flex-col gap-3">
                {section.options.map((option) => {
                  const isChecked = (filters[section.key] || []).includes(
                    option,
                  );
                  return (
                    <label
                      key={option}
                      className="flex items-center gap-3 cursor-pointer group/item"
                    >
                      <div
                        className={`w-4 h-4 rounded-[4px] border-2 flex items-center justify-center transition-all duration-200
                          ${
                            isChecked
                              ? "bg-brand-dark dark:bg-brand-mint border-brand-dark dark:border-brand-mint"
                              : "border-gray-300 dark:border-gray-600 group-hover/item:border-brand-dark dark:group-hover/item:border-brand-mint"
                          }`}
                      >
                        {isChecked && (
                          <CheckIcon className="w-2.5 h-2.5 text-white" />
                        )}
                      </div>
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() =>
                          handleCheckboxChange(section.key, option)
                        }
                        className="sr-only"
                      />
                      <span
                        className={`text-[13px] transition-colors duration-200 ${isChecked ? "font-semibold text-text-primary" : "text-text-secondary group-hover/item:text-text-primary"}`}
                      >
                        {getOptionLabel(section, option)}
                      </span>
                    </label>
                  );
                })}
              </div>
            )}
          </div>
        ))}
      </div>
    </>
  );

  return (
    <>
      {/* Desktop Filter */}
      <aside className="hidden lg:block w-[260px] shrink-0 sticky top-28 self-start">
        {filterContent}
      </aside>

      {/* Mobile Filter Overlay */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={onMobileClose}
          />
          {/* Slide Panel */}
          <div
            className={`absolute left-0 top-0 bottom-0 w-[300px] max-w-[85vw] bg-bg-primary shadow-2xl p-6 overflow-y-auto ${animationStyles.animateSlideInLeft}`}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-sans text-sm font-bold tracking-[0.2em] uppercase text-text-primary">
                {t("AllProducts.filters.title")}
              </h3>
              <button
                onClick={onMobileClose}
                className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-100 dark:hover:bg-white/10 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5 text-text-primary" />
              </button>
            </div>
            {activeFilterCount > 0 && (
              <button
                onClick={onClearAll}
                className="text-[11px] font-semibold tracking-wider uppercase text-brand-orange hover:text-brand-orange/80 transition-colors cursor-pointer mb-4"
              >
                {t("AllProducts.filters.clearAll")}
              </button>
            )}
            <div className="flex flex-col divide-y divide-border-color">
              {filterSections.map((section) => (
                <div key={section.key} className="py-5 first:pt-0">
                  <button
                    onClick={() => toggleSection(section.key)}
                    className="w-full flex items-center justify-between cursor-pointer group"
                  >
                    <span className="text-xs font-bold tracking-[0.15em] uppercase text-text-primary group-hover:text-brand-orange transition-colors">
                      {getSectionTitle(section)}
                    </span>
                    {expandedSections[section.key] ? (
                      <ChevronUp className="w-4 h-4 text-text-secondary" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-text-secondary" />
                    )}
                  </button>
                  {expandedSections[section.key] && (
                    <div className="mt-4 flex flex-col gap-3">
                      {section.options.map((option) => {
                        const isChecked = (filters[section.key] || []).includes(
                          option,
                        );
                        return (
                          <label
                            key={option}
                            className="flex items-center gap-3 cursor-pointer group/item"
                          >
                            <div
                              className={`w-4 h-4 rounded-[4px] border-2 flex items-center justify-center transition-all duration-200
                                ${
                                  isChecked
                                    ? "bg-brand-dark dark:bg-brand-mint border-brand-dark dark:border-brand-mint"
                                    : "border-gray-300 dark:border-gray-600 group-hover/item:border-brand-dark dark:group-hover/item:border-brand-mint"
                                }`}
                            >
                              {isChecked && (
                                <CheckIcon className="w-2.5 h-2.5 text-white" />
                              )}
                            </div>
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={() =>
                                handleCheckboxChange(section.key, option)
                              }
                              className="sr-only"
                            />
                            <span
                              className={`text-[13px] transition-colors duration-200 ${isChecked ? "font-semibold text-text-primary" : "text-text-secondary group-hover/item:text-text-primary"}`}
                            >
                              {getOptionLabel(section, option)}
                            </span>
                          </label>
                        );
                      })}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
