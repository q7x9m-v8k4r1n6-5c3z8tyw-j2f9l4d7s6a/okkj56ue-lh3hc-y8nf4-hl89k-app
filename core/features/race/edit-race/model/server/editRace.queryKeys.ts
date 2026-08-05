/**
 * Query keys owned by edit-race.
 *
 * The root value follows the application cache convention without importing
 * another feature or the race entity.
 */
export const editRaceQueryKeys = {
  all: ['races'] as const,
  detail: (raceId?: string) =>
    [...editRaceQueryKeys.all, 'detail', raceId] as const,
  rules: (raceId?: string) =>
    [...editRaceQueryKeys.all, 'rules', raceId] as const,
}