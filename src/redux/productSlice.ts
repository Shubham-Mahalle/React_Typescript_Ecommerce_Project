import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Product } from "../types";
interface ProductState {
  products: Product[];
  total: number;
  nextSkip: number;
  loading: boolean;
  error: string | null;
}
const initialState: ProductState = {
  products: [],
  total: 0,
  nextSkip: 0,
  loading: false,
  error: null,
};
const productSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    loadingProducts(state) {
      state.loading = true;
      state.error = null;
    },
    productsReceived(
      state,
      action: PayloadAction<{
        products: Product[];
        total: number;
        nextSkip: number;
      }>,
    ) {
      const known = new Set(state.products.map((product) => product.id));
      state.products.push(
        ...action.payload.products.filter((product) => !known.has(product.id)),
      );
      state.total = action.payload.total;
      state.nextSkip = action.payload.nextSkip;
      state.loading = false;
    },
    productsFailed(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },
    resetProducts(state) {
      state.products = [];
      state.total = 0;
      state.nextSkip = 0;
      state.error = null;
    },
  },
});
export const {
  loadingProducts,
  productsReceived,
  productsFailed,
  resetProducts,
} = productSlice.actions;
export default productSlice.reducer;
