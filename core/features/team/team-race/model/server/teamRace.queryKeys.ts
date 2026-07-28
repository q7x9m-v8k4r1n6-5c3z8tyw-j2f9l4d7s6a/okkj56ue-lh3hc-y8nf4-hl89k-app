export const teamRaceQueryKeys = {
  all: ['team-race'] as const,
  detail: (raceId?: string) => (
    [...teamRaceQueryKeys.all, 'detail', raceId] as const
  ),
}
