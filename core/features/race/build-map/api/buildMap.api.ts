import { client } from '@/core/shared/api'
import {
  raceBoothsResponseSchema,
  raceMapDetailResponseSchema,
  uploadRaceMapResponseSchema,
  updateRaceMapSettingsPayloadSchema,
  type RaceBoothsResponse,
  type RaceMapDetailResponse,
  type UpdateBoothCoordinatesPayload,
  type UpdateRaceMapSettingsPayload,
  type UploadRaceMapResponse,
} from '../model/buildMap.contract'

/**
 * Fetches race details including the mapImageUrl.
 */
export const getRaceMapDetail = async (
  raceId: string,
  signal?: AbortSignal,
): Promise<RaceMapDetailResponse> => {
  if (!raceId.trim()) {
    throw new Error('Mã trận đấu không hợp lệ.')
  }
  const response = await client.request<unknown>({
    path: `/Race/${raceId}`,
    signal,
  })
  return raceMapDetailResponseSchema.parse(response)
}

/**
 * Fetches the list of stations/booths for the specified race.
 */
export const getRaceBooths = async (
  raceId: string,
  signal?: AbortSignal,
): Promise<RaceBoothsResponse> => {
  if (!raceId.trim()) {
    throw new Error('Mã trận đấu không hợp lệ.')
  }
  const response = await client.request<unknown>({
    path: '/Race/booth-list',
    query: { raceId },
    signal,
  })
  return raceBoothsResponseSchema.parse(response)
}

/**
 * Uploads a race map image file as multipart/form-data with field name `mapImage`.
 */
export const uploadRaceMap = async (
  raceId: string,
  file: File,
  signal?: AbortSignal,
): Promise<UploadRaceMapResponse> => {
  if (!raceId.trim()) {
    throw new Error('Mã trận đấu không hợp lệ.')
  }
  const formData = new FormData()
  formData.append('mapImage', file)

  const response = await client.request<unknown, FormData>({
    path: `/Race/${raceId}/map`,
    method: 'POST',
    body: formData,
    signal,
  })
  return uploadRaceMapResponseSchema.parse(response)
}

/**
 * Updates coordinates of booths for a race via PUT /Race/{raceId}/booths/coordinates.
 */
export const updateBoothCoordinates = async (
  raceId: string,
  payload: UpdateBoothCoordinatesPayload,
  signal?: AbortSignal,
): Promise<{ message?: string } | boolean> => {
  if (!raceId.trim()) {
    throw new Error('Mã trận đấu không hợp lệ.')
  }
  const response = await client.request<{ message?: string } | boolean, UpdateBoothCoordinatesPayload>({
    path: `/Race/${raceId}/booths/coordinates`,
    method: 'PUT',
    body: payload,
    signal,
  })
  return response
}

/**
 * Updates race map settings via PATCH /Race/{raceId}.
 */
export const updateRaceMapSettings = async (
  raceId: string,
  payload: UpdateRaceMapSettingsPayload,
  signal?: AbortSignal,
): Promise<RaceMapDetailResponse> => {
  if (!raceId.trim()) {
    throw new Error('Mã trận đấu không hợp lệ.')
  }
  const validatedPayload = updateRaceMapSettingsPayloadSchema.parse(payload)
  const formData = new FormData()
  formData.append('payload', JSON.stringify(validatedPayload))

  const response = await client.request<unknown, FormData>({
    path: `/Race/${raceId}`,
    method: 'PATCH',
    body: formData,
    signal,
  })
  return raceMapDetailResponseSchema.parse(response)
}
