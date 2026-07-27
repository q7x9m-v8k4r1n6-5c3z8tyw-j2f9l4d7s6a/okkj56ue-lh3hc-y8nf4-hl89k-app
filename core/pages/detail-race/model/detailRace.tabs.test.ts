import { describe, expect, it } from 'vitest'
import { detailRaceTabs, isDetailRaceTab } from './detailRace.tabs'

describe('detail-race tabs', () => {
  it('keeps the basic information feature as the default first section', () => {
    expect(detailRaceTabs[0]).toEqual({
      value: 'basic',
      label: 'Thông tin cơ bản',
    })
  })

  it('accepts configured tabs and rejects unknown values', () => {
    expect(isDetailRaceTab('history')).toBe(true)
    expect(isDetailRaceTab('unknown')).toBe(false)
  })
})
