import { createSelector } from "@reduxjs/toolkit";

export const selectHomeUiState = (state) => state.homeUi;
export const selectWishlistIds = createSelector(
  [selectHomeUiState],
  (homeUi) => homeUi.wishlistIds,
);
