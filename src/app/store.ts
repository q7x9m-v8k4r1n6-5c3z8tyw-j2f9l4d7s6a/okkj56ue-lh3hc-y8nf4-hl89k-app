import { configureStore } from '@reduxjs/toolkit'
import { createRaceReducer } from '@/core/features/race/create-race/stores/createRaceSlice'
import { authReducer } from '@/core/features/auth/stores/authSlice' 

export const store = configureStore({ 
  reducer: { 
    createRace: createRaceReducer,
    auth: authReducer 
  } 
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch