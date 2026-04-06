import { useEffect, useMemo, useState } from "react";
import { useLanguage } from "@/hooks/useLanguage";
import { useSession } from "next-auth/react";
import { mapProductReviews } from "@/features/product/mappers";
import {
  useCreateProductReviewMutation,
  useProductReviewsQuery,
} from "@/features/product/queries";

function buildRatingBars(reviews = []) {
  return [5, 4, 3, 2, 1].map((star) => {
    const count = reviews.filter((review) => review.rating === star).length;
    const pct = reviews.length > 0 ? (count / reviews.length) * 100 : 0;

    return {
      star,
      count,
      pct,
    };
  });
}

export function useProductReviewsLogic(productId) {
  const { t } = useLanguage();
  const { data: session, status } = useSession();
  const [reviewForm, setReviewForm] = useState({
    name: "",
    rating: 0,
    comment: "",
  });

  const reviewsQuery = useProductReviewsQuery(productId);
  const createReviewMutation = useCreateProductReviewMutation(productId);

  const mapped = useMemo(
    () => mapProductReviews(reviewsQuery.data || {}),
    [reviewsQuery.data],
  );

  const averageRating = Number(mapped.ratingsAverage || 0).toFixed(1);
  const ratingBars = useMemo(() => buildRatingBars(mapped.reviews), [mapped.reviews]);
  const userDisplayName = String(session?.user?.name || "").trim();
  const userAvatar = String(session?.user?.image || "").trim();
  const isAuthenticated = status === "authenticated";

  useEffect(() => {
    if (!isAuthenticated) {
      return;
    }

    if (!userDisplayName) {
      return;
    }

    setReviewForm((previous) => ({
      ...previous,
      name: previous.name || userDisplayName,
    }));
  }, [isAuthenticated, userDisplayName]);

  async function handleSubmit(event) {
    event.preventDefault();

    if (!reviewForm.name.trim() || !reviewForm.rating) {
      return;
    }

    try {
      await createReviewMutation.mutateAsync({
        reviewerName: reviewForm.name.trim(),
        rating: Number(reviewForm.rating),
        comment: reviewForm.comment.trim(),
        reviewerAvatar: userAvatar || "",
      });

      setReviewForm({ name: "", rating: 0, comment: "" });
    } catch (_error) {
      // Error is surfaced in mutation state and API message.
    }
  }

  return {
    t,
    reviewForm,
    setReviewForm,
    isAuthenticated,
    userDisplayName,
    userAvatar,
    reviews: mapped.reviews,
    ratingsCount: mapped.ratingsCount,
    averageRating,
    ratingBars,
    isLoading: reviewsQuery.isLoading,
    isError: reviewsQuery.isError,
    errorMessage: reviewsQuery.error?.message || "",
    isSubmitting: createReviewMutation.isPending,
    handleSubmit,
  };
}
