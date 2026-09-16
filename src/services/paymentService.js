import { apiClient } from "@/services/http/axiosClient";

function unwrapApiResponse(response) {
  return response?.data?.data ?? null;
}

export async function initializePaymobPayment(orderId, merchantOrderId) {
  const response = await apiClient.post("/payment/paymob", {
    orderId,
    merchantOrderId,
  });
  return unwrapApiResponse(response) || {};
}

export async function confirmPaymobCallback(searchParams) {
  const queryString =
    searchParams instanceof URLSearchParams
      ? searchParams.toString()
      : new URLSearchParams(searchParams || {}).toString();
  const response = await apiClient.get(`/payment/callback/confirm?${queryString}`);
  return unwrapApiResponse(response) || {};
}
