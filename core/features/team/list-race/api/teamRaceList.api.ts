import { client } from '@/core/shared/api'
import {
  listTeamRacesRequestSchema,
  listTeamRacesResponseSchema,
  type ListTeamRacesRequest,
  type ListTeamRacesResponse,
} from '../model/teamRaceList.contract'

/** Fetches and validates races visible to a team account. */
export const listTeamRaces = async (
  request: ListTeamRacesRequest = {},
  signal?: AbortSignal,
): Promise<ListTeamRacesResponse> => {
  const query = listTeamRacesRequestSchema.parse(request)
  const response = await client.request<unknown>({
    path: '/api/v1/Race',
    query,
    signal,
  })
  return listTeamRacesResponseSchema.parse(response)
}
