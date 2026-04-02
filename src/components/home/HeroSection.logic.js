import { useMemo } from "react";
import { useLanguage } from "@/hooks/useLanguage";
import { HERO_BACKGROUND_SLIDES, HERO_CARDS_DATA } from "./HeroSection.data";

export function useHeroSectionLogic() {
  const { t, locale } = useLanguage();

  const heroStats = useMemo(
    () => [
      { value: "100%", label: t("Hero.vegan") },
      { value: "4.9/5", label: t("Hero.customerRating") },
      { value: "24h", label: t("Hero.hydration") },
    ],
    [t],
  );

  return {
    t,
    isArabic: locale === "ar",
    heroCards: HERO_CARDS_DATA,
    backgroundSlides: HERO_BACKGROUND_SLIDES,
    heroStats,
  };
}
