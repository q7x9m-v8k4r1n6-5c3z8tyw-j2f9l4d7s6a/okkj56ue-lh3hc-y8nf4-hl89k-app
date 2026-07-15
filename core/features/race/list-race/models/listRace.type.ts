import { z } from 'zod'
import type { listRacesRequestSchema, listRacesResponseSchema } from './listRace.schema'

export type ListRacesResponse = z.infer<typeof listRacesResponseSchema>
export type ListRacesRequestData = z.infer<typeof listRacesRequestSchema>