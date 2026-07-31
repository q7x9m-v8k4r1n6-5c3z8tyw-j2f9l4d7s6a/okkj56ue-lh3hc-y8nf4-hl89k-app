import { client } from '@/core/shared/api'
import {
  organizerRaceDetailResponseSchema,
  type OrganizerRaceDetailResponse,
} from '../model/organizerRace.contract'

/** Fetches a race summary for organizer-facing access checks. */
export const getOrganizerRaceDetail = async (
  raceId: string,
  signal?: AbortSignal,
): Promise<OrganizerRaceDetailResponse> => {
  const response = await client.request<unknown>({
    path: `/Race/${encodeURIComponent(raceId)}`,
    signal,
  })

  return organizerRaceDetailResponseSchema.parse(response)
}
