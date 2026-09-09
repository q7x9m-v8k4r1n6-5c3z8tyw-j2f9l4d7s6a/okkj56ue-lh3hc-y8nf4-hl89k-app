import { z } from 'zod'

export const raceMapSettingsSchema = z.object({
  isShowHiddenBooths: z.boolean().default(false),
  isHideBoothDescription: z.boolean().default(false),
  isDisabledBoothStatus: z.boolean().default(false),
})

export type RaceMapSettings = z.infer<typeof raceMapSettingsSchema>

export const updateRaceMapSettingsPayloadSchema = z.object({
  expectedModifiedAt: z.string().min(1),
  raceSettings: z.object({
    isShowHiddenBooths: z.boolean().optional(),
    isHideBoothDescription: z.boolean().optional(),
    isDisabledBoothStatus: z.boolean().optional(),
  }),
})

export type UpdateRaceMapSettingsPayload = z.infer<typeof updateRaceMapSettingsPayloadSchema>

/**
 * Runtime schema validating race map details returned by GET /Race/{raceId}.
 */
export const raceMapDetailResponseSchema = z.object({
  id: z.string(),
  name: z.string().optional(),
  raceName: z.string().optional(),
  mapImageUrl: z.string().nullable().optional(),
  status: z.enum(['draft', 'ready', 'ongoing', 'paused', 'completed']).optional(),
  modifiedAt: z.string().optional(),
  isShowHiddenBooths: z.boolean().optional(),
  isHideBoothDescription: z.boolean().optional(),
  isDisabledBoothStatus: z.boolean().optional(),
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
  mapX: z.number().nullable().optional(),
  mapY: z.number().nullable().optional(),
  currentTeamName: z.string().nullable().optional(),
  currentOrganizerName: z.string().nullable().optional(),
})

export type RaceBoothItem = z.infer<typeof raceBoothItemSchema>

/**
 * Runtime schema for an individual booth coordinate item in range [0.0, 100.0].
 */
export const boothCoordinateItemSchema = z.object({
  boothId: z.string(),
  mapX: z.number().min(0).max(100),
  mapY: z.number().min(0).max(100),
})

export type BoothCoordinateItem = z.infer<typeof boothCoordinateItemSchema>

/**
 * Runtime schema for batch coordinate update payload sent to PUT /Race/{raceId}/booths/coordinates.
 */
export const updateBoothCoordinatesPayloadSchema = z.object({
  coordinates: z.array(boothCoordinateItemSchema),
})

export type UpdateBoothCoordinatesPayload = z.infer<typeof updateBoothCoordinatesPayloadSchema>

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
