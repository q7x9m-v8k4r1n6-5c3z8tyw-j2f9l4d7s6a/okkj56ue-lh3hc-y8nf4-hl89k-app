import { client } from '@/core/shared/api'
import {
  editRaceDetailResponseSchema,
  editRaceRulesResponseSchema,
  type EditRaceDetailResponse,
  type EditRaceRulesResponse,
  type EditRaceRequest,
} from '../model/editRace.contract'

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

/** Fetches the race rules text, only reachable by an admin-permissioned actor. */
export const getRaceRules = async (
  raceId: string,
  signal?: AbortSignal,
): Promise<EditRaceRulesResponse> => {
  const response = await client.request<unknown>({
    path: `/Race/${raceId}/rules/admin`,
    signal,
  })
  return editRaceRulesResponseSchema.parse(response)
}

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