import { z } from 'zod'
import { teamModelSchema } from './team.schema'

export type TeamModel = z.infer<typeof teamModelSchema>
export type TeamSearchMode = 'single' | 'multiple'