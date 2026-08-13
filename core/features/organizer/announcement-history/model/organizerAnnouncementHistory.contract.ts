import { z } from 'zod'

const nonEmptyStringArraySchema = z.preprocess(
  (value) => (Array.isArray(value) ? value : []),
  z.array(z.string().trim().min(1)),
)

export const organizerAnnouncementMessageSchema = z.object({
  id: z.string().min(1),
  raceId: z.string().min(1),
  senderId: z.string().nullable().optional(),
  senderName: z.string().trim().min(1).catch('ADMIN'),
  recipientKeys: nonEmptyStringArraySchema.catch([]),
  recipientLabels: nonEmptyStringArraySchema.catch([]),
  body: z.string().min(1),
  createdAt: z.string().min(1),
})

export type OrganizerAnnouncementMessage = z.infer<typeof organizerAnnouncementMessageSchema>
