import { z } from 'zod'

/** Canonical booth lifecycle returned by the backend. */
export const boothStatusSchema = z.enum(['free', 'pending', 'occupied'])

export const boothSchema = z.object({
  id: z.string().uuid('ID trạm phải là dạng UUID hợp lệ'),
  name: z.string().min(1, 'Tên trạm không được để trống'),
  status: boothStatusSchema,
  currentTeamId: z.string().uuid().nullable().optional(),
})

/** Export Type được suy ra từ Schema */
export type BoothStatus = z.infer<typeof boothStatusSchema>
export type Booth = z.infer<typeof boothSchema>
