import { useCallback, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useOrganizerJoinRequestsState } from '../../model/frontend/useOrganizerJoinRequestsState'
import { mapScoringFormToRequest } from '../../model/mapScoringFormToRequest'
import { useAcceptEntryMutation } from '../../model/server/useAcceptEntryMutation'
import { useBoothSignalR } from '../../model/server/useBoothSignalR'
import { useCancelBoothSessionMutation } from '../../model/server/useCancelBoothSessionMutation'
import { useMyBoothQuery } from '../../model/server/useMyBoothQuery'
import { useRejectEntryMutation } from '../../model/server/useRejectEntryMutation'
import { useSubmitScoreMutation } from '../../model/server/useSubmitScoreMutation'

const getErrorMessage = (error: unknown) => {
  if (error instanceof Error) return error.message
  if (typeof error === 'object' && error && 'message' in error) {
    return String((error as { message?: unknown }).message ?? '')
  }

  return 'Không thể thực hiện thao tác. Vui lòng thử lại.'
}

/**
 * Exposes the organizer join-request view-model connected with Realtime & API Mutation.
 * Reads raceId from the route itself instead of receiving it as a prop.
 */
export const useOrganizerJoinRequests = () => {
  const { raceId } = useParams<{ raceId: string }>()
  const state = useOrganizerJoinRequestsState()
  const myBoothQuery = useMyBoothQuery(raceId)
  const {
    data: myBooth,
    error: myBoothError,
    isPending: isMyBoothLoading,
    refetch: refetchMyBooth,
  } = myBoothQuery
  const { syncBoothSession } = state
  const acceptEntryMutation = useAcceptEntryMutation()
  const cancelSessionMutation = useCancelBoothSessionMutation()
  const rejectEntryMutation = useRejectEntryMutation()
  const submitScoreMutation = useSubmitScoreMutation()
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    if (myBooth) {
      syncBoothSession(myBooth)
    }
  }, [myBooth, syncBoothSession])

  const refreshBoothSession = useCallback(() => {
    void refetchMyBooth()
  }, [refetchMyBooth])

  useBoothSignalR({
    boothId: myBooth?.boothId,
    onBoothStatusChanged: refreshBoothSession,
  })

  const acceptRequest = async () => {
    if (!state.request) return

    setErrorMessage('')
    try {
      await acceptEntryMutation.mutateAsync({
        boothId: state.request.boothId,
        teamId: state.request.id,
      })
      await refetchMyBooth()
    } catch (error) {
      setErrorMessage(getErrorMessage(error))
    }
  }

  const rejectRequest = async () => {
    if (!state.request) return

    setErrorMessage('')
    try {
      await rejectEntryMutation.mutateAsync({
        boothId: state.request.boothId,
        teamId: state.request.id,
      })
      await refetchMyBooth()
    } catch (error) {
      setErrorMessage(getErrorMessage(error))
    }
  }

  const submitScore = async () => {
    if (!state.acceptedRequest || !state.canSubmitScore) return

    setErrorMessage('')
    try {
      const payload = mapScoringFormToRequest(
        state.acceptedRequest.boothId,
        state.acceptedRequest.id,
        {
          selectedScore: state.normalizedScore,
          commentInput: '',
        },
      )

      await submitScoreMutation.mutateAsync(payload)
      await refetchMyBooth()
    } catch (error) {
      setErrorMessage(getErrorMessage(error))
    }
  }

  const cancelSession = async () => {
    if (!state.acceptedRequest) return

    setErrorMessage('')
    try {
      await cancelSessionMutation.mutateAsync({
        boothId: state.acceptedRequest.boothId,
      })
      await refetchMyBooth()
    } catch (error) {
      state.dismissCancelConfirmation()
      setErrorMessage(getErrorMessage(error))
    }
  }

  return {
    ...state,
    acceptRequest,
    cancelSession,
    errorMessage: errorMessage || (
      myBoothError ? getErrorMessage(myBoothError) : ''
    ),
    isAccepting: acceptEntryMutation.isPending,
    isCancelling: cancelSessionMutation.isPending,
    isRejecting: rejectEntryMutation.isPending,
    isSubmitting: submitScoreMutation.isPending,
    isLoading: isMyBoothLoading,
    rejectRequest,
    submitScore,
  }
}
