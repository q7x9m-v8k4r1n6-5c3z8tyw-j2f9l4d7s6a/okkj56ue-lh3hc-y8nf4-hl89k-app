import { useEffect, useRef } from 'react'
import * as signalR from '@microsoft/signalr'
import { getAuthToken } from '@/core/shared/api'

type UseBoothSignalRProps = {
  boothId?: string
  onBoothStatusChanged: () => void
}

/** Uses realtime only to invalidate the database-backed booth session query. */
export const useBoothSignalR = ({
  boothId,
  onBoothStatusChanged,
}: UseBoothSignalRProps) => {
  const callbackRef = useRef(onBoothStatusChanged)

  useEffect(() => {
    callbackRef.current = onBoothStatusChanged
  }, [onBoothStatusChanged])

  useEffect(() => {
    if (!boothId) return

    const connection = new signalR.HubConnectionBuilder()
      .withUrl(`${import.meta.env.VITE_API_BASE_URL || ''}/hubs/booth`, {
        accessTokenFactory: () => getAuthToken() ?? '',
      })
      .withAutomaticReconnect()
      .build()

    const joinBoothGroup = async () => {
      await connection.invoke('JoinBoothGroup', boothId)
      callbackRef.current()
    }

    connection.on(
      'ReceiveBoothStatusChanged',
      (changedBoothId: string) => {
        if (changedBoothId.toLowerCase() === boothId.toLowerCase()) {
          callbackRef.current()
        }
      },
    )

    connection.onreconnected(() => {
      void joinBoothGroup()
    })

    connection
      .start()
      .then(joinBoothGroup)
      .catch((error: unknown) =>
        console.error('Không thể kết nối Booth Hub:', error))

    return () => {
      if (connection.state === signalR.HubConnectionState.Connected) {
        connection.invoke('LeaveBoothGroup', boothId).catch(() => {})
      }
      connection.off('ReceiveBoothStatusChanged')
      void connection.stop()
    }
  }, [boothId])
}
