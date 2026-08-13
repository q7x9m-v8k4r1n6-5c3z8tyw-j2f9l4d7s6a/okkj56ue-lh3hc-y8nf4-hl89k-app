import { describe, expect, it } from 'vitest'
import { validateQrCode } from './scanQr.validation'

describe('validateQrCode', () => {
  it('accepts a booth UUID', () => {
    expect(validateQrCode('ee0fd25b-e9b5-42ba-9e25-187fe5c471ea')).toBeNull()
  })

  it('rejects blank and malformed QR values', () => {
    expect(validateQrCode('')).toBe('Vui lòng quét hoặc nhập mã QR hợp lệ')
    expect(validateQrCode('not-a-booth-id')).toBe('Mã QR của trạm không hợp lệ')
  })
})
