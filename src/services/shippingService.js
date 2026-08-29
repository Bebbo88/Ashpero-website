import { apiClient } from "@/services/http/axiosClient";

function unwrapApiResponse(response) {
  return response?.data?.data ?? null;
}

export async function fetchShippingSettings() {
  try {
    const response = await apiClient.get("/shipping");
    return unwrapApiResponse(response);
  } catch (error) {
    console.error("Failed to fetch shipping settings", error);
    return null;
  }
}

export const shippingService = {
  fetchShippingSettings,
};
