import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createProductReview,
  fetchProducts,
  fetchProductById,
  fetchProductReviews,
} from "@/services/productService";
import { productQueryKeys } from "./queryKeys";

export function useProductsQuery(params = {}) {
  const paramsKey = JSON.stringify(params);

  return useQuery({
    queryKey: productQueryKeys.list(paramsKey),
    queryFn: () => fetchProducts(params),
    staleTime: 1000 * 15,
  });
}

export function useProductDetailsQuery(productId) {
  return useQuery({
    queryKey: productQueryKeys.details(productId),
    queryFn: () => fetchProductById(productId),
    enabled: Boolean(productId),
    staleTime: 1000 * 30,
  });
}

export function useProductReviewsQuery(productId) {
  return useQuery({
    queryKey: productQueryKeys.reviews(productId),
    queryFn: () => fetchProductReviews(productId),
    enabled: Boolean(productId),
    staleTime: 1000 * 15,
  });
}

export function useCreateProductReviewMutation(productId) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload) => createProductReview(productId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: productQueryKeys.reviews(productId),
      });
      queryClient.invalidateQueries({
        queryKey: productQueryKeys.details(productId),
      });
    },
  });
}
