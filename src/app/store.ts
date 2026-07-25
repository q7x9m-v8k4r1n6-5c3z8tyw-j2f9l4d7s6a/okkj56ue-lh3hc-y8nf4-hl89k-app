import { configureStore } from '@reduxjs/toolkit'
import { createRaceReducer } from '@/core/features/race/create-race/stores/createRaceSlice'
import { editRaceReducer } from '@/core/features/race/edit-race/stores/editRaceSlice'
import { authReducer } from '@/core/features/auth/stores/authSlice' 

export const store = configureStore({ 
  reducer: { 
    createRace: createRaceReducer,
    editRace: editRaceReducer,
    auth: authReducer 
  } 
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
