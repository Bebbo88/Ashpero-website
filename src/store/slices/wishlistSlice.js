import { createSlice } from "@reduxjs/toolkit";

const STORAGE_KEY = "ashpero_wishlist_v1";

function loadFromStorage() {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return [];
    }

    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (_error) {
    return [];
  }
}

function persistToStorage(items) {
  if (typeof window === "undefined") {
    return;
  }

  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch (_error) {
    // ignore storage errors
  }
}

function normalizeItem(payload = {}) {
  const id = String(payload.id || payload.productId || "").trim();
  if (!id) {
    return null;
  }

  return {
    id,
    productId: id,
    title: String(payload.title || "Product"),
    image: String(payload.image || "/assets/photo1.jpeg"),
    category: String(payload.category || ""),
    price: String(payload.price || ""),
    priceValue: Number(payload.priceValue) || 0,
  };
}

const initialState = {
  items: [],
};

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState,
  reducers: {
    toggleWishlistItem: (state, action) => {
      const nextItem = normalizeItem(action.payload);
      if (!nextItem) {
        return;
      }

      const exists = state.items.some((item) => item.productId === nextItem.productId);
      state.items = exists
        ? state.items.filter((item) => item.productId !== nextItem.productId)
        : [nextItem, ...state.items];

      persistToStorage(state.items);
    },
    removeWishlistItem: (state, action) => {
      const targetId = String(action.payload?.productId || action.payload || "").trim();
      state.items = state.items.filter((item) => item.productId !== targetId);
      persistToStorage(state.items);
    },
    hydrateWishlist: (state) => {
      state.items = loadFromStorage();
    },
    clearWishlist: (state) => {
      state.items = [];
      persistToStorage(state.items);
    },
  },
});

export const { toggleWishlistItem, removeWishlistItem, hydrateWishlist, clearWishlist } =
  wishlistSlice.actions;

export default wishlistSlice.reducer;
