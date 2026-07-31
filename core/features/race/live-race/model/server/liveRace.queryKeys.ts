export const liveRaceQueryKeys = {
  all: ['live-race'] as const,
  leaderboard: (raceId?: string) =>
    [...liveRaceQueryKeys.all, 'leaderboard', raceId] as const,
  booths: (raceId?: string) =>
    [...liveRaceQueryKeys.all, 'booths', raceId] as const,
  logs: (raceId?: string, page?: number, pageSize?: number) =>
    [...liveRaceQueryKeys.all, 'logs', raceId, page, pageSize] as const,
}