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

/** Extracts the lockout duration in seconds from a rate-limit error (HTTP 429). */
export const getAuthLockoutSeconds = (error: unknown): number | null => {
  if (!isRecord(error)) return null
  
  const payload = isRecord(error.data) ? error.data : error

  if (payload.statusCode === 429) {
    const text = typeof payload.detailError === 'string' 
      ? payload.detailError 
      : typeof payload.message === 'string' 
        ? payload.message 
        : ''

    const match = text.match(/(\d+)\s*giây/i)
    if (match && match[1]) {
      return parseInt(match[1], 10)
    }
  }
  return null
}