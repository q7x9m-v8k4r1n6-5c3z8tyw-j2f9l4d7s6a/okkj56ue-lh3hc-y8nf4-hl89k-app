import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { UserProfile } from '@/core/entities/user'

export type AuthSessionState = {
  isInitialized: boolean
  isAuthenticated: boolean
  accessToken: string | null
  user: UserProfile | null
}

const initialState: AuthSessionState = {
  isInitialized: false,
  isAuthenticated: false,
  accessToken: null,
  user: null,
}

/** Stores application-wide authentication session state in pure reducers. */
const authSessionSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    sessionInitialized: (state) => {
      state.isInitialized = true
    },
    sessionAuthenticated: (
      state,
      action: PayloadAction<{ user: UserProfile; accessToken: string }>,
    ) => {
      state.user = action.payload.user
      state.accessToken = action.payload.accessToken
      state.isAuthenticated = true
    },
    sessionCleared: (state) => {
      state.user = null
      state.accessToken = null
      state.isAuthenticated = false
    },
  },
})

export const {
  sessionAuthenticated,
  sessionCleared,
  sessionInitialized,
} = authSessionSlice.actions
export const authReducer = authSessionSlice.reducer
