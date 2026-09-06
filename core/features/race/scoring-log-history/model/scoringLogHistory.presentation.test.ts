import { describe, expect, it } from 'vitest'
import type { ScoringLogHistoryItem } from './scoringLogHistory.contract'
import {
  getScoringLogReason,
  getScoringLogReasonOptions,
  mapScoringLogHistoryItem,
} from './scoringLogHistory.presentation'

const createLog = (
  overrides: Partial<ScoringLogHistoryItem>,
): ScoringLogHistoryItem => ({
  actorFullName: null,
  actorShortName: null,
  boothName: null,
  createdAt: '2026-09-05T01:00:00Z',
  createdBy: 'admin',
  eventName: 'Điều chỉnh điểm thủ công',
  logId: crypto.randomUUID(),
  reason: 'Admin hiệu chỉnh',
  scoreAfter: 30,
  scoreBefore: 0,
  scoreDelta: 30,
  teamName: 'Team A',
  ...overrides,
})

describe('scoring log history presentation', () => {
  it('uses the typed manual reason as a filter option', () => {
    const items = [
      createLog({ reason: 'Admin hiệu chỉnh' }),
      createLog({ reason: 'Hiệu ứng Techcache' }),
      createLog({ reason: 'Lý do mới người dùng nhập' }),
    ]

    expect(getScoringLogReasonOptions(items).map((option) => option.label)).toEqual([
      'Lý do',
      'Admin hiệu chỉnh',
      'Hiệu ứng Techcache',
      'Lý do mới người dùng nhập',
    ])
  })

  it('groups booth completion logs by booth name', () => {
    expect(getScoringLogReason(createLog({
      boothName: 'Trạm A',
      reason: 'Hoàn thành trạm',
    }))).toBe('Hoàn thành trạm A')
  })

  it('maps score tone from positive and negative deltas', () => {
    expect(mapScoringLogHistoryItem(createLog({ scoreDelta: 30 })).scoreTone).toBe('positive')
    expect(mapScoringLogHistoryItem(createLog({ scoreDelta: -30 })).scoreTone).toBe('negative')
  })
})
