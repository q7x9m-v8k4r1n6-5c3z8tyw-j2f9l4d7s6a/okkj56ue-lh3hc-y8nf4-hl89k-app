import { z } from 'zod'

/**
 * Canonical team summary used by reusable search and selection UI.
 */
export const teamSummarySchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1),
  leaderEmail: z.string().email().or(z.literal('')),
})

export type TeamSummary = z.infer<typeof teamSummarySchema>
