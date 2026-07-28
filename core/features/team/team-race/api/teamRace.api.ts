import { client } from '@/core/shared/api'
import {
  teamRaceDetailResponseSchema,
  type TeamRaceDetailResponse,
} from '../model/teamRace.contract'

/** Fetches a race summary for team-facing access checks. */
export const getTeamRaceDetail = async (
  raceId: string,
  signal?: AbortSignal,
): Promise<TeamRaceDetailResponse> => {
  const response = await client.request<unknown>({
    path: `/Race/${encodeURIComponent(raceId)}`,
    signal,
  })

  return teamRaceDetailResponseSchema.parse(response)
}
