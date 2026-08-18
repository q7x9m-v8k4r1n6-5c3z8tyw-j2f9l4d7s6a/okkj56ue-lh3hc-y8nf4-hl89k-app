import { z } from 'zod'
import { raceSummarySchema } from '@/core/entities/race'

export const listTeamRacesRequestSchema = z.object({
  page: z.number().int().positive().optional(),
  pageSize: z.number().int().positive().max(100).optional(),
})

export const listTeamRacesResponseSchema = z.object({
  items: z.array(raceSummarySchema),
  page: z.number().int().positive(),
  pageSize: z.number().int().positive(),
  totalItems: z.number().int().nonnegative(),
  totalPages: z.number().int().nonnegative(),
})

export type ListTeamRacesRequest = z.infer<typeof listTeamRacesRequestSchema>
export type ListTeamRacesResponse = z.infer<typeof listTeamRacesResponseSchema>
