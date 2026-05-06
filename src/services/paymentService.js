import { apiClient } from "@/services/http/axiosClient";

function unwrapApiResponse(response) {
  return response?.data?.data ?? null;
}

export async function initializePaymobPayment(orderId) {
  const response = await apiClient.post("/payment/paymob", { orderId });
  return unwrapApiResponse(response) || {};
}
