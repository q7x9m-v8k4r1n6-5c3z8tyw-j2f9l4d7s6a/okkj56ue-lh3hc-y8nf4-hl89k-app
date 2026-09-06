import { z } from 'zod'

export const scoringLogHistoryItemSchema = z.object({
  logId: z.string().uuid(),
  boothName: z.string().nullable().optional().default(null),
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

export type ScoringLogHistoryItem = z.infer<typeof scoringLogHistoryItemSchema>

export const scoringLogHistoryResponseSchema = z.object({
  page: z.number(),
  pageSize: z.number(),
  totalItems: z.number(),
  totalPages: z.number(),
  items: z.array(scoringLogHistoryItemSchema),
})

export type ScoringLogHistoryResponse = z.infer<typeof scoringLogHistoryResponseSchema>
