import { z } from 'zod'

export const myBoothDataSchema = z.object({
  boothId: z.string().uuid(),
})
export type MyBoothData = z.infer<typeof myBoothDataSchema>