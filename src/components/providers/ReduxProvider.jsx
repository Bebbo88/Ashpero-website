"use client";

import { useEffect } from "react";
import { Provider } from "react-redux";
import { store } from "@/store/store";
import { hydrateCart } from "@/store/slices/cartSlice";
import { hydrateWishlist } from "@/store/slices/wishlistSlice";

export default function ReduxProvider({ children }) {
  useEffect(() => {
    store.dispatch(hydrateCart());
    store.dispatch(hydrateWishlist());
  }, []);

  return <Provider store={store}>{children}</Provider>;
}
