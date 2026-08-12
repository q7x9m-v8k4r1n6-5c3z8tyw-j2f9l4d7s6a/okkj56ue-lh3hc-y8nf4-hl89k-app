import { useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import {
  sendMessageDraftSchema,
  type MessageRecipient,
  type SentMessage,
} from '../sendMessage.schema'
import { useMessageRecipientsQuery } from '../server/useMessageRecipientsQuery'
import { useRaceMessagesQuery } from '../server/useRaceMessagesQuery'
import { useSendRaceMessageMutation } from '../server/useSendRaceMessageMutation'

const messageTimeFormatter = new Intl.DateTimeFormat('vi-VN', {
  hour: '2-digit',
  minute: '2-digit',
  hour12: false,
  timeZone: 'Asia/Bangkok',
})

const messageFullTimeFormatter = new Intl.DateTimeFormat('vi-VN', {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
  hour12: false,
  timeZone: 'Asia/Bangkok',
})

const formatMessageTime = (value: string | Date) =>
  messageTimeFormatter.format(new Date(value))

const formatFullMessageTime = (value: string | Date) =>
  messageFullTimeFormatter.format(new Date(value))

/** Owns browser-only compose state and delegates server work to message hooks. */
export const useSendMessageState = () => {
  const { raceId } = useParams<{ raceId: string }>()
  const [body, setBody] = useState('')
  const [recipientSearch, setRecipientSearch] = useState('')
  const [selectedRecipients, setSelectedRecipients] = useState<MessageRecipient[]>([])
  const [selectedMessageId, setSelectedMessageId] = useState<string | null>(null)
  const recipientsQuery = useMessageRecipientsQuery()
  const messagesQuery = useRaceMessagesQuery(raceId)
  const sendMutation = useSendRaceMessageMutation()

  const selectedIds = useMemo(
    () => new Set(selectedRecipients.map((recipient) => recipient.id)),
    [selectedRecipients],
  )

  const draft = useMemo(
    () => sendMessageDraftSchema.safeParse({
      recipients: selectedRecipients.map((recipient) => recipient.label),
      body,
    }),
    [body, selectedRecipients],
  )

  const messages = useMemo<SentMessage[]>(() => (
    (messagesQuery.data ?? []).map((message) => ({
      id: message.id,
      senderName: message.senderName,
      recipients: message.recipientLabels,
      body: message.body,
      sentAt: formatMessageTime(message.createdAt),
      sentAtFull: formatFullMessageTime(message.createdAt),
    }))
  ), [messagesQuery.data])

  const selectedMessage = useMemo(
    () => messages.find((message) => message.id === selectedMessageId) ?? null,
    [messages, selectedMessageId],
  )

  const recipientOptions = useMemo(() => {
    const query = recipientSearch.trim().toLowerCase()
    const recipients = recipientsQuery.data ?? []
    if (!query) return recipients
    return recipients.filter((recipient) => {
      const haystack = [
        recipient.label,
        recipient.description ?? '',
      ].join(' ').toLowerCase()
      return haystack.includes(query)
    })
  }, [recipientSearch, recipientsQuery.data])

  const removeRecipient = (id: string) => {
    setSelectedRecipients((current) => current.filter((recipient) => recipient.id !== id))
  }

  const toggleRecipient = (recipient: MessageRecipient) => {
    setSelectedRecipients((current) => {
      const exists = current.some((item) => item.id === recipient.id)
      if (exists) return current.filter((item) => item.id !== recipient.id)

      if (recipient.type === 'all') return [recipient]

      const withoutAll = current.filter((item) => item.type !== 'all')
      if (recipient.type === 'all-organizers') {
        return [
          ...withoutAll.filter((item) => item.type !== 'organizer'),
          recipient,
        ]
      }
      if (recipient.type === 'all-teams') {
        return [
          ...withoutAll.filter((item) => item.type !== 'team'),
          recipient,
        ]
      }
      if (recipient.type === 'organizer') {
        return [
          ...withoutAll.filter((item) => item.type !== 'all-organizers'),
          recipient,
        ]
      }
      return [
        ...withoutAll.filter((item) => item.type !== 'all-teams'),
        recipient,
      ]
    })
  }

  const send = () => {
    if (!draft.success || !raceId) return

    sendMutation.mutate(
      {
        raceId,
        body: draft.data.body,
        recipients: selectedRecipients.map((recipient) => ({
          key: recipient.id,
          label: recipient.label,
          type: recipient.type,
        })),
      },
      {
        onSuccess: () => {
          setBody('')
          setSelectedRecipients([])
          setRecipientSearch('')
        },
      },
    )
  }

  return {
    body,
    canSend: draft.success && Boolean(raceId) && !sendMutation.isPending,
    closeMessageDetail: () => setSelectedMessageId(null),
    isLoadingRecipients: recipientsQuery.isLoading,
    isSending: sendMutation.isPending,
    messages,
    messageErrorMessage: messagesQuery.isError
      ? 'Không thể tải lịch sử tin nhắn.'
      : '',
    openMessageDetail: (messageId: string) => setSelectedMessageId(messageId),
    recipientErrorMessage: recipientsQuery.isError
      ? 'Không thể tải danh sách người nhận.'
      : '',
    recipientOptions,
    recipientSearch,
    removeRecipient,
    selectedMessage,
    selectedMessageId,
    send,
    sendErrorMessage: sendMutation.isError
      ? 'Không thể gửi tin nhắn.'
      : '',
    selectedIds,
    selectedRecipients,
    setBody,
    setRecipientSearch,
    toggleRecipient,
  }
}
