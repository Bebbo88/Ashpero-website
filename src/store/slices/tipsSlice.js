import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  activeTipItem: null,
};

const tipsSlice = createSlice({
  name: "tips",
  initialState,
  reducers: {
    setActiveTipItem(state, action) {
      state.activeTipItem = action.payload;
    },
    clearActiveTipItem(state) {
      state.activeTipItem = null;
    },
  },
});

export const { setActiveTipItem, clearActiveTipItem } = tipsSlice.actions;
export default tipsSlice.reducer;
