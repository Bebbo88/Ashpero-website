import { apiClient } from "@/services/http/axiosClient";

function unwrapApiResponse(response) {
  return response?.data?.data ?? null;
}

export async function fetchProductById(productId) {
  const response = await apiClient.get(`/products/${productId}`);
  return unwrapApiResponse(response);
}

export async function fetchProducts(params = {}) {
  const response = await apiClient.get("/products", { params });
  const data = unwrapApiResponse(response);
  return Array.isArray(data) ? data : [];
}

export async function fetchProductReviews(productId) {
  const response = await apiClient.get(`/products/${productId}/reviews`);
  return unwrapApiResponse(response) || {};
}

export async function createProductReview(productId, payload) {
  const response = await apiClient.post(`/products/${productId}/reviews`, payload);
  return unwrapApiResponse(response) || {};
}
