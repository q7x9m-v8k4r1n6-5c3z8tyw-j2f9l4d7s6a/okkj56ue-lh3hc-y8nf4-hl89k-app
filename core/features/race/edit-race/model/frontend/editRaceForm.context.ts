import { createContext } from 'react'
import type {
  EditRaceBooth,
  EditRaceForm,
  EditRaceFormErrors,
  EditRaceOrganizer,
  EditRaceTeam,
} from '../editRace.form'
import type { BasicInformationChanges } from './editRaceForm.reducer'

export type EditRaceFormContextValue = {
  addBooth: () => void
  addOrganizers: (organizers: EditRaceOrganizer[]) => void
  addTeams: (teams: EditRaceTeam[]) => void
  cancelEditing: () => void
  coverFile: File | null
  coverPreviewUrl: string
  errors: EditRaceFormErrors
  finishEditing: (savedForm: EditRaceForm) => void
  form: EditRaceForm
  isDirty: boolean
  isEditing: boolean
  originalForm: EditRaceForm
  removeBooth: (boothId: string) => void
  removeOrganizer: (organizerId: string) => void
  removeTeam: (teamId: string) => void
  selectCoverFile: (file: File) => void
  startEditing: () => void
  updateBasic: (changes: BasicInformationChanges) => void
  updateBooth: (boothId: string, changes: Partial<EditRaceBooth>) => void
  updateSetting: (
    key: keyof EditRaceForm['settings'],
    value: boolean,
  ) => void
  validateForSave: () => boolean
}

export const EditRaceFormContext =
  createContext<EditRaceFormContextValue | null>(null)
