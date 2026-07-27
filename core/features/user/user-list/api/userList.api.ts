import { client } from '@/core/shared/api'
import {
  listOrganizersRequestSchema,
  listOrganizersResponseSchema,
  listTeamsRequestSchema,
  listTeamsResponseSchema,
  type ListOrganizersRequest,
  type ListOrganizersResponse,
  type ListTeamsRequest,
  type ListTeamsResponse,
} from '../model/userList.contract'

/** Fetches and validates one paginated team management list. */
export const listTeams = async (
  request: ListTeamsRequest = {},
  signal?: AbortSignal,
): Promise<ListTeamsResponse> => {
  const response = await client.request<unknown>({
    path: '/Team',
    query: listTeamsRequestSchema.parse(request),
    signal,
  })
  return listTeamsResponseSchema.parse(response)
}

/** Fetches and validates one paginated organizer management list. */
export const listOrganizers = async (
  request: ListOrganizersRequest = {},
  signal?: AbortSignal,
): Promise<ListOrganizersResponse> => {
  const response = await client.request<unknown>({
    path: '/Organizer',
    query: listOrganizersRequestSchema.parse(request),
    signal,
  })
  return listOrganizersResponseSchema.parse(response)
}

/** Deletes one managed team. */
export const deleteTeam = (teamId: string): Promise<void> =>
  client.request<void>({ path: `/Team/${teamId}`, method: 'DELETE' })

/** Deletes one managed organizer. */
export const deleteOrganizer = (organizerId: string): Promise<void> =>
  client.request<void>({
    path: `/Organizer/${organizerId}`,
    method: 'DELETE',
  })
