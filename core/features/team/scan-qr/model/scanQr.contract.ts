import { z } from 'zod'

export const scanQrRequestSchema = z.object({
  stationCode: z.string().min(1, 'Mã QR không được để trống'),
})

export const scanQrResponseSchema = z.object({
  success: z.boolean(),
  message: z.string().optional(),
  stationName: z.string().optional(),
})

export type ScanQrRequest = z.infer<typeof scanQrRequestSchema>
export type ScanQrResponse = z.infer<typeof scanQrResponseSchema>