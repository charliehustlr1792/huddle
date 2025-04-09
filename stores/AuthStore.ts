// store/slices/authSlice.ts

import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
  name: string;
  email: string;
  isAuthenticated: boolean;
}

const initialState: AuthState = {
  name: '',
  email: '',
  isAuthenticated: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<{ name: string; email: string }>) => {
      state.name = action.payload.name;
      state.email = action.payload.email;
      state.isAuthenticated = true;
    },
  },
});

export const { setUser } = authSlice.actions;
export default authSlice.reducer;
