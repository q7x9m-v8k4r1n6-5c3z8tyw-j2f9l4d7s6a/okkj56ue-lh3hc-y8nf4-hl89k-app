import { useCallback } from 'react'
import { useParams } from 'react-router-dom'
import { useMyBoothQuery } from '@/core/entities/booth'
import { useOrganizerJoinRequestsState } from '../../model/frontend/useOrganizerJoinRequestsState'
import { useBoothSignalR, type JoinRequestPayload } from '../../model/server/useBoothSignalR'

export const useOrganizerJoinRequests = () => {
  const { raceId } = useParams<{ raceId: string }>()
  const myBoothQuery = useMyBoothQuery(raceId)
  const boothId = myBoothQuery.data?.boothId

  const state = useOrganizerJoinRequestsState(boothId ?? '')

  const handleJoinRequestReceived = useCallback(
    (newRequest: JoinRequestPayload) => state.setRequest(newRequest),
    [state]
  )

  useBoothSignalR({ boothId, onJoinRequestReceived: handleJoinRequestReceived })

  return { ...state }
}