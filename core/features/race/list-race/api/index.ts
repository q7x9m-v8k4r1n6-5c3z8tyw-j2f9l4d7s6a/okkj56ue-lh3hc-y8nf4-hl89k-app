import { client } from '@/core/shared/api/interceptor' 
import type { ListRacesRequestData, ListRacesResponse } from '@/core/features/race/list-race/models'

export const getAllListRaces = async (
  payload: ListRacesRequestData = {}, 
  signal?: AbortSignal
): Promise<ListRacesResponse> => {
  
  return client.request<ListRacesResponse, ListRacesRequestData>({
    path: '/Race',
    query: payload,
    signal,
  })
}
