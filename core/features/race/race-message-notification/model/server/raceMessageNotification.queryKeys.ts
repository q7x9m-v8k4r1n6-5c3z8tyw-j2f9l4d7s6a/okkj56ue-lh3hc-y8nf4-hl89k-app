export const raceMessageNotificationQueryKeys = {
  all: ['race', 'message-notification'] as const,
  history: (raceId?: string) =>
    [...raceMessageNotificationQueryKeys.all, raceId, 'history'] as const,
}
