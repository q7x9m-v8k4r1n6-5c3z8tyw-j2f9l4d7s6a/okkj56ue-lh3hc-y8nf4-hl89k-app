import { z } from 'zod'

/**
 * Validates individual booth items returned from GET /api/v1/Race/booth-list?RaceId={raceId}.
 */
export const teamMapBoothSchema = z.object({
  boothId: z.string().uuid().or(z.string()),
  boothName: z.string().min(1, 'Tên trạm không được để trống'),
  boothLocation: z.string().optional().default(''),
  description: z.string().nullable().optional().default(''),
  status: z.string().optional().default('free'),
  isHidden: z.boolean().optional().default(false),
  currentTeamName: z.string().nullable().optional(),
  currentOrganizerName: z.string().nullable().optional(),
  mapX: z.number().nullable().optional(),
  mapY: z.number().nullable().optional(),
})

export const teamMapBoothListResponseSchema = z.array(teamMapBoothSchema)

/**
 * Validates race details returned from GET /api/v1/Race/{raceId}.
 */
export const teamRaceMapDetailSchema = z.object({
  id: z.string().uuid().or(z.string()),
  name: z.string().optional(),
  raceName: z.string().optional(),
  mapImageUrl: z.string().nullable().optional(),
  mapUrl: z.string().nullable().optional(),
  status: z.string().optional(),
  modifiedAt: z.string().optional(),
})

export type TeamMapBoothItem = z.infer<typeof teamMapBoothSchema>
export type TeamMapBoothListResponse = z.infer<typeof teamMapBoothListResponseSchema>
export type TeamMapRaceDetail = z.infer<typeof teamRaceMapDetailSchema>
export type TeamMapDetail = TeamMapRaceDetail
