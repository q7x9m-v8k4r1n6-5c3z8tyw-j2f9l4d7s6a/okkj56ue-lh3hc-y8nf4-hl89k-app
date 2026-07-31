import { z } from 'zod'

export const teamLeaderboardItemSchema = z.object({
  displayName: z.string(),
  totalScore: z.number(),
})
export type TeamLeaderboardItem = z.infer<typeof teamLeaderboardItemSchema>

export const boothListItemSchema = z.object({
  boothId: z.string(),
  boothName: z.string(),
  boothLocation: z.string(),
  description: z.string(),
  status: z.string(),
  isHidden: z.boolean(),
  currentTeamName: z.string().nullable().optional(),
  currentOrganizerName: z.string().nullable().optional(),
})
export type BoothListItem = z.infer<typeof boothListItemSchema>

export const scoringLogItemSchema = z.object({
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
export type ScoringLogItem = z.infer<typeof scoringLogItemSchema>

export const scoringLogPagedResponseSchema = z.object({
  page: z.number(),
  pageSize: z.number(),
  totalItems: z.number(),
  totalPages: z.number(),
  items: z.array(scoringLogItemSchema),
})
export type ScoringLogPagedResponse = z.infer<typeof scoringLogPagedResponseSchema>