import { describe, expect, it } from 'vitest'
import type { EditRaceForm } from './editRace.form'
import {
  hasEditRaceFormErrors,
  validateEditRaceForm,
} from './editRace.validation'

const createValidForm = (): EditRaceForm => ({
  raceName: 'Race',
  timeStart: '2026-08-01T08:00:00',
  timeEnd: '2026-08-01T10:00:00',
  coverUrl: '',
  coverFileName: '',
  place: 'HCMC',
  status: 'draft',
  rules: 'Rules',
  modifiedAt: '2026-07-26T01:00:00Z',
  booths: [],
  teams: [],
  organizers: [],
  settings: {
    isToggledLeaderboard: false,
    isHiddenPoint: false,
  },
})

describe('validateEditRaceForm', () => {
  it('accepts an empty team and organizer list', () => {
    const errors = validateEditRaceForm(createValidForm(), null)
    expect(hasEditRaceFormErrors(errors)).toBe(false)
  })

  it('requires the end time to be after the start time', () => {
    const form = createValidForm()
    form.timeEnd = form.timeStart

    const errors = validateEditRaceForm(form, null)
    expect(errors.timeEnd).toBe(
      'Thời gian kết thúc phải sau thời gian bắt đầu.',
    )
  })

  it('reports booth errors by booth id', () => {
    const form = createValidForm()
    const boothId = '33333333-3333-4333-8333-333333333333'
    form.booths.push({
      id: boothId,
      name: '',
      place: '',
      description: '',
      managers: [],
    })

    const errors = validateEditRaceForm(form, null)
    expect(errors.booths[boothId]).toEqual({
      name: 'Vui lòng nhập tên trạm.',
      place: 'Vui lòng nhập địa điểm trạm.',
    })
  })
})
