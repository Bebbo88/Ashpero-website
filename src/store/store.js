import { configureStore } from "@reduxjs/toolkit";
import homeUiReducer from "@/store/slices/homeUiSlice";

export const store = configureStore({
  reducer: {
    homeUi: homeUiReducer,
  },
  devTools: process.env.NODE_ENV !== "production",
});
