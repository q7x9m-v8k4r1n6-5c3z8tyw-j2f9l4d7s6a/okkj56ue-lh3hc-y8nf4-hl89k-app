import { useState } from 'react'
import type { OrganizerJoinRequest } from '../organizerJoinRequest'

const scoreOptions = [0, 10, 20, 30, 40, 50] as const

/**
 * Hook quản lý State duyệt đội thi và gửi điểm chấm trạm cho Organizer
 */
export const useOrganizerJoinRequestsState = () => {
  const [request, setRequest] = useState<OrganizerJoinRequest | null>(null)
  const [acceptedRequest, setAcceptedRequest] = useState<OrganizerJoinRequest | null>(null)
  const [score, setScore] = useState('')
  const [isCancelConfirmationOpen, setIsCancelConfirmationOpen] = useState(false)

  const normalizedScore = Number(score)
  const canSubmitScore =
    score.trim() !== '' &&
    Number.isFinite(normalizedScore) &&
    normalizedScore >= 0 &&
    normalizedScore <= 100

  const acceptCurrentRequest = () => {
    if (!request) return

    setAcceptedRequest(request)
    setRequest(null)
    setScore('')
  }

  const dismissRequest = () => {
    setRequest(null)
  }

  const finishSession = () => {
    setAcceptedRequest(null)
    setScore('')
    setIsCancelConfirmationOpen(false)
  }

  return {
    acceptCurrentRequest,
    request,
    setRequest,
    acceptedRequest,
    canSubmitScore,
    dismissCancelConfirmation: () => setIsCancelConfirmationOpen(false),
    dismissRequest,
    finishSession,
    isCancelConfirmationOpen,
    normalizedScore,
    openCancelConfirmation: () => setIsCancelConfirmationOpen(true),
    score,
    setScore,
    scoreOptions,
    selectScore: (nextScore: number) => setScore(String(nextScore)),
  }
}
