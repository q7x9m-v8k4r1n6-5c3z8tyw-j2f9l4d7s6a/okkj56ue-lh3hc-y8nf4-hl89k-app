import { describe, expect, it } from 'vitest'
import { editRaceDetailResponseSchema } from './editRace.contract'
import { mapRaceDetailToForm } from './mapRaceDetailToForm'

describe('mapRaceDetailToForm', () => {
  it('keeps the hidden-booth classification returned by the API', () => {
    const detail = editRaceDetailResponseSchema.parse({
      id: '11111111-1111-4111-8111-111111111111',
      name: 'Race',
      raceName: 'Race',
      timeStart: '2026-08-01T08:00:00',
      timeEnd: '2026-08-01T10:00:00',
      place: 'HCMC',
      status: 'draft',
      modifiedAt: '2026-07-26T01:00:00Z',
      isToggledLeaderboard: true,
      isHiddenPoint: false,
      organizerId: [],
      organizers: [],
      raceTeam: [],
      booth: [{
        id: '22222222-2222-4222-8222-222222222222',
        name: 'Hidden booth',
        place: 'Campus B',
        description: 'Secret mission',
        organizerID: null,
        isHidden: true,
      }],
    })

    expect(mapRaceDetailToForm(detail, 'Rules').booths[0].isHidden).toBe(true)
  })
})
