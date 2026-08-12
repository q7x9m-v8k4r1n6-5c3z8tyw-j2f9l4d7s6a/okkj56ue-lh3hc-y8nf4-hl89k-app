import { describe, expect, it } from 'vitest'
import { createInitialRaceForm } from '../createRace.form'
import { createRaceFormReducer } from './createRaceForm.reducer'

describe('createRaceFormReducer', () => {
  it('updates form sections without mutating the previous state', () => {
    const initial = createInitialRaceForm()
    const updated = createRaceFormReducer(initial, {
      type: 'basic/update',
      changes: { name: 'Amazing Race' },
    })

    expect(updated.basic.name).toBe('Amazing Race')
    expect(initial.basic.name).toBe('')
    expect(updated.settings).toBe(initial.settings)
  })

  it('removes station errors together with a removed station', () => {
    const state = {
      ...createInitialRaceForm(),
      stations: [{
        id: 'station-1',
        name: '',
        location: '',
        managers: [],
        description: '',
        isHidden: false,
      }],
      errors: {
        ...createInitialRaceForm().errors,
        stations: { 'station-1': { name: 'Required' } },
      },
    }

    const updated = createRaceFormReducer(state, {
      type: 'stations/remove',
      id: 'station-1',
    })
    expect(updated.stations).toEqual([])
    expect(updated.errors.stations).toEqual({})
  })
})
