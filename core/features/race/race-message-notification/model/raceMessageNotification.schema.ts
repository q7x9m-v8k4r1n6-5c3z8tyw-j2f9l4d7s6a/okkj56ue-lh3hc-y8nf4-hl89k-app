import { z } from 'zod'

export const raceMessageNotificationSchema = z.object({
  id: z.string().min(1),
  raceId: z.string().min(1),
  senderId: z.string().nullable().optional(),
  senderName: z.string().min(1),
  recipientKeys: z.array(z.string().min(1)),
  recipientLabels: z.array(z.string().min(1)),
  body: z.string().min(1),
  createdAt: z.string().min(1),
})

export type RaceMessageNotification = z.infer<typeof raceMessageNotificationSchema>
