import { describe, expect, it } from 'vitest'
import { buildMapQueryKeys } from './buildMap.queryKeys'

describe('buildMapQueryKeys', () => {
  it('creates stable and consistent query keys', () => {
    expect(buildMapQueryKeys.all).toEqual(['race-build-map'])
    expect(buildMapQueryKeys.mapDetail('race-1')).toEqual([
      'race-build-map',
      'map-detail',
      'race-1',
    ])
    expect(buildMapQueryKeys.booths('race-1')).toEqual([
      'race-build-map',
      'booths',
      'race-1',
    ])
  })
})
