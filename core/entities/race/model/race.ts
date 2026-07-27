import { z } from 'zod'

/**
 * Canonical lifecycle statuses shared by race entity representations.
 */
export const raceStatusSchema = z.enum([
  'draft',
  'ready',
  'ongoing',
  'paused',
  'completed',
])

/**
 * Canonical race summary rendered by reusable entity UI.
 *
 * Feature-specific detail fields, form values, and mutation payloads do not
 * belong in this entity model.
 */
export const raceSummarySchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1).max(255),
  place: z.string().max(255).optional(),
  timeStart: z.string().optional(),
  timeEnd: z.string().optional(),
  coverUrl: z.string().url().max(500).nullable().optional(),
  status: raceStatusSchema,
})

export type RaceStatus = z.infer<typeof raceStatusSchema>
export type RaceSummary = z.infer<typeof raceSummarySchema>
