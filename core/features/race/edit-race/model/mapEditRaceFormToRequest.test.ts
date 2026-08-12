import { describe, expect, it } from 'vitest'
import type { EditRaceForm } from './editRace.form'
import { mapEditRaceFormToRequest } from './mapEditRaceFormToRequest'

const organizerId = '11111111-1111-4111-8111-111111111111'
const teamId = '22222222-2222-4222-8222-222222222222'
const boothId = '33333333-3333-4333-8333-333333333333'

const createForm = (): EditRaceForm => ({
  raceName: 'Race',
  timeStart: '2026-08-01T08:00:00',
  timeEnd: '2026-08-01T10:00:00',
  coverUrl: 'https://example.com/cover.jpg',
  coverFileName: 'cover.jpg',
  place: 'HCMC',
  status: 'draft',
  rules: 'Rules',
  modifiedAt: '2026-07-26T01:00:00Z',
  booths: [{
    id: boothId,
    name: 'Booth 1',
    place: 'Floor 1',
    description: 'Description',
    isHidden: false,
    managers: [{
      id: organizerId,
      displayName: 'Organizer',
      email: 'o@example.com',
    }],
  }],
  teams: [{ id: teamId, name: 'Team', leaderEmail: 't@example.com' }],
  organizers: [{
    id: organizerId,
    displayName: 'Organizer',
    email: 'o@example.com',
  }],
  settings: {
    isToggledLeaderboard: false,
    isHiddenPoint: false,
  },
})

describe('mapEditRaceFormToRequest', () => {
  it('returns only the concurrency token when nothing changed', () => {
    const form = createForm()

    expect(mapEditRaceFormToRequest(form, structuredClone(form))).toEqual({
      expectedModifiedAt: form.modifiedAt,
    })
  })

  it('patches only changed fields and changed booths', () => {
    const original = createForm()
    const form = structuredClone(original)
    form.raceName = 'Updated race'
    form.booths[0].description = 'Updated description'

    expect(mapEditRaceFormToRequest(form, original)).toEqual({
      expectedModifiedAt: original.modifiedAt,
      basicInfo: { raceName: 'Updated race' },
      booths: {
        update: [{
          boothId,
          description: 'Updated description',
        }],
      },
    })
  })

  it('builds relation add/remove operations', () => {
    const original = createForm()
    const form = structuredClone(original)
    const nextTeamId = '44444444-4444-4444-8444-444444444444'
    form.teams = [{
      id: nextTeamId,
      name: 'Next team',
      leaderEmail: 'next@example.com',
    }]

    expect(mapEditRaceFormToRequest(form, original)).toEqual({
      expectedModifiedAt: original.modifiedAt,
      raceTeams: {
        add: [nextTeamId],
        remove: [teamId],
      },
    })
  })

  it('includes the hidden flag when adding a booth', () => {
    const original = createForm()
    const form = structuredClone(original)
    form.booths.push({
      id: '44444444-4444-4444-8444-444444444444',
      name: 'Hidden booth',
      place: 'Floor 2',
      description: '',
      isHidden: true,
      managers: [],
    })

    expect(mapEditRaceFormToRequest(form, original)).toEqual({
      expectedModifiedAt: original.modifiedAt,
      booths: {
        add: [{
          name: 'Hidden booth',
          place: 'Floor 2',
          description: '',
          isHidden: true,
          organizerIds: [],
        }],
      },
    })
  })

  it('ignores duplicate relation ids', () => {
    const original = createForm()
    const form = structuredClone(original)
    form.teams.push(structuredClone(form.teams[0]))

    expect(mapEditRaceFormToRequest(form, original)).toEqual({
      expectedModifiedAt: original.modifiedAt,
    })
  })
})
