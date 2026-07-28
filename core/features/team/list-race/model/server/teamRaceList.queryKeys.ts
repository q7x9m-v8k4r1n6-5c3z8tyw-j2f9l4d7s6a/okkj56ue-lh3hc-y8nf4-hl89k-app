import type { ListTeamRacesRequest } from '../teamRaceList.contract'

export const teamRaceListQueryKeys = {
  all: ['team-races'] as const,
  list: (request: ListTeamRacesRequest) => (
    [...teamRaceListQueryKeys.all, 'list', request] as const
  ),
}
