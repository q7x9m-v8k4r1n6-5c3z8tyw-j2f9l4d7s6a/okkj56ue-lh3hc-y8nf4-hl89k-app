import { z } from 'zod'

export const verifyMissionCodeResponseSchema = z.boolean()

export const submitTechCacheResultResponseSchema = z.object({
  scoreDelta: z.number(),
  isMapPieceReward: z.boolean(),
})
export type SubmitTechCacheResultResponse = z.infer<typeof submitTechCacheResultResponseSchema>

export type TechCacheResultType = 'success' | 'fail'