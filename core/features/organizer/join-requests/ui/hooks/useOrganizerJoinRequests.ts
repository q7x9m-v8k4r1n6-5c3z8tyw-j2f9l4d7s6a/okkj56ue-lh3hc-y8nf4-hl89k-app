import { useCallback } from 'react'
import { useParams } from 'react-router-dom'
import { useOrganizerJoinRequestsState } from '../../model/frontend/useOrganizerJoinRequestsState'
import { useBoothSignalR, type JoinRequestPayload } from '../../model/server/useBoothSignalR'
import { useMyBoothQuery } from '../../model/server/useMyBoothQuery'

/**
 * Exposes the organizer join-request view-model connected with Realtime & API Mutation.
 * Reads raceId from the route itself instead of receiving it as a prop.
 */
export const useOrganizerJoinRequests = () => {
  const { raceId } = useParams<{ raceId: string }>()
  const myBoothQuery = useMyBoothQuery(raceId)
  const boothId = myBoothQuery.data ?? undefined

  const state = useOrganizerJoinRequestsState(boothId ?? '')

  const handleJoinRequestReceived = useCallback(
    (newRequest: JoinRequestPayload) => {
      state.setRequest(newRequest)
    },
    [state]
  )

  useBoothSignalR({
    boothId,
    onJoinRequestReceived: handleJoinRequestReceived,
  })

  return {
    ...state,
  }
}