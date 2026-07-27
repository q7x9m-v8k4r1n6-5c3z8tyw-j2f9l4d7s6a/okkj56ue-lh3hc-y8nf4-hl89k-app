import { useQuery } from '@tanstack/react-query'
import { listRaces } from '../../api/listRaces.api'
import type { ListRacesRequest } from '../listRace.contract'
import { listRaceQueryKeys } from './listRace.queryKeys'

/** Owns loading, error and cached backend state for a race collection. */
export const useRaceListQuery = (request: ListRacesRequest = {}) => useQuery({
  queryKey: listRaceQueryKeys.list(request),
  queryFn: ({ signal }) => listRaces(request, signal),
})
