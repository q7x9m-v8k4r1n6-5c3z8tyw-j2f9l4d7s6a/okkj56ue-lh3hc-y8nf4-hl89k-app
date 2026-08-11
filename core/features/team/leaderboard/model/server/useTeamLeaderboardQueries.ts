import { useInfiniteQuery, useQuery } from '@tanstack/react-query'
import {
  getTeamLeaderboard,
  getTeamScoreHistory,
} from '../../api/teamLeaderboard.api'
import { teamLeaderboardQueryKeys } from './teamLeaderboard.queryKeys'

const SCORE_HISTORY_PAGE_SIZE = 20

/** Caches the authenticated Team's leaderboard view for one race. */
export const useTeamLeaderboardQuery = (raceId?: string) =>
  useQuery({
    queryKey: teamLeaderboardQueryKeys.leaderboard(raceId),
    queryFn: ({ signal }) => getTeamLeaderboard(raceId!, signal),
    enabled: Boolean(raceId),
  })

/** Loads score history incrementally so the phone view remains compact. */
export const useTeamScoreHistoryQuery = (
  raceId?: string,
  enabled = true,
) => useInfiniteQuery({
  queryKey: teamLeaderboardQueryKeys.history(raceId),
  queryFn: ({ pageParam, signal }) => getTeamScoreHistory(
    raceId!,
    pageParam,
    SCORE_HISTORY_PAGE_SIZE,
    signal,
  ),
  initialPageParam: 1,
  getNextPageParam: (lastPage) => (
    lastPage.page < lastPage.totalPages ? lastPage.page + 1 : undefined
  ),
  enabled: Boolean(raceId) && enabled,
})
