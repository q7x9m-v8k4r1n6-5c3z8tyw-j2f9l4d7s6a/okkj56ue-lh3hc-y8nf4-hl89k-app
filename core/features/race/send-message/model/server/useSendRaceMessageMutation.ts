import { useMutation, useQueryClient } from '@tanstack/react-query'
import { sendRaceMessage } from '../../api/sendRaceMessage.api'
import type { SendRaceMessageRecipient } from '../sendMessage.schema'
import { sendMessageQueryKeys } from './sendMessage.queryKeys'

type SendRaceMessageVariables = {
  raceId: string
  recipients: SendRaceMessageRecipient[]
  body: string
}

export const useSendRaceMessageMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ raceId, recipients, body }: SendRaceMessageVariables) =>
      sendRaceMessage(raceId, { recipients, body }),
    onSuccess: (_, variables) => {
      void queryClient.invalidateQueries({
        queryKey: sendMessageQueryKeys.messages(variables.raceId),
      })
    },
  })
}
