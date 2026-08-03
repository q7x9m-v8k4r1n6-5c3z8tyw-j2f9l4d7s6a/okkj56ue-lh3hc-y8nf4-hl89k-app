import { useQuery } from '@tanstack/react-query'
import { getMyBooth } from '../../api/getMyBooth.api'

/** Loads and caches the organizer's assigned booth for one race. */
export const useMyBoothQuery = (raceId?: string) =>
  useQuery({
    queryKey: ['booth', 'my-booth', raceId],
    queryFn: () => getMyBooth(raceId!),
    enabled: Boolean(raceId),
    staleTime: 1000 * 60 * 5,
  })