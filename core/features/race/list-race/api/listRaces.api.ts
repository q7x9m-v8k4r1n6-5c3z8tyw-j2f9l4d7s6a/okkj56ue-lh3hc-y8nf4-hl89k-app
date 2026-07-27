import { client } from '@/core/shared/api'
import {
  listRacesRequestSchema,
  listRacesResponseSchema,
  type ListRacesRequest,
  type ListRacesResponse,
} from '../model/listRace.contract'

/** Fetches and runtime-validates one paginated race collection. */
export const listRaces = async (
  request: ListRacesRequest = {},
  signal?: AbortSignal,
): Promise<ListRacesResponse> => {
  const query = listRacesRequestSchema.parse(request)
  const response = await client.request<unknown>({
    path: '/Race',
    query,
    signal,
  })
  return listRacesResponseSchema.parse(response)
}
