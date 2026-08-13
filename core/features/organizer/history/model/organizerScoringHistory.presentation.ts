import { formatGmt7DateTime } from '@/core/shared'
import type { OrganizerScoringHistoryItem } from './organizerScoringHistory.contract'

export type OrganizerScoringHistoryViewItem = {
  id: string
  actorName: string
  description: string
  score: string
  scoreTone: 'positive' | 'negative' | 'neutral'
  time: string
}

const formatSignedScore = (score: number) => {
  if (score > 0) return `+${score}`
  return String(score)
}

const getScoreTone = (score: number): OrganizerScoringHistoryViewItem['scoreTone'] => {
  if (score > 0) return 'positive'
  if (score < 0) return 'negative'
  return 'neutral'
}

const getActorName = (item: OrganizerScoringHistoryItem) =>
  item.actorShortName?.trim()
  || item.actorFullName?.trim()
  || item.createdBy?.trim()
  || 'Quản trạm'

const getDescription = (item: OrganizerScoringHistoryItem) => {
  if (item.boothName?.trim()) {
    return `${item.teamName} hoàn thành ${item.boothName}`
  }

  if (item.reason.trim()) {
    return `${item.teamName}: ${item.reason.trim()}`
  }

  return `${item.teamName} được cập nhật điểm`
}

export const mapOrganizerScoringHistoryItem = (
  item: OrganizerScoringHistoryItem,
): OrganizerScoringHistoryViewItem => ({
  id: item.logId,
  actorName: getActorName(item),
  description: getDescription(item),
  score: `${formatSignedScore(item.scoreDelta)} điểm`,
  scoreTone: getScoreTone(item.scoreDelta),
  time: formatGmt7DateTime(item.createdAt),
})
