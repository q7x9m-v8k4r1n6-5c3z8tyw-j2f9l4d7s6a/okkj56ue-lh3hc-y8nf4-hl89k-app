export const teamMapQueryKeys = {
  all: ['team-map'] as const,
  detail: (raceId?: string) => [...teamMapQueryKeys.all, 'detail', raceId] as const,
  booths: (raceId?: string) => [...teamMapQueryKeys.all, 'booths', raceId] as const,
  combined: (raceId?: string) => [...teamMapQueryKeys.all, 'combined', raceId] as const,
}
