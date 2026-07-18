import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { setAuthToken } from '@/core/shared/api';

export interface UserInfo {
  id: string;
  email: string;
  role: string;
  displayName: string | null;
}

export interface AuthState {
  isInitialized: boolean; // Thêm cờ này
  isAuthenticated: boolean;
  accessToken: string | null;
  user: UserInfo | null;
}

const initialState: AuthState = {
  isInitialized: false, // Ban đầu là false
  isAuthenticated: false,
  accessToken: null,
  user: null,
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // Thêm Action đánh dấu đã khởi tạo xong
    setInitialized: (state) => {
      state.isInitialized = true;
    },
    setCredentials: (
      state,
      action: PayloadAction<{ user: UserInfo; accessToken: string }>
    ) => {
      state.user = action.payload.user;
      state.accessToken = action.payload.accessToken;
      state.isAuthenticated = true;
      setAuthToken(action.payload.accessToken); 
    },
    logout: (state) => {
      state.user = null;
      state.accessToken = null;
      state.isAuthenticated = false;
      setAuthToken(null); 
    },
  },
});

export const { setCredentials, logout, setInitialized } = authSlice.actions;
export const authReducer = authSlice.reducer;