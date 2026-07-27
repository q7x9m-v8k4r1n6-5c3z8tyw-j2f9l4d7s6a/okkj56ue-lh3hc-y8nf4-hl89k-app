import { configureStore } from '@reduxjs/toolkit'
import { authReducer } from '@/core/features/auth'

export const store = configureStore({
  reducer: {
    auth: authReducer,
  },
})
