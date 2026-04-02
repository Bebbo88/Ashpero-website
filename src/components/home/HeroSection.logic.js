import { useMemo } from "react";
import { useLanguage } from "@/hooks/useLanguage";
import { useBestSellersQuery, useSiteContentQuery } from "@/features/home/queries";
import { mapHeroBackgroundSlides, mapHeroCards } from "@/features/home/mappers";

export function useHeroSectionLogic() {
  const { t, locale } = useLanguage();
  const bestSellersQuery = useBestSellersQuery(12);
  const contentQuery = useSiteContentQuery();

  const heroStats = useMemo(
    () => [
      { value: "100%", label: t("Hero.vegan") },
      { value: "4.9/5", label: t("Hero.customerRating") },
      { value: "24h", label: t("Hero.hydration") },
    ],
    [t],
  );

  const heroCards = useMemo(
    () => mapHeroCards(bestSellersQuery.data || [], locale),
    [bestSellersQuery.data, locale],
  );

  const backgroundSlides = useMemo(
    () => mapHeroBackgroundSlides(contentQuery.data || {}),
    [contentQuery.data],
  );

  return {
    t,
    isArabic: locale === "ar",
    heroCards,
    backgroundSlides,
    heroStats,
    isLoading: bestSellersQuery.isLoading || contentQuery.isLoading,
  };
}
