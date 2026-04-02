import { apiClient } from "@/services/http/axiosClient";

function unwrapApiResponse(response) {
  return response?.data?.data ?? null;
}

export async function fetchSiteContent() {
  const response = await apiClient.get("/content");
  return unwrapApiResponse(response) || {};
}

export async function fetchBestSellers(limit = 8) {
  const response = await apiClient.get("/products/best-sellers", {
    params: { limit },
  });

  const data = unwrapApiResponse(response);
  return Array.isArray(data) ? data : [];
}
