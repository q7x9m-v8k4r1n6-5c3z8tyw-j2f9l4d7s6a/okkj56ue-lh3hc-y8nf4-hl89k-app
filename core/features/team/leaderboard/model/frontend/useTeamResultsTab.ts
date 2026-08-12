import { useState } from 'react'

export type TeamResultsTab = 'score' | 'leaderboard'

/** Owns presentation-only switching between score detail and leaderboard. */
export const useTeamResultsTab = () => {
  const [activeTab, setActiveTab] = useState<TeamResultsTab>('score')

  return { activeTab, setActiveTab }
}
