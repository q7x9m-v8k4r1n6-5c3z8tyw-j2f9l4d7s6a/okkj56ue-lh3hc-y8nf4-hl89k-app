import { useQuery } from '@tanstack/react-query'
import { getMyBooth } from '../../api/getMyBooth.api'
import { myBoothQueryKeys } from './myBooth.queryKeys'

/** Loads and caches the organizer's assigned booth for one race. */
export const useMyBoothQuery = (raceId?: string) =>
  useQuery({
    queryKey: myBoothQueryKeys.detail(raceId),
    queryFn: ({ signal }) => getMyBooth(raceId!, signal),
    enabled: Boolean(raceId),
    staleTime: 0,
    refetchOnWindowFocus: true,
  })
