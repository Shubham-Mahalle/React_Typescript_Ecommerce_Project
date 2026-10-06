import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { User } from "../types";
import {
  getFromStorage,
  removeFromStorage,
  saveToStorage,
} from "../utils/localStorage";
interface AuthState {
  user: User | null;
}
const initialState: AuthState = {
  user: getFromStorage<User | null>("shopeasy_user", null),
};
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login(state, action: PayloadAction<User>) {
      const { password: _password, ...user } = action.payload;
      state.user = user;
      saveToStorage("shopeasy_user", user);
    },
    logout(state) {
      state.user = null;
      removeFromStorage("shopeasy_user");
    },
  },
});
export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
