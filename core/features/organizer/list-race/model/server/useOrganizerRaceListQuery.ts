import { useQuery } from '@tanstack/react-query'
import { listOrganizerRaces } from '../../api/organizerRaceList.api'
import type { ListOrganizerRacesRequest } from '../organizerRaceList.contract'
import { organizerRaceListQueryKeys } from './organizerRaceList.queryKeys'

/** Owns loading, error and cached backend state for organizer race collection. */
export const useOrganizerRaceListQuery = (
  request: ListOrganizerRacesRequest = {},
) => useQuery({
  queryKey: organizerRaceListQueryKeys.list(request),
  queryFn: ({ signal }) => listOrganizerRaces(request, signal),
})
