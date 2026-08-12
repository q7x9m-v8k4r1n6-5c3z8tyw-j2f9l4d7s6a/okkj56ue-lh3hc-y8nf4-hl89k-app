import { useCallback, useRef } from 'react'
import { useConfirmDialog } from '@/core/shared'
import type { BannerVariant } from '@/core/shared/ui/StatusBanner'
import { createAsyncActionLock } from '../../model/frontend/asyncActionLock'
import { getActionErrorMessage } from '../../model/getActionErrorMessage'
import { mapScoringFormToRequest } from '../../model/mapScoringFormToRequest'
import type { OrganizerJoinRequest } from '../../model/organizerJoinRequest'
import { useCancelBoothSessionMutation } from '../../model/server/useCancelBoothSessionMutation'
import { useSubmitScoreMutation } from '../../model/server/useSubmitScoreMutation'

type UseOrganizerBoothSessionActionsOptions = {
  acceptedRequest: OrganizerJoinRequest | null
  canSubmitScore: boolean
  clearScore: () => void
  normalizedScore: number
  raceId?: string
  setErrorMessage: (message: string) => void
  showStatus: (message: string, variant: BannerVariant) => void
}

export const useOrganizerBoothSessionActions = ({
  acceptedRequest,
  canSubmitScore,
  clearScore,
  normalizedScore,
  raceId,
  setErrorMessage,
  showStatus,
}: UseOrganizerBoothSessionActionsOptions) => {
  const { confirm } = useConfirmDialog()
  const cancelMutation = useCancelBoothSessionMutation(raceId)
  const submitMutation = useSubmitScoreMutation(raceId)
  const cancelLock = useRef(createAsyncActionLock())
  const submitLock = useRef(createAsyncActionLock())

  const submitScore = useCallback(async () => {
    if (!acceptedRequest || !canSubmitScore) return

    await submitLock.current.run(async () => {
      const submitted = await confirm({
        title: 'Xác nhận chấm điểm',
        description: `Bạn có chắc chắn muốn chấm ${normalizedScore} điểm cho đội ${acceptedRequest.teamName} không?`,
      })
      if (!submitted) return

      setErrorMessage('')
      try {
        const payload = mapScoringFormToRequest(
          acceptedRequest.boothId,
          acceptedRequest.id,
          { selectedScore: normalizedScore, commentInput: '' },
        )

        await submitMutation.mutateAsync(payload)
        clearScore()
        showStatus(
          `+${normalizedScore} điểm cho đội ${acceptedRequest.teamName}`,
          'success',
        )
      } catch (error) {
        setErrorMessage(getActionErrorMessage(error))
      }
    })
  }, [
    acceptedRequest,
    canSubmitScore,
    clearScore,
    confirm,
    normalizedScore,
    setErrorMessage,
    showStatus,
    submitMutation,
  ])

  const cancelSession = useCallback(async () => {
    if (!acceptedRequest) return

    await cancelLock.current.run(async () => {
      const cancelled = await confirm({
        title: 'Hủy lượt chơi?',
        description: `Đội ${acceptedRequest.teamName} sẽ bị đưa khỏi trạm và có thể chọn trạm khác.`,
      })
      if (!cancelled) return

      setErrorMessage('')
      try {
        await cancelMutation.mutateAsync({ boothId: acceptedRequest.boothId })
        clearScore()
        showStatus(
          `Đã hủy lượt chơi của đội ${acceptedRequest.teamName}`,
          'neutral',
        )
      } catch (error) {
        setErrorMessage(getActionErrorMessage(error))
      }
    })
  }, [
    acceptedRequest,
    cancelMutation,
    clearScore,
    confirm,
    setErrorMessage,
    showStatus,
  ])

  return {
    cancelSession,
    isCancelling: cancelMutation.isPending,
    isSubmitting: submitMutation.isPending,
    submitScore,
  }
}
