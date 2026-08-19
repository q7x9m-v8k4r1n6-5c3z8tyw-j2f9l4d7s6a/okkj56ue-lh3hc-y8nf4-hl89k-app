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
  onBoothCompleted: (boothId: string, boothName: string, score: number) => void
  onEntryRejected: (boothId: string) => void
  onSessionAccepted: (boothId: string) => void
  onSessionCancelled: (boothId: string) => void
}

/** Keeps the QR workflow aware when an organizer rejects or kicks the team. */
export const useTeamBoothSignalR = ({
  activeBoothId,
  raceId,
  teamId,
  onBoothCompleted,
  onEntryRejected,
  onSessionAccepted,
  onSessionCancelled,
}: UseTeamBoothSignalRProps) => {
  const queryClient = useQueryClient()
  const activeBoothIdRef = useRef(activeBoothId)
  const callbackRef = useRef(onSessionCancelled)
  const acceptedCallbackRef = useRef(onSessionAccepted)
  const completedCallbackRef = useRef(onBoothCompleted)
  const rejectedCallbackRef = useRef(onEntryRejected)

  useEffect(() => {
    activeBoothIdRef.current = activeBoothId
  }, [activeBoothId])

  useEffect(() => {
    callbackRef.current = onSessionCancelled
  }, [onSessionCancelled])

  useEffect(() => {
    acceptedCallbackRef.current = onSessionAccepted
  }, [onSessionAccepted])

  useEffect(() => {
    completedCallbackRef.current = onBoothCompleted
  }, [onBoothCompleted])

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
      getActiveBoothId: () => activeBoothIdRef.current,
      onBoothCompleted: (boothId, boothName, score) => {
        void invalidateTeamBoothSession(queryClient, raceId)
        completedCallbackRef.current(boothId, boothName, score)
      },
      onBoothStatusChanged: (_boothId, status) => {
        void invalidateTeamBoothSession(queryClient, raceId)
        const parsedStatus = boothStatusSchema.safeParse(status)
        if (parsedStatus.data === 'occupied') {
          acceptedCallbackRef.current(_boothId)
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
