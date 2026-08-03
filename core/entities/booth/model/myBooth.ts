import { z } from 'zod'

/**
 * The booth assigned to the current organizer for one race, including the
 * rules text shown at that station. This is a distinct representation from
 * the canonical `boothSchema` (used for status/map displays) — it carries
 * fields (place, description) that only matter for this read use case.
 */
export const myBoothSchema = z.object({
  boothId: z.string().uuid('ID trạm phải là dạng UUID hợp lệ'),
  name: z.string().min(1, 'Tên trạm không được để trống'),
  place: z.string(),
  description: z.string(),
})

export type MyBooth = z.infer<typeof myBoothSchema>