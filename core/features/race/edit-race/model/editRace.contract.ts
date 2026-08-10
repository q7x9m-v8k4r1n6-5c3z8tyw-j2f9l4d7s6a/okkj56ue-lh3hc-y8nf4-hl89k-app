import { z } from 'zod'

/**
 * Status values supported by the race API.
 *
 * Keeping the enum at the API boundary prevents UI code from introducing
 * statuses that the backend cannot persist.
 */
export const editRaceStatusSchema = z.enum([
  'draft',
  'ready',
  'ongoing',
  'paused',
  'completed',
])

const relationPatchSchema = z.object({
  add: z.array(z.string().uuid()).optional(),
  remove: z.array(z.string().uuid()).optional(),
  replace: z.array(z.object({
    currentId: z.string().uuid(),
    newId: z.string().uuid(),
  })).optional(),
})

/** Contract sent to PATCH /Race/{raceId}. */
export const editRaceRequestSchema = z.object({
  expectedModifiedAt: z.string().min(1),
  basicInfo: z.object({
    raceName: z.string().min(1).max(255).optional(),
    timeStart: z.string().min(1).optional(),
    timeEnd: z.string().min(1).optional(),
    place: z.string().min(1).max(255).optional(),
    status: editRaceStatusSchema.optional(),
    rules: z.string().nullable().optional(),
  }).optional(),
  raceSettings: z.object({
    isToggledLeaderboard: z.boolean().optional(),
    isHiddenPoint: z.boolean().optional(),
  }).optional(),
  organizers: relationPatchSchema.optional(),
  raceTeams: relationPatchSchema.optional(),
  booths: z.object({
    add: z.array(z.object({
      name: z.string().min(1).max(255),
      place: z.string().min(1).max(255),
      description: z.string().max(500).optional(),
      organizerIds: z.array(z.string().uuid()),
    })).optional(),
    update: z.array(z.object({
      boothId: z.string().uuid(),
      name: z.string().min(1).max(255).optional(),
      place: z.string().min(1).max(255).optional(),
      description: z.string().max(500).optional(),
      organizerIds: z.array(z.string().uuid()).optional(),
    })).optional(),
    remove: z.array(z.string().uuid()).optional(),
  }).optional(),
})

const editRaceOrganizerSchema = z.object({
  id: z.string().uuid(),
  displayName: z.string(),
  email: z.string(),
  avatarUrl: z.string().url().or(z.literal('')).nullable().optional(),
})

const editRaceTeamSchema = z.object({
  teamID: z.string().uuid(),
  name: z.string().optional(),
  leaderEmail: z.string().optional(),
})

const editRaceBoothSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  place: z.string(),
  description: z.string().nullable().optional(),
  organizerID: z.string().nullable().optional(),
})

/** Runtime-validated contract returned by the race detail API. */
export const editRaceDetailResponseSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  raceName: z.string(),
  timeStart: z.string(),
  timeEnd: z.string(),
  place: z.string(),
  status: editRaceStatusSchema,
  coverUrl: z.string().nullable().optional(),
  modifiedAt: z.string(),
  isToggledLeaderboard: z.boolean(),
  isHiddenPoint: z.boolean(),
  organizerId: z.array(z.string().uuid()),
  organizers: z.array(editRaceOrganizerSchema).optional(),
  raceTeam: z.array(editRaceTeamSchema),
  booth: z.array(editRaceBoothSchema),
})
export const editRaceRulesResponseSchema = z.object({
  rules: z.string().nullable(),
})

export type EditRaceStatus = z.infer<typeof editRaceStatusSchema>
export type EditRaceDetailResponse = z.infer<typeof editRaceDetailResponseSchema>
export type EditRaceRequest = z.infer<typeof editRaceRequestSchema>
export type EditRaceRulesResponse = z.infer<typeof editRaceRulesResponseSchema>
