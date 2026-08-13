import { client } from '@/core/shared/api'
import {
  scoreHistoryResponseSchema,
  teamLeaderboardResponseSchema,
  type ScoreHistoryResponse,
  type TeamLeaderboardResponse,
} from '../model/teamLeaderboard.contract'

/** Loads the authenticated Team's score summary and visible leaderboard. */
export const getTeamLeaderboard = async (
  raceId: string,
  signal?: AbortSignal,
): Promise<TeamLeaderboardResponse> => {
  const response = await client.request<unknown>({
    path: '/Team/leaderboard',
    query: { raceId },
    signal,
  })

  return teamLeaderboardResponseSchema.parse(response)
}

/** Loads one page of score changes belonging to the authenticated Team. */
export const getTeamScoreHistory = async (
  raceId: string,
  page: number,
  pageSize: number,
  signal?: AbortSignal,
): Promise<ScoreHistoryResponse> => {
  const response = await client.request<unknown>({
    path: '/Team/score-history',
    query: { raceId, page, pageSize },
    signal,
  })

  return scoreHistoryResponseSchema.parse(response)
}
