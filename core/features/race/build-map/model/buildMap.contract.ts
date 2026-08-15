import { z } from 'zod'

/**
 * Contract for a booth item returned in GET /api/v1/Race/booth-list?RaceId={raceId}
 */
export const raceBoothItemSchema = z.object({
  boothId: z.string().uuid().or(z.string()),
  boothName: z.string().min(1, 'Tên trạm không được rỗng'),
  boothLocation: z.string().optional().default(''),
  description: z.string().nullable().optional().default(''),
  status: z.enum(['free', 'pending', 'occupied']).or(z.string()).default('free'),
  isHidden: z.boolean().optional().default(false),
  currentTeamName: z.string().nullable().optional(),
  currentOrganizerName: z.string().nullable().optional(),
  mapX: z.number().nullable().optional(),
  mapY: z.number().nullable().optional(),
})

export const raceBoothListResponseSchema = z.array(raceBoothItemSchema)

/**
 * Contract for a single booth coordinate item in PUT request
 */
export const boothCoordinateItemSchema = z.object({
  boothId: z.string().uuid().or(z.string()),
  mapX: z.number().min(0).max(100).nullable(),
  mapY: z.number().min(0).max(100).nullable(),
})

/**
 * Contract for saving all booth coordinates: PUT /api/v1/Race/{raceId}/booths/coordinates
 */
export const updateBoothCoordinatesPayloadSchema = z.object({
  coordinates: z.array(boothCoordinateItemSchema),
})

export const updateBoothCoordinatesResponseSchema = z.object({
  message: z.string().optional(),
}).passthrough()

/**
 * Contract for a booth/station item returned in the race detail response.
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

export type RaceBoothItem = z.infer<typeof raceBoothItemSchema>
export type RaceBoothListResponse = z.infer<typeof raceBoothListResponseSchema>
export type BoothCoordinateItem = z.infer<typeof boothCoordinateItemSchema>
export type UpdateBoothCoordinatesPayload = z.infer<typeof updateBoothCoordinatesPayloadSchema>
export type UpdateBoothCoordinatesResponse = z.infer<typeof updateBoothCoordinatesResponseSchema>
export type RaceMapBooth = z.infer<typeof raceMapBoothSchema>
export type RaceMapDetailResponse = z.infer<typeof raceMapDetailResponseSchema>
export type SaveRaceMapResponse = z.infer<typeof saveRaceMapResponseSchema>
