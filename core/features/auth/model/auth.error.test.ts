import { describe, expect, it } from 'vitest'
import { getAuthErrorMessage } from './auth.error'

describe('getAuthErrorMessage', () => {
  it('reads typed API error payloads without any casts', () => {
    expect(getAuthErrorMessage({
      data: { message: 'Sai thông tin đăng nhập.' },
    })).toBe('Sai thông tin đăng nhập.')
  })

  it('falls back for unknown thrown values', () => {
    expect(getAuthErrorMessage(null, 'Fallback')).toBe('Fallback')
  })
})
