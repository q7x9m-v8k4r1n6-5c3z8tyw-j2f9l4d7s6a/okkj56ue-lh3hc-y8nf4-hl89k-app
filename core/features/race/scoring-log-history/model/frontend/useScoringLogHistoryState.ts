import { useCallback, useMemo, useState } from 'react'
import type { ScoringLogHistoryItem } from '../scoringLogHistory.contract'
import {
  SCORING_LOG_HISTORY_ALL_REASONS,
  SCORING_LOG_HISTORY_ALL_SCORES,
  SCORING_LOG_HISTORY_ALL_TEAMS,
} from '../scoringLogHistory.constants'
import {
  getScoringLogReason,
  getScoringLogReasonOptions,
  getScoringLogScoreFilter,
  getScoringLogScoreOptions,
  getScoringLogTeamOptions,
  mapScoringLogHistoryItem,
} from '../scoringLogHistory.presentation'

export const useScoringLogHistoryState = (
  items: ScoringLogHistoryItem[],
) => {
  const [score, setScore] = useState(SCORING_LOG_HISTORY_ALL_SCORES)
  const [team, setTeam] = useState(SCORING_LOG_HISTORY_ALL_TEAMS)
  const [reason, setReason] = useState(SCORING_LOG_HISTORY_ALL_REASONS)

  const resetFilters = useCallback(() => {
    setScore(SCORING_LOG_HISTORY_ALL_SCORES)
    setTeam(SCORING_LOG_HISTORY_ALL_TEAMS)
    setReason(SCORING_LOG_HISTORY_ALL_REASONS)
  }, [])

  const scoreOptions = useMemo(
    () => getScoringLogScoreOptions(),
    [],
  )

  const teamOptions = useMemo(
    () => getScoringLogTeamOptions(items),
    [items],
  )

  const reasonOptions = useMemo(
    () => getScoringLogReasonOptions(items),
    [items],
  )

  const visibleItems = useMemo(
    () => items
      .filter((item) => (
        score === SCORING_LOG_HISTORY_ALL_SCORES
        || getScoringLogScoreFilter(item.scoreDelta) === score
      ))
      .filter((item) => (
        team === SCORING_LOG_HISTORY_ALL_TEAMS
        || item.teamName.trim() === team
      ))
      .filter((item) => (
        reason === SCORING_LOG_HISTORY_ALL_REASONS
        || getScoringLogReason(item) === reason
      ))
      .map(mapScoringLogHistoryItem),
    [items, reason, score, team],
  )

  return {
    reason,
    reasonOptions,
    resetFilters,
    score,
    scoreOptions,
    setReason,
    setScore,
    setTeam,
    team,
    teamOptions,
    visibleItems,
  }
}
