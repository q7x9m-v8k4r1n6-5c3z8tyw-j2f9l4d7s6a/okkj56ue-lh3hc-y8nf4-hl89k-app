import { useEffect, useRef } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import * as signalR from '@microsoft/signalr'
import { getAuthToken } from '@/core/shared/api'
import {
  raceMessageResponseSchema,
  type RaceMessageResponse,
} from '../sendMessage.schema'
import { sendMessageQueryKeys } from './sendMessage.queryKeys'

const upsertRaceMessage = (
  current: RaceMessageResponse[] | undefined,
  message: RaceMessageResponse,
) => [
  message,
  ...(current ?? []).filter((item) => item.id !== message.id),
]

export const useRaceMessageHistorySignalR = (raceId?: string) => {
  const queryClient = useQueryClient()
  const raceIdRef = useRef(raceId)

  useEffect(() => {
    raceIdRef.current = raceId
  }, [raceId])

  useEffect(() => {
    if (!raceId) return

    const connection = new signalR.HubConnectionBuilder()
      .withUrl(`${import.meta.env.VITE_API_BASE_URL || ''}/hubs/booth`, {
        accessTokenFactory: () => getAuthToken() ?? '',
      })
      .withAutomaticReconnect()
      .build()

    connection.on('ReceiveRaceMessage', (payload: unknown) => {
      const parsed = raceMessageResponseSchema.safeParse(payload)
      if (!parsed.success) return
      if (parsed.data.raceId !== raceIdRef.current) return

      queryClient.setQueryData<RaceMessageResponse[]>(
        sendMessageQueryKeys.messages(parsed.data.raceId),
        (current) => upsertRaceMessage(current, parsed.data),
      )
    })

    void connection
      .start()
      .then(() => connection.invoke('JoinRaceMessageHistoryGroup', raceId))
      .catch((error) => console.error('Lỗi kết nối realtime lịch sử tin nhắn:', error))

    return () => {
      if (connection.state === signalR.HubConnectionState.Connected) {
        void connection.invoke('LeaveRaceMessageHistoryGroup', raceId).catch(() => {})
      }

      connection.off('ReceiveRaceMessage')
      void connection.stop()
    }
  }, [queryClient, raceId])
}
