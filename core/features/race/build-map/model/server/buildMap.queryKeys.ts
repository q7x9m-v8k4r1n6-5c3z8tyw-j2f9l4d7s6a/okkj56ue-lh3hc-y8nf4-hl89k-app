export const buildMapQueryKeys = {
  all: ['build-map'] as const,
  detail: (raceId?: string) => ['build-map', 'detail', raceId] as const,
  booths: (raceId?: string) => ['build-map', 'booths', raceId] as const,
}
