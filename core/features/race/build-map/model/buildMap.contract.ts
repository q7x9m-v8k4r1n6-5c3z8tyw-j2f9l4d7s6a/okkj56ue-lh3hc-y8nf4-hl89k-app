import { z } from 'zod'

/**
 * Contract for a booth/station item returned in the race detail or booth list.
 */
export const raceMapBoothSchema = z.object({
  id: z.string().uuid().or(z.string()),
  name: z.string().min(1),
  place: z.string().optional().default(''),
  description: z.string().nullable().optional(),
  status: z.string().optional().default('free'),
  organizerID: z.string().nullable().optional(),
  isHidden: z.boolean().optional(),
  type: z.string().optional(),
  stationType: z.string().optional(),
})

/**
 * Runtime-validated contract for the race detail response for map builder.
 */
export const raceMapDetailResponseSchema = z.object({
  id: z.string().uuid().or(z.string()),
  name: z.string().optional(),
  raceName: z.string().optional(),
  coverUrl: z.string().nullable().optional(),
  mapImageUrl: z.string().nullable().optional(),
  mapUrl: z.string().nullable().optional(),
  modifiedAt: z.string().optional(),
  status: z.string().optional(),
  booth: z.array(raceMapBoothSchema).optional().default([]),
})

export const saveRaceMapResponseSchema = z.object({
  mapImageUrl: z.string().optional(),
  mapUrl: z.string().optional(),
  coverUrl: z.string().optional(),
  url: z.string().optional(),
  imageUrl: z.string().optional(),
  message: z.string().optional(),
}).passthrough()

export type RaceMapBooth = z.infer<typeof raceMapBoothSchema>
export type RaceMapDetailResponse = z.infer<typeof raceMapDetailResponseSchema>
export type SaveRaceMapResponse = z.infer<typeof saveRaceMapResponseSchema>
