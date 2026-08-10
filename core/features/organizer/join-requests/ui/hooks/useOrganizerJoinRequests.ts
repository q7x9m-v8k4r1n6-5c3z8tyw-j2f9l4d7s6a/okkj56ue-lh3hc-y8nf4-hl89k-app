import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { useOrganizerAssignedBooths } from '@/core/features/organizer/organizer-race'
import { useOrganizerJoinRequestsState } from '../../model/frontend/useOrganizerJoinRequestsState'
import { mapScoringFormToRequest } from '../../model/mapScoringFormToRequest'
import type { OrganizerJoinRequest } from '../../model/organizerJoinRequest'
import { useAcceptEntryMutation } from '../../model/server/useAcceptEntryMutation'
import { useBoothSignalR } from '../../model/server/useBoothSignalR'
import { useCancelBoothSessionMutation } from '../../model/server/useCancelBoothSessionMutation'
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
  const { boothIds } = useOrganizerAssignedBooths(raceId)

  const state = useOrganizerJoinRequestsState()
  const acceptEntryMutation = useAcceptEntryMutation()
  const cancelSessionMutation = useCancelBoothSessionMutation()
  const submitScoreMutation = useSubmitScoreMutation()
  const [errorMessage, setErrorMessage] = useState('')

  const handleJoinRequestReceived = (newRequest: OrganizerJoinRequest) => {
    setErrorMessage('')
    state.setRequest(newRequest)
  }

  useBoothSignalR({
    boothIds,
    raceId,
    onJoinRequestReceived: handleJoinRequestReceived,
  })

  const acceptRequest = async () => {
    if (!state.request) return

    setErrorMessage('')
    try {
      await acceptEntryMutation.mutateAsync({
        boothId: state.request.boothId,
        teamId: state.request.id,
      })
      state.acceptCurrentRequest()
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
      state.finishSession()
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
      state.finishSession()
    } catch (error) {
      state.dismissCancelConfirmation()
      setErrorMessage(getErrorMessage(error))
    }
  }

  return {
    ...state,
    acceptRequest,
    cancelSession,
    errorMessage,
    isAccepting: acceptEntryMutation.isPending,
    isCancelling: cancelSessionMutation.isPending,
    isSubmitting: submitScoreMutation.isPending,
    submitScore,
  }
}
