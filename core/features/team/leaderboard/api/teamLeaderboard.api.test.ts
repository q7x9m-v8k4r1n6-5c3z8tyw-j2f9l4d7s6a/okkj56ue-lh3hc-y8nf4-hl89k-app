import { beforeEach, describe, expect, it, vi } from 'vitest'

const { requestMock } = vi.hoisted(() => ({
  requestMock: vi.fn(),
}))

vi.mock('@/core/shared/api', () => ({
  client: { request: requestMock },
}))

import {
  getTeamLeaderboard,
  getTeamScoreHistory,
} from './teamLeaderboard.api'

const raceId = '22d749f7-da08-404f-8113-529a32a88374'
const teamId = '1b6d04ef-6281-4032-b1ae-969816213641'

describe('team result APIs', () => {
  beforeEach(() => requestMock.mockReset())

  it('loads and validates the authenticated team leaderboard', async () => {
    const response = {
      currentTeam: {
        teamId,
        displayName: 'Team A',
        rank: 1,
        totalScore: 300,
        completedRegularBooths: 4,
        completedHiddenBooths: 2,
      },
      isLeaderboardVisible: true,
      areOtherTeamPointsHidden: false,
      teams: [{
        teamId,
        displayName: 'Team A',
        rank: 1,
        totalScore: 300,
        isCurrentTeam: true,
      }],
    }
    requestMock.mockResolvedValue(response)

    await expect(getTeamLeaderboard(raceId)).resolves.toEqual(response)
    expect(requestMock).toHaveBeenCalledWith({
      path: '/Team/leaderboard',
      query: { raceId },
      signal: undefined,
    })
  })

  it('loads one validated score-history page', async () => {
    const response = {
      items: [{
        id: 'bf05e1c8-82c0-441e-a56d-042c1a136f52',
        boothId: null,
        organizerId: null,
        scoreGiven: -10,
        scoreAfterChange: 290,
        source: 'admin_fix',
        reason: 'Điều chỉnh điểm',
        createdAt: '2026-08-12T08:00:00Z',
      }],
      page: 1,
      pageSize: 20,
      totalItems: 1,
      totalPages: 1,
    }
    requestMock.mockResolvedValue(response)

    await expect(getTeamScoreHistory(raceId, 1, 20)).resolves.toEqual(response)
    expect(requestMock).toHaveBeenCalledWith({
      path: '/Team/score-history',
      query: { raceId, page: 1, pageSize: 20 },
      signal: undefined,
    })
  })

  it('rejects malformed leaderboard data at the API boundary', async () => {
    requestMock.mockResolvedValue({
      currentTeam: { teamId, rank: 0 },
      isLeaderboardVisible: true,
      areOtherTeamPointsHidden: false,
      teams: [],
    })

    await expect(getTeamLeaderboard(raceId)).rejects.toThrow()
  })
})
