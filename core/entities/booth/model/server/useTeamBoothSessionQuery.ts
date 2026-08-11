import { useQuery } from '@tanstack/react-query'
import { getTeamBoothSession } from '../../api/getTeamBoothSession.api'
import { teamBoothSessionQueryKeys } from './teamBoothSession.queryKeys'

/** Loads the current team's pending or occupied booth session. */
export const useTeamBoothSessionQuery = (raceId?: string) =>
  useQuery({
    queryKey: teamBoothSessionQueryKeys.detail(raceId),
    queryFn: ({ signal }) => getTeamBoothSession(raceId!, signal),
    enabled: Boolean(raceId),
    staleTime: 0,
    refetchOnWindowFocus: true,
  })
