import { client } from '@/core/shared/api/interceptor'
import type { RaceDetailModel } from '../model'
import { getSampleRaceDetail, isSampleRaceDataEnabled } from './sampleRaceData'

/**
 * API thuoc entities/race: lay du lieu goc cua mot Race.
 * Feature edit/detail se tai su dung ham nay thay vi tu tao request rieng.
 */
export const getRaceDetail = async (
  raceId: string,
  signal?: AbortSignal,
): Promise<RaceDetailModel> => {
  try {
    return await client.request<RaceDetailModel>({
      path: `/api/v1/Race/${raceId}`,
      signal,
    })
  } catch (error) {
    if (!isSampleRaceDataEnabled()) throw error

    // Du lieu mau tach rieng trong API layer, chi dung de xem UI khi backend chua chay.
    const sampleRace = getSampleRaceDetail(raceId)
    if (!sampleRace) throw error

    return sampleRace
  }
}
