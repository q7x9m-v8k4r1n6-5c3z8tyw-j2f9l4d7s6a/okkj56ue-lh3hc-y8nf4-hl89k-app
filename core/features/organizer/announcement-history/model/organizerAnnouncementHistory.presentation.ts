import { formatGmt7DateTime } from '@/core/shared'
import type { OrganizerAnnouncementMessage } from './organizerAnnouncementHistory.contract'

export type OrganizerAnnouncementHistoryItem = {
  id: string
  senderName: string
  body: string
  sentAt: string
}

export const isOrganizerAnnouncementTargetedToUser = (
  message: OrganizerAnnouncementMessage,
  userId?: string,
) => {
  const keys = new Set(message.recipientKeys.map((key) => key.toLowerCase()))
  return keys.has('all') || keys.has('all-organizers') || Boolean(userId && keys.has(`organizer:${userId.toLowerCase()}`))
}

export const mapOrganizerAnnouncementHistoryItem = (
  message: OrganizerAnnouncementMessage,
): OrganizerAnnouncementHistoryItem => ({
  id: message.id,
  senderName: message.senderName || 'ADMIN',
  body: message.body,
  sentAt: formatGmt7DateTime(message.createdAt),
})
