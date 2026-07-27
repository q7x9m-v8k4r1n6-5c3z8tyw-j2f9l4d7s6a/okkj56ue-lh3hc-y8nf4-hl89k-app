import { client } from '@/core/shared/api'
import {
  editRaceDetailResponseSchema,
  type EditRaceDetailResponse,
  type EditRaceRequest,
} from '../model/editRace.contract'

/**
 * Fetches the details of a specific race.
 * @param raceId The unique identifier of the race to retrieve
 * @param signal An optional AbortSignal to cancel the request if needed
 * @returns A promise resolving to the race details
 */
export const getRaceDetail = async (
  raceId: string,
  signal?: AbortSignal,
): Promise<EditRaceDetailResponse> => {
  const response = await client.request<unknown>({
    path: `/Race/${raceId}`,
    signal,
  })
  return editRaceDetailResponseSchema.parse(response)
}

/**
 * Updates the details of a specific race.
 * @param raceId The unique identifier of the race to update
 * @param payload The updated race information
 * @param coverImage The new cover image for the race
 * @returns A promise resolving to the updated race details
 */
export const patchRace = async (
  raceId: string,
  payload: EditRaceRequest,
  coverImage: File | null,
): Promise<EditRaceDetailResponse> => {
  const formData = new FormData()
  formData.append('payload', JSON.stringify(payload))
  if (coverImage) formData.append('coverImage', coverImage)

  const response = await client.request<unknown, FormData>({
    path: `/Race/${raceId}`,
    method: 'PATCH',
    body: formData,
  })
  return editRaceDetailResponseSchema.parse(response)
}
