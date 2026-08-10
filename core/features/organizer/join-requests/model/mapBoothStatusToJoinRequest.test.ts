import { describe, expect, it } from 'vitest'
import { mapBoothStatusToJoinRequest } from './mapBoothStatusToJoinRequest'

describe('mapBoothStatusToJoinRequest', () => {
  it('maps the lowercase pending status emitted by the backend', () => {
    expect(mapBoothStatusToJoinRequest(['BOOTH-1', 'BOOTH-2'], {
      boothId: 'booth-2',
      status: 'pending',
      teamId: 'team-1',
      teamName: 'Team A',
    })).toEqual({
      boothId: 'booth-2',
      id: 'team-1',
      teamName: 'Team A',
    })
  })

  it('ignores another booth or a non-pending status', () => {
    expect(mapBoothStatusToJoinRequest(['booth-1'], {
      boothId: 'booth-2',
      status: 'pending',
      teamId: 'team-1',
      teamName: 'Team A',
    })).toBeNull()

    expect(mapBoothStatusToJoinRequest(['booth-1'], {
      boothId: 'booth-1',
      status: 'occupied',
      teamId: 'team-1',
      teamName: 'Team A',
    })).toBeNull()
  })
})
