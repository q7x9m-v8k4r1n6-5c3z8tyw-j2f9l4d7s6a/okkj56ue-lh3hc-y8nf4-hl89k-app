import type { QueryClient } from '@tanstack/react-query'
import { teamBoothSessionQueryKeys } from './teamBoothSession.queryKeys'

/** Marks one team's durable booth session as stale. */
export const invalidateTeamBoothSession = (
  queryClient: QueryClient,
  raceId?: string,
) => queryClient.invalidateQueries({
  queryKey: teamBoothSessionQueryKeys.detail(raceId),
})
