import { z } from 'zod'

export const organizerScoringHistoryItemSchema = z.object({
  logId: z.string(),
  boothName: z.string().nullable().optional(),
  eventName: z.string(),
  teamName: z.string(),
  actorFullName: z.string().nullable().optional(),
  actorShortName: z.string().nullable().optional(),
  scoreDelta: z.number(),
  scoreBefore: z.number(),
  scoreAfter: z.number(),
  reason: z.string(),
  createdAt: z.string(),
  createdBy: z.string(),
})

export const organizerScoringHistoryResponseSchema = z.object({
  page: z.number(),
  pageSize: z.number(),
  totalItems: z.number(),
  totalPages: z.number(),
  items: z.array(organizerScoringHistoryItemSchema),
})

export type OrganizerScoringHistoryItem = z.infer<typeof organizerScoringHistoryItemSchema>
export type OrganizerScoringHistoryResponse = z.infer<typeof organizerScoringHistoryResponseSchema>
