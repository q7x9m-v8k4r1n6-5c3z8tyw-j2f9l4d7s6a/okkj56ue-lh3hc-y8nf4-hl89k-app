import { describe, expect, it } from 'vitest'
import {
  formatLeaderboardRank,
  mapScoreHistoryItem,
} from './teamLeaderboard.presentation'

const baseItem = {
  id: 'bf05e1c8-82c0-441e-a56d-042c1a136f52',
  boothId: null,
  organizerId: null,
  scoreAfterChange: 100,
  source: 'booth_completed',
  createdAt: '2026-08-12T08:05:04Z',
}

describe('team result presentation', () => {
  it('renders a positive score delta and GMT+7 time', () => {
    expect(mapScoreHistoryItem({
      ...baseItem,
      scoreGiven: 50,
      reason: 'Hoàn thành Trạm T04.',
    })).toEqual({
      id: baseItem.id,
      description: 'Hoàn thành Trạm T04 (+50 điểm).',
      time: '15:05:04',
    })
  })

  it('keeps negative and zero score deltas explicit', () => {
    expect(mapScoreHistoryItem({
      ...baseItem,
      scoreGiven: -10,
      reason: 'Điều chỉnh',
    }).description).toBe('Điều chỉnh (-10 điểm).')
    expect(mapScoreHistoryItem({
      ...baseItem,
      scoreGiven: 0,
      reason: '',
    }).description).toBe('Điểm số được cập nhật (0 điểm).')
  })

  it('uses the two-digit rank style from the team result screen', () => {
    expect(formatLeaderboardRank(1)).toBe('#01')
    expect(formatLeaderboardRank(12)).toBe('#12')
  })
})
