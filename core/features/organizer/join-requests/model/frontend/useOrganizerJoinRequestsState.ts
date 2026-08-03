import { useState } from 'react'
import { useToast } from '@/core/shared/ui/Toast' // sửa đúng đường dẫn theo cấu trúc thật của shared/toast
import { mapScoringFormToRequest } from '../mapScoringFormToRequest'
import { useSubmitScoreMutation } from '../server/useSubmitScoreMutation'
import { acceptEntryToBooth } from '../../api/joinRequests.api'

export type JoinRequest = {
  id: string
  teamName: string
}

const scoreOptions = [0, 10, 20, 30, 40, 50] as const

export const useOrganizerJoinRequestsState = (boothId: string) => {
  const { toast } = useToast()
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