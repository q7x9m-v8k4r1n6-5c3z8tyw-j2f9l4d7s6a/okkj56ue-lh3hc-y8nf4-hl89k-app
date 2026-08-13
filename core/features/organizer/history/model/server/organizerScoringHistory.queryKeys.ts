export const organizerScoringHistoryQueryKeys = {
  all: ['organizer', 'scoring-history'] as const,
  list: (raceId?: string, page?: number, pageSize?: number) =>
    [...organizerScoringHistoryQueryKeys.all, raceId, page, pageSize] as const,
}
