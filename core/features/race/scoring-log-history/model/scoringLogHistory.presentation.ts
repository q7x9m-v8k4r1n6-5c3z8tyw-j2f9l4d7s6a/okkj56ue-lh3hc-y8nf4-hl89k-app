import type { ScoringLogHistoryItem } from './scoringLogHistory.contract'
import {
  SCORING_LOG_HISTORY_ALL_REASONS,
  SCORING_LOG_HISTORY_ALL_SCORES,
  SCORING_LOG_HISTORY_ALL_TEAMS,
  SCORING_LOG_HISTORY_NEGATIVE_SCORES,
  SCORING_LOG_HISTORY_POSITIVE_SCORES,
} from './scoringLogHistory.constants'

export type ScoringLogHistoryViewItem = {
  id: string
  score: string
  scoreTone: 'positive' | 'negative' | 'neutral'
  teamName: string
  actorName: string
  reason: string
  time: string
}

export type ScoringLogHistoryFilterOption = {
  value: string
  label: string
}

export const formatSignedScore = (score: number) => {
  if (score > 0) return `+${score}`
  return String(score)
}

export const getScoringLogScoreFilter = (score: number) => {
  if (score > 0) return SCORING_LOG_HISTORY_POSITIVE_SCORES
  if (score < 0) return SCORING_LOG_HISTORY_NEGATIVE_SCORES
  return SCORING_LOG_HISTORY_ALL_SCORES
}

const getScoreTone = (score: number): ScoringLogHistoryViewItem['scoreTone'] => {
  if (score > 0) return 'positive'
  if (score < 0) return 'negative'
  return 'neutral'
}

const getActorName = (item: ScoringLogHistoryItem) =>
  item.actorShortName?.trim()
  || item.actorFullName?.trim()
  || item.createdBy?.trim()
  || 'ADMIN'

const formatGmt7Time = (value: string) =>
  new Intl.DateTimeFormat('vi-VN', {
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'Asia/Ho_Chi_Minh',
  }).format(new Date(value))

export const getScoringLogReason = (item: ScoringLogHistoryItem) => {
  const boothName = item.boothName?.trim()
  const boothLabel = boothName?.replace(/^trạm\b\s*/iu, '').trim()

  if (boothLabel) return `Hoàn thành trạm ${boothLabel}`

  return item.reason.trim() || item.eventName.trim()
}

const uniqueOptions = (
  values: string[],
): ScoringLogHistoryFilterOption[] => Array.from(new Set(values.filter(Boolean)))
  .map((value) => ({ value, label: value }))

export const mapScoringLogHistoryItem = (
  item: ScoringLogHistoryItem,
): ScoringLogHistoryViewItem => ({
  id: item.logId,
  score: formatSignedScore(item.scoreDelta),
  scoreTone: getScoreTone(item.scoreDelta),
  teamName: item.teamName,
  actorName: getActorName(item),
  reason: getScoringLogReason(item),
  time: formatGmt7Time(item.createdAt),
})

export const getScoringLogScoreOptions = (): ScoringLogHistoryFilterOption[] => [
  { value: SCORING_LOG_HISTORY_ALL_SCORES, label: 'Điểm' },
  { value: SCORING_LOG_HISTORY_POSITIVE_SCORES, label: 'Điểm cộng' },
  { value: SCORING_LOG_HISTORY_NEGATIVE_SCORES, label: 'Điểm trừ' },
]

export const getScoringLogTeamOptions = (
  items: ScoringLogHistoryItem[],
): ScoringLogHistoryFilterOption[] => [
  { value: SCORING_LOG_HISTORY_ALL_TEAMS, label: 'Đội' },
  ...uniqueOptions(items.map((item) => item.teamName.trim())),
]

export const getScoringLogReasonOptions = (
  items: ScoringLogHistoryItem[],
): ScoringLogHistoryFilterOption[] => [
  { value: SCORING_LOG_HISTORY_ALL_REASONS, label: 'Lý do' },
  ...uniqueOptions(items.map(getScoringLogReason)),
]
