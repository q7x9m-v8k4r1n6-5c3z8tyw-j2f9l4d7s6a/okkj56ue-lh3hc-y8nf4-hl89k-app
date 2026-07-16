import { client } from '@/core/shared/api/interceptor'
import type { RaceDetailModel } from '@/core/entities/race'
import type { BackendCreateRaceRequest } from '../../create-race/helpers/mapToBackendRequest'

/**
 * API thuoc feature edit-race: cap nhat Race da ton tai.
 * Chi feature edit moi can lenh PUT, nen khong dat ham nay vao shared.
 */
export const updateRace = async (
  raceId: string,
  payload: BackendCreateRaceRequest,
): Promise<RaceDetailModel> => {
  return client.request<RaceDetailModel, BackendCreateRaceRequest>({
    path: `/api/v1/Race/${raceId}`,
    method: 'PUT',
    body: payload,
  })
}
