"use client";

import { useFeaturedBestsellersLogic } from "./FeaturedBestsellers.logic";
import { FeaturedBestsellersUI } from "./FeaturedBestsellers.ui";

export default function FeaturedBestsellers() {
  const logic = useFeaturedBestsellersLogic();
  return <FeaturedBestsellersUI {...logic} />;
}
