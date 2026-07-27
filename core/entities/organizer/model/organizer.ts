import { z } from 'zod'

/**
 * Canonical organizer summary used by reusable search and selection UI.
 */
export const organizerSummarySchema = z.object({
  id: z.string().uuid(),
  displayName: z.string().optional(),
  email: z.string().email().or(z.literal('')),
})

export type OrganizerSummary = z.infer<typeof organizerSummarySchema>
