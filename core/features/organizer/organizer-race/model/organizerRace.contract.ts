import { z } from 'zod'
import { raceStatusSchema } from '@/core/entities/race'

export const organizerRaceDetailResponseSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1).optional(),
  raceName: z.string().min(1).optional(),
  status: raceStatusSchema,
  booth: z.array(z.object({
    id: z.string().uuid(),
    organizerID: z.string().uuid().nullable().optional(),
  })).default([]),
}).transform((race) => ({
  id: race.id,
  name: race.name ?? race.raceName ?? 'MOVE 2025 - SEVALUX',
  status: race.status,
  booths: race.booth.map((booth) => ({
    id: booth.id,
    organizerId: booth.organizerID ?? null,
  })),
}))

export type OrganizerRaceDetailResponse = z.infer<typeof organizerRaceDetailResponseSchema>
