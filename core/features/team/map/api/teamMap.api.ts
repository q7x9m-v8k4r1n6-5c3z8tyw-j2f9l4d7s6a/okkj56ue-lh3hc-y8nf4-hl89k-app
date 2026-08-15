import { client } from '@/core/shared/api'
import {
  teamRaceMapDetailSchema,
  teamMapBoothListResponseSchema,
  type TeamMapRaceDetail,
  type TeamMapBoothItem,
} from '../model/teamMap.contract'

/**
 * Fetches race detail (including mapImageUrl, name, status) for the team map view.
 * Endpoint: GET /api/v1/Race/{raceId}
 */
export const getTeamRaceMapDetail = async (
  raceId: string,
  signal?: AbortSignal,
): Promise<TeamMapRaceDetail> => {
  const response = await client.request<unknown>({
    path: `/Race/${encodeURIComponent(raceId)}`,
    signal,
  })
  return teamRaceMapDetailSchema.parse(response)
}

/**
 * Fetches the booth list with placement coordinates for the team map view.
 * Endpoint: GET /api/v1/Race/booth-list?RaceId={raceId}
 */
export const getTeamBoothList = async (
  raceId: string,
  signal?: AbortSignal,
): Promise<TeamMapBoothItem[]> => {
  const response = await client.request<unknown>({
    path: '/Race/booth-list',
    query: { RaceId: raceId },
    signal,
  })
  return teamMapBoothListResponseSchema.parse(response)
}
