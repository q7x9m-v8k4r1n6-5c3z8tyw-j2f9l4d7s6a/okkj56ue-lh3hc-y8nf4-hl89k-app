import { useQuery } from '@tanstack/react-query'
import { getTeamAnnouncementHistory } from '../../api/teamAnnouncementHistory.api'
import { teamAnnouncementHistoryQueryKeys } from './teamAnnouncementHistory.queryKeys'

export const useTeamAnnouncementHistoryQuery = (raceId?: string) => useQuery({
  enabled: Boolean(raceId),
  queryKey: raceId
    ? teamAnnouncementHistoryQueryKeys.list(raceId)
    : [...teamAnnouncementHistoryQueryKeys.all, 'missing-race-id'],
  queryFn: ({ signal }) => getTeamAnnouncementHistory(raceId ?? '', signal),
})
