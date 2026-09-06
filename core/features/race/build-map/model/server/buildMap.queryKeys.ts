/**
 * Query keys owned by the build-map feature slice.
 */
export const buildMapQueryKeys = {
  all: ['race-build-map'] as const,
  mapDetail: (raceId?: string) =>
    [...buildMapQueryKeys.all, 'map-detail', raceId] as const,
  booths: (raceId?: string) =>
    [...buildMapQueryKeys.all, 'booths', raceId] as const,
}
