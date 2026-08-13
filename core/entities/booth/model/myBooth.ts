import { z } from 'zod'
import { boothStatusSchema } from './booth'

/** The current organizer's booth assignment and its durable team session. */
export const myBoothSchema = z.object({
  boothId: z.string().uuid('ID trạm phải là dạng UUID hợp lệ'),
  name: z.string().min(1, 'Tên trạm không được để trống'),
  place: z.string(),
  description: z.string(),
  status: boothStatusSchema,
  teamId: z.string().uuid().nullable(),
  teamName: z.string().nullable(),
})

export type MyBooth = z.infer<typeof myBoothSchema>
