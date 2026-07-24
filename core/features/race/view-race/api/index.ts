import { client } from '@/core/shared/api/interceptor'
import type { BoothScoringLogResponse, BoothSummaryResponse, TeamLeaderboardResponse } from '../models'

export const getTeamLeaderboard = async (raceId: string, signal?: AbortSignal): Promise<TeamLeaderboardResponse[]> => {
  return client.request<TeamLeaderboardResponse[]>({
    path: `/Team/leaderboard?RaceId=${raceId}`,
    method: 'GET',
    signal,
  })
}

export const getBoothSummary = async (raceId: string, signal?: AbortSignal): Promise<BoothSummaryResponse[]> => {
  return client.request<BoothSummaryResponse[]>({
    path: `/Booth/status-summary?RaceId=${raceId}`,
    method: 'GET',
    signal,
  })
}

export const getBoothScoringLogs = async (raceId: string, limit: number = 20, signal?: AbortSignal): Promise<BoothScoringLogResponse[]> => {
  return client.request<BoothScoringLogResponse[]>({
    path: `/Logs/booth-scoring?RaceId=${raceId}&Limit=${limit}`,
    method: 'GET',
    signal,
  })
}