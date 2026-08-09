import { client } from '@/core/shared/api'
import { raceRulesResponseSchema, type RaceRulesResponse } from '../model/raceRules.contract'

/**
 * Fetches the race rules for the current team, scoped to races the team
 * has actually been assigned to (enforced by the backend).
 */
export const getRaceRules = async (
  raceId: string,
  signal?: AbortSignal,
): Promise<RaceRulesResponse> => {
  const response = await client.request<unknown>({
    path: `/Race/${raceId}/rules`,
    signal,
  })

  return raceRulesResponseSchema.parse(response)
}