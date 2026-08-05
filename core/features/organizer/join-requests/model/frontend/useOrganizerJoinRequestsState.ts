import { useState } from 'react'
import { useToast, useConfirmDialog } from '@/core/shared'
import { mapScoringFormToRequest } from '../mapScoringFormToRequest'
import { useSubmitScoreMutation } from '../server/useSubmitScoreMutation'
import { acceptEntryToBooth } from '../../api/joinRequests.api'

export type JoinRequest = {
  id: string
  teamName: string
}

const scoreOptions = [0, 10, 20, 30, 40, 50] as const

/**
 * Hook quản lý State duyệt đội thi và gửi điểm chấm trạm cho Organizer
 */
export const useOrganizerJoinRequestsState = (boothId: string) => {
  const { toast } = useToast()
  const { confirm } = useConfirmDialog()

  const [request, setRequest] = useState<JoinRequest | null>(null)
  const [acceptedRequest, setAcceptedRequest] = useState<JoinRequest | null>(null)
  const [score, setScore] = useState('')
  const [isAccepting, setIsAccepting] = useState(false)

  const submitScoreMutation = useSubmitScoreMutation()

  const normalizedScore = Number(score)

  const canSubmitScore =
    score.trim() !== '' &&
    Number.isFinite(normalizedScore) &&
    normalizedScore >= 0 &&
    normalizedScore <= 100

  const handleAcceptRequest = async () => {
    if (!request) return

    const isConfirmed = await confirm({
      title: 'Xác nhận cho đội vào trạm',
      description: `Bạn có chắc chắn muốn cho đội ${request.teamName} vào trạm này không?`,
    })
    if (!isConfirmed) return

    try {
      setIsAccepting(true)

      await acceptEntryToBooth({
        boothId,
        teamId: request.id,
      })

      setAcceptedRequest(request)
      setRequest(null)
      setScore('')
    } catch (error) {
      toast({
        title: 'Không thể duyệt cho đội vào trạm',
        description: 'Vui lòng kiểm tra lại!',
        variant: 'danger',
      })
    } finally {
      setIsAccepting(false)
    }
  }

  const handleRejectRequest = () => {
    setRequest(null)
    setAcceptedRequest(null)
    setScore('')
  }

  const handleSubmitScore = async () => {
    if (!canSubmitScore || !acceptedRequest) return

    const isConfirmed = await confirm({
      title: 'Xác nhận chấm điểm',
      description: `Bạn có chắc chắn muốn chấm ${normalizedScore} điểm cho ${acceptedRequest.teamName} không?`,
    })
    if (!isConfirmed) return

    try {
      const payload = mapScoringFormToRequest(boothId, acceptedRequest.id, {
        selectedScore: normalizedScore,
        commentInput: '',
      })

      await submitScoreMutation.mutateAsync(payload)

      toast({
        title: 'Chấm điểm thành công',
        description: `Đã ghi nhận ${normalizedScore} điểm cho ${acceptedRequest.teamName}`,
        variant: 'success',
      })

      setAcceptedRequest(null)
      setScore('')
    } catch (error) {
      toast({
        title: 'Chấm điểm thất bại',
        description: 'Vui lòng thử lại.',
        variant: 'danger',
      })
    }
  }

  return {
    request,
    setRequest,
    acceptedRequest,

    acceptRequest: handleAcceptRequest,
    isAccepting,

    rejectRequest: handleRejectRequest,

    score,
    setScore,
    scoreOptions,
    selectScore: (nextScore: number) => setScore(String(nextScore)),

    canSubmitScore,
    submitScore: handleSubmitScore,
    isSubmitting: submitScoreMutation.isPending,
  }
}