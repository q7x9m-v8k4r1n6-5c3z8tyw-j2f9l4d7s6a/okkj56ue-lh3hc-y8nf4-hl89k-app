import { useCallback, useEffect, useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { useParams } from 'react-router-dom'
import { invalidateMyBooth, useMyBoothQuery } from '@/core/entities/booth'
import { useToast } from '@/core/shared'
import { useOrganizerJoinRequestsState } from '../../model/frontend/useOrganizerJoinRequestsState'
import { getActionErrorMessage } from '../../model/getActionErrorMessage'
import { mapMyBoothToOrganizerSession } from '../../model/mapMyBoothToOrganizerSession'
import { useBoothSignalR } from '../../model/server/useBoothSignalR'
import { useOrganizerBoothSessionActions } from './useOrganizerBoothSessionActions'
import { useOrganizerJoinRequestActions } from './useOrganizerJoinRequestActions'

/** Composes booth server state with the organizer workflow's presentation state. */
export const useOrganizerJoinRequests = () => {
  const { raceId } = useParams<{ raceId: string }>()
  const queryClient = useQueryClient()
  const { toast } = useToast()
  const myBoothQuery = useMyBoothQuery(raceId)
  const state = useOrganizerJoinRequestsState()
  const [errorMessage, setErrorMessage] = useState('')
  const session = mapMyBoothToOrganizerSession(myBoothQuery.data)
  const { clearScore } = state
  const { refetch: refetchMyBooth } = myBoothQuery

  useEffect(() => {
    clearScore()
  }, [clearScore, session.acceptedRequest?.id])

  const invalidateBoothSession = useCallback(() => {
    void invalidateMyBooth(queryClient, raceId)
  }, [queryClient, raceId])

  const handleBoothStatusChanged = useCallback((
    status?: string,
    teamName?: string | null,
  ) => {
    invalidateBoothSession()
    if (status === 'pending') {
      toast({
        title: 'Có yêu cầu vào trạm',
        description: `${teamName || 'Một đội chơi'} đang chờ bạn xác nhận.`,
        variant: 'info',
      })
    }
  }, [invalidateBoothSession, toast])

  const retryBoothSession = useCallback(() => {
    setErrorMessage('')
    void refetchMyBooth()
  }, [refetchMyBooth])

  useBoothSignalR({
    boothId: myBoothQuery.data?.boothId,
    onBoothStatusChanged: handleBoothStatusChanged,
  })

  const requestActions = useOrganizerJoinRequestActions({
    raceId,
    request: session.request,
    setErrorMessage,
    showStatus: state.showStatus,
  })
  const sessionActions = useOrganizerBoothSessionActions({
    acceptedRequest: session.acceptedRequest,
    canSubmitScore: state.canSubmitScore,
    clearScore: state.clearScore,
    normalizedScore: state.normalizedScore,
    raceId,
    setErrorMessage,
    showStatus: state.showStatus,
  })

  return {
    ...state,
    ...session,
    ...requestActions,
    ...sessionActions,
    errorMessage: errorMessage || (
      myBoothQuery.error ? getActionErrorMessage(myBoothQuery.error) : ''
    ),
    hasLoadingError: myBoothQuery.isError,
    isLoading: myBoothQuery.isPending,
    isRetrying: myBoothQuery.isFetching,
    retryBoothSession,
  }
}
