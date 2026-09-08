import { client } from '@/core/shared/api'
import {
  teamMapDetailResponseSchema,
  type TeamMapDetailResponse,
} from '../model/teamMap.contract'

/**
 * Fetches race details and stations for team map view via GET /Race/{raceId}.
 */
export const getTeamMapDetail = async (
  raceId: string,
  signal?: AbortSignal,
): Promise<TeamMapDetailResponse> => {
  if (!raceId.trim()) {
    throw new Error('Mã trận đấu không hợp lệ.')
  }

  const response = await client.request<unknown>({
    path: `/Race/${encodeURIComponent(raceId)}`,
    signal,
  })

  return teamMapDetailResponseSchema.parse(response)
}
