import { client } from '@/core/shared/api'
import {
  raceMessageResponseSchema,
  sendRaceMessageRecipientSchema,
  type RaceMessageResponse,
  type SendRaceMessageRecipient,
} from '../model/sendMessage.schema'

type SendRaceMessagePayload = {
  recipients: SendRaceMessageRecipient[]
  body: string
  senderName?: string
}

export const getRaceMessages = async (
  raceId: string,
  signal?: AbortSignal,
): Promise<RaceMessageResponse[]> => {
  const response = await client.request<unknown[]>({
    path: `/Race/${raceId}/messages`,
    query: { limit: 50 },
    signal,
  })

  return response.map((message) => raceMessageResponseSchema.parse(message))
}

export const sendRaceMessage = async (
  raceId: string,
  payload: SendRaceMessagePayload,
): Promise<RaceMessageResponse> => {
  const recipients = payload.recipients.map((recipient) =>
    sendRaceMessageRecipientSchema.parse(recipient),
  )
  const response = await client.request<unknown, SendRaceMessagePayload>({
    path: `/Race/${raceId}/messages`,
    method: 'POST',
    body: {
      recipients,
      body: payload.body,
      senderName: payload.senderName,
    },
  })

  return raceMessageResponseSchema.parse(response)
}
