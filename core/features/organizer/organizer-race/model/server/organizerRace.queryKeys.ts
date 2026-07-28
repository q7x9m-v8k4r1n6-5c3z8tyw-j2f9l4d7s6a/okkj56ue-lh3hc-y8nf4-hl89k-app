export const organizerRaceQueryKeys = {
  all: ['organizer', 'race-detail'] as const,
  detail: (raceId?: string) => [
    ...organizerRaceQueryKeys.all,
    raceId ?? 'unknown',
  ] as const,
}
