import { useEffect, useRef } from 'react'
import * as signalR from '@microsoft/signalr'
import { getAuthToken } from '@/core/shared/api'
import {
  raceMessageNotificationSchema,
  type RaceMessageNotification,
} from '../raceMessageNotification.schema'

type UseRaceMessageSignalRProps = {
  raceId?: string
  onMessageReceived: (message: RaceMessageNotification) => void
}

export const useRaceMessageSignalR = ({
  raceId,
  onMessageReceived,
}: UseRaceMessageSignalRProps) => {
  const callbackRef = useRef(onMessageReceived)
  const raceIdRef = useRef(raceId)

  useEffect(() => {
    callbackRef.current = onMessageReceived
  }, [onMessageReceived])

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
      const parsed = raceMessageNotificationSchema.safeParse(payload)
      if (!parsed.success) return
      if (parsed.data.raceId !== raceIdRef.current) return

      callbackRef.current(parsed.data)
    })

    void connection
      .start()
      .then(() => connection.invoke('JoinRaceGroup', raceId))
      .catch((error) => console.error('Lỗi kết nối realtime tin nhắn:', error))

    return () => {
      if (connection.state === signalR.HubConnectionState.Connected) {
        void connection.invoke('LeaveRaceGroup', raceId).catch(() => {})
      }

      connection.off('ReceiveRaceMessage')
      void connection.stop()
    }
  }, [raceId])
}
