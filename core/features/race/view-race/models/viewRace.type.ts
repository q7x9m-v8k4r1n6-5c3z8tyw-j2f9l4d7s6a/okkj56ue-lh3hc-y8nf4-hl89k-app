import type { z } from 'zod'
import type {
  boothScoringLogResponseSchema,
  boothSummaryResponseSchema,
  teamLeaderboardResponseSchema,
} from './viewRace.schema'

export type TeamLeaderboardResponse = z.infer<typeof teamLeaderboardResponseSchema>
export type BoothSummaryResponse = z.infer<typeof boothSummaryResponseSchema>
export type BoothScoringLogResponse = z.infer<typeof boothScoringLogResponseSchema>