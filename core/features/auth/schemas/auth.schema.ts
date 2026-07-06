import type { LoginPayload } from '../types'

export const isLoginPayload = (value: unknown): value is LoginPayload => {
  if (!value || typeof value !== 'object') {
    return false
  }

  const payload = value as Record<string, unknown>

  return typeof payload.username === 'string' && typeof payload.password === 'string'
}
