import { z } from 'zod'

export const cardItemSchema = z.object({
  cardId: z.string(),
  cardUrl: z.string().nullable().optional(),
  cardName: z.string(),
  cardType: z.string(),
  cardStatus: z.string(),
})

export type CardItemDto = z.infer<typeof cardItemSchema>