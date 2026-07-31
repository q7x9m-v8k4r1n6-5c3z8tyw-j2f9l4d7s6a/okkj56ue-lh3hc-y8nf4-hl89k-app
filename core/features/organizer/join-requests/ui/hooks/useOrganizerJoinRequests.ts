import { useCallback } from 'react'
import { useOrganizerJoinRequestsState } from '../../model/frontend/useOrganizerJoinRequestsState'
import { useBoothSignalR, type JoinRequestPayload } from '../../model/server/useBoothSignalR'

interface UseOrganizerJoinRequestsProps {
  boothId?: string
}

/**
 * Exposes the organizer join-request view-model connected with Realtime & API Mutation.
 */
export const useOrganizerJoinRequests = ({ boothId }: UseOrganizerJoinRequestsProps = {}) => {
  const state = useOrganizerJoinRequestsState(boothId ?? '')

  // Kết nối tín hiệu Realtime từ SignalR
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