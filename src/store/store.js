import { configureStore } from "@reduxjs/toolkit";
import homeUiReducer from "@/store/slices/homeUiSlice";
import cartReducer from "@/store/slices/cartSlice";
import wishlistReducer from "@/store/slices/wishlistSlice";
import tipsReducer from "@/store/slices/tipsSlice";

export const store = configureStore({
  reducer: {
    homeUi: homeUiReducer,
    cart: cartReducer,
    wishlist: wishlistReducer,
    tips: tipsReducer,
  },
  devTools: process.env.NODE_ENV !== "production",
});
