import { z } from 'zod'

const boothIdSchema = z.string().trim().uuid()

export const validateQrCode = (code: string): string | null => {
  if (!code || !code.trim()) {
    return 'Vui lòng quét hoặc nhập mã QR hợp lệ'
  }

  if (!boothIdSchema.safeParse(code).success) {
    return 'Mã QR của trạm không hợp lệ'
  }

  return null
}
