import { useQuery } from '@tanstack/react-query'
import { getBoothList, getLeaderboard, getScoringLog } from '../../api/liveRace.api'
import { liveRaceQueryKeys } from './liveRace.queryKeys'

const LIVE_REFETCH_INTERVAL = 30 * 1000 

/**
 * Caches and auto-refreshes the team leaderboard.
 */
export const useLeaderboardQuery = (raceId?: string) =>
  useQuery({
    queryKey: liveRaceQueryKeys.leaderboard(raceId),
    queryFn: ({ signal }) => getLeaderboard(raceId!, signal),
    enabled: Boolean(raceId),
    refetchInterval: LIVE_REFETCH_INTERVAL,
  })

/**
 * Caches and auto-refreshes the list of booths.
 */
export const useBoothListQuery = (raceId?: string) =>
  useQuery({
    queryKey: liveRaceQueryKeys.booths(raceId),
    queryFn: ({ signal }) => getBoothList(raceId!, signal),
    enabled: Boolean(raceId),
    refetchInterval: LIVE_REFETCH_INTERVAL,
  })

/**
 * Caches and auto-refreshes the scoring log pagination.
 */
export const useScoringLogQuery = (raceId?: string, page: number = 1, pageSize: number = 20) =>
  useQuery({
    queryKey: liveRaceQueryKeys.logs(raceId, page, pageSize),
    queryFn: ({ signal }) => getScoringLog(raceId!, page, pageSize, signal),
    enabled: Boolean(raceId),
    refetchInterval: LIVE_REFETCH_INTERVAL,
  })