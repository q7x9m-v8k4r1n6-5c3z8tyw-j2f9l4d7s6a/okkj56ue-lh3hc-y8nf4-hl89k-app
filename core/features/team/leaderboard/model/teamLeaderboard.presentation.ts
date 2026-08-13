import { formatGmt7DateTime } from '@/core/shared'
import type { ScoreHistoryItem } from './teamLeaderboard.contract'

const DEFAULT_SCORE_CHANGE_REASON = 'Điểm số được cập nhật'

export type ScoreHistoryViewItem = {
  id: string
  description: string
  time: string
}

const formatSignedScore = (score: number) => (
  score > 0 ? `+${score}` : String(score)
)

const removeTrailingPunctuation = (value: string) =>
  value.replace(/[.!?]+$/u, '')

/** Maps one validated history DTO to the compact phone presentation. */
export const mapScoreHistoryItem = (
  item: ScoreHistoryItem,
): ScoreHistoryViewItem => {
  const reason = removeTrailingPunctuation(
    item.reason.trim() || DEFAULT_SCORE_CHANGE_REASON,
  )
  const formattedDateTime = formatGmt7DateTime(item.createdAt)
  const time = formattedDateTime.includes(' ')
    ? formattedDateTime.split(' ').at(-1) ?? formattedDateTime
    : formattedDateTime

  return {
    id: item.id,
    description: `${reason} (${formatSignedScore(item.scoreGiven)} điểm).`,
    time,
  }
}

/** Formats ranks with the two-digit style used by the mobile design. */
export const formatLeaderboardRank = (rank: number) =>
  `#${String(rank).padStart(2, '0')}`
