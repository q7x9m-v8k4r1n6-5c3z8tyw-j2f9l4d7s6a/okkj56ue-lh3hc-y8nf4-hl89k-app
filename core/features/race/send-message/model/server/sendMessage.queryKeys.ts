export const sendMessageQueryKeys = {
  recipients: (raceId?: string) =>
    ['race', 'send-message', raceId, 'recipients'] as const,
  messages: (raceId: string) => ['race', 'send-message', raceId, 'messages'] as const,
}
