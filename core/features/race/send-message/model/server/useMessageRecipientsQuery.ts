import { useQuery } from '@tanstack/react-query'
import { getMessageRecipients } from '../../api/sendMessageRecipients.api'
import { sendMessageQueryKeys } from './sendMessage.queryKeys'

/** Owns server state for message recipient options. */
export const useMessageRecipientsQuery = () => useQuery({
  queryKey: sendMessageQueryKeys.recipients,
  queryFn: ({ signal }) => getMessageRecipients(signal),
})
