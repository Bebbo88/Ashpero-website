"use client";

import React from "react";
import { Star } from "lucide-react";
import Image from "@/components/ui/AppImage";
import EmptyState from "@/components/ui/EmptyState";

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

export function ProductReviewsUI({
  t,
  reviewForm,
  setReviewForm,
  isAuthenticated,
  userDisplayName,
  userAvatar,
  reviews,
  ratingsCount,
  averageRating,
  ratingBars,
  isLoading,
  isError,
  errorMessage,
  isSubmitting,
  handleSubmit,
}) {
  return (
    <section className="w-full border-t border-border-color pt-12 mt-6">
      <div className="container mx-auto px-6 lg:px-10">
        <h2 className="font-serif text-2xl md:text-3xl font-semibold text-text-primary mb-10">
          {t("ProductDetails.reviews.title")}
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 lg:gap-16">
          <div className="lg:col-span-2 flex flex-col gap-8">
            <div className="flex items-center gap-6 pb-8 border-b border-border-color">
              <div className="flex flex-col items-center gap-1">
                <span className="text-5xl font-bold text-text-primary">{averageRating}</span>
                <StarRating rating={Math.round(Number(averageRating))} size={18} />
                <span className="text-xs text-text-secondary mt-1">
                  {ratingsCount} {t("ProductDetails.reviews.reviewCount")}
                </span>
              </div>

              <div className="flex-1 flex flex-col gap-2">
                {ratingBars.map((item) => (
                  <div key={item.star} className="flex items-center gap-3">
                    <span className="text-xs font-semibold text-text-secondary w-4 text-right">
                      {item.star}
                    </span>
                    <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                    <div className="flex-1 h-2 rounded-full bg-gray-200 dark:bg-white/10 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-amber-400 transition-all duration-500"
                        style={{ width: `${item.pct}%` }}
                      />
                    </div>
                    <span className="text-xs text-text-secondary w-6">{item.count}</span>
                  </div>
                ))}
              </div>
            </div>

            {isLoading ? (
              <div className="py-6 text-sm text-text-secondary">Loading reviews...</div>
            ) : null}

            {isError ? (
              <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {errorMessage || "Failed to load reviews."}
              </div>
            ) : null}

            {!isLoading && !isError && reviews.length === 0 ? (
              <EmptyState
                title={t("ProductDetails.reviews.title")}
                description="No reviews yet. Be the first to review this product."
                className="py-6 md:py-8"
              />
            ) : null}

            {!isLoading && !isError && reviews.length > 0 ? (
              <div className="flex flex-col divide-y divide-border-color">
                {reviews.map((review) => (
                  <div key={review.id} className="py-6 first:pt-0">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        {review.avatar ? (
                          <div className="relative w-9 h-9 overflow-hidden rounded-full">
                            <Image
                              src={review.avatar}
                              alt={review.name || "User"}
                              fill
                              className="object-cover"
                              sizes="36px"
                            />
                          </div>
                        ) : (
                          <div className="w-9 h-9 rounded-full bg-brand-mint/20 flex items-center justify-center">
                            <span className="text-sm font-bold text-brand-dark dark:text-brand-mint">
                              {String(review.name || "A")[0]}
                            </span>
                          </div>
                        )}
                        <div>
                          <h4 className="text-sm font-bold text-text-primary">{review.name}</h4>
                          <StarRating rating={review.rating} size={12} />
                        </div>
                      </div>
                      <span className="text-[11px] text-text-secondary">{review.date}</span>
                    </div>
                    <p className="text-sm text-text-secondary leading-relaxed mt-2">{review.comment}</p>
                  </div>
                ))}
              </div>
            ) : null}
          </div>

          <div className="lg:col-span-1">
            <div className="sticky top-28 bg-brand-creme/40 dark:bg-white/5 rounded-2xl p-6 md:p-8">
              <h3 className="font-serif text-lg font-semibold text-text-primary mb-6">
                {t("ProductDetails.reviews.addReview")}
              </h3>
              <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                <div>
                  <label className="block text-xs font-bold tracking-wider uppercase text-text-secondary mb-2">
                    {t("ProductDetails.reviews.yourName")}
                  </label>
                  {isAuthenticated && userAvatar ? (
                    <div className="mb-2 inline-flex items-center gap-2 rounded-lg border border-border-color bg-bg-primary px-2 py-1">
                      <div className="relative h-6 w-6 overflow-hidden rounded-full">
                        <Image
                          src={userAvatar}
                          alt={reviewForm.name || "User"}
                          fill
                          className="object-cover"
                          sizes="24px"
                        />
                      </div>
                      <span className="text-xs text-text-secondary">
                        Logged in user
                      </span>
                    </div>
                  ) : null}
                  <input
                    type="text"
                    value={reviewForm.name}
                    onChange={(event) =>
                      setReviewForm((previous) => ({
                        ...previous,
                        name: event.target.value,
                      }))
                    }
                    className="w-full px-4 py-3 rounded-xl border border-border-color bg-bg-primary text-text-primary text-sm focus:outline-none focus:border-brand-mint transition-colors"
                    placeholder={t("ProductDetails.reviews.namePlaceholder")}
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold tracking-wider uppercase text-text-secondary mb-2">
                    {t("ProductDetails.reviews.yourRating")}
                  </label>
                  <StarRating
                    rating={reviewForm.rating}
                    size={24}
                    interactive
                    onRate={(ratingValue) =>
                      setReviewForm((previous) => ({
                        ...previous,
                        rating: ratingValue,
                      }))
                    }
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold tracking-wider uppercase text-text-secondary mb-2">
                    {t("ProductDetails.reviews.yourReview")}
                  </label>
                  <textarea
                    value={reviewForm.comment}
                    onChange={(event) =>
                      setReviewForm((previous) => ({
                        ...previous,
                        comment: event.target.value,
                      }))
                    }
                    rows={4}
                    className="w-full px-4 py-3 rounded-xl border border-border-color bg-bg-primary text-text-primary text-sm focus:outline-none focus:border-brand-mint transition-colors resize-none"
                    placeholder={t("ProductDetails.reviews.reviewPlaceholder")}
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 rounded-xl bg-brand-dark dark:bg-brand-mint text-white font-bold text-sm tracking-wide hover:opacity-90 transition-opacity cursor-pointer disabled:opacity-60"
                >
                  {isSubmitting
                    ? "Submitting..."
                    : t("ProductDetails.reviews.submit")}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

