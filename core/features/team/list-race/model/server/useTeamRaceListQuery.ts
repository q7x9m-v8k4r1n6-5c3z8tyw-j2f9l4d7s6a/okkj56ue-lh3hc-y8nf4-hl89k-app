import { useQuery } from '@tanstack/react-query'
import { listTeamRaces } from '../../api/teamRaceList.api'
import type { ListTeamRacesRequest } from '../teamRaceList.contract'
import { teamRaceListQueryKeys } from './teamRaceList.queryKeys'

/** Owns loading, error and cached backend state for team race collection. */
export const useTeamRaceListQuery = (request: ListTeamRacesRequest = {}) => useQuery({
  queryKey: teamRaceListQueryKeys.list(request),
  queryFn: ({ signal }) => listTeamRaces(request, signal),
})
