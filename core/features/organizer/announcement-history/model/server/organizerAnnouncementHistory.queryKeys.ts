export const organizerAnnouncementHistoryQueryKeys = {
  all: ['organizer', 'announcement-history'] as const,
  list: (raceId: string) => [
    ...organizerAnnouncementHistoryQueryKeys.all,
    raceId,
  ] as const,
}
