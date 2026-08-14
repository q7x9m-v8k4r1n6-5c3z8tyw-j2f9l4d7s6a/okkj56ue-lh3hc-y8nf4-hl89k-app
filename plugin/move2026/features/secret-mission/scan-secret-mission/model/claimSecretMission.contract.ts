import { z } from 'zod'

export const claimSecretMissionResponseSchema = z.boolean()

export type ClaimSecretMissionResponse = z.infer<typeof claimSecretMissionResponseSchema>