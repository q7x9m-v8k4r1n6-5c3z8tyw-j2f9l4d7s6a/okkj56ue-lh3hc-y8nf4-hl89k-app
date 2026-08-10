import { useEffect, useRef } from 'react'
import * as signalR from '@microsoft/signalr'
import { getAuthToken } from '@/core/shared/api'
import { mapBoothStatusToJoinRequest } from '../mapBoothStatusToJoinRequest'
import type { OrganizerJoinRequest } from '../organizerJoinRequest'

interface UseBoothSignalRProps {
  boothIds: readonly string[]
  raceId?: string
  onJoinRequestReceived: (data: OrganizerJoinRequest) => void
}

/** Subscribes to race events and keeps only booths assigned to the organizer. */
export const useBoothSignalR = ({
  boothIds,
  raceId,
  onJoinRequestReceived,
}: UseBoothSignalRProps) => {
  const callbackRef = useRef(onJoinRequestReceived)
  const assignedBoothIdsRef = useRef<readonly string[]>(boothIds)

  useEffect(() => {
    callbackRef.current = onJoinRequestReceived
  }, [onJoinRequestReceived])

  useEffect(() => {
    assignedBoothIdsRef.current = boothIds
  }, [boothIds])

  useEffect(() => {
    if (!raceId) return

    const connection = new signalR.HubConnectionBuilder()
      .withUrl(`${import.meta.env.VITE_API_BASE_URL || ''}/hubs/booth`, {
        accessTokenFactory: () => getAuthToken() ?? '',
      })
      .withAutomaticReconnect()
      .build()

    const joinRaceGroup = () => connection.invoke('JoinRaceGroup', raceId)

    connection.on(
      'ReceiveBoothStatusChanged',
      (changedBoothId: string, status: string, teamId: string | null, teamName: string | null) => {
        const request = mapBoothStatusToJoinRequest(assignedBoothIdsRef.current, {
          boothId: changedBoothId,
          status,
          teamId,
          teamName,
        })

        if (request) callbackRef.current(request)
      }
    )

    connection.onreconnected(() => {
      void joinRaceGroup()
    })

    connection
      .start()
      .then(joinRaceGroup)
      .catch((error: unknown) => console.error('Không thể kết nối Booth Hub:', error))

    return () => {
      if (connection.state === signalR.HubConnectionState.Connected) {
        connection.invoke('LeaveRaceGroup', raceId).catch(() => {})
      }
      connection.off('ReceiveBoothStatusChanged')
      void connection.stop()
    }
  }, [raceId])
}
