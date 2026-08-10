import { useCallback, useState } from 'react'
import type { BannerVariant } from '@/core/shared/ui/StatusBanner'

const scoreOptions = [0, 10, 20, 30, 40, 50] as const

/** Owns presentation-only state for the organizer booth workflow. */
export const useOrganizerJoinRequestsState = () => {
  const [score, setScore] = useState('')
  const [statusMessage, setStatusMessage] = useState('')
  const [statusVariant, setStatusVariant] = useState<BannerVariant>('success')

  const normalizedScore = Number(score)
  const canSubmitScore =
    score.trim() !== '' &&
    Number.isFinite(normalizedScore) &&
    normalizedScore >= 0 &&
    normalizedScore <= 100

  const showStatus = useCallback((message: string, variant: BannerVariant) => {
    setStatusMessage(message)
    setStatusVariant(variant)
  }, [])

  const clearStatusMessage = useCallback(() => setStatusMessage(''), [])
  const clearScore = useCallback(() => setScore(''), [])

  return {
    canSubmitScore,
    clearScore,
    clearStatusMessage,
    normalizedScore,
    score,
    scoreOptions,
    selectScore: (nextScore: number) => setScore(String(nextScore)),
    setScore,
    showStatus,
    statusMessage,
    statusVariant,
  }
}
