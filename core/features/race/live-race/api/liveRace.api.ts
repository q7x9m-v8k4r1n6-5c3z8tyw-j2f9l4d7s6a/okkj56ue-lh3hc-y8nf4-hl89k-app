import { client } from '@/core/shared/api'
import { z } from 'zod'
import {
  boothListItemSchema,
  scoringLogPagedResponseSchema,
  teamLeaderboardItemSchema,
  type BoothListItem,
  type ScoringLogPagedResponse,
  type TeamLeaderboardItem,
} from '../model/liveRace.schemas'

/**
 * Fetches and validates the leaderboard for a specific race.
 * @param raceId The unique identifier of the race to retrieve leaderboard
 * @param signal An optional AbortSignal to cancel the request if needed
 * @returns A promise resolving to the team leaderboard array
 */
export const getLeaderboard = async (
  raceId: string,
  signal?: AbortSignal,
): Promise<TeamLeaderboardItem[]> => {
  const response = await client.request<unknown>({
    path: `/Race/leaderboard`,
    query: { raceId },
    signal,
  })
  return z.array(teamLeaderboardItemSchema).parse(response)
}

/**
 * Fetches and validates the booth list and their current status.
 * @param raceId The unique identifier of the race
 * @param signal An optional AbortSignal to cancel the request if needed
 * @returns A promise resolving to the booth list array
 */
export const getBoothList = async (
  raceId: string,
  signal?: AbortSignal,
): Promise<BoothListItem[]> => {
  const response = await client.request<unknown>({
    path: `/Race/booth-list`,
    query: { raceId },
    signal,
  })
  return z.array(boothListItemSchema).parse(response)
}

/**
 * Fetches and validates a paginated list of scoring logs.
 * @param raceId The unique identifier of the race
 * @param page The page number to fetch
 * @param pageSize The number of items per page
 * @param signal An optional AbortSignal to cancel the request if needed
 * @returns A promise resolving to the paginated scoring log response
 */
export const getScoringLog = async (
  raceId: string,
  page: number = 1,
  pageSize: number = 20,
  signal?: AbortSignal,
): Promise<ScoringLogPagedResponse> => {
  const response = await client.request<unknown>({
    path: `/Race/scoring-log`,
    query: { raceId, page, pageSize },
    signal,
  })
  return scoringLogPagedResponseSchema.parse(response)
}