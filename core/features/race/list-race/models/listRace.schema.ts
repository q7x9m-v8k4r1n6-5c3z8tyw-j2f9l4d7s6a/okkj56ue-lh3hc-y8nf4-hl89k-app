import { z } from 'zod'

export const listRacesResponseSchema = z.array(z.object({
    id: z.string(),
    name: z.string(),
    place: z.string().optional(),
    timeStart: z.string().optional(),
    timeEnd: z.string().optional(),
    status: z.enum(['draft', 'upcoming', 'ongoing', 'completed', 'cancelled']),
}))

export const listRacesRequestSchema = z.object({
    page: z.number().optional(),
    pageSize: z.number().optional(),
})
