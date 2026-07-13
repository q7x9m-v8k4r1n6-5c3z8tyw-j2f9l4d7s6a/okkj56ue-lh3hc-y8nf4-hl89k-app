import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { OrganizerModel } from '@/core/entities/organizer'

/**
 * [Local state]: station row in create new race feature
 */
export type StationDraft = { id: string; name: string; location: string; managers: OrganizerModel[]; description: string }

/**
 * [Local state]: team row in create new race feature
 */
export type TeamDraft = { id: string; email: string; name: string }

/**
 * [Local state]: organizer row in create new race feature
 */
export type OrganizerDraft = { id: string; name: string; email: string }

/**
 * [Local state]: basic information in create new race feature
 */
export type BasicDraft = { name: string; startAt: string; endAt: string; imageName: string; location: string }

//#region ============== Validation Errors ==============
export type BasicValidationErrors = Partial<Record<keyof BasicDraft, string>>
export type StationValidationErrors = Record<string, Partial<Record<'name' | 'location' | 'managers', string>>>
//#endregion

export type CreateRaceState = {
  step: number
  basic: BasicDraft
  basicErrors: BasicValidationErrors
  stationErrors: StationValidationErrors
  stations: StationDraft[]
  teams: TeamDraft[]
  organizers: OrganizerDraft[]
  settings: { disableLeaderboard: boolean; hideScores: boolean }
}

const initialState: CreateRaceState = {
  step: 1,
  basic: { name: '', startAt: '', endAt: '', imageName: '', location: '' },
  basicErrors: {},
  stationErrors: {},
  stations: [],
  teams: [],
  organizers: [],
  settings: { disableLeaderboard: true, hideScores: true },
}

const createRaceSlice = createSlice({
  name: 'createRace',
  initialState,
  reducers: {
    setStep: (state, action: PayloadAction<number>) => { state.step = Math.min(5, Math.max(1, action.payload)) },
    updateBasic: (state, action: PayloadAction<Partial<BasicDraft>>) => { Object.assign(state.basic, action.payload) },
    setBasicErrors: (state, action: PayloadAction<BasicValidationErrors>) => { state.basicErrors = action.payload },
    clearBasicError: (state, action: PayloadAction<keyof BasicDraft>) => { delete state.basicErrors[action.payload] },
    setStationErrors: (state, action: PayloadAction<StationValidationErrors>) => { state.stationErrors = action.payload },
    clearStationError: (state, action: PayloadAction<{ id: string; field: 'name' | 'location' | 'managers' }>) => {
      delete state.stationErrors[action.payload.id]?.[action.payload.field]
      if (state.stationErrors[action.payload.id] && !Object.keys(state.stationErrors[action.payload.id]).length) delete state.stationErrors[action.payload.id]
    },
    addStation: (state, action: PayloadAction<Omit<StationDraft, 'id'>>) => { state.stations.push({ id: crypto.randomUUID(), ...action.payload }) },
    addStationWithId: (state, action: PayloadAction<StationDraft>) => { state.stations.push(action.payload) },
    updateStation: (state, action: PayloadAction<{ id: string; changes: Partial<Omit<StationDraft, 'id'>> }>) => {
      const station = state.stations.find((row) => row.id === action.payload.id)
      if (station) Object.assign(station, action.payload.changes)
    },
    removeStation: (state, action: PayloadAction<string>) => {
      state.stations = state.stations.filter((row) => row.id !== action.payload)
      delete state.stationErrors[action.payload]
    },
    addTeam: (state, action: PayloadAction<TeamDraft>) => { state.teams.push(action.payload) },
    removeTeam: (state, action: PayloadAction<string>) => { state.teams = state.teams.filter((row) => row.id !== action.payload) },
    addOrganizer: (state, action: PayloadAction<OrganizerDraft>) => { state.organizers.push(action.payload) },
    removeOrganizer: (state, action: PayloadAction<string>) => { state.organizers = state.organizers.filter((row) => row.id !== action.payload) },
    updateSettings: (state, action: PayloadAction<Partial<CreateRaceState['settings']>>) => { Object.assign(state.settings, action.payload) },
    resetCreateRace: () => initialState,
  },
})

export const createRaceActions = createRaceSlice.actions
export const createRaceReducer = createRaceSlice.reducer
