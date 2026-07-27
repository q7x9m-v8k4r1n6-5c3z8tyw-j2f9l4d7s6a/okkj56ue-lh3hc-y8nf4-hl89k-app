import { describe, expect, it } from 'vitest'
import type { EditRaceForm } from '../editRace.form'
import {
  createEditRaceFormState,
  editRaceFormReducer,
} from './editRaceForm.reducer'

const createForm = (): EditRaceForm => ({
  raceName: 'Original race',
  timeStart: '2026-08-01T08:00:00',
  timeEnd: '2026-08-01T10:00:00',
  coverUrl: '',
  coverFileName: '',
  place: 'HCMC',
  status: 'draft',
  modifiedAt: '2026-07-26T01:00:00Z',
  booths: [],
  teams: [],
  organizers: [],
  settings: {
    isToggledLeaderboard: false,
    isHiddenPoint: false,
  },
})

describe('editRaceFormReducer', () => {
  it('restores the server baseline when editing is cancelled', () => {
    const initialState = createEditRaceFormState(createForm())
    const editingState = editRaceFormReducer(initialState, {
      type: 'UPDATE_BASIC',
      changes: { raceName: 'Changed locally' },
    })

    const cancelledState = editRaceFormReducer(editingState, {
      type: 'CANCEL_EDITING',
    })

    expect(cancelledState.form.raceName).toBe('Original race')
    expect(cancelledState.originalForm.raceName).toBe('Original race')
    expect(cancelledState.isEditing).toBe(false)
  })

  it('promotes a successful server response to the new baseline', () => {
    const initialState = createEditRaceFormState(createForm())
    const savedForm = { ...createForm(), raceName: 'Saved race' }

    const savedState = editRaceFormReducer(initialState, {
      type: 'SAVE_SUCCEEDED',
      savedForm,
    })

    expect(savedState.form).toBe(savedForm)
    expect(savedState.originalForm).toBe(savedForm)
  })
})
