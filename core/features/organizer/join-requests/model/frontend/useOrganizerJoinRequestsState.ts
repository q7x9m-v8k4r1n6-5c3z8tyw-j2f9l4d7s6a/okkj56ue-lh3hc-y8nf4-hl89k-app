import { useState } from 'react'

type JoinRequest = {
  id: string
  teamName: string
}

const scoreOptions = [0, 10, 20, 30, 40, 50] as const

const initialRequest: JoinRequest = {
  id: 'team-a-request',
  teamName: 'Team A',
}

/**
 * Owns organizer request UI state until the station request API is connected.
 */
export const useOrganizerJoinRequestsState = () => {
  const [request, setRequest] = useState<JoinRequest | null>(initialRequest)
  const [acceptedRequest, setAcceptedRequest] = useState<JoinRequest | null>(null)
  const [score, setScore] = useState('')
  const [submittedScore, setSubmittedScore] = useState<number | null>(null)

  const normalizedScore = Number(score)
  const canSubmitScore = score.trim() !== ''
    && Number.isFinite(normalizedScore)
    && normalizedScore >= 0
    && normalizedScore <= 100

  return {
    acceptRequest: () => {
      setAcceptedRequest(request)
      setRequest(null)
      setScore('')
      setSubmittedScore(null)
    },
    acceptedRequest,
    canSubmitScore,
    rejectRequest: () => {
      setRequest(null)
      setAcceptedRequest(null)
      setScore('')
    },
    request,
    score,
    scoreOptions,
    selectScore: (nextScore: number) => setScore(String(nextScore)),
    setScore,
    submitScore: () => {
      if (!canSubmitScore) return
      setSubmittedScore(normalizedScore)
      setAcceptedRequest(null)
      setScore('')
    },
    submittedScore,
  }
}
