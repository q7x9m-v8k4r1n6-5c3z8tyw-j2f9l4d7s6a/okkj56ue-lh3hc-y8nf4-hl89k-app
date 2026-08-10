import { useCallback, useState } from 'react'
import type { MyBooth } from '@/core/entities/booth'
import type { BannerVariant } from '@/core/shared/ui/StatusBanner'
import type { OrganizerJoinRequest } from '../organizerJoinRequest'

const scoreOptions = [0, 10, 20, 30, 40, 50] as const

export const mapMyBoothToOrganizerSession = (booth: MyBooth) => {
  const activeTeam: OrganizerJoinRequest | null = booth.teamId
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

/** Owns presentation-only state for the organizer booth workflow. */
export const useOrganizerJoinRequestsState = () => {
  const [request, setRequest] = useState<OrganizerJoinRequest | null>(null)
  const [acceptedRequest, setAcceptedRequest] = useState<OrganizerJoinRequest | null>(null)
  const [score, setScore] = useState('')
  const [statusMessage, setStatusMessage] = useState('')
  const [statusVariant, setStatusVariant] = useState<BannerVariant>('success')

  const normalizedScore = Number(score)
  const canSubmitScore =
    score.trim() !== '' &&
    Number.isFinite(normalizedScore) &&
    normalizedScore >= 0 &&
    normalizedScore <= 100

  const syncBoothSession = useCallback((booth: MyBooth) => {
    const session = mapMyBoothToOrganizerSession(booth)
    setRequest(session.request)
    setAcceptedRequest(session.acceptedRequest)
    if (!session.acceptedRequest) setScore('')
  }, [])

  const showStatus = useCallback((message: string, variant: BannerVariant) => {
    setStatusMessage(message)
    setStatusVariant(variant)
  }, [])

  const clearStatusMessage = useCallback(() => setStatusMessage(''), [])

  return {
    acceptedRequest,
    canSubmitScore,
    clearStatusMessage,
    normalizedScore,
    request,
    score,
    scoreOptions,
    selectScore: (nextScore: number) => setScore(String(nextScore)),
    setScore,
    showStatus,
    statusMessage,
    statusVariant,
    syncBoothSession,
  }
}
