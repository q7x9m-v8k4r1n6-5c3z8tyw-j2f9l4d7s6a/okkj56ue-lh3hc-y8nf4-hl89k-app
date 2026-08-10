import { z } from 'zod'

/**
 * Runtime contract sent to the create-race endpoint.
 *
 * Keep this contract separate from the multi-step form because API field names
 * and frontend editing state change for different reasons.
 */
export const createRaceRequestSchema = z.object({
  basicInfo: z.object({
    raceName: z.string().min(1).max(255),
    place: z.string().min(1).max(255),
    timeStart: z.string().min(1),
    timeEnd: z.string().min(1),
    rules: z.string().optional(),
  }),
  organizerId: z.array(z.string().min(1)),
  raceTeam: z.array(z.string().min(1)),
  booths: z.array(z.object({
    name: z.string().min(1).max(255),
    place: z.string().min(1).max(255),
    description: z.string().max(500).optional(),
    organizerIds: z.array(z.string().min(1)),
  })),
  raceSettings: z.object({
    isToggledLeaderboard: z.boolean(),
    isHiddenPoint: z.boolean(),
  }),
})

export const createRaceResponseSchema = z.string()

export type CreateRaceRequest = z.infer<typeof createRaceRequestSchema>
export type CreateRaceResponse = z.infer<typeof createRaceResponseSchema>
