import { useEffect } from 'react'
import * as signalR from '@microsoft/signalr'
import { useQueryClient } from '@tanstack/react-query'
import { getAuthToken } from '@/core/shared/api'
import { scoringLogHistoryQueryKeys } from './scoringLogHistory.queryKeys'
import { startScoringLogHistorySignalRSession } from './scoringLogHistorySignalRSession'

export const useScoringLogHistorySignalR = (raceId?: string) => {
  const queryClient = useQueryClient()

  useEffect(() => {
    if (!raceId) return

    const token = getAuthToken()
    if (!token) return

    const refreshHistory = () => {
      void queryClient.invalidateQueries({
        queryKey: scoringLogHistoryQueryKeys.race(raceId),
      })
    }
    const connection = new signalR.HubConnectionBuilder()
      .withUrl(`${import.meta.env.VITE_API_BASE_URL || ''}/hubs/booth`, {
        accessTokenFactory: () => getAuthToken() ?? '',
      })
      .withAutomaticReconnect()
      .build()

    return startScoringLogHistorySignalRSession({
      connection,
      onRaceScoreChanged: refreshHistory,
      onReconnected: refreshHistory,
      raceId,
    })
  }, [queryClient, raceId])
}
