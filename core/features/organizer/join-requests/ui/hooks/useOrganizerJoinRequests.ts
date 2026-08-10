import { useCallback, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useMyBoothQuery } from '@/core/entities/booth'
import { useConfirmDialog } from '@/core/shared'
import { useOrganizerJoinRequestsState } from '../../model/frontend/useOrganizerJoinRequestsState'
import { mapScoringFormToRequest } from '../../model/mapScoringFormToRequest'
import { useAcceptEntryMutation } from '../../model/server/useAcceptEntryMutation'
import { useBoothSignalR } from '../../model/server/useBoothSignalR'
import { useCancelBoothSessionMutation } from '../../model/server/useCancelBoothSessionMutation'
import { useRejectEntryMutation } from '../../model/server/useRejectEntryMutation'
import { useSubmitScoreMutation } from '../../model/server/useSubmitScoreMutation'

const getErrorMessage = (error: unknown) => {
  if (error instanceof Error) return error.message
  if (typeof error === 'object' && error && 'message' in error) {
    return String((error as { message?: unknown }).message ?? '')
  }

  return 'Không thể thực hiện thao tác. Vui lòng thử lại.'
}

/** Connects organizer UI state to booth queries, mutations, and realtime invalidation. */
export const useOrganizerJoinRequests = () => {
  const { raceId } = useParams<{ raceId: string }>()
  const { confirm } = useConfirmDialog()
  const state = useOrganizerJoinRequestsState()
  const myBoothQuery = useMyBoothQuery(raceId)
  const acceptEntryMutation = useAcceptEntryMutation()
  const cancelSessionMutation = useCancelBoothSessionMutation()
  const rejectEntryMutation = useRejectEntryMutation()
  const submitScoreMutation = useSubmitScoreMutation()
  const [errorMessage, setErrorMessage] = useState('')

  const { data: myBooth, refetch: refetchMyBooth } = myBoothQuery
  const { syncBoothSession } = state

  useEffect(() => {
    if (myBooth) syncBoothSession(myBooth)
  }, [myBooth, syncBoothSession])

  const refreshBoothSession = useCallback(() => {
    void refetchMyBooth()
  }, [refetchMyBooth])

  useBoothSignalR({
    boothId: myBooth?.boothId,
    onBoothStatusChanged: refreshBoothSession,
  })

  const acceptRequest = async () => {
    const request = state.request
    if (!request || acceptEntryMutation.isPending) return

    const accepted = await confirm({
      title: 'Xác nhận cho đội vào trạm',
      description: `Bạn có chắc chắn muốn cho đội ${request.teamName} vào trạm này không?`,
    })
    if (!accepted) return

    setErrorMessage('')
    try {
      await acceptEntryMutation.mutateAsync({
        boothId: request.boothId,
        teamId: request.id,
      })
      await refetchMyBooth()
      state.showStatus(`Đội ${request.teamName} đã vào trạm`, 'success')
    } catch (error) {
      setErrorMessage(getErrorMessage(error))
    }
  }

  const rejectRequest = async () => {
    const request = state.request
    if (!request || rejectEntryMutation.isPending) return

    const rejected = await confirm({
      title: 'Xác nhận hủy yêu cầu',
      description: `Bạn có chắc chắn muốn từ chối yêu cầu của đội ${request.teamName} không?`,
    })
    if (!rejected) return

    setErrorMessage('')
    try {
      await rejectEntryMutation.mutateAsync({
        boothId: request.boothId,
        teamId: request.id,
      })
      await refetchMyBooth()
      state.showStatus(`Đã từ chối yêu cầu của đội ${request.teamName}`, 'neutral')
    } catch (error) {
      setErrorMessage(getErrorMessage(error))
    }
  }

  const submitScore = async () => {
    const acceptedRequest = state.acceptedRequest
    if (
      !acceptedRequest ||
      !state.canSubmitScore ||
      submitScoreMutation.isPending
    ) return

    const submitted = await confirm({
      title: 'Xác nhận chấm điểm',
      description: `Bạn có chắc chắn muốn chấm ${state.normalizedScore} điểm cho đội ${acceptedRequest.teamName} không?`,
    })
    if (!submitted) return

    setErrorMessage('')
    try {
      const score = state.normalizedScore
      const payload = mapScoringFormToRequest(
        acceptedRequest.boothId,
        acceptedRequest.id,
        { selectedScore: score, commentInput: '' },
      )

      await submitScoreMutation.mutateAsync(payload)
      await refetchMyBooth()
      state.showStatus(`+${score} điểm cho đội ${acceptedRequest.teamName}`, 'success')
    } catch (error) {
      setErrorMessage(getErrorMessage(error))
    }
  }

  const cancelSession = async () => {
    const acceptedRequest = state.acceptedRequest
    if (!acceptedRequest || cancelSessionMutation.isPending) return

    const cancelled = await confirm({
      title: 'Hủy lượt chơi?',
      description: `Đội ${acceptedRequest.teamName} sẽ bị đưa khỏi trạm và có thể chọn trạm khác.`,
    })
    if (!cancelled) return

    setErrorMessage('')
    try {
      await cancelSessionMutation.mutateAsync({
        boothId: acceptedRequest.boothId,
      })
      await refetchMyBooth()
      state.showStatus(`Đã hủy lượt chơi của đội ${acceptedRequest.teamName}`, 'neutral')
    } catch (error) {
      setErrorMessage(getErrorMessage(error))
    }
  }

  return {
    ...state,
    acceptRequest,
    cancelSession,
    errorMessage: errorMessage || (
      myBoothQuery.error ? getErrorMessage(myBoothQuery.error) : ''
    ),
    isAccepting: acceptEntryMutation.isPending,
    isCancelling: cancelSessionMutation.isPending,
    isLoading: myBoothQuery.isPending,
    isRejecting: rejectEntryMutation.isPending,
    isSubmitting: submitScoreMutation.isPending,
    rejectRequest,
    submitScore,
  }
}
