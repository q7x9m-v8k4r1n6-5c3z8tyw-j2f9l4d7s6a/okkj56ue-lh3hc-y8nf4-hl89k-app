import { z } from 'zod'

export const editRaceRequestSchema = z.object({
  raceName: z.string().min(1).max(255),
  timeStart: z.string().min(1),
  timeEnd: z.string().min(1),
  place: z.string().min(1).max(255),
  coverUrl: z.string().optional(),
  isToggledLeaderboard: z.boolean(),
  isHiddenPoint: z.boolean(),
  organizerId: z.array(z.string()),
  raceTeam: z.array(z.object({ teamID: z.string() })),
  booth: z.array(z.object({
    name: z.string().max(255),
    place: z.string().max(255),
    description: z.string().max(500),
    organizerID: z.string(),
  })),
})
