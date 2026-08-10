import { z } from 'zod'

export const submitScoreRequestSchema = z.object({
  boothId: z.string().uuid('ID Trạm không hợp lệ'),
  teamId: z.string().uuid('ID Đội thi không hợp lệ'),
  score: z.coerce.number().min(0, 'Điểm số không được âm').max(100, 'Điểm số tối đa là 100'), 
  comment: z.string().optional(),
})

export type SubmitScoreRequest = z.infer<typeof submitScoreRequestSchema>

export const boothOperationResponseSchema = z.object({
  message: z.string(),
})

export type BoothOperationResponse = z.infer<typeof boothOperationResponseSchema>

export const acceptEntryRequestSchema = z.object({
  boothId: z.string().uuid('ID Trạm không hợp lệ'),
  teamId: z.string().uuid('ID Đội thi không hợp lệ'),
})

export type AcceptEntryRequest = z.infer<typeof acceptEntryRequestSchema>

export const rejectEntryRequestSchema = acceptEntryRequestSchema

export type RejectEntryRequest = z.infer<typeof rejectEntryRequestSchema>

export const cancelBoothSessionRequestSchema = z.object({
  boothId: z.string().uuid('ID Trạm không hợp lệ'),
})

export type CancelBoothSessionRequest = z.infer<
  typeof cancelBoothSessionRequestSchema
>
