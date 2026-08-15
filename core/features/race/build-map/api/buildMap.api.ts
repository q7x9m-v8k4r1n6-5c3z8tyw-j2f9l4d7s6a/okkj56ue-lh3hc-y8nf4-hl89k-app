import { client } from '@/core/shared/api'
import {
  raceMapDetailResponseSchema,
  type RaceMapDetailResponse,
} from '../model/buildMap.contract'

/**
 * Fetches race detail including booths and persisted map image URL.
 */
export const getRaceMapDetail = async (
  raceId: string,
  signal?: AbortSignal,
): Promise<RaceMapDetailResponse> => {
  const response = await client.request<unknown>({
    path: `/Race/${raceId}`,
    signal,
  })
  return raceMapDetailResponseSchema.parse(response)
}

/**
 * Uploads race map image to Azure Blob Storage (container 'race-map')
 * and persists the map image URL into the database.
 */
export const uploadAndSaveRaceMap = async (
  raceId: string,
  mapFile: File,
): Promise<{ mapImageUrl: string }> => {
  const formData = new FormData()
  formData.append('mapImage', mapFile)

  const response = await client.request<{ mapImageUrl: string }, FormData>({
    path: `/Race/${raceId}/map`,
    method: 'POST',
    body: formData,
  })
  
  return response
}

