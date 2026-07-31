import { useEffect, useRef } from 'react'
import * as signalR from '@microsoft/signalr'
import { useQueryClient } from '@tanstack/react-query'
import { liveRaceQueryKeys } from './liveRace.queryKeys'

interface UseLiveRaceSignalRProps {
  raceId?: string
}

export const useLiveRaceSignalR = ({ raceId }: UseLiveRaceSignalRProps) => {
  const queryClient = useQueryClient()
  const raceIdRef = useRef(raceId)

  useEffect(() => {
    raceIdRef.current = raceId
  }, [raceId])

  useEffect(() => {
    if (!raceId) return

    const connection = new signalR.HubConnectionBuilder()
      .withUrl(`${import.meta.env.VITE_API_BASE_URL || ''}/hubs/booth`)
      .withAutomaticReconnect()
      .build()

    connection.on('ReceiveRaceScoreChanged', (changedRaceId: string) => {
      if (changedRaceId !== raceIdRef.current) return

      void queryClient.invalidateQueries({
        queryKey: liveRaceQueryKeys.all,
      })
    })

    void connection
      .start()
      .then(() => connection.invoke('JoinRaceGroup', raceId))
      .catch((err) => console.error('Lỗi kết nối realtime điểm:', err))

    return () => {
      if (connection.state === signalR.HubConnectionState.Connected) {
        void connection.invoke('LeaveRaceGroup', raceId).catch(() => {})
      }

      connection.off('ReceiveRaceScoreChanged')
      void connection.stop()
    }
  }, [queryClient, raceId])
}
