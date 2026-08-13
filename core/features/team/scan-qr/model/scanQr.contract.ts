import { z } from 'zod'

export const scanQrRequestSchema = z.object({
  boothId: z.string().uuid('Mã trạm không hợp lệ'),
})

export const scanQrResponseSchema = z.object({
  message: z.string(),
})

export type ScanQrRequest = z.infer<typeof scanQrRequestSchema>
export type ScanQrResponse = z.infer<typeof scanQrResponseSchema>
