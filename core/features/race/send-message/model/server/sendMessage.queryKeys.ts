export const sendMessageQueryKeys = {
  recipients: ['race', 'send-message', 'recipients'] as const,
  messages: (raceId: string) => ['race', 'send-message', raceId, 'messages'] as const,
}
