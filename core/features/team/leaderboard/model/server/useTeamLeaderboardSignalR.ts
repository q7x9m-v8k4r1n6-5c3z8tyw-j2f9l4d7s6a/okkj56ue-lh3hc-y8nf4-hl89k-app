import { useEffect } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import * as signalR from '@microsoft/signalr'
import { getAuthToken } from '@/core/shared/api'
import { teamLeaderboardQueryKeys } from './teamLeaderboard.queryKeys'
import { startTeamLeaderboardSignalRSession } from './teamLeaderboardSignalRSession'

/** Uses SignalR only as an invalidation signal; React Query owns server state. */
export const useTeamLeaderboardSignalR = (raceId?: string) => {
  const queryClient = useQueryClient()

  useEffect(() => {
    if (!raceId) return

    const refreshScoreData = () => {
      void queryClient.invalidateQueries({
        queryKey: teamLeaderboardQueryKeys.leaderboard(raceId),
      })
      void queryClient.invalidateQueries({
        queryKey: teamLeaderboardQueryKeys.history(raceId),
      })
    }
    const connection = new signalR.HubConnectionBuilder()
      .withUrl(`${import.meta.env.VITE_API_BASE_URL || ''}/hubs/booth`, {
        accessTokenFactory: () => getAuthToken() ?? '',
      })
      .withAutomaticReconnect()
      .build()

    return startTeamLeaderboardSignalRSession({
      connection,
      onRaceScoreChanged: refreshScoreData,
      onReconnected: refreshScoreData,
      raceId,
    })
  }, [queryClient, raceId])
}
