import { createSlice } from "@reduxjs/toolkit";

const STORAGE_KEY = "ashpero_cart_v1";

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

function toNumber(value, fallback = 0) {
  const numeric = Number(value);
  return Number.isFinite(numeric) ? numeric : fallback;
}

function normalizeItem(payload = {}) {
  const id = String(payload.id || payload.productId || "").trim();
  const quantity = Math.max(1, toNumber(payload.quantity, 1));

  return {
    id,
    productId: id,
    title: String(payload.title || "Product"),
    image: String(payload.image || "/assets/photo1.jpeg"),
    category: String(payload.category || ""),
    size: String(payload.size || "")
      .trim()
      .toLowerCase(),
    priceValue: Math.max(0, toNumber(payload.priceValue, 0)),
    priceLabel: String(payload.price || payload.priceLabel || ""),
    quantity,
    stock: Math.max(0, toNumber(payload.stock, 0)),
  };
}

const initialState = {
  items: [],
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const nextItem = normalizeItem(action.payload);

      if (!nextItem.id) {
        return;
      }

      const existingIndex = state.items.findIndex(
        (item) =>
          item.productId === nextItem.productId && item.size === nextItem.size,
      );

      if (existingIndex >= 0) {
        state.items[existingIndex].quantity += nextItem.quantity;
      } else {
        state.items.push(nextItem);
      }

      persistToStorage(state.items);
    },
    setBuyNowItem: (state, action) => {
      const nextItem = normalizeItem(action.payload);

      if (!nextItem.id) {
        return;
      }

      const existingIndex = state.items.findIndex(
        (item) =>
          item.productId === nextItem.productId && item.size === nextItem.size,
      );

      if (existingIndex >= 0) {
        state.items[existingIndex].quantity = nextItem.quantity;
      } else {
        state.items.push(nextItem);
      }

      persistToStorage(state.items);
    },
    updateCartItemQuantity: (state, action) => {
      const { productId, size = "", quantity } = action.payload || {};
      const normalizedSize = String(size).trim().toLowerCase();
      const targetId = String(productId || "").trim();
      const nextQuantity = Math.max(1, toNumber(quantity, 1));

      state.items = state.items.map((item) =>
        item.productId === targetId && item.size === normalizedSize
          ? { ...item, quantity: nextQuantity }
          : item,
      );

      persistToStorage(state.items);
    },
    removeFromCart: (state, action) => {
      const { productId, size = "" } = action.payload || {};
      const targetId = String(productId || "").trim();
      const normalizedSize = String(size).trim().toLowerCase();
      state.items = state.items.filter(
        (item) =>
          !(item.productId === targetId && item.size === normalizedSize),
      );
      persistToStorage(state.items);
    },
    clearCart: (state) => {
      state.items = [];
      persistToStorage(state.items);
    },
    hydrateCart: (state) => {
      state.items = loadFromStorage();
    },
  },
});

export const {
  addToCart,
  setBuyNowItem,
  updateCartItemQuantity,
  removeFromCart,
  clearCart,
  hydrateCart,
} = cartSlice.actions;

export default cartSlice.reducer;
