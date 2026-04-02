import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  wishlistIds: [],
};

const homeUiSlice = createSlice({
  name: "homeUi",
  initialState,
  reducers: {
    toggleWishlist(state, action) {
      const productId = String(action.payload);
      const exists = state.wishlistIds.includes(productId);
      state.wishlistIds = exists
        ? state.wishlistIds.filter((id) => id !== productId)
        : [...state.wishlistIds, productId];
    },
    setWishlist(state, action) {
      state.wishlistIds = (action.payload || []).map((id) => String(id));
    },
  },
});

export const { toggleWishlist, setWishlist } = homeUiSlice.actions;
export default homeUiSlice.reducer;
