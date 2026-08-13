import { client } from '@/core/shared/api'
import {
  teamBoothSessionSchema,
  type TeamBoothSession,
} from '../model/teamBoothSession'

/** Loads the current team's durable booth session for one race. */
export const getTeamBoothSession = async (
  raceId: string,
  signal?: AbortSignal,
): Promise<TeamBoothSession | null> => {
  const response = await client.request<unknown>({
    path: '/Team/my-session',
    method: 'GET',
    query: { raceId },
    signal,
  })

  return teamBoothSessionSchema.nullable().parse(response)
}
