import { z } from 'zod'

export const raceRulesResponseSchema = z.object({
  rules: z.string().nullable(),
})

export type RaceRulesResponse = z.infer<typeof raceRulesResponseSchema>