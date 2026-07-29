import { useEffect } from 'react'
import * as signalR from '@microsoft/signalr'

export interface JoinRequestPayload {
  id: string
  teamName: string
}

interface UseBoothSignalRProps {
  boothId?: string
  /** Callback được gọi khi có đội thi quét QR vào trạm */
  onJoinRequestReceived: (data: JoinRequestPayload) => void
}

export const useBoothSignalR = ({
  boothId,
  onJoinRequestReceived,
}: UseBoothSignalRProps) => {
  useEffect(() => {
    if (!boothId) return

    // Thiết lập đường truyền SignalR Hub với Backend C#
    const connection = new signalR.HubConnectionBuilder()
      .withUrl(`${import.meta.env.VITE_API_URL || ''}/hubs/booth`)
      .withAutomaticReconnect()
      .build()

    // Lắng nghe tín hiệu Realtime khi đội quét QR
    connection.on('TeamJoinedStation', (data: JoinRequestPayload) => {
      console.log('⚡ [SignalR] Nhận yêu cầu vào trạm từ đội:', data)
      onJoinRequestReceived(data)
    })

    connection.start().catch((err) => console.error('❌ Lỗi kết nối SignalR Hub:', err))

    return () => {
      connection.off('TeamJoinedStation')
      connection.stop()
    }
  }, [boothId, onJoinRequestReceived])
}