import { client } from '@/core/shared/api/interceptor' 
import { getSampleRaceList, isSampleRaceDataEnabled } from '@/core/entities/race/api/sampleRaceData'
import type { ListRacesRequestData, ListRacesResponse } from '@/core/features/race/list-race/models'

export const getAllListRaces = async (
  payload: ListRacesRequestData = {}, 
  signal?: AbortSignal
): Promise<ListRacesResponse> => {
  try {
    return await client.request<ListRacesResponse, ListRacesRequestData>({
      path: '/api/v1/Race', 
      query: payload,
      signal,
    })
  } catch (error) {
    if (!isSampleRaceDataEnabled()) throw error

    // Du lieu mau nam rieng trong API layer de khong tron vao UI/page.
    return getSampleRaceList()
  }
}
