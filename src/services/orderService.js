import { apiClient } from "@/services/http/axiosClient";

function unwrapApiResponse(response) {
  return response?.data?.data ?? null;
}

export async function createOrder(payload) {
  const response = await apiClient.post("/orders", payload);
  return unwrapApiResponse(response) || {};
}

export async function getPublicOrderSummary(orderId, merchantOrderId) {
  const response = await apiClient.get(`/orders/${orderId}/summary`, {
    params: { merchantOrderId },
  });
  return unwrapApiResponse(response) || {};
}

export async function getTrackedOrder(merchantOrderId) {
  const response = await apiClient.get(`/orders/track/${merchantOrderId}`);

  return unwrapApiResponse(response) || {};
}
