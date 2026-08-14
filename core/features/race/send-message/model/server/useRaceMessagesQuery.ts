import { useQuery } from '@tanstack/react-query'
import { getRaceMessages } from '../../api/sendRaceMessage.api'
import { sendMessageQueryKeys } from './sendMessage.queryKeys'

export const useRaceMessagesQuery = (raceId?: string) => useQuery({
  enabled: Boolean(raceId),
  queryKey: raceId
    ? sendMessageQueryKeys.messages(raceId)
    : ['race', 'send-message', 'missing-race-id'],
  queryFn: ({ signal }) => getRaceMessages(raceId ?? '', signal),
})
