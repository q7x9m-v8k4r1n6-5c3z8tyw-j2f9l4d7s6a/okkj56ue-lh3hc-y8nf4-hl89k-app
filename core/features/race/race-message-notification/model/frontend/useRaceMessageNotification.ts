import { useCallback, useEffect, useMemo, useState } from 'react'
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
  const storageKey = getStorageKey(raceId, auth.user?.id)
  const [messages, setMessages] = useState<RaceMessageNotification[]>([])

  useEffect(() => {
    if (!storageKey) {
      setMessages([])
      return
    }

    const storedMessages = parseStoredMessages(window.localStorage.getItem(storageKey))
    setMessages(storedMessages)
  }, [storageKey])

  const handleMessageReceived = useCallback((nextMessage: RaceMessageNotification) => {
    if (!isTargetedToUser(
      nextMessage,
      auth.user?.id,
      auth.user?.userType,
    )) return

    setMessages((current) => {
      const nextMessages = [
        nextMessage,
        ...current.filter((message) => message.id !== nextMessage.id),
      ]
      if (storageKey) {
        window.localStorage.setItem(storageKey, JSON.stringify(nextMessages))
      }
      return nextMessages
    })
  }, [auth.user?.id, auth.user?.userType, storageKey])

  useRaceMessageSignalR({
    raceId,
    onMessageReceived: handleMessageReceived,
  })

  const banners = useMemo(() => messages.map(toBanner), [messages])

  const dismiss = useCallback((messageId: string) => {
    setMessages((current) => {
      const nextMessages = current.filter((message) => message.id !== messageId)
      if (storageKey) {
        if (nextMessages.length) {
          window.localStorage.setItem(storageKey, JSON.stringify(nextMessages))
        } else {
          window.localStorage.removeItem(storageKey)
        }
      }
      return nextMessages
    })
  }, [storageKey])

  return {
    banners,
    isVisible: banners.length > 0,
    dismiss,
  }
}
