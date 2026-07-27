import { createContext, type Dispatch } from 'react'
import type { CreateRaceFormState } from '../createRace.form'
import type { CreateRaceFormAction } from './createRaceForm.reducer'

export type CreateRaceFormContextValue = {
  form: CreateRaceFormState
  dispatch: Dispatch<CreateRaceFormAction>
  coverFile: File | null
  previewUrl: string
  selectCoverFile: (file: File) => void
  clearCoverFile: () => void
}

export const CreateRaceFormContext =
  createContext<CreateRaceFormContextValue | null>(null)
