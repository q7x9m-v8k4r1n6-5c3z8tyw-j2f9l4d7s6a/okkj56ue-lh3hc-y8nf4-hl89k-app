import { useQuery } from '@tanstack/react-query'
import { getOrganizerAnnouncementHistory } from '../../api/organizerAnnouncementHistory.api'
import { organizerAnnouncementHistoryQueryKeys } from './organizerAnnouncementHistory.queryKeys'

export const useOrganizerAnnouncementHistoryQuery = (raceId?: string) => useQuery({
  enabled: Boolean(raceId),
  queryKey: raceId
    ? organizerAnnouncementHistoryQueryKeys.list(raceId)
    : [...organizerAnnouncementHistoryQueryKeys.all, 'missing-race-id'],
  queryFn: ({ signal }) => getOrganizerAnnouncementHistory(raceId ?? '', signal),
})
