import { client } from '@/core/shared/api/interceptor'
import type { EditRaceDetailResponse, EditRaceRequest } from '../models'

export const getRaceDetail = async (raceId: string, signal?: AbortSignal): Promise<EditRaceDetailResponse> => {
  return client.request<EditRaceDetailResponse>({
    path: `/Race/${raceId}`,
    signal,
  })
}

export const updateRace = async (raceId: string, payload: EditRaceRequest): Promise<EditRaceDetailResponse> => {
  return client.request<EditRaceDetailResponse, EditRaceRequest>({
    path: `/Race/${raceId}`,
    method: 'PUT',
    body: payload,
  })
}
