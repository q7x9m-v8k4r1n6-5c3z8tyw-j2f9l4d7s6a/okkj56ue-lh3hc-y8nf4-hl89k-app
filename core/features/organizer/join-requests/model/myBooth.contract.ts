import { z } from 'zod'

export const boothStatusSchema = z.enum(['free', 'pending', 'occupied'])

export const myBoothDataSchema = z.object({
  boothId: z.string().uuid(),
  name: z.string(),
  place: z.string(),
  description: z.string(),
  status: boothStatusSchema,
  teamId: z.string().uuid().nullable(),
  teamName: z.string().nullable(),
})

export type MyBoothData = z.infer<typeof myBoothDataSchema>
