import { configureStore } from "@reduxjs/toolkit";
import auth from "./authSlice";
import cart from "./cartSlice";
import products from "./productSlice";
import orders from "./orderSlice";
export const store = configureStore({
  reducer: { auth, cart, products, orders },
});
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
