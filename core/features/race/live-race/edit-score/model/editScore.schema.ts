import { z } from 'zod'

export const updateTeamScoreRequestSchema = z.object({
  delta: z.number().int().min(-10000).max(10000),
  reason: z.string().trim().min(1),
})

export type UpdateTeamScoreRequest = z.infer<typeof updateTeamScoreRequestSchema>

export const updateTeamScoreResponseSchema = z.object({
  raceId: z.string(),
  teamId: z.string(),
  scoreBefore: z.number(),
  scoreAfter: z.number(),
  delta: z.number(),
})

export type UpdateTeamScoreResponse = z.infer<typeof updateTeamScoreResponseSchema>
