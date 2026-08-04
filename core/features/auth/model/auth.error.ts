const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null

/** Extracts a safe user-facing message from an unknown API error. */
export const getAuthErrorMessage = (
  error: unknown,
  fallback = 'Đã có lỗi xảy ra. Vui lòng thử lại.',
) => {
  if (!isRecord(error)) return fallback

  if (isRecord(error.data)) {
    if (typeof error.data.detailError === 'string' && error.data.detailError) {
      return error.data.detailError
    }
    if (typeof error.data.message === 'string') {
      return error.data.message
    }
  }

  if (typeof error.message === 'string') return error.message

  return fallback
}

/** Extracts the lockout duration in seconds directly from the normalized API Error. */
export const getAuthLockoutSeconds = (error: unknown): number | null => {
  if (!isRecord(error)) return null
  
  if (error.status === 429 && typeof error.retryAfterSeconds === 'number') {
    return error.retryAfterSeconds
  }

  return null
}