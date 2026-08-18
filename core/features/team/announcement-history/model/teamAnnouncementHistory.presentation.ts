import { formatGmt7DateTime } from '@/core/shared'
import type { TeamAnnouncementMessage } from './teamAnnouncementHistory.contract'

export type TeamAnnouncementHistoryItem = {
  id: string
  senderName: string
  body: string
  sentAt: string
}

export const isTeamAnnouncementTargetedToUser = (
  message: TeamAnnouncementMessage,
  userId?: string,
) => {
  const keys = new Set(message.recipientKeys.map((key) => key.toLowerCase()))
  return keys.has('all') || keys.has('all-teams') || Boolean(userId && keys.has(`team:${userId.toLowerCase()}`))
}

export const mapTeamAnnouncementHistoryItem = (
  message: TeamAnnouncementMessage,
): TeamAnnouncementHistoryItem => ({
  id: message.id,
  senderName: 'ADMIN',
  body: message.body,
  sentAt: formatGmt7DateTime(message.createdAt),
})
