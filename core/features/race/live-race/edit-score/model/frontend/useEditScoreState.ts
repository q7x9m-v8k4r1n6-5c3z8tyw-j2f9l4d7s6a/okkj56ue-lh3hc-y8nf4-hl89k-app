import { useState } from 'react'

const SCORE_STEP = 10
const INITIAL_DELTA = -50

export type EditScorePanelTab = 'cards' | 'secret'

export const useEditScoreState = (initialScore: number) => {
  const [activeTab, setActiveTab] = useState<EditScorePanelTab>('cards')
  const [delta, setDelta] = useState(INITIAL_DELTA)
  const [reason, setReason] = useState('')

  const scoreAfter = initialScore + delta
  const canSave = delta !== 0 && reason.trim().length > 0

  return {
    activeTab,
    delta,
    reason,
    scoreAfter,
    canSave,
    setActiveTab,
    setReason,
    setDelta,
    increaseDelta: () => setDelta((current) => current + SCORE_STEP),
    decreaseDelta: () => setDelta((current) => current - SCORE_STEP),
    reset: () => {
      setDelta(INITIAL_DELTA)
      setReason('')
    },
  }
}
