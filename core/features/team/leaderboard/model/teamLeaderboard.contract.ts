import { z } from 'zod'

const teamScoreSummarySchema = z.object({
  teamId: z.string().uuid(),
  displayName: z.string(),
  rank: z.number().int().positive(),
  totalScore: z.number().int(),
  completedRegularBooths: z.number().int().nonnegative(),
  completedHiddenBooths: z.number().int().nonnegative(),
})

const leaderboardEntrySchema = z.object({
  teamId: z.string().uuid(),
  displayName: z.string(),
  rank: z.number().int().positive(),
  totalScore: z.number().int().nullable(),
  isCurrentTeam: z.boolean(),
})

export const teamLeaderboardResponseSchema = z.object({
  currentTeam: teamScoreSummarySchema,
  isLeaderboardVisible: z.boolean(),
  areOtherTeamPointsHidden: z.boolean(),
  teams: z.array(leaderboardEntrySchema),
})

const scoreHistoryItemSchema = z.object({
  id: z.string().uuid(),
  boothId: z.string().uuid().nullable(),
  organizerId: z.string().uuid().nullable(),
  scoreGiven: z.number().int(),
  scoreAfterChange: z.number().int(),
  source: z.string(),
  reason: z.string(),
  createdAt: z.string().min(1),
})

export const scoreHistoryResponseSchema = z.object({
  items: z.array(scoreHistoryItemSchema),
  page: z.number().int().positive(),
  pageSize: z.number().int().positive(),
  totalItems: z.number().int().nonnegative(),
  totalPages: z.number().int().nonnegative(),
})

export type TeamLeaderboardResponse = z.infer<
  typeof teamLeaderboardResponseSchema
>
export type ScoreHistoryItem = z.infer<typeof scoreHistoryItemSchema>
export type ScoreHistoryResponse = z.infer<typeof scoreHistoryResponseSchema>
