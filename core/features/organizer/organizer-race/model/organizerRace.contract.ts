import { z } from 'zod'
import { raceStatusSchema } from '@/core/entities/race'

export const organizerRaceDetailResponseSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1).optional(),
  raceName: z.string().min(1).optional(),
  status: raceStatusSchema,
}).transform((race) => ({
  id: race.id,
  name: race.name ?? race.raceName ?? 'MOVE 2025 - SEVALUX',
  status: race.status,
}))

export type OrganizerRaceDetailResponse = z.infer<typeof organizerRaceDetailResponseSchema>
