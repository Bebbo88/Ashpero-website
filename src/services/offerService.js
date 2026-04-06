import { apiClient } from "@/services/http/axiosClient";

function unwrapApiResponse(response) {
  return response?.data?.data ?? null;
}

export async function fetchOffers() {
  const response = await apiClient.get("/offers");
  const data = unwrapApiResponse(response);
  return Array.isArray(data) ? data : [];
}
