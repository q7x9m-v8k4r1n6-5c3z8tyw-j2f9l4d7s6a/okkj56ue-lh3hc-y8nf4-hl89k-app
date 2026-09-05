export const scoringLogHistoryQueryKeys = {
  all: ['race', 'scoring-log-history'] as const,
  race: (raceId?: string) => [...scoringLogHistoryQueryKeys.all, raceId] as const,
  list: (raceId?: string, page?: number, pageSize?: number) =>
    [...scoringLogHistoryQueryKeys.race(raceId), page, pageSize] as const,
}
