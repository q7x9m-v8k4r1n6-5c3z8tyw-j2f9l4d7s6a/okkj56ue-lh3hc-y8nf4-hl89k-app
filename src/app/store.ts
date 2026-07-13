import { configureStore } from '@reduxjs/toolkit'
import { createRaceReducer } from '@/core/features/race/create-race/stores/createRaceSlice'

export const store = configureStore({ reducer: { createRace: createRaceReducer } })
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
