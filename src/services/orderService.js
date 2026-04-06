import { apiClient } from "@/services/http/axiosClient";

function unwrapApiResponse(response) {
  return response?.data?.data ?? null;
}

export async function createOrder(payload) {
  const response = await apiClient.post("/orders", payload);
  return unwrapApiResponse(response) || {};
}
