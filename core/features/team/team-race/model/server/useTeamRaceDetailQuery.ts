import { useQuery } from '@tanstack/react-query'
import { getTeamRaceDetail } from '../../api/teamRace.api'
import { teamRaceQueryKeys } from './teamRace.queryKeys'

/** Owns backend state for the team-facing race detail access check. */
export const useTeamRaceDetailQuery = (raceId?: string) => useQuery({
  queryKey: teamRaceQueryKeys.detail(raceId),
  queryFn: ({ signal }) => getTeamRaceDetail(raceId ?? '', signal),
  enabled: Boolean(raceId),
  retry: false,
})
