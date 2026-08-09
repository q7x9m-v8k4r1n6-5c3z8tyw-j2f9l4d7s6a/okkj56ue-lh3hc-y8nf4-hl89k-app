import { useEffect, useRef } from 'react'
import * as signalR from '@microsoft/signalr'
import { getAuthToken } from '@/core/shared/api'

export interface JoinRequestPayload {
  id: string
  teamName: string
}

interface UseBoothSignalRProps {
  boothId?: string
  onJoinRequestReceived: (data: JoinRequestPayload) => void
}

export const useBoothSignalR = ({
  boothId,
  onJoinRequestReceived,
}: UseBoothSignalRProps) => {
  const callbackRef = useRef(onJoinRequestReceived)

  useEffect(() => {
    callbackRef.current = onJoinRequestReceived
  }, [onJoinRequestReceived])

  useEffect(() => {
    if (!boothId) return

    const connection = new signalR.HubConnectionBuilder()
      .withUrl(`${import.meta.env.VITE_API_BASE_URL || ''}/hubs/booth`, {
        accessTokenFactory: () => getAuthToken() ?? '',
      })
      .withAutomaticReconnect()
      .build()

    connection.on(
      'ReceiveBoothStatusChanged',
      (changedBoothId: string, status: string, teamId: string | null, teamName: string | null) => {
        console.log('⚡ [SignalR] Nhận tín hiệu đổi trạng thái trạm:', {
          changedBoothId,
          status,
          teamId,
          teamName,
        })

        if (changedBoothId === boothId && status === 'pending' && teamId) {
          callbackRef.current({
            id: teamId,
            teamName: teamName ?? 'Đội chưa xác định',
          })
        }
      }
    )

    connection
      .start()
      .then(() => {
        console.log(`🔌 [SignalR] Kết nối thành công! Đang tham gia: Booth_${boothId}`)
        return connection.invoke('JoinBoothGroup', boothId)
      })
      .catch((err) => console.error('❌ Lỗi kết nối SignalR Hub:', err))

    return () => {
      if (connection.state === signalR.HubConnectionState.Connected) {
        connection.invoke('LeaveBoothGroup', boothId).catch(() => {})
      }
      connection.off('ReceiveBoothStatusChanged')
      connection.stop()
    }
  }, [boothId])
}
