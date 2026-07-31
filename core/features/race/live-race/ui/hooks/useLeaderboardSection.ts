import { useLeaderboardQuery } from '../../model/server/useLiveQueries'

/**
 * Adapts leaderboard server state for presentation.
 */
export const useLeaderboardSection = (raceId?: string) => {
  const query = useLeaderboardQuery(raceId)

  return {
    items: query.data ?? [],
    isLoading: query.isLoading,
    isError: query.isError,
  }
}