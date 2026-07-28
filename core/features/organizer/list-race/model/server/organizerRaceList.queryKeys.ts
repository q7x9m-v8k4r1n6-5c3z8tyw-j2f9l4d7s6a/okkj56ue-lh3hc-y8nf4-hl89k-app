import type { ListOrganizerRacesRequest } from '../organizerRaceList.contract'

export const organizerRaceListQueryKeys = {
  all: ['organizer', 'race-list'] as const,
  list: (request: ListOrganizerRacesRequest = {}) => [
    ...organizerRaceListQueryKeys.all,
    request,
  ] as const,
}
