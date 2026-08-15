import { client } from '@/core/shared/api'
import {
  raceMapDetailResponseSchema,
  raceBoothListResponseSchema,
  updateBoothCoordinatesResponseSchema,
  type RaceMapDetailResponse,
  type RaceBoothItem,
  type UpdateBoothCoordinatesPayload,
  type UpdateBoothCoordinatesResponse,
} from '../model/buildMap.contract'

/**
 * Fetches race detail including booths and persisted map image URL.
 * Endpoint: GET /api/v1/Race/{raceId}
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
 * Fetches the full booth list with current coordinates and station metadata.
 * Endpoint: GET /api/v1/Race/booth-list?RaceId={raceId}
 */
export const getRaceBoothList = async (
  raceId: string,
  signal?: AbortSignal,
): Promise<RaceBoothItem[]> => {
  const response = await client.request<unknown>({
    path: '/Race/booth-list',
    query: { RaceId: raceId },
    signal,
  })
  return raceBoothListResponseSchema.parse(response)
}

/**
 * Uploads race map image to Azure Blob Storage (container 'race-map')
 * and persists the map image URL into the database.
 * Endpoint: POST /api/v1/Race/{raceId}/map
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

/**
 * Persists all booth coordinates to the database.
 * Endpoint: PUT /api/v1/Race/{raceId}/booths/coordinates
 */
export const updateBoothCoordinates = async (
  raceId: string,
  payload: UpdateBoothCoordinatesPayload,
): Promise<UpdateBoothCoordinatesResponse> => {
  const response = await client.request<unknown, UpdateBoothCoordinatesPayload>({
    path: `/Race/${raceId}/booths/coordinates`,
    method: 'PUT',
    body: payload,
  })
  return updateBoothCoordinatesResponseSchema.parse(response)
}
