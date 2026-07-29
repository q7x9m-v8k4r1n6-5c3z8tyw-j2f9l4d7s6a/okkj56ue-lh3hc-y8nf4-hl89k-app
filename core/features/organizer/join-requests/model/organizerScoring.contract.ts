import { z } from 'zod'

export const submitScoreRequestSchema = z.object({
  boothId: z.string().uuid('ID Trạm không hợp lệ'),
  teamId: z.string().uuid('ID Đội thi không hợp lệ'),
  score: z.number().positive('Số điểm phải lớn hơn 0'),
  comment: z.string().optional(),
})

export type SubmitScoreRequest = z.infer<typeof submitScoreRequestSchema>

export const submitScoreResponseSchema = z.object({
  success: z.boolean(),
  message: z.string().optional(),
})

export type SubmitScoreResponse = z.infer<typeof submitScoreResponseSchema>