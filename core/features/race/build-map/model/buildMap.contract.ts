import { z } from 'zod'

/**
 * Runtime schema validating race map details returned by GET /Race/{raceId}.
 */
export const raceMapDetailResponseSchema = z.object({
  id: z.string(),
  name: z.string().optional(),
  raceName: z.string().optional(),
  mapImageUrl: z.string().nullable().optional(),
}).passthrough()

export type RaceMapDetailResponse = z.infer<typeof raceMapDetailResponseSchema>

/**
 * Runtime schema validating an individual station/booth returned by GET /Race/booth-list.
 */
export const raceBoothItemSchema = z.object({
  boothId: z.string(),
  boothName: z.string(),
  boothLocation: z.string().optional().default(''),
  description: z.string().nullable().optional().default(''),
  status: z.string().optional().default(''),
  isHidden: z.boolean().default(false),
  currentTeamName: z.string().nullable().optional(),
  currentOrganizerName: z.string().nullable().optional(),
})

export type RaceBoothItem = z.infer<typeof raceBoothItemSchema>

/**
 * Runtime schema validating the station/booth list collection.
 */
export const raceBoothsResponseSchema = z.array(raceBoothItemSchema)

export type RaceBoothsResponse = z.infer<typeof raceBoothsResponseSchema>

/**
 * Runtime schema validating the response from POST /Race/{raceId}/map.
 */
export const uploadRaceMapResponseSchema = z.object({
  mapImageUrl: z.string(),
})

export type UploadRaceMapResponse = z.infer<typeof uploadRaceMapResponseSchema>
