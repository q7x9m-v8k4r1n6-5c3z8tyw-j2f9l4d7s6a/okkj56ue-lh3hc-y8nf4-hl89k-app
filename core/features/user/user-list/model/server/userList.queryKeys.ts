import type {
  ListOrganizersRequest,
  ListTeamsRequest,
} from '../userList.contract'

/** Query-key factory for user-list server state. */
export const userListQueryKeys = {
  all: ['users'] as const,
  teams: (request: ListTeamsRequest) =>
    [...userListQueryKeys.all, 'teams', request] as const,
  organizers: (request: ListOrganizersRequest) =>
    [...userListQueryKeys.all, 'organizers', request] as const,
}
