import { useEffect, useRef } from 'react'
import * as signalR from '@microsoft/signalr'
import { getAuthToken } from '@/core/shared/api'

type UseTeamBoothSignalRProps = {
  raceId?: string
  teamId?: string
  onEntryRejected: (boothId: string) => void
  onSessionCancelled: (boothId: string) => void
}

/** Keeps the QR workflow aware when an organizer rejects or kicks the team. */
export const useTeamBoothSignalR = ({
  raceId,
  teamId,
  onEntryRejected,
  onSessionCancelled,
}: UseTeamBoothSignalRProps) => {
  const callbackRef = useRef(onSessionCancelled)
  const rejectedCallbackRef = useRef(onEntryRejected)

  useEffect(() => {
    callbackRef.current = onSessionCancelled
  }, [onSessionCancelled])

  useEffect(() => {
    rejectedCallbackRef.current = onEntryRejected
  }, [onEntryRejected])

  useEffect(() => {
    if (!raceId || !teamId) return

    const connection = new signalR.HubConnectionBuilder()
      .withUrl(`${import.meta.env.VITE_API_BASE_URL || ''}/hubs/booth`, {
        accessTokenFactory: () => getAuthToken() ?? '',
      })
      .withAutomaticReconnect()
      .build()

    const joinRaceGroup = () => connection.invoke('JoinRaceGroup', raceId)

    connection.on(
      'ReceiveBoothEntryCancelled',
      (boothId: string, cancelledTeamId: string) => {
        if (cancelledTeamId.toLowerCase() === teamId.toLowerCase()) {
          callbackRef.current(boothId)
        }
      },
    )

    connection.on(
      'ReceiveBoothEntryRejected',
      (boothId: string, rejectedTeamId: string) => {
        if (rejectedTeamId.toLowerCase() === teamId.toLowerCase()) {
          rejectedCallbackRef.current(boothId)
        }
      },
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
      connection.off('ReceiveBoothEntryCancelled')
      connection.off('ReceiveBoothEntryRejected')
      void connection.stop()
    }
  }, [raceId, teamId])
}
