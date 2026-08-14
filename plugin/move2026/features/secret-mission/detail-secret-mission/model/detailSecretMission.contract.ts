import { z } from 'zod'

export const evidenceFileSchema = z.object({
  id: z.string(),
  url: z.string(),
  createdAt: z.string(),
})

export const secretMissionDetailSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  isAssigned: z.boolean(),
  evidenceImageUrls: z.array(evidenceFileSchema).nullable().optional(),
  evidenceVideoUrls: z.array(evidenceFileSchema).nullable().optional(),
})

export type SecretMissionDetailDto = z.infer<typeof secretMissionDetailSchema>