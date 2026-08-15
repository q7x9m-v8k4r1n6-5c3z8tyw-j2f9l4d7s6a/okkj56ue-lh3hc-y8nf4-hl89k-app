import { useQuery } from '@tanstack/react-query'
import { getMessageRecipients } from '../../api/sendMessageRecipients.api'
import { sendMessageQueryKeys } from './sendMessage.queryKeys'

/** Owns server state for message recipient options. */
export const useMessageRecipientsQuery = (raceId?: string) => useQuery({
  enabled: Boolean(raceId),
  queryKey: sendMessageQueryKeys.recipients(raceId),
  queryFn: ({ signal }) => getMessageRecipients(raceId ?? '', signal),
})
