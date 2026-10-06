import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { CartItem, Product } from "../types";
import { getFromStorage, saveToStorage } from "../utils/localStorage";
interface CartState {
  items: CartItem[];
}
const initialState: CartState = {
  items: getFromStorage<CartItem[]>("shopeasy_cart", []),
};
function persist(items: CartItem[]) {
  saveToStorage("shopeasy_cart", items);
}
const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart(
      state,
      action: PayloadAction<{ product: Product; quantity?: number }>,
    ) {
      const { product, quantity = 1 } = action.payload;
      const item = state.items.find((entry) => entry.product.id === product.id);
      if (item) item.quantity += quantity;
      else state.items.push({ product, quantity });
      persist(state.items);
    },
    removeFromCart(state, action: PayloadAction<number>) {
      state.items = state.items.filter(
        (item) => item.product.id !== action.payload,
      );
      persist(state.items);
    },
    increaseQuantity(state, action: PayloadAction<number>) {
      const item = state.items.find(
        (entry) => entry.product.id === action.payload,
      );
      if (item) item.quantity += 1;
      persist(state.items);
    },
    decreaseQuantity(state, action: PayloadAction<number>) {
      const item = state.items.find(
        (entry) => entry.product.id === action.payload,
      );
      if (item && item.quantity > 1) item.quantity -= 1;
      persist(state.items);
    },
    clearCart(state) {
      state.items = [];
      persist(state.items);
    },
  },
});
export const {
  addToCart,
  removeFromCart,
  increaseQuantity,
  decreaseQuantity,
  clearCart,
} = cartSlice.actions;
export default cartSlice.reducer;
