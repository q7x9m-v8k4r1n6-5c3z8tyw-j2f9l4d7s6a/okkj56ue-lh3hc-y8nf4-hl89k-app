import { useEffect } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import * as signalR from '@microsoft/signalr'
import { getAuthToken } from '@/core/shared/api'
import type { TeamMapDetailResponse } from '../teamMap.contract'
import { teamMapQueryKeys } from './teamMap.queryKeys'
import { startTeamMapSignalRSession } from './teamMapSignalRSession'

const isSameId = (
  left?: string | number | null,
  right?: string | number | null,
) =>
  left != null &&
  right != null &&
  String(left).trim().toLowerCase() === String(right).trim().toLowerCase()

/**
 * Subscribes to realtime booth status changes via SignalR and updates React Query cache immediately.
 */
export const useTeamMapSignalR = (raceId?: string) => {
  const queryClient = useQueryClient()

  useEffect(() => {
    const normalizedRaceId = raceId?.trim()
    if (!normalizedRaceId) return

    const handleBoothStatusChanged = (boothId: string, newStatus: string) => {
      queryClient.setQueryData<TeamMapDetailResponse>(
        teamMapQueryKeys.detail(normalizedRaceId),
        (oldData) => {
          if (!oldData || !oldData.booth) return oldData
          const updatedBooth = oldData.booth.map((booth) =>
            isSameId(booth.id, boothId) || isSameId(booth.boothId, boothId)
              ? { ...booth, status: newStatus }
              : booth,
          )
          return {
            ...oldData,
            booth: updatedBooth,
          }
        },
      )

      void queryClient.invalidateQueries({
        queryKey: teamMapQueryKeys.detail(normalizedRaceId),
      })
    }

    const handleReconnected = () => {
      void queryClient.invalidateQueries({
        queryKey: teamMapQueryKeys.detail(normalizedRaceId),
      })
    }

    const connection = new signalR.HubConnectionBuilder()
      .withUrl(`${import.meta.env.VITE_API_BASE_URL || ''}/hubs/booth`, {
        accessTokenFactory: () => getAuthToken() ?? '',
      })
      .withAutomaticReconnect()
      .build()

    return startTeamMapSignalRSession({
      connection,
      onBoothStatusChanged: handleBoothStatusChanged,
      onReconnected: handleReconnected,
      raceId: normalizedRaceId,
    })
  }, [queryClient, raceId])
}
