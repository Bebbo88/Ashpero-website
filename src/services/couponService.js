import { apiClient } from "@/services/http/axiosClient";

function unwrapApiResponse(response) {
  return response?.data?.data ?? null;
}

export async function applyCoupon({ code, orderTotal }) {
  const response = await apiClient.post("/coupons/apply", {
    code,
    orderTotal,
  });

  const payload = unwrapApiResponse(response);

  if (!payload) {
    throw new Error("Invalid coupon response.");
  }

  return {
    discount: Number(payload.discount || 0),
    finalTotal: Number(payload.finalTotal || orderTotal || 0),
  };
}

export const couponService = {
  applyCoupon,
};
