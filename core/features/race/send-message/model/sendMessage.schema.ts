import { z } from 'zod'

export const sendMessageDraftSchema = z.object({
  recipients: z.array(z.string().trim().min(1)).min(1),
  body: z.string().trim().min(1),
})

export const sendRaceMessageRecipientSchema = z.object({
  key: z.string().trim().min(1),
  label: z.string().trim().min(1),
  type: z.string().trim().min(1),
})

export const sentMessageSchema = z.object({
  id: z.string().min(1),
  senderName: z.string().min(1),
  recipients: z.array(z.string().min(1)).min(1),
  body: z.string().min(1),
  sentAt: z.string().min(1),
  sentAtFull: z.string().min(1),
})

export const raceMessageResponseSchema = z.object({
  id: z.string().min(1),
  raceId: z.string().min(1),
  senderId: z.string().nullable().optional(),
  senderName: z.string().min(1),
  recipientKeys: z.array(z.string().min(1)),
  recipientLabels: z.array(z.string().min(1)),
  body: z.string().min(1),
  createdAt: z.string().min(1),
})

export const messageRecipientTypeSchema = z.enum([
  'all',
  'all-organizers',
  'all-teams',
  'organizer',
  'team',
])

export const messageRecipientSchema = z.object({
  id: z.string().min(1),
  label: z.string().min(1),
  description: z.string().optional(),
  type: messageRecipientTypeSchema,
})

export type SendMessageDraft = z.infer<typeof sendMessageDraftSchema>
export type SendRaceMessageRecipient = z.infer<typeof sendRaceMessageRecipientSchema>
export type SentMessage = z.infer<typeof sentMessageSchema>
export type RaceMessageResponse = z.infer<typeof raceMessageResponseSchema>
export type MessageRecipient = z.infer<typeof messageRecipientSchema>
export type MessageRecipientType = z.infer<typeof messageRecipientTypeSchema>
