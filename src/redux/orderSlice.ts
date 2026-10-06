import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Order } from "../types";
import { getFromStorage, saveToStorage } from "../utils/localStorage";
interface OrderState {
  orders: Order[];
}
const initialState: OrderState = {
  orders: getFromStorage<Order[]>("shopeasy_orders", []),
};
const orderSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {
    addOrder(state, action: PayloadAction<Order>) {
      state.orders.unshift(action.payload);
      saveToStorage("shopeasy_orders", state.orders);
    },
  },
});
export const { addOrder } = orderSlice.actions;
export default orderSlice.reducer;
