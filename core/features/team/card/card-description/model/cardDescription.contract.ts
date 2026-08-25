import { z } from 'zod'

export const cardInfoSchema = z.object({
  cardInfo: z.string(),
})

export type CardInfoDto = z.infer<typeof cardInfoSchema>