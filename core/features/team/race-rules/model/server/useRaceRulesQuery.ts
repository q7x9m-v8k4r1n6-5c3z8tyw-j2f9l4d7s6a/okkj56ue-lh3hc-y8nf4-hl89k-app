import { useQuery } from '@tanstack/react-query'
import { getRaceRules } from '../../api/raceRules.api'

/** Loads and caches the current team's rules text for one race. */
export const useRaceRulesQuery = (raceId?: string) =>
  useQuery({
    queryKey: ['race-rules', raceId],
    queryFn: ({ signal }) => getRaceRules(raceId ?? '', signal),
    enabled: Boolean(raceId),
    retry: false,
  })