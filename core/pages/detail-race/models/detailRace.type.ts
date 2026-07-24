import type { z } from 'zod'
import type { detailRaceTabSchema } from './detailRace.schema'

export type DetailRaceTab = z.infer<typeof detailRaceTabSchema>
