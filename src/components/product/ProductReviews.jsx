"use client";

import React, { useState } from "react";
import { Star } from "lucide-react";
import { useLanguage } from "../../hooks/useLanguage";

const MOCK_REVIEWS = [
  {
    id: 1,
    name: "Eleanor M.",
    rating: 5,
    date: "2026-03-15",
    comment:
      "This serum is incredible! In just a few weeks I noticed a visible improvement in my skin's texture and hydration. The formula feels so luxurious and absorbs beautifully.",
  },
  {
    id: 2,
    name: "Layla A.",
    rating: 5,
    date: "2026-03-02",
    comment:
      "I've tried so many serums that don't do anything. This one actually delivers. My skin feels plumper and the fine lines around my eyes are genuinely less visible.",
  },
  {
    id: 3,
    name: "Sarah K.",
    rating: 4,
    date: "2026-02-20",
    comment:
      "Really good product overall. The ingredients are high quality and I love that it's vegan. Only wish the bottle was a bit bigger for the price.",
  },
];

function StarRating({ rating, size = 16, interactive = false, onRate }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          onClick={() => interactive && onRate?.(star)}
          className={interactive ? "cursor-pointer" : "cursor-default"}
          type="button"
        >
          <Star
            className={`transition-colors ${
              star <= rating
                ? "text-amber-400 fill-amber-400"
                : "text-gray-300 dark:text-gray-600"
            }`}
            style={{ width: size, height: size }}
          />
        </button>
      ))}
    </div>
  );
}

export default function ProductReviews() {
  const { t } = useLanguage();
  const [reviewForm, setReviewForm] = useState({
    name: "",
    rating: 0,
    comment: "",
  });

  const averageRating = (
    MOCK_REVIEWS.reduce((sum, r) => sum + r.rating, 0) / MOCK_REVIEWS.length
  ).toFixed(1);

  const handleSubmit = (e) => {
    e.preventDefault();
    // placeholder — would post to API
    setReviewForm({ name: "", rating: 0, comment: "" });
  };

  return (
    <section className="w-full border-t border-border-color pt-12 mt-6">
      <div className="container mx-auto px-6 lg:px-10">
        <h2 className="font-serif text-2xl md:text-3xl font-semibold text-text-primary mb-10">
          {t("ProductDetails.reviews.title")}
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 lg:gap-16">
          {/* Left: Overall Rating + Reviews */}
          <div className="lg:col-span-2 flex flex-col gap-8">
            {/* Overall Rating */}
            <div className="flex items-center gap-6 pb-8 border-b border-border-color">
              <div className="flex flex-col items-center gap-1">
                <span className="text-5xl font-bold text-text-primary">
                  {averageRating}
                </span>
                <StarRating rating={Math.round(Number(averageRating))} size={18} />
                <span className="text-xs text-text-secondary mt-1">
                  {MOCK_REVIEWS.length} {t("ProductDetails.reviews.reviewCount")}
                </span>
              </div>

              {/* Rating Bars */}
              <div className="flex-1 flex flex-col gap-2">
                {[5, 4, 3, 2, 1].map((star) => {
                  const count = MOCK_REVIEWS.filter(
                    (r) => r.rating === star,
                  ).length;
                  const pct =
                    MOCK_REVIEWS.length > 0
                      ? (count / MOCK_REVIEWS.length) * 100
                      : 0;
                  return (
                    <div key={star} className="flex items-center gap-3">
                      <span className="text-xs font-semibold text-text-secondary w-4 text-right">
                        {star}
                      </span>
                      <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                      <div className="flex-1 h-2 rounded-full bg-gray-200 dark:bg-white/10 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-amber-400 transition-all duration-500"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <span className="text-xs text-text-secondary w-6">
                        {count}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Review List */}
            <div className="flex flex-col divide-y divide-border-color">
              {MOCK_REVIEWS.map((review) => (
                <div key={review.id} className="py-6 first:pt-0">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-brand-mint/20 flex items-center justify-center">
                        <span className="text-sm font-bold text-brand-dark dark:text-brand-mint">
                          {review.name[0]}
                        </span>
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-text-primary">
                          {review.name}
                        </h4>
                        <StarRating rating={review.rating} size={12} />
                      </div>
                    </div>
                    <span className="text-[11px] text-text-secondary">
                      {review.date}
                    </span>
                  </div>
                  <p className="text-sm text-text-secondary leading-relaxed mt-2">
                    {review.comment}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Add Review Form */}
          <div className="lg:col-span-1">
            <div className="sticky top-28 bg-brand-creme/40 dark:bg-white/5 rounded-2xl p-6 md:p-8">
              <h3 className="font-serif text-lg font-semibold text-text-primary mb-6">
                {t("ProductDetails.reviews.addReview")}
              </h3>
              <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                {/* Name */}
                <div>
                  <label className="block text-xs font-bold tracking-wider uppercase text-text-secondary mb-2">
                    {t("ProductDetails.reviews.yourName")}
                  </label>
                  <input
                    type="text"
                    value={reviewForm.name}
                    onChange={(e) =>
                      setReviewForm({ ...reviewForm, name: e.target.value })
                    }
                    className="w-full px-4 py-3 rounded-xl border border-border-color bg-bg-primary text-text-primary text-sm focus:outline-none focus:border-brand-mint transition-colors"
                    placeholder={t("ProductDetails.reviews.namePlaceholder")}
                    required
                  />
                </div>

                {/* Rating */}
                <div>
                  <label className="block text-xs font-bold tracking-wider uppercase text-text-secondary mb-2">
                    {t("ProductDetails.reviews.yourRating")}
                  </label>
                  <StarRating
                    rating={reviewForm.rating}
                    size={24}
                    interactive
                    onRate={(r) =>
                      setReviewForm({ ...reviewForm, rating: r })
                    }
                  />
                </div>

                {/* Comment */}
                <div>
                  <label className="block text-xs font-bold tracking-wider uppercase text-text-secondary mb-2">
                    {t("ProductDetails.reviews.yourReview")}
                  </label>
                  <textarea
                    value={reviewForm.comment}
                    onChange={(e) =>
                      setReviewForm({ ...reviewForm, comment: e.target.value })
                    }
                    rows={4}
                    className="w-full px-4 py-3 rounded-xl border border-border-color bg-bg-primary text-text-primary text-sm focus:outline-none focus:border-brand-mint transition-colors resize-none"
                    placeholder={t("ProductDetails.reviews.reviewPlaceholder")}
                    required
                  />
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  className="w-full py-3.5 rounded-xl bg-brand-dark dark:bg-brand-mint text-white font-bold text-sm tracking-wide hover:opacity-90 transition-opacity cursor-pointer"
                >
                  {t("ProductDetails.reviews.submit")}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
