import { describe, expect, it } from 'vitest'
import { teamSummarySchema } from './team'

describe('team entity schema', () => {
  it('accepts a canonical team summary', () => {
    const team = {
      id: '11111111-1111-4111-8111-111111111111',
      name: 'Team Alpha',
      leaderEmail: 'leader@example.com',
    }

    expect(teamSummarySchema.parse(team)).toEqual(team)
  })

  it('rejects a team without a name', () => {
    expect(() => teamSummarySchema.parse({
      id: '11111111-1111-4111-8111-111111111111',
      name: '',
      leaderEmail: 'leader@example.com',
    })).toThrow()
  })
})
