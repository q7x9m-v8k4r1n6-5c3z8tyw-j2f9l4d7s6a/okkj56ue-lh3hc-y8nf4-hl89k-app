import { useQuery } from '@tanstack/react-query'
import { getScoringLogHistory } from '../../api/scoringLogHistory.api'
import { scoringLogHistoryQueryKeys } from './scoringLogHistory.queryKeys'

export const useScoringLogHistoryQuery = (
  raceId?: string,
  page = 1,
  pageSize = 100,
) =>
  useQuery({
    queryKey: scoringLogHistoryQueryKeys.list(raceId, page, pageSize),
    queryFn: ({ signal }) => getScoringLogHistory(raceId!, page, pageSize, signal),
    enabled: Boolean(raceId),
  })
