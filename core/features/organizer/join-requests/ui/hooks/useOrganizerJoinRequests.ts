import { useCallback } from 'react'
import { useOrganizerJoinRequestsState } from '../../model/frontend/useOrganizerJoinRequestsState'
import { useSubmitScoreMutation } from '../../model/server/useSubmitScoreMutation'
import { useBoothSignalR, type JoinRequestPayload } from '../../model/server/useBoothSignalR'
import { mapScoringFormToRequest } from '../../model/mapScoringFormToRequest'

interface UseOrganizerJoinRequestsProps {
  boothId?: string
}

/**
 * Exposes the organizer join-request view-model connected with Realtime & API Mutation.
 */
export const useOrganizerJoinRequests = ({ boothId }: UseOrganizerJoinRequestsProps = {}) => {
  const state = useOrganizerJoinRequestsState()
  const submitScoreMutation = useSubmitScoreMutation()

  //Kết nối tín hiệu Realtime từ SignalR
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

  const handleSubmitScore = () => {
    if (!state.canSubmitScore || !state.acceptedRequest) return

    if (!boothId) {
      state.submitScore()
      return
    }

    try {
      const payload = mapScoringFormToRequest(boothId, state.acceptedRequest.id, {
        selectedScore: Number(state.score),
        commentInput: '',
      })

      submitScoreMutation.mutate(payload, {
        onSuccess: () => {
          state.submitScore()
        },
        onError: (error) => {
          console.error('❌ Chấm điểm thất bại:', error)
        },
      })
    } catch (error) {
      console.error('❌ Lỗi đóng gói dữ liệu:', error)
    }
  }

  return {
    ...state,
    submitScore: handleSubmitScore,
    isSubmitting: submitScoreMutation.isPending,
    isSubmitError: submitScoreMutation.isError,
  }
}