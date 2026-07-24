import { z } from 'zod'

export const teamLeaderboardResponseSchema = z.object({
  displayName: z.string(),
  totalScore: z.number(),
})

export const boothSummaryResponseSchema = z.object({
  boothId: z.string().uuid(),
  boothName: z.string(),
  status: z.string(),
})

export const boothScoringLogResponseSchema = z.object({
  boothName: z.string(),
  teamName: z.string(),
  organizerName: z.string(),
  scoreGiven: z.number(),
  createdAt: z.string(),
})