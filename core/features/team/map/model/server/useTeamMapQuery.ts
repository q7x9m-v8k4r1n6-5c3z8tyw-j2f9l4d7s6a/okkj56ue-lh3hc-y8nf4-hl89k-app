import { useQuery } from '@tanstack/react-query'
import { getTeamMapDetail } from '../../api/teamMap.api'
import { teamMapQueryKeys } from './teamMap.queryKeys'

/**
 * Loads and caches the race detail and booth information for the team map view.
 */
export const useTeamMapQuery = (raceId?: string) => {
  const normalizedRaceId = raceId?.trim()
  return useQuery({
    enabled: Boolean(normalizedRaceId),
    queryKey: normalizedRaceId
      ? teamMapQueryKeys.detail(normalizedRaceId)
      : [...teamMapQueryKeys.all, 'missing-race-id'],
    queryFn: ({ signal }) => {
      if (!normalizedRaceId) {
        throw new Error('Mã trận đấu không hợp lệ.')
      }
      return getTeamMapDetail(normalizedRaceId, signal)
    },
  })
}
