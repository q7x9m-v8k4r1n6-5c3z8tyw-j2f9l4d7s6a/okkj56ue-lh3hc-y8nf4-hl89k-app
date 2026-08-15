import { useQuery } from '@tanstack/react-query'
import { getOrganizerScoringHistory } from '../../api/organizerScoringHistory.api'
import { organizerScoringHistoryQueryKeys } from './organizerScoringHistory.queryKeys'

export const useOrganizerScoringHistoryQuery = (
  raceId?: string,
  page = 1,
  pageSize = 50,
) =>
  useQuery({
    queryKey: organizerScoringHistoryQueryKeys.list(raceId, page, pageSize),
    queryFn: ({ signal }) => getOrganizerScoringHistory(raceId!, page, pageSize, signal),
    enabled: Boolean(raceId),
  })
