import { useQuery } from '@tanstack/react-query'
import { getMyBooth } from '../../api/joinRequests.api'

export const organizerMyBoothQueryKey = (raceId?: string) =>
  ['organizer-my-booth', raceId] as const

/** Database-backed source of truth for the organizer's assigned booth session. */
export const useMyBoothQuery = (raceId?: string) => useQuery({
  queryKey: organizerMyBoothQueryKey(raceId),
  queryFn: ({ signal }) => getMyBooth(raceId!, signal),
  enabled: Boolean(raceId),
  staleTime: 0,
  refetchOnWindowFocus: true,
})
