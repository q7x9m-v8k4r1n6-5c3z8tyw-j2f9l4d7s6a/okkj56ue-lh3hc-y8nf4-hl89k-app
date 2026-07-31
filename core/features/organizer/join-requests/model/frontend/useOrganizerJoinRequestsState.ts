import { useState } from 'react'
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
  const [request, setRequest] = useState<JoinRequest | null>(null)
  const [acceptedRequest, setAcceptedRequest] = useState<JoinRequest | null>(null)
  const [score, setScore] = useState('')
  const [isAccepting, setIsAccepting] = useState(false) // Thêm State loading khi bấm Cho vô

  // Mutation gửi API chấm điểm lên Backend
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
      console.log('✅ Đã duyệt cho đội vào trạm thành công!')
    } catch (error) {
      console.error('❌ Lỗi khi duyệt đội vào trạm:', error)
      alert('Không thể duyệt cho đội vào trạm. Vui lòng kiểm tra lại!')
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

      setAcceptedRequest(null)
      setScore('')
      console.log('✅ Chấm điểm thành công!')
    } catch (error) {
      console.error('❌ Chấm điểm thất bại:', error)
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