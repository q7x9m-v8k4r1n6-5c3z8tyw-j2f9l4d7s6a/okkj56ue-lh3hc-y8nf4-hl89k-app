import { useCallback, useMemo, useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { useParams } from 'react-router-dom'
import { useAuthSession } from '@/core/features/auth'
import {
  raceMessageNotificationSchema,
  type RaceMessageNotification,
} from '../raceMessageNotification.schema'
import { useRaceMessageSignalR } from '../server/useRaceMessageSignalR'

const storagePrefix = 'ovc-race-message-notification'

const getStorageKey = (raceId?: string, userId?: string) => {
  if (!raceId || !userId) return null
  return `${storagePrefix}:${raceId}:${userId}`
}

const parseStoredMessages = (value: string | null) => {
  if (!value) return []

  try {
    const parsed = JSON.parse(value)
    if (Array.isArray(parsed)) {
      return parsed
        .map((item) => raceMessageNotificationSchema.safeParse(item))
        .filter((item) => item.success)
        .map((item) => item.data)
    }

    const singleMessage = raceMessageNotificationSchema.safeParse(parsed)
    return singleMessage.success ? [singleMessage.data] : []
  } catch {
    return []
  }
}

const isTargetedToUser = (
  message: RaceMessageNotification,
  userId?: string,
  userType?: string,
) => {
  const keys = new Set(message.recipientKeys)
  if (keys.has('all')) return true
  if (!userId || !userType) return false

  if (userType === 'team') {
    return keys.has('all-teams') || keys.has(`team:${userId}`)
  }

  if (userType === 'organizer') {
    return keys.has('all-organizers') || keys.has(`organizer:${userId}`)
  }

  return false
}

const toBanner = (message: RaceMessageNotification) => ({
  id: message.id,
  text: `${message.senderName || 'ADMIN'}: ${message.body}`,
})

export const useRaceMessageNotification = () => {
  const { raceId } = useParams<{ raceId: string }>()
  const auth = useAuthSession()
  const queryClient = useQueryClient()
  const storageKey = getStorageKey(raceId, auth.user?.id)
  const [messagesByStorageKey, setMessagesByStorageKey] = useState<
    Record<string, RaceMessageNotification[]>
  >({})

  const messages = useMemo(() => {
    if (!storageKey) return []
    return messagesByStorageKey[storageKey]
      ?? parseStoredMessages(window.localStorage.getItem(storageKey))
  }, [messagesByStorageKey, storageKey])

  const handleMessageReceived = useCallback((nextMessage: RaceMessageNotification) => {
    if (!isTargetedToUser(
      nextMessage,
      auth.user?.id,
      auth.user?.userType,
    )) return

    const announcementHistoryQueryKey = nextMessage.raceId && auth.user?.userType === 'team'
      ? ['team', 'announcement-history', nextMessage.raceId]
      : nextMessage.raceId && auth.user?.userType === 'organizer'
        ? ['organizer', 'announcement-history', nextMessage.raceId]
        : null

    if (announcementHistoryQueryKey) {
      queryClient.setQueryData<RaceMessageNotification[]>(
        announcementHistoryQueryKey,
        (current = []) => [
          nextMessage,
          ...current.filter((message) => message.id !== nextMessage.id),
        ],
      )
    }

    setMessagesByStorageKey((currentByKey) => {
      if (!storageKey) return currentByKey

      const current = currentByKey[storageKey]
        ?? parseStoredMessages(window.localStorage.getItem(storageKey))
      const nextMessages = [
        nextMessage,
        ...current.filter((message) => message.id !== nextMessage.id),
      ]
      window.localStorage.setItem(storageKey, JSON.stringify(nextMessages))

      return {
        ...currentByKey,
        [storageKey]: nextMessages,
      }
    })
  }, [auth.user?.id, auth.user?.userType, queryClient, storageKey])

  useRaceMessageSignalR({
    raceId,
    onMessageReceived: handleMessageReceived,
  })

  const banners = useMemo(() => messages.map(toBanner), [messages])

  const dismiss = useCallback((messageId: string) => {
    setMessagesByStorageKey((currentByKey) => {
      if (!storageKey) return currentByKey

      const current = currentByKey[storageKey]
        ?? parseStoredMessages(window.localStorage.getItem(storageKey))
      const nextMessages = current.filter((message) => message.id !== messageId)

      if (nextMessages.length) {
        window.localStorage.setItem(storageKey, JSON.stringify(nextMessages))
      } else {
        window.localStorage.removeItem(storageKey)
      }

      return {
        ...currentByKey,
        [storageKey]: nextMessages,
      }
    })
  }, [storageKey])

  return {
    banners,
    isVisible: banners.length > 0,
    dismiss,
  }
}
