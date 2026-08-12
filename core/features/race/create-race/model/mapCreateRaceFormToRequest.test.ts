import { describe, expect, it } from 'vitest'
import { createInitialRaceForm } from './createRace.form'
import { mapCreateRaceFormToRequest } from './mapCreateRaceFormToRequest'

describe('mapCreateRaceFormToRequest', () => {
  it('maps frontend names, entity selections and setting semantics', () => {
    const form = createInitialRaceForm()
    form.basic = {
      ...form.basic,
      name: '  Amazing Race  ',
      location: '  Ho Chi Minh City  ',
      startAt: '2026-07-28T08:00',
      endAt: '2026-07-28T10:00',
      rules: '  Some rules for the race  ',
    }
    form.teams = [{
      id: '11111111-1111-4111-8111-111111111111',
      name: 'Alpha',
      leaderEmail: 'leader@example.com',
    }]
    form.organizers = [{
      id: '22222222-2222-4222-8222-222222222222',
      displayName: 'Coordinator',
      email: 'coordinator@example.com',
    }]
    form.stations = [{
      id: '33333333-3333-4333-8333-333333333333',
      name: '  Hidden station  ',
      location: '  Campus B  ',
      managers: [form.organizers[0]],
      description: '<p>Secret mission</p>',
      isHidden: true,
    }]
    form.settings = { showLeaderboard: true, showScores: false }

    const request = mapCreateRaceFormToRequest(form)
    expect(request.basicInfo.raceName).toBe('Amazing Race')
    expect(request.basicInfo.place).toBe('Ho Chi Minh City')
    expect(request.raceTeam).toEqual([form.teams[0].id])
    expect(request.organizerId).toEqual([form.organizers[0].id])
    expect(request.booths).toEqual([{
      name: 'Hidden station',
      place: 'Campus B',
      description: '<p>Secret mission</p>',
      organizerIds: [form.organizers[0].id],
      isHidden: true,
    }])
    expect(request.raceSettings).toEqual({
      isToggledLeaderboard: true,
      isHiddenPoint: true,
    })
  })
})
