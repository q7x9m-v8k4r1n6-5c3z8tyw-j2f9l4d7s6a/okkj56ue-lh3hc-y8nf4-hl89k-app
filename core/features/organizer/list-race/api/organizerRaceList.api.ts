import { client } from '@/core/shared/api'
import {
  listOrganizerRacesRequestSchema,
  listOrganizerRacesResponseSchema,
  type ListOrganizerRacesRequest,
  type ListOrganizerRacesResponse,
} from '../model/organizerRaceList.contract'

/** Fetches and validates races visible to an organizer account. */
export const listOrganizerRaces = async (
  request: ListOrganizerRacesRequest = {},
  signal?: AbortSignal,
): Promise<ListOrganizerRacesResponse> => {
  const query = listOrganizerRacesRequestSchema.parse(request)
  const response = await client.request<unknown>({
    path: '/api/v1/Race',
    query,
    signal,
  })

  return listOrganizerRacesResponseSchema.parse(response)
}
