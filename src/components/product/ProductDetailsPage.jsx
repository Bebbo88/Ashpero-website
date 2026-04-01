"use client";

import React from "react";
import ProductGallery from "./ProductGallery";
import ProductInfo from "./ProductInfo";
import ProductReviews from "./ProductReviews";
import { useLanguage } from "../../hooks/useLanguage";

const PRODUCTS_DB = {
  1: {
    id: 1,
    images: ["/assets/photo1.jpeg", "/assets/photo2.jpeg", "/assets/photo3.jpeg", "/assets/photo4.jpeg"],
    categoryKey: "antiAging",
    titleKey: "retinol",
    price: "$84.00",
    descriptionKey: "retinolDesc",
    ingredientsKey: "retinolIngredients",
    howToUseKey: "retinolHowToUse",
    sizes: ["30ml", "50ml"],
  },
  2: {
    id: 2,
    images: ["/assets/photo2.jpeg", "/assets/photo1.jpeg", "/assets/photo3.jpeg", "/assets/photo4.jpeg"],
    categoryKey: "hydration",
    titleKey: "hyaluronic",
    price: "$62.00",
    descriptionKey: "hyaluronicDesc",
    ingredientsKey: "hyaluronicIngredients",
    howToUseKey: "hyaluronicHowToUse",
    sizes: ["50ml", "100ml"],
  },
  3: {
    id: 3,
    images: ["/assets/photo3.jpeg", "/assets/photo1.jpeg", "/assets/photo2.jpeg", "/assets/photo4.jpeg"],
    categoryKey: "glow",
    titleKey: "goldOil",
    price: "$120.00",
    descriptionKey: "goldOilDesc",
    ingredientsKey: "goldOilIngredients",
    howToUseKey: "goldOilHowToUse",
    sizes: ["30ml"],
  },
  4: {
    id: 4,
    images: ["/assets/photo4.jpeg", "/assets/photo1.jpeg", "/assets/photo2.jpeg", "/assets/photo3.jpeg"],
    categoryKey: "cleansing",
    titleKey: "cleanser",
    price: "$45.00",
    descriptionKey: "cleanserDesc",
    ingredientsKey: "cleanserIngredients",
    howToUseKey: "cleanserHowToUse",
    sizes: ["150ml", "250ml"],
  },
  5: {
    id: 5,
    images: ["/assets/photo1.jpeg", "/assets/photo3.jpeg", "/assets/photo2.jpeg", "/assets/photo4.jpeg"],
    categoryKey: "antiAging",
    titleKey: "retinolNight",
    price: "$92.00",
    descriptionKey: "retinolNightDesc",
    ingredientsKey: "retinolNightIngredients",
    howToUseKey: "retinolNightHowToUse",
    sizes: ["50ml", "75ml"],
  },
  6: {
    id: 6,
    images: ["/assets/photo3.jpeg", "/assets/photo2.jpeg", "/assets/photo1.jpeg", "/assets/photo4.jpeg"],
    categoryKey: "glow",
    titleKey: "vitaminCSerum",
    price: "$78.00",
    descriptionKey: "vitaminCDesc",
    ingredientsKey: "vitaminCIngredients",
    howToUseKey: "vitaminCHowToUse",
    sizes: ["30ml", "60ml"],
  },
  7: {
    id: 7,
    images: ["/assets/photo2.jpeg", "/assets/photo4.jpeg", "/assets/photo1.jpeg", "/assets/photo3.jpeg"],
    categoryKey: "hydration",
    titleKey: "moisturizer",
    price: "$56.00",
    descriptionKey: "moisturizerDesc",
    ingredientsKey: "moisturizerIngredients",
    howToUseKey: "moisturizerHowToUse",
    sizes: ["50ml", "100ml"],
  },
  8: {
    id: 8,
    images: ["/assets/photo4.jpeg", "/assets/photo2.jpeg", "/assets/photo3.jpeg", "/assets/photo1.jpeg"],
    categoryKey: "cleansing",
    titleKey: "foamCleanser",
    price: "$38.00",
    descriptionKey: "foamCleanserDesc",
    ingredientsKey: "foamCleanserIngredients",
    howToUseKey: "foamCleanserHowToUse",
    sizes: ["150ml"],
  },
};

export default function ProductDetailsPage({ productId }) {
  const { t } = useLanguage();

  const rawProduct = PRODUCTS_DB[productId] || PRODUCTS_DB[1];

  const product = {
    id: rawProduct.id,
    images: rawProduct.images,
    category: t(`ProductDetails.categories.${rawProduct.categoryKey}`),
    title: t(`ProductDetails.products.${rawProduct.titleKey}`),
    price: rawProduct.price,
    description: t(`ProductDetails.descriptions.${rawProduct.descriptionKey}`),
    sizes: rawProduct.sizes || [],
    ingredients: t(`ProductDetails.ingredientsData.${rawProduct.ingredientsKey}`),
    howToUse: t(`ProductDetails.howToUseData.${rawProduct.howToUseKey}`),
  };

  return (
    <section className="w-full bg-bg-primary min-h-screen py-8 md:py-14">
      <div className="container mx-auto px-6 lg:px-10">
        {/* Product Top Section: Gallery + Info */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
          <ProductGallery images={product.images} productName={product.title} />
          <ProductInfo product={product} />
        </div>

        {/* Reviews Section */}
        <ProductReviews />
      </div>
    </section>
  );
}
