import { z } from 'zod'
import { raceSummarySchema } from '@/core/entities/race'

export const listOrganizerRacesRequestSchema = z.object({
  page: z.number().int().positive().optional(),
  pageSize: z.number().int().positive().max(100).optional(),
})

export const listOrganizerRacesResponseSchema = z.object({
  items: z.array(raceSummarySchema),
  page: z.number().int().positive(),
  pageSize: z.number().int().positive(),
  totalItems: z.number().int().nonnegative(),
  totalPages: z.number().int().nonnegative(),
})

export type ListOrganizerRacesRequest = z.infer<typeof listOrganizerRacesRequestSchema>
export type ListOrganizerRacesResponse = z.infer<typeof listOrganizerRacesResponseSchema>
