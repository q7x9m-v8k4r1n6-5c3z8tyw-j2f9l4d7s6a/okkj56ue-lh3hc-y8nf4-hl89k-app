import { z } from 'zod'

export const submitScoreRequestSchema = z.object({
  boothId: z.string().uuid('ID Trạm không hợp lệ'),
  teamId: z.string().uuid('ID Đội thi không hợp lệ'),
  score: z.coerce.number().min(0, 'Điểm số không được âm').max(100, 'Điểm số tối đa là 100'), 
  comment: z.string().optional(),
})

export type SubmitScoreRequest = z.infer<typeof submitScoreRequestSchema>

// ⚡ Sửa Schema khớp với Response thực tế của C# BoothController
export const submitScoreResponseSchema = z.object({
  message: z.string().optional(),
})

export type SubmitScoreResponse = z.infer<typeof submitScoreResponseSchema>