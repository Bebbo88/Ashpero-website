"use client";

import { useHeroSectionLogic } from "./HeroSection.logic";
import { HeroSectionUI } from "./HeroSection.ui";

export default function HeroSection() {
  const logic = useHeroSectionLogic();
  return <HeroSectionUI {...logic} />;
}
