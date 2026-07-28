import { useQuery } from '@tanstack/react-query'
import { getOrganizerRaceDetail } from '../../api/organizerRace.api'
import { organizerRaceQueryKeys } from './organizerRace.queryKeys'

/** Owns backend state for the organizer-facing race detail access check. */
export const useOrganizerRaceDetailQuery = (raceId?: string) => useQuery({
  queryKey: organizerRaceQueryKeys.detail(raceId),
  queryFn: ({ signal }) => getOrganizerRaceDetail(raceId ?? '', signal),
  enabled: Boolean(raceId),
  retry: false,
})
