import { z } from 'zod'
import type { listRacesRequestSchema, listRacesResponseSchema } from './listRace.schema'
import type { PagedResult } from '@/core/shared/types/api-types'

export type RaceListItem = z.infer<typeof listRacesResponseSchema>[number]
export type ListRacesResponse = PagedResult<RaceListItem>
export type ListRacesRequestData = z.infer<typeof listRacesRequestSchema>
