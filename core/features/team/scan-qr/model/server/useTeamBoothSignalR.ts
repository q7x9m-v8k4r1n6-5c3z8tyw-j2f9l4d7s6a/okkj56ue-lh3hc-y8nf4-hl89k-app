import { useEffect, useRef } from 'react'
import * as signalR from '@microsoft/signalr'
import { getAuthToken } from '@/core/shared/api'
import { startTeamBoothSignalRSession } from './teamBoothSignalRSession'

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

    return startTeamBoothSignalRSession({
      connection,
      onEntryRejected: (boothId) => rejectedCallbackRef.current(boothId),
      onSessionCancelled: (boothId) => callbackRef.current(boothId),
      raceId,
      teamId,
    })
  }, [raceId, teamId])
}
