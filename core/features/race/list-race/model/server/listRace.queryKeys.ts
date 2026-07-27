import type { ListRacesRequest } from '../listRace.contract'

/** Query-key factory owned by the list-race server model. */
export const listRaceQueryKeys = {
  all: ['races'] as const,
  list: (request: ListRacesRequest) =>
    [...listRaceQueryKeys.all, 'list', request] as const,
}
