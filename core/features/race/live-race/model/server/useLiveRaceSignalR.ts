import { useEffect, useRef } from 'react'
import * as signalR from '@microsoft/signalr'
import { useQueryClient } from '@tanstack/react-query'
import { getAuthToken } from '@/core/shared/api'
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
      .withUrl(`${import.meta.env.VITE_API_BASE_URL || ''}/hubs/booth`, {
        accessTokenFactory: () => getAuthToken() ?? '',
      })
      .withAutomaticReconnect()
      .build()

    connection.on('ReceiveRaceScoreChanged', (changedRaceId: string) => {
      if (changedRaceId !== raceIdRef.current) return

      void queryClient.invalidateQueries({
        queryKey: liveRaceQueryKeys.all,
      })
    })

    connection.on('ReceiveBoothStatusChanged', () => {
      const currentRaceId = raceIdRef.current
      if (!currentRaceId) return

      void queryClient.invalidateQueries({
        queryKey: liveRaceQueryKeys.booths(currentRaceId),
      })
    })

    void connection
      .start()
      .then(() => connection.invoke('JoinRaceGroup', raceId))
      .catch((err) => console.error('Lỗi kết nối realtime live race:', err))

    return () => {
      if (connection.state === signalR.HubConnectionState.Connected) {
        void connection.invoke('LeaveRaceGroup', raceId).catch(() => {})
      }

      connection.off('ReceiveRaceScoreChanged')
      connection.off('ReceiveBoothStatusChanged')
      void connection.stop()
    }
  }, [queryClient, raceId])
}
