import { useCallback, useState } from 'react'
import type { MyBoothData } from '../myBooth.contract'
import type { OrganizerJoinRequest } from '../organizerJoinRequest'

const scoreOptions = [0, 10, 20, 30, 40, 50] as const

export const mapMyBoothToOrganizerSession = (booth: MyBoothData) => {
  const activeTeam = booth.teamId
    ? {
        boothId: booth.boothId,
        id: booth.teamId,
        teamName: booth.teamName ?? 'Đội chưa xác định',
      }
    : null

  return {
    request: booth.status === 'pending' ? activeTeam : null,
    acceptedRequest: booth.status === 'occupied' ? activeTeam : null,
  }
}

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

  const syncBoothSession = useCallback((booth: MyBoothData) => {
    const session = mapMyBoothToOrganizerSession(booth)
    setRequest(session.request)
    setAcceptedRequest(session.acceptedRequest)
    if (!session.acceptedRequest) setScore('')
    if (!session.acceptedRequest) setIsCancelConfirmationOpen(false)
  }, [])

  return {
    request,
    acceptedRequest,
    canSubmitScore,
    dismissCancelConfirmation: () => setIsCancelConfirmationOpen(false),
    isCancelConfirmationOpen,
    normalizedScore,
    openCancelConfirmation: () => setIsCancelConfirmationOpen(true),
    score,
    setScore,
    scoreOptions,
    selectScore: (nextScore: number) => setScore(String(nextScore)),
    syncBoothSession,
  }
}
