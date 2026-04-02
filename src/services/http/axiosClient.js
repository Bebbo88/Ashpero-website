import axios from "axios";
import { CONFIG } from "@/constants/config";

export const apiClient = axios.create({
  baseURL: CONFIG.apiBaseUrl,
  timeout: CONFIG.requestTimeoutMs,
  headers: {
    Accept: "application/json",
  },
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const apiMessage =
        error.response.data?.error ||
        error.response.data?.message ||
        "Request failed";

      const nextError = new Error(apiMessage);
      nextError.status = error.response.status;
      nextError.payload = error.response.data;
      return Promise.reject(nextError);
    }

    if (error.code === "ECONNABORTED") {
      return Promise.reject(new Error("Request timeout. Please try again."));
    }

    return Promise.reject(new Error("Unable to connect to server."));
  },
);
