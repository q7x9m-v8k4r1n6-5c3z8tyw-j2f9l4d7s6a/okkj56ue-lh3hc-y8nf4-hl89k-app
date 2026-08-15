export const teamAnnouncementHistoryQueryKeys = {
  all: ['team', 'announcement-history'] as const,
  list: (raceId: string) => [
    ...teamAnnouncementHistoryQueryKeys.all,
    raceId,
  ] as const,
}
