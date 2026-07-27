import { useQuery } from '@tanstack/react-query'
import { listOrganizers, listTeams } from '../../api/userList.api'
import type {
  ListOrganizersRequest,
  ListTeamsRequest,
} from '../userList.contract'
import { userListQueryKeys } from './userList.queryKeys'

/** Owns paginated team server state. */
export const useTeamListQuery = (
  request: ListTeamsRequest,
  enabled: boolean,
) => useQuery({
  queryKey: userListQueryKeys.teams(request),
  queryFn: ({ signal }) => listTeams(request, signal),
  enabled,
})

/** Owns paginated organizer server state. */
export const useOrganizerListQuery = (
  request: ListOrganizersRequest,
  enabled: boolean,
) => useQuery({
  queryKey: userListQueryKeys.organizers(request),
  queryFn: ({ signal }) => listOrganizers(request, signal),
  enabled,
})
