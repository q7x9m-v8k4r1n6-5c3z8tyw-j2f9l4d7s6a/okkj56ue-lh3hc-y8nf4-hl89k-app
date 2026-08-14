import { z } from 'zod'
import { boothStatusSchema } from './booth'

/** Durable pending or occupied booth session owned by the current team. */
export const teamBoothSessionSchema = z.object({
  raceId: z.string().uuid(),
  boothId: z.string().uuid(),
  boothName: z.string().min(1),
  place: z.string(),
  description: z.string(),
  isHidden: z.boolean().default(false),
  status: boothStatusSchema.pipe(z.enum(['pending', 'occupied'])),
})

export type TeamBoothSession = z.infer<typeof teamBoothSessionSchema>
