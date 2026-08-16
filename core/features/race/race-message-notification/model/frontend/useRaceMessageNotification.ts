import { useCallback, useEffect, useMemo, useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { useParams } from 'react-router-dom'
import { useAuthSession } from '@/core/features/auth'
import {
  raceMessageNotificationSchema,
  type RaceMessageNotification,
} from '../raceMessageNotification.schema'
import { useRaceMessageNotificationsQuery } from '../server/useRaceMessageNotificationsQuery'
import { useRaceMessageSignalR } from '../server/useRaceMessageSignalR'

const storagePrefix = 'ovc-race-message-notification'
const dismissedStoragePrefix = 'ovc-race-message-notification-dismissed'

const getStorageKey = (raceId?: string, userId?: string) => {
  if (!raceId || !userId) return null
  return `${storagePrefix}:${raceId}:${userId}`
}

const getDismissedStorageKey = (raceId?: string, userId?: string) => {
  if (!raceId || !userId) return null
  return `${dismissedStoragePrefix}:${raceId}:${userId}`
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

const parseStoredIds = (value: string | null) => {
  if (!value) return new Set<string>()

  try {
    const parsed = JSON.parse(value)
    return Array.isArray(parsed)
      ? new Set(parsed.filter((item): item is string => typeof item === 'string'))
      : new Set<string>()
  } catch {
    return new Set<string>()
  }
}

const readDismissedIds = (dismissedStorageKey: string | null) =>
  dismissedStorageKey
    ? parseStoredIds(window.localStorage.getItem(dismissedStorageKey))
    : new Set<string>()

const sortNewestFirst = (messages: RaceMessageNotification[]) => (
  [...messages].sort((a, b) => (
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  ))
)

const mergeMessages = (
  current: RaceMessageNotification[],
  incoming: RaceMessageNotification[],
) => sortNewestFirst([
  ...incoming,
  ...current.filter((message) => !incoming.some((item) => item.id === message.id)),
])

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
  const dismissedStorageKey = getDismissedStorageKey(raceId, auth.user?.id)
  const [messagesByStorageKey, setMessagesByStorageKey] = useState<
    Record<string, RaceMessageNotification[]>
  >({})
  const historyQuery = useRaceMessageNotificationsQuery(
    raceId,
    Boolean(auth.user?.id),
  )

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
    if (readDismissedIds(dismissedStorageKey).has(nextMessage.id)) return

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
      const nextMessages = mergeMessages(current, [nextMessage])
      window.localStorage.setItem(storageKey, JSON.stringify(nextMessages))

      return {
        ...currentByKey,
        [storageKey]: nextMessages,
      }
    })
  }, [auth.user?.id, auth.user?.userType, dismissedStorageKey, queryClient, storageKey])

  useEffect(() => {
    if (!storageKey || !historyQuery.data) return

    const dismissedIds = readDismissedIds(dismissedStorageKey)
    const incomingMessages = historyQuery.data.filter((message) => (
      !dismissedIds.has(message.id) &&
      isTargetedToUser(message, auth.user?.id, auth.user?.userType)
    ))

    if (!incomingMessages.length) return

    setMessagesByStorageKey((currentByKey) => {
      const current = currentByKey[storageKey]
        ?? parseStoredMessages(window.localStorage.getItem(storageKey))
      const nextMessages = mergeMessages(current, incomingMessages)
      window.localStorage.setItem(storageKey, JSON.stringify(nextMessages))

      return {
        ...currentByKey,
        [storageKey]: nextMessages,
      }
    })
  }, [
    auth.user?.id,
    auth.user?.userType,
    dismissedStorageKey,
    historyQuery.data,
    storageKey,
  ])

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
      if (dismissedStorageKey) {
        const dismissedIds = readDismissedIds(dismissedStorageKey)
        dismissedIds.add(messageId)
        window.localStorage.setItem(
          dismissedStorageKey,
          JSON.stringify([...dismissedIds]),
        )
      }

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
  }, [dismissedStorageKey, storageKey])

  return {
    banners,
    isVisible: banners.length > 0,
    dismiss,
  }
}
