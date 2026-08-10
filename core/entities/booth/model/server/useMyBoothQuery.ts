import { useQuery } from '@tanstack/react-query'
import { getMyBooth } from '../../api/getMyBooth.api'

/** Loads and caches the organizer's assigned booth for one race. */
export const useMyBoothQuery = (raceId?: string) =>
  useQuery({
    queryKey: ['booth', 'my-booth', raceId],
    queryFn: ({ signal }) => getMyBooth(raceId!, signal),
    enabled: Boolean(raceId),
    staleTime: 0,
    refetchOnWindowFocus: true,
  })
