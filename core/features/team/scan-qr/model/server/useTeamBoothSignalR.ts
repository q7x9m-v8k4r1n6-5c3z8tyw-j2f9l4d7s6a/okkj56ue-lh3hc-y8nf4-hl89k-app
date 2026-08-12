import { useEffect, useRef } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import * as signalR from '@microsoft/signalr'
import {
  boothStatusSchema,
  invalidateTeamBoothSession,
} from '@/core/entities/booth'
import { getAuthToken } from '@/core/shared/api'
import { startTeamBoothSignalRSession } from './teamBoothSignalRSession'

type UseTeamBoothSignalRProps = {
  activeBoothId?: string
  raceId?: string
  teamId?: string
  onEntryRejected: (boothId: string) => void
  onSessionCancelled: (boothId: string) => void
  onSessionReleased: () => void
}

/** Keeps the QR workflow aware when an organizer rejects or kicks the team. */
export const useTeamBoothSignalR = ({
  activeBoothId,
  raceId,
  teamId,
  onEntryRejected,
  onSessionCancelled,
  onSessionReleased,
}: UseTeamBoothSignalRProps) => {
  const queryClient = useQueryClient()
  const activeBoothIdRef = useRef(activeBoothId)
  const callbackRef = useRef(onSessionCancelled)
  const rejectedCallbackRef = useRef(onEntryRejected)
  const releasedCallbackRef = useRef(onSessionReleased)

  useEffect(() => {
    activeBoothIdRef.current = activeBoothId
  }, [activeBoothId])

  useEffect(() => {
    callbackRef.current = onSessionCancelled
  }, [onSessionCancelled])

  useEffect(() => {
    rejectedCallbackRef.current = onEntryRejected
  }, [onEntryRejected])

  useEffect(() => {
    releasedCallbackRef.current = onSessionReleased
  }, [onSessionReleased])

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
      getActiveBoothId: () => activeBoothIdRef.current,
      onBoothStatusChanged: (_boothId, status) => {
        void invalidateTeamBoothSession(queryClient, raceId)
        const parsedStatus = boothStatusSchema.safeParse(status)
        if (parsedStatus.data === 'free') {
          releasedCallbackRef.current()
        }
      },
      onEntryRejected: (boothId) => {
        void invalidateTeamBoothSession(queryClient, raceId)
        rejectedCallbackRef.current(boothId)
      },
      onReconnected: () => {
        void invalidateTeamBoothSession(queryClient, raceId)
      },
      onSessionCancelled: (boothId) => {
        void invalidateTeamBoothSession(queryClient, raceId)
        callbackRef.current(boothId)
      },
      raceId,
      teamId,
    })
  }, [queryClient, raceId, teamId])
}
