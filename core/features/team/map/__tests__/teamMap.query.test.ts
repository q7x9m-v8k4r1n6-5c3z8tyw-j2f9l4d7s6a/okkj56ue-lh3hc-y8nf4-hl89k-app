import { describe, expect, it } from 'vitest'
import { teamMapQueryKeys } from '../model/server/teamMap.queryKeys'

describe('teamMapQueryKeys', () => {
  it('constructs correct query keys', () => {
    expect(teamMapQueryKeys.all).toEqual(['team', 'map'])
    expect(teamMapQueryKeys.detail('race-999')).toEqual(['team', 'map', 'race-999'])
  })
})
