import { configureStore } from "@reduxjs/toolkit";
import homeUiReducer from "@/store/slices/homeUiSlice";
import cartReducer from "@/store/slices/cartSlice";
import wishlistReducer from "@/store/slices/wishlistSlice";

export const store = configureStore({
  reducer: {
    homeUi: homeUiReducer,
    cart: cartReducer,
    wishlist: wishlistReducer,
  },
  devTools: process.env.NODE_ENV !== "production",
});
