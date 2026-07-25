import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import { EDIT_RACE_INITIAL_FORM } from '../constants'
import type { EditRaceForm } from '../models'

export type EditRaceState = {
  form: EditRaceForm
  isEditing: boolean
}

const initialState: EditRaceState = {
  form: EDIT_RACE_INITIAL_FORM,
  isEditing: false,
}

const editRaceSlice = createSlice({
  name: 'editRace',
  initialState,
  reducers: {
    setForm: (state, action: PayloadAction<EditRaceForm>) => {
      state.form = action.payload
    },
    updateBasic: (state, action: PayloadAction<Partial<Pick<EditRaceForm, 'raceName' | 'timeStart' | 'timeEnd' | 'coverUrl' | 'coverFileName' | 'place'>>>) => {
      Object.assign(state.form, action.payload)
    },
    setEditing: (state, action: PayloadAction<boolean>) => {
      state.isEditing = action.payload
    },
    addBooth: (state) => {
      state.form.booths.push({
        id: crypto.randomUUID(),
        name: '',
        place: '',
        managers: [],
        description: '',
      })
    },
    updateBooth: (state, action: PayloadAction<{ id: string; changes: Partial<EditRaceForm['booths'][number]> }>) => {
      const booth = state.form.booths.find((row) => row.id === action.payload.id)
      if (booth) Object.assign(booth, action.payload.changes)
    },
    removeBooth: (state, action: PayloadAction<string>) => {
      state.form.booths = state.form.booths.filter((booth) => booth.id !== action.payload)
    },
    addTeams: (state, action: PayloadAction<EditRaceForm['teams']>) => {
      const nextTeams = action.payload.filter((team) => !state.form.teams.some((row) => row.id === team.id))
      state.form.teams.push(...nextTeams)
    },
    removeTeam: (state, action: PayloadAction<string>) => {
      state.form.teams = state.form.teams.filter((team) => team.id !== action.payload)
    },
    addOrganizers: (state, action: PayloadAction<EditRaceForm['organizers']>) => {
      const nextOrganizers = action.payload.filter((organizer) => !state.form.organizers.some((row) => row.id === organizer.id))
      state.form.organizers.push(...nextOrganizers)
    },
    removeOrganizer: (state, action: PayloadAction<string>) => {
      state.form.organizers = state.form.organizers.filter((organizer) => organizer.id !== action.payload)
    },
    updateSetting: (state, action: PayloadAction<{ key: keyof EditRaceForm['settings']; value: boolean }>) => {
      state.form.settings[action.payload.key] = action.payload.value
    },
    resetEditRace: () => initialState,
  },
})

export const editRaceActions = editRaceSlice.actions
export const editRaceReducer = editRaceSlice.reducer
