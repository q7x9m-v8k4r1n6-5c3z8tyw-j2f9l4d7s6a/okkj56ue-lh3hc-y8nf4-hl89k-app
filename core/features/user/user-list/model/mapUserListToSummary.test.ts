import { describe, expect, it } from 'vitest'
import { mapUserListToSummaries } from './mapUserListToSummary'

describe('mapUserListToSummaries', () => {
  it('maps backend organizer rows to the canonical user entity', () => {
    expect(mapUserListToSummaries('staff', [], [{
      id: '9c1b6d4e-6e20-4c4c-a36c-f8a8e3d1e7a1',
      displayName: 'Nguyen Van A',
      email: 'nguyenvana@example.com',
      role: 'support',
      status: 'active',
    }])).toEqual([{
      id: '9c1b6d4e-6e20-4c4c-a36c-f8a8e3d1e7a1',
      category: 'staff',
      displayName: 'Nguyen Van A',
      username: 'nguyenvana',
      email: 'nguyenvana@example.com',
      status: 'active',
    }])
  })
})
